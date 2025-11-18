# 🧠 MATCHING SERVICE - HƯỚNG DẪN TÍCH HỢP

## 📋 Tổng quan
Matching Service sử dụng **AI/ML (scikit-learn, TF-IDF, Cosine Similarity)** để tính toán độ tương đồng giữa sinh viên và học bổng, giúp đề xuất các cơ hội phù hợp nhất.

**Tech Stack:**
- FastAPI (Python)
- PostgreSQL (Matching DB)
- scikit-learn (TF-IDF, Cosine Similarity)
- Celery (Background jobs - optional)
- RabbitMQ (Event-driven sync - optional)

---

## 🎯 1. CÁC THÀNH PHẦN CHÍNH

### 1.1. MatchingEngine (Bộ não AI)
**File:** `app/matching.py`

**Thuật toán:**
```python
Total Score = (Skills Match × 50%) + (GPA Match × 30%) + (Research Match × 20%)
```

**3 chỉ số:**
- **Skills Match (50%):** TF-IDF + Cosine Similarity giữa kỹ năng sinh viên và yêu cầu học bổng
- **GPA Match (30%):** So sánh GPA sinh viên vs GPA tối thiểu
- **Research Match (20%):** Tương đồng về lĩnh vực nghiên cứu

**Performance:**
- Rule-based scoring: < 300ms (dùng cho API `/match/score`)
- ML-based scoring: 2-5s (dùng cho API `/recommendations`)

---

## 🗄️ 2. DATABASE SCHEMA (PostgreSQL)

### 2.1. Bảng `applicant_features`
Lưu trữ features đã tiền xử lý của sinh viên.

```sql
CREATE TABLE applicant_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id VARCHAR(255) UNIQUE NOT NULL,  -- User ID từ Auth Service
    
    -- Profile data
    gpa FLOAT,
    major VARCHAR(255),
    university VARCHAR(255),
    year_of_study INTEGER,
    
    -- Skills (original)
    skills TEXT[],  -- PostgreSQL Array
    research_interests TEXT[],
    
    -- Preprocessed features (for ML)
    skills_vector JSON,         -- TF-IDF vector
    research_vector JSON,       -- TF-IDF vector
    combined_text TEXT,         -- Combined text for vectorization
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_processed_at TIMESTAMP
);

CREATE INDEX idx_applicant_id ON applicant_features(applicant_id);
```

### 2.2. Bảng `opportunity_features`
Lưu trữ features đã tiền xử lý của học bổng.

```sql
CREATE TABLE opportunity_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id VARCHAR(255) UNIQUE NOT NULL,  -- Scholarship ID từ Scholarship Service
    
    -- Opportunity data
    opportunity_type VARCHAR(50) NOT NULL,  -- 'scholarship' or 'lab'
    title VARCHAR(500),
    description TEXT,
    
    -- Requirements
    min_gpa FLOAT,
    required_skills TEXT[],
    preferred_majors TEXT[],
    research_areas TEXT[],
    
    -- Preprocessed features
    skills_vector JSON,
    research_vector JSON,
    combined_text TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_processed_at TIMESTAMP
);

CREATE INDEX idx_opportunity_id ON opportunity_features(opportunity_id);
```

### 2.3. Bảng `matching_scores` (Cache - Optional)
Cache kết quả tính toán để tối ưu performance.

```sql
CREATE TABLE matching_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id VARCHAR(255) NOT NULL,
    opportunity_id VARCHAR(255) NOT NULL,
    
    -- Scores
    overall_score FLOAT NOT NULL,
    gpa_score FLOAT,
    skills_score FLOAT,
    research_score FLOAT,
    
    -- Metadata
    calculated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    
    UNIQUE(applicant_id, opportunity_id)
);

CREATE INDEX idx_matching_applicant ON matching_scores(applicant_id);
CREATE INDEX idx_matching_opportunity ON matching_scores(opportunity_id);
```

---

## 🚀 3. CÁC API ENDPOINTS

### 3.1. POST /api/v1/match/score
**Mục đích:** Tính điểm tương đồng giữa 1 sinh viên và 1 học bổng.

**Request:**
```json
POST http://localhost:8000/api/v1/match/score
Content-Type: application/json

{
  "applicantId": "5",
  "opportunityId": "1"
}
```

**Response:**
```json
{
  "overallScore": 84.7,
  "breakdown": {
    "gpaMatch": 95.0,
    "skillsMatch": 80.0,
    "researchMatch": 75.0
  }
}
```

**Performance:** < 300ms

---

### 3.2. GET /api/v1/recommendations/applicant/{applicantId}
**Mục đích:** Lấy danh sách học bổng phù hợp cho 1 sinh viên.

**Request:**
```http
GET http://localhost:8000/api/v1/recommendations/applicant/5?limit=10&page=1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "metadata": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  },
  "data": [
    {
      "opportunityId": "3",
      "matchingScore": 92.3
    },
    {
      "opportunityId": "1",
      "matchingScore": 84.7
    }
  ]
}
```

**⚠️ WARNING:** API này CHẬM (2-5s) vì chạy ML on-the-fly.

---

### 3.3. POST /api/v1/sync/applicant ⭐
**Mục đích:** Đồng bộ dữ liệu sinh viên từ Auth Service vào Matching DB.

**Khi nào gọi:**
- ✅ User đăng ký mới (sau verify)
- ✅ User cập nhật profile (GPA, skills, bio)
- ✅ User cập nhật research interests

**Request:**
```json
POST http://localhost:8000/api/v1/sync/applicant
Content-Type: application/json

{
  "userId": "5",
  "gpa": 3.8,
  "major": "Computer Science",
  "university": "University of Transport",
  "yearOfStudy": 3,
  "skills": ["Python", "Machine Learning", "TensorFlow"],
  "researchInterests": ["Natural Language Processing", "Computer Vision"],
  "bio": "Passionate about AI and deep learning."
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Applicant 5 synced successfully",
  "entityId": "5",
  "action": "updated"
}
```

---

### 3.4. POST /api/v1/sync/opportunity ⭐
**Mục đích:** Đồng bộ dữ liệu học bổng từ Scholarship Service vào Matching DB.

**Khi nào gọi:**
- ✅ Admin approve scholarship (PENDING → PUBLISHED)
- ✅ Employer update scholarship
- ✅ Scholarship status change to CLOSED

**Request:**
```json
POST http://localhost:8000/api/v1/sync/opportunity
Content-Type: application/json

{
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
```

**Response:**
```json
{
  "status": "success",
  "message": "Opportunity 1 synced successfully",
  "entityId": "1",
  "action": "created"
}
```

---

## 🔄 4. LUỒNG TÍCH HỢP THỰC TẾ

### Scenario 1: Sinh viên đăng ký tài khoản
```mermaid
sequenceDiagram
    participant User as Sinh viên
    participant Frontend as Frontend
    participant AuthSvc as Auth Service
    participant MatchingSvc as Matching Service
    participant PostgreSQL as PostgreSQL

    User->>Frontend: Đăng ký + nhập GPA, skills
    Frontend->>AuthSvc: POST /api/auth/register
    AuthSvc->>AuthSvc: Lưu vào MySQL
    AuthSvc->>MatchingSvc: POST /api/v1/sync/applicant
    Note over AuthSvc,MatchingSvc: {userId, gpa, skills, bio}
    MatchingSvc->>PostgreSQL: INSERT INTO applicant_features
    MatchingSvc->>MatchingSvc: Preprocess features (TF-IDF)
    MatchingSvc-->>AuthSvc: 200 OK
    AuthSvc-->>Frontend: 200 OK
```

### Scenario 2: Admin approve học bổng
```mermaid
sequenceDiagram
    participant Admin as Admin
    participant Frontend as Frontend
    participant ScholarshipSvc as Scholarship Service
    participant MatchingSvc as Matching Service
    participant PostgreSQL as PostgreSQL

    Admin->>Frontend: Approve scholarship
    Frontend->>ScholarshipSvc: PUT /api/scholarships/1/approve
    ScholarshipSvc->>ScholarshipSvc: Update status = PUBLISHED
    ScholarshipSvc->>MatchingSvc: POST /api/v1/sync/opportunity
    Note over ScholarshipSvc,MatchingSvc: {opportunityId, title, description,<br/>minGpa, requiredSkills}
    MatchingSvc->>PostgreSQL: INSERT INTO opportunity_features
    MatchingSvc->>MatchingSvc: Preprocess features (TF-IDF)
    MatchingSvc-->>ScholarshipSvc: 200 OK
    ScholarshipSvc-->>Frontend: 200 OK
```

### Scenario 3: Sinh viên xem học bổng
```mermaid
sequenceDiagram
    participant User as Sinh viên
    participant Frontend as Frontend
    participant MatchingSvc as Matching Service

    User->>Frontend: Click vào học bổng
    Frontend->>MatchingSvc: POST /api/v1/match/score<br/>{applicantId: 5, opportunityId: 1}
    MatchingSvc->>MatchingSvc: Calculate score<br/>(< 300ms)
    MatchingSvc-->>Frontend: 200 OK {overallScore: 84.7}
    Frontend->>Frontend: Hiển thị progress bar<br/>"84.7% Phù hợp"
```

---

## 💻 5. CODE TÍCH HỢP

### 5.1. Auth Service (Java) - Gọi sync khi user update profile
```java
@Service
public class UserService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    private static final String MATCHING_SERVICE_URL = "http://matching-service:8000";
    
    public void updateUserProfile(Long userId, UserProfileDTO profile) {
        // 1. Lưu vào MySQL
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setGpa(profile.getGpa());
        user.setMajor(profile.getMajor());
        user.setBio(profile.getBio());
        userRepository.save(user);
        
        // 2. Sync sang Matching Service
        syncApplicantToMatchingService(user);
    }
    
    private void syncApplicantToMatchingService(User user) {
        try {
            // Prepare request
            Map<String, Object> syncRequest = new HashMap<>();
            syncRequest.put("userId", user.getId().toString());
            syncRequest.put("gpa", user.getGpa());
            syncRequest.put("major", user.getMajor());
            syncRequest.put("university", user.getUniversity());
            syncRequest.put("yearOfStudy", user.getYearOfStudy());
            syncRequest.put("skills", user.getSkills()); // List<String>
            syncRequest.put("researchInterests", user.getResearchInterests());
            syncRequest.put("bio", user.getBio());
            
            // Call Matching Service
            String url = MATCHING_SERVICE_URL + "/api/v1/sync/applicant";
            ResponseEntity<Map> response = restTemplate.postForEntity(
                url, 
                syncRequest, 
                Map.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                log.info("Applicant {} synced successfully to Matching Service", user.getId());
            }
            
        } catch (Exception e) {
            log.error("Failed to sync applicant to Matching Service", e);
            // Không throw exception để không block user update
            // Có thể retry sau bằng scheduled job
        }
    }
}
```

### 5.2. Scholarship Service (Java) - Gọi sync khi admin approve
```java
@Service
public class ScholarshipService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    private static final String MATCHING_SERVICE_URL = "http://matching-service:8000";
    
    public void approveScholarship(Long scholarshipId) {
        // 1. Update status trong MySQL
        Opportunity scholarship = opportunityRepository.findById(scholarshipId)
            .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found"));
        
        scholarship.setStatus(OpportunityStatus.PUBLISHED);
        opportunityRepository.save(scholarship);
        
        // 2. Sync sang Matching Service
        syncOpportunityToMatchingService(scholarship);
    }
    
    private void syncOpportunityToMatchingService(Opportunity scholarship) {
        try {
            Map<String, Object> syncRequest = new HashMap<>();
            syncRequest.put("opportunityId", scholarship.getId().toString());
            syncRequest.put("opportunityType", "scholarship");
            syncRequest.put("title", scholarship.getTitle());
            syncRequest.put("description", scholarship.getDescription());
            syncRequest.put("minGpa", scholarship.getMinGpa());
            syncRequest.put("requiredSkills", scholarship.getRequiredSkills());
            syncRequest.put("preferredMajors", scholarship.getPreferredMajors());
            syncRequest.put("researchAreas", scholarship.getResearchAreas());
            syncRequest.put("status", scholarship.getStatus().name());
            
            String url = MATCHING_SERVICE_URL + "/api/v1/sync/opportunity";
            ResponseEntity<Map> response = restTemplate.postForEntity(
                url,
                syncRequest,
                Map.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                log.info("Opportunity {} synced successfully", scholarship.getId());
            }
            
        } catch (Exception e) {
            log.error("Failed to sync opportunity to Matching Service", e);
        }
    }
}
```

### 5.3. Frontend (TypeScript) - Hiển thị matching score
```typescript
// services/matchingService.ts
export const getMatchingScore = async (
  applicantId: string,
  opportunityId: string
): Promise<MatchingScoreResponse> => {
  const response = await api.post('/api/v1/match/score', {
    applicantId,
    opportunityId
  });
  return response.data;
};

// components/ScholarshipCard.tsx
const ScholarshipCard = ({ scholarship, currentUserId }) => {
  const [matchingScore, setMatchingScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScore = async () => {
      setLoading(true);
      try {
        const result = await getMatchingScore(
          currentUserId,
          scholarship.id
        );
        setMatchingScore(result.overallScore);
      } catch (error) {
        console.error('Error fetching matching score:', error);
        setMatchingScore(null); // Fallback: không hiển thị score
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId && scholarship.id) {
      fetchScore();
    }
  }, [currentUserId, scholarship.id]);

  return (
    <div className="scholarship-card">
      <h3>{scholarship.title}</h3>
      <p>{scholarship.description}</p>
      
      {loading && <Spinner />}
      
      {matchingScore !== null && (
        <div className="matching-score">
          <ProgressBar 
            value={matchingScore} 
            color={matchingScore >= 80 ? 'green' : matchingScore >= 60 ? 'yellow' : 'red'}
          />
          <span>{matchingScore.toFixed(1)}% Phù hợp</span>
          
          {matchingScore >= 80 && (
            <Badge color="success">Rất phù hợp</Badge>
          )}
        </div>
      )}
      
      <Button onClick={() => applyScholarship(scholarship.id)}>
        Ứng tuyển
      </Button>
    </div>
  );
};
```

---

## 🐛 6. XỬ LÝ COLD START (Dữ liệu trống)

**Vấn đề:** Khi mới triển khai, DB matching trống → API `/match/score` không có dữ liệu để tính.

**Giải pháp:**

### Option 1: Backfill Data (Khuyến nghị)
Tạo script để đồng bộ toàn bộ data hiện có từ MySQL sang PostgreSQL.

```python
# scripts/backfill_data.py
import requests
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Kết nối MySQL (Auth DB)
auth_engine = create_engine('mysql://user:pass@localhost:3307/auth_db')
AuthSession = sessionmaker(bind=auth_engine)

# Kết nối MySQL (Scholarship DB)
scholarship_engine = create_engine('mysql://user:pass@localhost:3308/scholarship_db')
ScholarshipSession = sessionmaker(bind=scholarship_engine)

MATCHING_SERVICE_URL = 'http://localhost:8000'

def backfill_applicants():
    """Sync all users to Matching Service"""
    auth_session = AuthSession()
    
    # Lấy tất cả users
    users = auth_session.execute(
        "SELECT id, gpa, major, university, year_of_study, bio FROM users WHERE enabled=1"
    ).fetchall()
    
    print(f"Found {len(users)} users to sync")
    
    for user in users:
        # Lấy skills
        skills = auth_session.execute(
            "SELECT skill_name FROM user_skills WHERE user_id=%s",
            (user[0],)
        ).fetchall()
        
        # Prepare sync request
        sync_data = {
            'userId': str(user[0]),
            'gpa': user[1],
            'major': user[2],
            'university': user[3],
            'yearOfStudy': user[4],
            'skills': [s[0] for s in skills],
            'researchInterests': [],
            'bio': user[5]
        }
        
        # Call Matching Service
        try:
            response = requests.post(
                f'{MATCHING_SERVICE_URL}/api/v1/sync/applicant',
                json=sync_data,
                timeout=10
            )
            print(f"✅ Synced user {user[0]}: {response.json()}")
        except Exception as e:
            print(f"❌ Error syncing user {user[0]}: {e}")
    
    auth_session.close()

def backfill_opportunities():
    """Sync all scholarships to Matching Service"""
    scholarship_session = ScholarshipSession()
    
    # Lấy tất cả scholarships PUBLISHED
    scholarships = scholarship_session.execute(
        "SELECT id, title, description, min_gpa FROM opportunities WHERE status='PUBLISHED'"
    ).fetchall()
    
    print(f"Found {len(scholarships)} scholarships to sync")
    
    for scholarship in scholarships:
        sync_data = {
            'opportunityId': str(scholarship[0]),
            'opportunityType': 'scholarship',
            'title': scholarship[1],
            'description': scholarship[2],
            'minGpa': scholarship[3],
            'requiredSkills': [],  # Parse từ description nếu có
            'preferredMajors': [],
            'researchAreas': [],
            'status': 'PUBLISHED'
        }
        
        try:
            response = requests.post(
                f'{MATCHING_SERVICE_URL}/api/v1/sync/opportunity',
                json=sync_data,
                timeout=10
            )
            print(f"✅ Synced scholarship {scholarship[0]}: {response.json()}")
        except Exception as e:
            print(f"❌ Error syncing scholarship {scholarship[0]}: {e}")
    
    scholarship_session.close()

if __name__ == '__main__':
    print("=== Starting backfill process ===")
    backfill_applicants()
    backfill_opportunities()
    print("=== Backfill completed ===")
```

**Chạy script:**
```bash
cd matching-service
python scripts/backfill_data.py
```

### Option 2: Graceful Fallback trong Code
Nếu không có data, trả về điểm mặc định 50%.

```python
# Đã implement trong service.py
if not applicant:
    return schemas.ScoreResponse(
        overallScore=50.0,
        breakdown=schemas.ScoreBreakdown(
            gpaMatch=50.0,
            skillsMatch=50.0,
            researchMatch=50.0
        )
    )
```

Frontend xử lý:
```typescript
if (matchingScore === null || matchingScore === 50) {
  // Không hiển thị hoặc hiển thị message
  return <div>Cần cập nhật hồ sơ để xem độ phù hợp</div>;
}
```

---

## ✅ 7. CHECKLIST TRIỂN KHAI

### Phase 1: Setup Matching Service
- [ ] Cài đặt Python dependencies: `pip install -r requirements.txt`
- [ ] Setup PostgreSQL database
- [ ] Tạo tables: `applicant_features`, `opportunity_features`, `matching_scores`
- [ ] Config database URL trong `.env`
- [ ] Start service: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- [ ] Test health check: `GET http://localhost:8000/health`

### Phase 2: Tích hợp Auth Service
- [ ] Implement `syncApplicantToMatchingService()` method
- [ ] Gọi sync khi user register
- [ ] Gọi sync khi user update profile
- [ ] Test bằng Postman: Register user → Check PostgreSQL

### Phase 3: Tích hợp Scholarship Service
- [ ] Implement `syncOpportunityToMatchingService()` method
- [ ] Gọi sync khi admin approve scholarship
- [ ] Gọi sync khi employer update scholarship
- [ ] Test bằng Postman: Approve scholarship → Check PostgreSQL

### Phase 4: Backfill Data (Cold Start)
- [ ] Viết script `backfill_data.py`
- [ ] Sync tất cả users hiện có
- [ ] Sync tất cả scholarships PUBLISHED
- [ ] Verify data trong PostgreSQL

### Phase 5: Frontend Integration
- [ ] Implement `getMatchingScore()` API call
- [ ] Hiển thị progress bar trong ScholarshipCard
- [ ] Hiển thị badge "Rất phù hợp" nếu score >= 80%
- [ ] Handle loading state và error

### Phase 6: Testing & Optimization
- [ ] Test performance API `/match/score` (target: < 300ms)
- [ ] Test edge cases: User chưa có GPA, Scholarship không yêu cầu skills
- [ ] Monitor logs khi có lỗi sync
- [ ] (Optional) Setup Redis cache cho recommendations

---

## 🚨 8. LƯU Ý QUAN TRỌNG

### ❗ Lỗi thường gặp

1. **"Applicant not found in features DB"**
   - Nguyên nhân: User chưa được sync vào Matching DB
   - Fix: Gọi POST `/sync/applicant` hoặc chạy backfill script

2. **"Matching score always 50%"**
   - Nguyên nhân: User hoặc Scholarship thiếu data (skills, GPA)
   - Fix: Yêu cầu user cập nhật profile đầy đủ

3. **"Recommendations API quá chậm (> 10s)"**
   - Nguyên nhân: Database có quá nhiều records (> 1000)
   - Fix: Implement caching với Redis, hoặc tính toán background

### ⚡ Tối ưu Performance

1. **Cache matching scores:**
   - Lưu kết quả vào bảng `matching_scores`
   - TTL: 1 giờ (cập nhật khi user/scholarship thay đổi)

2. **Batch processing:**
   - Thay vì tính score từng cặp, tính batch 100 cặp cùng lúc
   - Dùng Celery worker để tính background

3. **Pagination:**
   - API recommendations phải có pagination (`limit`, `page`)
   - Giới hạn `limit` tối đa 100

---

## 📚 9. TÀI LIỆU THAM KHẢO

- **Sequence Diagrams:** `SEQUENCE_DIAGRAMS_COMPLETE.md` (PART 5: Matching Flows)
- **FastAPI Docs:** `http://localhost:8000/docs` (Swagger UI)
- **scikit-learn TF-IDF:** https://scikit-learn.org/stable/modules/feature_extraction.html#tfidf-term-weighting
- **Cosine Similarity:** https://en.wikipedia.org/wiki/Cosine_similarity

---

## 🎓 10. MẸO CHO ĐỒ ÁN

1. **Demo Cold Start:**
   - Khi demo, hãy show trường hợp "Cần cập nhật hồ sơ" để giảng viên thấy bạn xử lý edge case

2. **Hiển thị lý do phù hợp:**
   - Trong response `breakdown`, show "Bạn phù hợp vì GPA đạt chuẩn (3.8/3.5) và có kỹ năng Python"

3. **Performance metrics:**
   - Log thời gian xử lý mỗi request
   - Demo với Postman: "API này chỉ mất 250ms"

4. **Explain thuật toán:**
   - Chuẩn bị 1 slide giải thích TF-IDF + Cosine Similarity (có ảnh minh họa)
   - Giải thích tại sao chọn tỷ lệ Skills 50%, GPA 30%, Research 20%

5. **Future improvements:**
   - Đề cập: "Trong tương lai có thể dùng Deep Learning (BERT embeddings) để tăng độ chính xác"
   - "Có thể thêm Collaborative Filtering: người dùng tương tự thích học bổng gì"

---

**✨ Chúc bạn triển khai thành công!**
