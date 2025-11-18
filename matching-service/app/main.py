"""
Matching Service - FastAPI Main Application
Provides ML-based matching and recommendation APIs
"""
import logging
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import psycopg2
from tenacity import retry, wait_fixed, stop_after_attempt, retry_if_exception_type

from .config import settings
from .database import get_db, engine, Base
from . import models, schemas
from .service import MatchingService
from .auth import get_current_user

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="ML-based matching and recommendation service",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= Startup Events =============

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    
    # Check database connection
    try:
        check_db_connection()
        logger.info("✅ Database connection successful")
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
    
    # Create tables if not exist
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created/verified")
    except Exception as e:
        logger.error(f"❌ Error creating tables: {e}")
    
    logger.info("🚀 Matching Service ready to accept requests")

@retry(
    wait=wait_fixed(5),
    stop=stop_after_attempt(10),
    retry=retry_if_exception_type(psycopg2.OperationalError),
    reraise=True
)
def check_db_connection():
    """Check database connection with retry"""
    logger.info("Checking database connection...")
    try:
        conn = psycopg2.connect(settings.DATABASE_URL)
        conn.close()
    except psycopg2.OperationalError as e:
        logger.warning(f"Database not ready, retrying... Error: {e}")
        raise

# ============= Health Check =============

@app.get("/health", response_model=schemas.HealthResponse)
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint"""
    
    # Check database
    db_status = "healthy"
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {e}"
        logger.error(f"Database health check failed: {e}")
    
    # Check RabbitMQ (basic check)
    rabbitmq_status = "not_checked"
    
    return schemas.HealthResponse(
        status="healthy" if db_status == "healthy" else "degraded",
        service=settings.APP_NAME,
        version=settings.APP_VERSION,
        timestamp=datetime.utcnow(),
        database=db_status,
        rabbitmq=rabbitmq_status
    )

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs"
    }

# ============= API Endpoints =============

@app.post("/api/v1/match/score", response_model=schemas.ScoreResponse)
async def calculate_matching_score(
    request: schemas.ScoreRequest,
    db: Session = Depends(get_db)
):
    """
    Calculate matching score between applicant and opportunity
    
    **Performance:** < 300ms (rule-based algorithm)
    """
    logger.info(f"Calculating score for applicant={request.applicantId}, opportunity={request.opportunityId}")
    
    try:
        service = MatchingService(db)
        result = service.calculate_score(
            applicant_id=request.applicantId,
            opportunity_id=request.opportunityId
        )
        
        logger.info(f"Score calculated: {result.overallScore}")
        return result
        
    except Exception as e:
        logger.error(f"Error calculating score: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/recommendations/applicant/{applicantId}", response_model=schemas.RecommendationResponse)
async def get_recommendations_for_applicant(
    applicantId: str,
    limit: int = Query(default=10, ge=1, le=100),
    page: int = Query(default=1, ge=1),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get opportunity recommendations for an applicant
    
    **⚠️ WARNING:** This API is SLOW (2-5 seconds) as it performs ML computation on-the-fly
    
    **Premium Feature:** Requires authentication
    """
    logger.info(f"Getting recommendations for applicant={applicantId}, user={current_user.get('sub')}, limit={limit}, page={page}")
    
    try:
        service = MatchingService(db)
        result = service.get_recommendations_for_applicant(
            applicant_id=applicantId,
            limit=limit,
            page=page
        )
        
        logger.info(f"Found {result.metadata.total} recommendations")
        return result
        
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/recommendations/opportunity/{opportunityId}", response_model=schemas.RecommendationResponse)
async def get_recommendations_for_opportunity(
    opportunityId: str,
    limit: int = Query(default=10, ge=1, le=100),
    page: int = Query(default=1, ge=1),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get applicant recommendations for an opportunity
    
    **⚠️ WARNING:** This API is SLOW (2-5 seconds) as it performs ML computation on-the-fly
    
    **Premium Feature:** Requires authentication
    """
    logger.info(f"Getting recommendations for opportunity={opportunityId}, user={current_user.get('sub')}, limit={limit}, page={page}")
    
    try:
        service = MatchingService(db)
        result = service.get_recommendations_for_opportunity(
            opportunity_id=opportunityId,
            limit=limit,
            page=page
        )
        
        logger.info(f"Found {result.metadata.total} recommendations")
        return result
        
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# ============= Sync Endpoints (for data synchronization) =============

@app.post("/api/v1/sync/applicant", response_model=schemas.SyncResponse)
async def sync_applicant(
    data: schemas.ApplicantSyncRequest,
    db: Session = Depends(get_db)
):
    """
    API để đồng bộ dữ liệu applicant từ Auth/User Service vào Matching DB.
    
    **Được gọi khi:**
    - User đăng ký mới (sau khi verify)
    - User cập nhật profile (GPA, skills, bio)
    - User cập nhật research interests
    
    **Flow:**
    1. Auth Service lưu vào MySQL
    2. Auth Service gọi API này (hoặc gửi event qua RabbitMQ)
    3. Matching Service lưu/update vào PostgreSQL
    4. Preprocess features (TF-IDF vectors) cho ML
    """
    logger.info(f"[SYNC] Syncing applicant: {data.userId}")
    
    try:
        service = MatchingService(db)
        result = service.sync_applicant(
            user_id=data.userId,
            gpa=data.gpa,
            major=data.major,
            university=data.university,
            year_of_study=data.yearOfStudy,
            skills=data.skills,
            research_interests=data.researchInterests,
            bio=data.bio
        )
        
        logger.info(f"[SYNC] Applicant synced successfully: {data.userId}")
        return schemas.SyncResponse(
            status="success",
            message=f"Applicant {data.userId} synced successfully",
            entityId=data.userId,
            action=result.get("action", "updated")
        )
        
    except Exception as e:
        logger.error(f"[SYNC] Error syncing applicant {data.userId}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/sync/opportunity", response_model=schemas.SyncResponse)
async def sync_opportunity(
    data: schemas.OpportunitySyncRequest,
    db: Session = Depends(get_db)
):
    """
    API để đồng bộ dữ liệu opportunity từ Scholarship Service vào Matching DB.
    
    **Được gọi khi:**
    - Admin approve scholarship (status: PENDING → PUBLISHED)
    - Employer update scholarship (nếu cần recalculate matches)
    - Scholarship status change to CLOSED (để remove khỏi recommendations)
    
    **Flow:**
    1. Scholarship Service lưu/update vào MySQL
    2. Scholarship Service gọi API này (hoặc gửi event qua RabbitMQ)
    3. Matching Service lưu/update vào PostgreSQL
    4. Preprocess features (TF-IDF vectors) cho ML
    5. Trigger background job để recalculate matching scores
    """
    logger.info(f"[SYNC] Syncing opportunity: {data.opportunityId}")
    
    try:
        service = MatchingService(db)
        result = service.sync_opportunity(
            opportunity_id=data.opportunityId,
            opportunity_type=data.opportunityType,
            title=data.title,
            description=data.description,
            min_gpa=data.minGpa,
            required_skills=data.requiredSkills,
            preferred_majors=data.preferredMajors,
            research_areas=data.researchAreas,
            status=data.status
        )
        
        logger.info(f"[SYNC] Opportunity synced successfully: {data.opportunityId}")
        return schemas.SyncResponse(
            status="success",
            message=f"Opportunity {data.opportunityId} synced successfully",
            entityId=data.opportunityId,
            action=result.get("action", "updated")
        )
        
    except Exception as e:
        logger.error(f"[SYNC] Error syncing opportunity {data.opportunityId}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# ============= Internal Test Endpoints (for PoC compatibility) =============

@app.get("/api/v1/internal-ping")
async def internal_ping():
    """Internal ping endpoint (for testing sync communication)"""
    logger.info("[PoC 2] Received SYNC ping")
    return {
        "status": "python_ok",
        "message": "Ping received successfully",
        "service": settings.APP_NAME
    }
