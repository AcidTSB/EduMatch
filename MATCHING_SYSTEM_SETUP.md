# 🎯 Matching System - User Profile Fields

## Overview
Đã bổ sung các trường cần thiết vào User model để hỗ trợ matching algorithm giữa users và scholarships.

## Changes Made

### 1. Database Schema (User Model)

**New Fields Added:**
```java
// User.java
@Column(name = "gpa")
private Double gpa;  // GPA (0.0 - 4.0)

@Column(name = "major", length = 100)
private String major;  // Ngành học: "Computer Science", "Engineering"

@Column(name = "university", length = 200)
private String university;  // Trường: "MIT", "Stanford"

@Column(name = "year_of_study")
private Integer yearOfStudy;  // Năm học: 1, 2, 3, 4, 5

@Column(name = "skills", columnDefinition = "TEXT")
private String skills;  // "Python,Java,Machine Learning,Deep Learning"

@Column(name = "research_interests", columnDefinition = "TEXT")
private String researchInterests;  // "AI,NLP,Computer Vision,Robotics"
```

### 2. Update Profile Request

**Updated DTO:**
```java
// UpdateProfileRequest.java
private Double gpa;
private String major;
private String university;
private Integer yearOfStudy;
private String skills;  // Comma-separated
private String researchInterests;  // Comma-separated
```

### 3. API Endpoints

#### GET `/api/user/me`
**Response includes new fields:**
```json
{
  "id": 123,
  "username": "john_doe",
  "email": "john@example.com",
  "gpa": 3.8,
  "major": "Computer Science",
  "university": "MIT",
  "yearOfStudy": 3,
  "skills": "Python,Java,Machine Learning",
  "researchInterests": "AI,NLP,Computer Vision"
}
```

#### PUT `/api/user/me`
**Request body can include:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "gpa": 3.8,
  "major": "Computer Science",
  "university": "MIT",
  "yearOfStudy": 3,
  "skills": "Python,Java,Machine Learning",
  "researchInterests": "AI,NLP,Computer Vision"
}
```

### 4. RabbitMQ Event

**Event Published:** `user.profile.updated`

**Payload:**
```json
{
  "userId": "123",
  "email": "john@example.com",
  "gpa": 3.8,
  "major": "Computer Science",
  "university": "MIT",
  "yearOfStudy": 3,
  "skills": ["Python", "Java", "Machine Learning"],
  "researchInterests": ["AI", "NLP", "Computer Vision"]
}
```

**When Published:**
- ✅ After user registration (with default/empty values)
- ✅ After user profile update (with actual values)

**Consumed by:** Matching Service (`matching-service`)

## Database Migration

**File:** `V3__add_matching_fields_to_users.sql`

**Run migration:**
```bash
# Auto-run by Flyway on application startup
# Or manually:
docker exec -it auth-db-test psql -U auth_user -d auth_db -f /path/to/migration.sql
```

## Matching Algorithm

### Input Data
**From User:**
- `gpa`: Float
- `skills`: List[String]
- `researchInterests`: List[String]

**From Scholarship:**
- `minGpa`: Float
- `requiredSkills`: List[String]
- `researchAreas`: List[String]

### Scoring
```python
overall_score = (
    gpa_match * 0.3 +          # 30% weight
    skills_match * 0.5 +        # 50% weight
    research_match * 0.2        # 20% weight
)
```

## Frontend Integration

### Update Profile Form
```typescript
interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  // ... existing fields
  
  // New matching fields
  gpa?: number;
  major?: string;
  university?: string;
  yearOfStudy?: number;
  skills?: string;  // Comma-separated
  researchInterests?: string;  // Comma-separated
}
```

### Example Usage
```typescript
const updateProfile = async () => {
  await api.put('/api/user/me', {
    gpa: 3.8,
    major: 'Computer Science',
    university: 'MIT',
    yearOfStudy: 3,
    skills: 'Python,Java,Machine Learning',
    researchInterests: 'AI,NLP,Computer Vision'
  });
};
```

## Testing

### 1. Update Profile
```bash
curl -X PUT http://localhost:8081/api/user/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "gpa": 3.8,
    "major": "Computer Science",
    "university": "MIT",
    "yearOfStudy": 3,
    "skills": "Python,Java,Machine Learning",
    "researchInterests": "AI,NLP,Computer Vision"
  }'
```

### 2. Verify Event Published
```bash
# Check RabbitMQ Management UI
# http://localhost:15672
# Queue: user_events_queue
# Should see event with full data
```

### 3. Verify Matching Service
```bash
# Check Matching Service logs
docker logs matching-service-test --tail 50 -f

# Should see:
# [Worker] Processing user.profile.updated: 123
# [Worker] ✅ Successfully processed user.profile.updated: 123
```

## Notes

- **Skills Format:** Comma-separated string (e.g., `"Python,Java,ML"`)
- **Research Interests Format:** Comma-separated string
- **GPA Range:** 0.0 - 4.0 (US scale)
- **Year of Study:** 1-5 (typical range)
- **Event Publishing:** Non-blocking (failures don't block profile update)
- **Database:** PostgreSQL for Auth Service
- **Matching Service:** Converts comma-separated to List[String]

## Future Improvements

1. **Validation:**
   - Add GPA range validation (0.0-4.0)
   - Add year of study range (1-5)
   - Validate skills format

2. **Skills Management:**
   - Create separate Skills entity
   - Many-to-Many relationship with User
   - Autocomplete skills from database

3. **University List:**
   - Create University entity
   - Dropdown selection instead of free text

4. **Real-time Sync:**
   - WebSocket notifications when profile affects matching scores
   - Cache invalidation strategy

## Support

For issues or questions:
- Backend: `backend-java/auth-service/`
- Matching: `matching-service/`
- Frontend: TBD (will be implemented)
