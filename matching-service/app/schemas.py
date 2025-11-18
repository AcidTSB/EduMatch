"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime

# ============= Request Schemas =============

class ScoreRequest(BaseModel):
    """Request body for POST /api/v1/match/score"""
    applicantId: str = Field(..., description="UUID of the applicant")
    opportunityId: str = Field(..., description="UUID of the opportunity")

class RecommendationQueryParams(BaseModel):
    """Query parameters for recommendation endpoints"""
    limit: int = Field(default=10, ge=1, le=100, description="Number of results")
    page: int = Field(default=1, ge=1, description="Page number")

# ============= Response Schemas =============

class ScoreBreakdown(BaseModel):
    """Breakdown of matching score"""
    gpaMatch: float = Field(..., ge=0, le=100)
    skillsMatch: float = Field(..., ge=0, le=100)
    researchMatch: Optional[float] = Field(None, ge=0, le=100)

class ScoreResponse(BaseModel):
    """Response for POST /api/v1/match/score"""
    overallScore: float = Field(..., ge=0, le=100)
    breakdown: ScoreBreakdown

class RecommendationItem(BaseModel):
    """Single recommendation item"""
    opportunityId: Optional[str] = None
    applicantId: Optional[str] = None
    matchingScore: float = Field(..., ge=0, le=100)

class RecommendationMetadata(BaseModel):
    """Metadata for recommendations"""
    total: int = Field(..., ge=0)
    page: int = Field(..., ge=1)
    limit: int = Field(..., ge=1)
    totalPages: int = Field(..., ge=0)

# ============= Sync Schemas =============

class ApplicantSyncRequest(BaseModel):
    """Request body để sync applicant data từ Auth/User Service"""
    userId: str = Field(..., description="User ID từ Auth Service")
    gpa: Optional[float] = Field(None, ge=0.0, le=4.0, description="GPA (thang 4.0)")
    major: Optional[str] = Field(None, max_length=255, description="Ngành học")
    university: Optional[str] = Field(None, max_length=255, description="Trường đại học")
    yearOfStudy: Optional[int] = Field(None, ge=1, le=6, description="Năm học")
    skills: Optional[List[str]] = Field(default_factory=list, description="Danh sách kỹ năng")
    researchInterests: Optional[List[str]] = Field(default_factory=list, description="Lĩnh vực nghiên cứu quan tâm")
    bio: Optional[str] = Field(None, max_length=2000, description="Mô tả bản thân")
    
    class Config:
        json_schema_extra = {
            "example": {
                "userId": "5",
                "gpa": 3.8,
                "major": "Computer Science",
                "university": "University of Transport",
                "yearOfStudy": 3,
                "skills": ["Python", "Machine Learning", "TensorFlow"],
                "researchInterests": ["Natural Language Processing", "Computer Vision"],
                "bio": "Passionate about AI and deep learning. Actively involved in research projects."
            }
        }

class OpportunitySyncRequest(BaseModel):
    """Request body để sync opportunity data từ Scholarship Service"""
    opportunityId: str = Field(..., description="Opportunity ID từ Scholarship Service")
    opportunityType: Literal["scholarship", "lab"] = Field(..., description="Loại cơ hội: scholarship hoặc lab")
    title: str = Field(..., max_length=500, description="Tiêu đề")
    description: Optional[str] = Field(None, description="Mô tả chi tiết")
    minGpa: Optional[float] = Field(None, ge=0.0, le=4.0, description="GPA tối thiểu yêu cầu")
    requiredSkills: Optional[List[str]] = Field(default_factory=list, description="Kỹ năng yêu cầu")
    preferredMajors: Optional[List[str]] = Field(default_factory=list, description="Ngành học ưu tiên")
    researchAreas: Optional[List[str]] = Field(default_factory=list, description="Lĩnh vực nghiên cứu")
    status: Optional[str] = Field(None, description="Status: PUBLISHED, CLOSED, etc.")
    
    class Config:
        json_schema_extra = {
            "example": {
                "opportunityId": "1",
                "opportunityType": "scholarship",
                "title": "AI Research Scholarship 2025",
                "description": "Full scholarship for students interested in AI research...",
                "minGpa": 3.5,
                "requiredSkills": ["Python", "Machine Learning", "Research Experience"],
                "preferredMajors": ["Computer Science", "Data Science"],
                "researchAreas": ["Deep Learning", "Natural Language Processing"],
                "status": "PUBLISHED"
            }
        }

class SyncResponse(BaseModel):
    """Response cho sync APIs"""
    status: Literal["success", "error"] = Field(..., description="Trạng thái sync")
    message: str = Field(..., description="Thông báo")
    entityId: str = Field(..., description="ID của entity đã sync")
    action: Optional[str] = Field(None, description="Action thực hiện: created, updated, deleted")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "success",
                "message": "Applicant 5 synced successfully",
                "entityId": "5",
                "action": "updated"
            }
        }

# ============= Recommendation Schemas =============

class RecommendationResponse(BaseModel):
    """Response for recommendation endpoints"""
    metadata: RecommendationMetadata
    data: List[RecommendationItem]

# ============= Event Schemas (for Celery workers) =============

class UserProfileUpdatedEvent(BaseModel):
    """Event schema for user.profile.updated"""
    userId: str
    gpa: Optional[float] = None
    major: Optional[str] = None
    university: Optional[str] = None
    yearOfStudy: Optional[int] = None
    skills: Optional[List[str]] = []
    researchInterests: Optional[List[str]] = []
    
class ScholarshipCreatedEvent(BaseModel):
    """Event schema for scholarship.created"""
    # Accept both 'opportunityId' (old) and 'id' (from Java service)
    opportunityId: Optional[str] = None
    id: Optional[int] = None  # Java sends 'id' instead of 'opportunityId'
    opportunityType: str = "scholarship"
    title: Optional[str] = None
    description: Optional[str] = None
    minGpa: Optional[float] = None
    requiredSkills: Optional[List[str]] = []
    preferredMajors: Optional[List[str]] = []
    researchAreas: Optional[List[str]] = []
    
    def get_opportunity_id(self) -> str:
        """Get opportunity ID from either field"""
        return str(self.opportunityId or self.id or "")

class ScholarshipUpdatedEvent(BaseModel):
    """Event schema for scholarship.updated (same as created)"""
    opportunityId: str
    opportunityType: str = "scholarship"
    title: Optional[str] = None
    description: Optional[str] = None
    minGpa: Optional[float] = None
    requiredSkills: Optional[List[str]] = []
    preferredMajors: Optional[List[str]] = []
    researchAreas: Optional[List[str]] = []

# ============= Health Check =============

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    service: str
    version: str
    timestamp: datetime
    database: str
    rabbitmq: str
