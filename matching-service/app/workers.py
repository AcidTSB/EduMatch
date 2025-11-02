"""
Celery workers for processing RabbitMQ events
"""
import logging
from datetime import datetime
from sqlalchemy.orm import Session

from .celery_app import celery_app
from .database import SessionLocal
from . import models, schemas
from .matching import matching_engine

logger = logging.getLogger(__name__)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        return db
    finally:
        pass  # Don't close here, close in task

# ============= Event Processors =============

@celery_app.task(name='app.workers.process_user_profile_updated', bind=True, max_retries=3)
def process_user_profile_updated(self, event_data: dict):
    """
    Process user.profile.updated event
    
    Worker sẽ:
    1. Nhận event data từ RabbitMQ
    2. Tiền xử lý features (vectorization)
    3. Lưu/Update vào PostgreSQL
    """
    logger.info(f"[Worker] Processing user.profile.updated: {event_data.get('userId')}")
    
    db = SessionLocal()
    try:
        # Validate event data
        event = schemas.UserProfileUpdatedEvent(**event_data)
        
        # Check if applicant features already exist
        applicant_feature = db.query(models.ApplicantFeature).filter(
            models.ApplicantFeature.applicant_id == event.userId
        ).first()
        
        # Preprocess features
        preprocessed = matching_engine.preprocess_text_features(
            skills=event.skills or [],
            research_interests=event.researchInterests or [],
            additional_text=f"{event.major or ''} {event.university or ''}"
        )
        
        if applicant_feature:
            # Update existing
            logger.info(f"[Worker] Updating existing applicant features: {event.userId}")
            applicant_feature.gpa = event.gpa
            applicant_feature.major = event.major
            applicant_feature.university = event.university
            applicant_feature.year_of_study = event.yearOfStudy
            applicant_feature.skills = event.skills
            applicant_feature.research_interests = event.researchInterests
            applicant_feature.skills_vector = preprocessed['skills_vector']
            applicant_feature.research_vector = preprocessed['research_vector']
            applicant_feature.combined_text = preprocessed['combined_text']
            applicant_feature.last_processed_at = datetime.utcnow()
            applicant_feature.updated_at = datetime.utcnow()
        else:
            # Create new
            logger.info(f"[Worker] Creating new applicant features: {event.userId}")
            applicant_feature = models.ApplicantFeature(
                applicant_id=event.userId,
                gpa=event.gpa,
                major=event.major,
                university=event.university,
                year_of_study=event.yearOfStudy,
                skills=event.skills,
                research_interests=event.researchInterests,
                skills_vector=preprocessed['skills_vector'],
                research_vector=preprocessed['research_vector'],
                combined_text=preprocessed['combined_text'],
                last_processed_at=datetime.utcnow()
            )
            db.add(applicant_feature)
        
        db.commit()
        logger.info(f"[Worker] ✅ Successfully processed user.profile.updated: {event.userId}")
        
        # Invalidate cached scores for this applicant
        invalidate_scores_for_applicant(db, event.userId)
        
        return {"status": "success", "applicant_id": event.userId}
        
    except Exception as e:
        db.rollback()
        logger.error(f"[Worker] ❌ Error processing user.profile.updated: {e}", exc_info=True)
        
        # Retry with exponential backoff
        raise self.retry(exc=e, countdown=60 * (2 ** self.request.retries))
        
    finally:
        db.close()


@celery_app.task(name='app.workers.process_scholarship_created', bind=True, max_retries=3)
def process_scholarship_created(self, event_data: dict):
    """
    Process scholarship.created event
    
    Worker sẽ:
    1. Nhận event data từ RabbitMQ
    2. Tiền xử lý features (vectorization)
    3. Lưu vào PostgreSQL
    """
    logger.info(f"[Worker] Processing scholarship.created: {event_data.get('opportunityId')}")
    
    db = SessionLocal()
    try:
        # Validate event data
        event = schemas.ScholarshipCreatedEvent(**event_data)
        
        # Preprocess features
        preprocessed = matching_engine.preprocess_text_features(
            skills=event.requiredSkills or [],
            research_interests=event.researchAreas or [],
            additional_text=f"{event.title or ''} {event.description or ''}"
        )
        
        # Create new opportunity feature
        logger.info(f"[Worker] Creating new opportunity features: {event.opportunityId}")
        opportunity_feature = models.OpportunityFeature(
            opportunity_id=event.opportunityId,
            opportunity_type=event.opportunityType,
            title=event.title,
            description=event.description,
            min_gpa=event.minGpa,
            required_skills=event.requiredSkills,
            preferred_majors=event.preferredMajors,
            research_areas=event.researchAreas,
            skills_vector=preprocessed['skills_vector'],
            research_vector=preprocessed['research_vector'],
            combined_text=preprocessed['combined_text'],
            last_processed_at=datetime.utcnow()
        )
        db.add(opportunity_feature)
        db.commit()
        
        logger.info(f"[Worker] ✅ Successfully processed scholarship.created: {event.opportunityId}")
        
        return {"status": "success", "opportunity_id": event.opportunityId}
        
    except Exception as e:
        db.rollback()
        logger.error(f"[Worker] ❌ Error processing scholarship.created: {e}", exc_info=True)
        
        # Retry with exponential backoff
        raise self.retry(exc=e, countdown=60 * (2 ** self.request.retries))
        
    finally:
        db.close()


@celery_app.task(name='app.workers.process_scholarship_updated', bind=True, max_retries=3)
def process_scholarship_updated(self, event_data: dict):
    """
    Process scholarship.updated event
    Similar to created but updates existing record
    """
    logger.info(f"[Worker] Processing scholarship.updated: {event_data.get('opportunityId')}")
    
    db = SessionLocal()
    try:
        # Validate event data
        event = schemas.ScholarshipUpdatedEvent(**event_data)
        
        # Check if opportunity features already exist
        opportunity_feature = db.query(models.OpportunityFeature).filter(
            models.OpportunityFeature.opportunity_id == event.opportunityId
        ).first()
        
        # Preprocess features
        preprocessed = matching_engine.preprocess_text_features(
            skills=event.requiredSkills or [],
            research_interests=event.researchAreas or [],
            additional_text=f"{event.title or ''} {event.description or ''}"
        )
        
        if opportunity_feature:
            # Update existing
            logger.info(f"[Worker] Updating existing opportunity features: {event.opportunityId}")
            opportunity_feature.opportunity_type = event.opportunityType
            opportunity_feature.title = event.title
            opportunity_feature.description = event.description
            opportunity_feature.min_gpa = event.minGpa
            opportunity_feature.required_skills = event.requiredSkills
            opportunity_feature.preferred_majors = event.preferredMajors
            opportunity_feature.research_areas = event.researchAreas
            opportunity_feature.skills_vector = preprocessed['skills_vector']
            opportunity_feature.research_vector = preprocessed['research_vector']
            opportunity_feature.combined_text = preprocessed['combined_text']
            opportunity_feature.last_processed_at = datetime.utcnow()
            opportunity_feature.updated_at = datetime.utcnow()
        else:
            # Create new if not exists
            logger.info(f"[Worker] Creating new opportunity features (from update): {event.opportunityId}")
            opportunity_feature = models.OpportunityFeature(
                opportunity_id=event.opportunityId,
                opportunity_type=event.opportunityType,
                title=event.title,
                description=event.description,
                min_gpa=event.minGpa,
                required_skills=event.requiredSkills,
                preferred_majors=event.preferredMajors,
                research_areas=event.researchAreas,
                skills_vector=preprocessed['skills_vector'],
                research_vector=preprocessed['research_vector'],
                combined_text=preprocessed['combined_text'],
                last_processed_at=datetime.utcnow()
            )
            db.add(opportunity_feature)
        
        db.commit()
        logger.info(f"[Worker] ✅ Successfully processed scholarship.updated: {event.opportunityId}")
        
        # Invalidate cached scores for this opportunity
        invalidate_scores_for_opportunity(db, event.opportunityId)
        
        return {"status": "success", "opportunity_id": event.opportunityId}
        
    except Exception as e:
        db.rollback()
        logger.error(f"[Worker] ❌ Error processing scholarship.updated: {e}", exc_info=True)
        
        # Retry with exponential backoff
        raise self.retry(exc=e, countdown=60 * (2 ** self.request.retries))
        
    finally:
        db.close()


# ============= Helper Functions =============

def invalidate_scores_for_applicant(db: Session, applicant_id: str):
    """Invalidate cached scores when applicant profile changes"""
    try:
        deleted_count = db.query(models.MatchingScore).filter(
            models.MatchingScore.applicant_id == applicant_id
        ).delete()
        db.commit()
        logger.info(f"[Worker] Invalidated {deleted_count} cached scores for applicant {applicant_id}")
    except Exception as e:
        logger.error(f"[Worker] Error invalidating scores: {e}")
        db.rollback()


def invalidate_scores_for_opportunity(db: Session, opportunity_id: str):
    """Invalidate cached scores when opportunity changes"""
    try:
        deleted_count = db.query(models.MatchingScore).filter(
            models.MatchingScore.opportunity_id == opportunity_id
        ).delete()
        db.commit()
        logger.info(f"[Worker] Invalidated {deleted_count} cached scores for opportunity {opportunity_id}")
    except Exception as e:
        logger.error(f"[Worker] Error invalidating scores: {e}")
        db.rollback()
