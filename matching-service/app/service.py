"""
Service layer - Business logic for matching operations
"""
from sqlalchemy.orm import Session
from typing import List, Dict, Optional, Tuple
from datetime import datetime
import logging

from . import models, schemas
from .matching import matching_engine

logger = logging.getLogger(__name__)

class MatchingService:
    """Service layer for matching operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    # ========== Score Calculation ==========
    
    def calculate_score(
        self,
        applicant_id: str,
        opportunity_id: str
    ) -> schemas.ScoreResponse:
        """
        Calculate matching score between applicant and opportunity
        Uses rule-based algorithm for speed
        """
        # Fetch applicant features
        applicant = self.db.query(models.ApplicantFeature).filter(
            models.ApplicantFeature.applicant_id == applicant_id
        ).first()
        
        if not applicant:
            logger.warning(f"Applicant {applicant_id} not found in features DB")
            # Return neutral score if not found
            return schemas.ScoreResponse(
                overallScore=50.0,
                breakdown=schemas.ScoreBreakdown(
                    gpaMatch=50.0,
                    skillsMatch=50.0,
                    researchMatch=50.0
                )
            )
        
        # Fetch opportunity features
        opportunity = self.db.query(models.OpportunityFeature).filter(
            models.OpportunityFeature.opportunity_id == opportunity_id
        ).first()
        
        if not opportunity:
            logger.warning(f"Opportunity {opportunity_id} not found in features DB")
            return schemas.ScoreResponse(
                overallScore=50.0,
                breakdown=schemas.ScoreBreakdown(
                    gpaMatch=50.0,
                    skillsMatch=50.0,
                    researchMatch=50.0
                )
            )
        
        # Prepare data for matching engine
        applicant_data = {
            'gpa': applicant.gpa,
            'skills': applicant.skills or [],
            'research_interests': applicant.research_interests or []
        }
        
        opportunity_data = {
            'min_gpa': opportunity.min_gpa,
            'required_skills': opportunity.required_skills or [],
            'research_areas': opportunity.research_areas or []
        }
        
        # Calculate score
        overall_score, breakdown = matching_engine.calculate_rule_based_score(
            applicant_data,
            opportunity_data
        )
        
        # Optionally cache the result
        self._cache_score(applicant_id, opportunity_id, overall_score, breakdown)
        
        return schemas.ScoreResponse(
            overallScore=overall_score,
            breakdown=schemas.ScoreBreakdown(
                gpaMatch=breakdown['gpaMatch'],
                skillsMatch=breakdown['skillsMatch'],
                researchMatch=breakdown.get('researchMatch', 50.0)
            )
        )
    
    def _cache_score(
        self,
        applicant_id: str,
        opportunity_id: str,
        overall_score: float,
        breakdown: Dict
    ):
        """Cache matching score in database"""
        try:
            # Check if exists
            existing = self.db.query(models.MatchingScore).filter(
                models.MatchingScore.applicant_id == applicant_id,
                models.MatchingScore.opportunity_id == opportunity_id
            ).first()
            
            if existing:
                # Update
                existing.overall_score = overall_score
                existing.gpa_score = breakdown.get('gpaMatch')
                existing.skills_score = breakdown.get('skillsMatch')
                existing.research_score = breakdown.get('researchMatch')
                existing.calculated_at = datetime.utcnow()
            else:
                # Create new
                score = models.MatchingScore(
                    applicant_id=applicant_id,
                    opportunity_id=opportunity_id,
                    overall_score=overall_score,
                    gpa_score=breakdown.get('gpaMatch'),
                    skills_score=breakdown.get('skillsMatch'),
                    research_score=breakdown.get('researchMatch')
                )
                self.db.add(score)
            
            self.db.commit()
        except Exception as e:
            logger.error(f"Error caching score: {e}")
            self.db.rollback()
    
    # ========== Recommendations for Applicant ==========
    
    def get_recommendations_for_applicant(
        self,
        applicant_id: str,
        limit: int = 10,
        page: int = 1
    ) -> schemas.RecommendationResponse:
        """
        Get opportunity recommendations for an applicant
        Uses ML-based scoring (SLOW)
        """
        # Fetch applicant features
        applicant = self.db.query(models.ApplicantFeature).filter(
            models.ApplicantFeature.applicant_id == applicant_id
        ).first()
        
        if not applicant:
            logger.warning(f"Applicant {applicant_id} not found")
            return schemas.RecommendationResponse(
                metadata=schemas.RecommendationMetadata(
                    total=0,
                    page=page,
                    limit=limit,
                    totalPages=0
                ),
                data=[]
            )
        
        # Fetch all opportunities
        opportunities = self.db.query(models.OpportunityFeature).all()
        
        if not opportunities:
            return schemas.RecommendationResponse(
                metadata=schemas.RecommendationMetadata(
                    total=0,
                    page=page,
                    limit=limit,
                    totalPages=0
                ),
                data=[]
            )
        
        # Prepare features for ML engine
        target_features = {
            'id': applicant.applicant_id,
            'skills_vector': applicant.skills_vector,
            'research_vector': applicant.research_vector,
            'combined_text': applicant.combined_text
        }
        
        candidates_features = []
        for opp in opportunities:
            candidates_features.append({
                'id': opp.opportunity_id,
                'skills_vector': opp.skills_vector,
                'research_vector': opp.research_vector,
                'combined_text': opp.combined_text
            })
        
        # Calculate ML-based scores
        logger.info(f"Calculating ML scores for {len(candidates_features)} opportunities")
        scored_results = matching_engine.calculate_ml_based_scores(
            target_features,
            candidates_features
        )
        
        # Pagination
        total = len(scored_results)
        total_pages = (total + limit - 1) // limit
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        
        paginated_results = scored_results[start_idx:end_idx]
        
        # Build response
        data = [
            schemas.RecommendationItem(
                opportunityId=opp_id,
                matchingScore=score
            )
            for opp_id, score in paginated_results
        ]
        
        return schemas.RecommendationResponse(
            metadata=schemas.RecommendationMetadata(
                total=total,
                page=page,
                limit=limit,
                totalPages=total_pages
            ),
            data=data
        )
    
    # ========== Recommendations for Opportunity ==========
    
    def get_recommendations_for_opportunity(
        self,
        opportunity_id: str,
        limit: int = 10,
        page: int = 1
    ) -> schemas.RecommendationResponse:
        """
        Get applicant recommendations for an opportunity
        Uses ML-based scoring (SLOW)
        """
        # Fetch opportunity features
        opportunity = self.db.query(models.OpportunityFeature).filter(
            models.OpportunityFeature.opportunity_id == opportunity_id
        ).first()
        
        if not opportunity:
            logger.warning(f"Opportunity {opportunity_id} not found")
            return schemas.RecommendationResponse(
                metadata=schemas.RecommendationMetadata(
                    total=0,
                    page=page,
                    limit=limit,
                    totalPages=0
                ),
                data=[]
            )
        
        # Fetch all applicants
        applicants = self.db.query(models.ApplicantFeature).all()
        
        if not applicants:
            return schemas.RecommendationResponse(
                metadata=schemas.RecommendationMetadata(
                    total=0,
                    page=page,
                    limit=limit,
                    totalPages=0
                ),
                data=[]
            )
        
        # Prepare features for ML engine
        target_features = {
            'id': opportunity.opportunity_id,
            'skills_vector': opportunity.skills_vector,
            'research_vector': opportunity.research_vector,
            'combined_text': opportunity.combined_text
        }
        
        candidates_features = []
        for app in applicants:
            candidates_features.append({
                'id': app.applicant_id,
                'skills_vector': app.skills_vector,
                'research_vector': app.research_vector,
                'combined_text': app.combined_text
            })
        
        # Calculate ML-based scores
        logger.info(f"Calculating ML scores for {len(candidates_features)} applicants")
        scored_results = matching_engine.calculate_ml_based_scores(
            target_features,
            candidates_features
        )
        
        # Pagination
        total = len(scored_results)
        total_pages = (total + limit - 1) // limit
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        
        paginated_results = scored_results[start_idx:end_idx]
        
        return schemas.RecommendationResponse(
            metadata=schemas.RecommendationMetadata(
                total=total,
                page=page,
                limit=limit,
                totalPages=total_pages
            ),
            data=data
        )
    
    # ========== Sync Operations ==========
    
    def sync_applicant(
        self,
        user_id: str,
        gpa: Optional[float],
        major: Optional[str],
        university: Optional[str],
        year_of_study: Optional[int],
        skills: Optional[List[str]],
        research_interests: Optional[List[str]],
        bio: Optional[str]
    ) -> Dict:
        """
        Sync applicant data from Auth/User Service
        Creates or updates ApplicantFeature record
        """
        try:
            # Check if exists
            applicant = self.db.query(models.ApplicantFeature).filter(
                models.ApplicantFeature.applicant_id == user_id
            ).first()
            
            action = "updated"
            if not applicant:
                action = "created"
                applicant = models.ApplicantFeature(applicant_id=user_id)
                self.db.add(applicant)
            
            # Update basic fields
            applicant.gpa = gpa
            applicant.major = major
            applicant.university = university
            applicant.year_of_study = year_of_study
            applicant.skills = skills or []
            applicant.research_interests = research_interests or []
            applicant.updated_at = datetime.utcnow()
            
            # Preprocess text features
            preprocessed = matching_engine.preprocess_text_features(
                skills=skills or [],
                research_interests=research_interests or [],
                additional_text=bio or ""
            )
            
            applicant.combined_text = preprocessed['combined_text']
            applicant.skills_vector = preprocessed['skills_vector']
            applicant.research_vector = preprocessed['research_vector']
            applicant.last_processed_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Applicant {user_id} synced successfully ({action})")
            return {"action": action, "applicant_id": user_id}
            
        except Exception as e:
            logger.error(f"Error syncing applicant {user_id}: {e}", exc_info=True)
            self.db.rollback()
            raise
    
    def sync_opportunity(
        self,
        opportunity_id: str,
        opportunity_type: str,
        title: str,
        description: Optional[str],
        min_gpa: Optional[float],
        required_skills: Optional[List[str]],
        preferred_majors: Optional[List[str]],
        research_areas: Optional[List[str]],
        status: Optional[str]
    ) -> Dict:
        """
        Sync opportunity data from Scholarship Service
        Creates or updates OpportunityFeature record
        """
        try:
            # Check if exists
            opportunity = self.db.query(models.OpportunityFeature).filter(
                models.OpportunityFeature.opportunity_id == opportunity_id
            ).first()
            
            action = "updated"
            if not opportunity:
                action = "created"
                opportunity = models.OpportunityFeature(opportunity_id=opportunity_id)
                self.db.add(opportunity)
            
            # Update basic fields
            opportunity.opportunity_type = opportunity_type
            opportunity.title = title
            opportunity.description = description
            opportunity.min_gpa = min_gpa
            opportunity.required_skills = required_skills or []
            opportunity.preferred_majors = preferred_majors or []
            opportunity.research_areas = research_areas or []
            opportunity.updated_at = datetime.utcnow()
            
            # Preprocess text features
            preprocessed = matching_engine.preprocess_text_features(
                skills=required_skills or [],
                research_interests=research_areas or [],
                additional_text=f"{title} {description or ''}"
            )
            
            opportunity.combined_text = preprocessed['combined_text']
            opportunity.skills_vector = preprocessed['skills_vector']
            opportunity.research_vector = preprocessed['research_vector']
            opportunity.last_processed_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Opportunity {opportunity_id} synced successfully ({action})")
            
            # If status is CLOSED, optionally delete cached scores
            if status == "CLOSED":
                self._invalidate_opportunity_scores(opportunity_id)
            
            return {"action": action, "opportunity_id": opportunity_id}
            
        except Exception as e:
            logger.error(f"Error syncing opportunity {opportunity_id}: {e}", exc_info=True)
            self.db.rollback()
            raise
    
    def _invalidate_opportunity_scores(self, opportunity_id: str):
        """Invalidate cached matching scores for a closed opportunity"""
        try:
            deleted_count = self.db.query(models.MatchingScore).filter(
                models.MatchingScore.opportunity_id == opportunity_id
            ).delete()
            
            self.db.commit()
            logger.info(f"Invalidated {deleted_count} cached scores for opportunity {opportunity_id}")
        except Exception as e:
            logger.error(f"Error invalidating scores: {e}")
            self.db.rollback()

