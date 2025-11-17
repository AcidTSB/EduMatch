-- =====================================================
-- EduMatch Database Migration Scripts
-- Migration: applicant/provider → user/employer
-- Date: 2025-11-14
-- =====================================================

-- =====================================================
-- 1. AUTH SERVICE DATABASE UPDATES
-- =====================================================

-- Add sex column to users table
ALTER TABLE users 
ADD COLUMN sex VARCHAR(10) COMMENT 'Gender: MALE, FEMALE, OTHER' 
AFTER last_name;

-- Make firstName and lastName NOT NULL (if needed)
-- WARNING: This will fail if existing records have NULL values
-- Run data migration first if needed
-- ALTER TABLE users 
-- MODIFY COLUMN first_name VARCHAR(50) NOT NULL,
-- MODIFY COLUMN last_name VARCHAR(50) NOT NULL;

-- Optional: Remove username column if not used elsewhere
-- WARNING: Check for dependencies first!
-- ALTER TABLE users DROP COLUMN username;

-- Add index on sex for filtering (optional, improves performance)
CREATE INDEX idx_users_sex ON users(sex);

-- =====================================================
-- 2. SCHOLARSHIP SERVICE DATABASE UPDATES
-- =====================================================

-- Add new columns to opportunities table
ALTER TABLE opportunities
ADD COLUMN scholarship_amount DECIMAL(10,2) COMMENT 'Scholarship amount in USD' AFTER min_experience_level,
ADD COLUMN study_mode VARCHAR(50) COMMENT 'FULL_TIME, PART_TIME, REMOTE' AFTER scholarship_amount,
ADD COLUMN level VARCHAR(50) COMMENT 'Education level: HIGH_SCHOOL, UNDERGRADUATE, GRADUATE, MASTER, PHD, POSTDOCTORAL' AFTER study_mode,
ADD COLUMN is_public BOOLEAN DEFAULT TRUE COMMENT 'Whether scholarship is publicly visible' AFTER level,
ADD COLUMN start_date DATE COMMENT 'Scholarship start date' AFTER is_public,
ADD COLUMN end_date DATE COMMENT 'Scholarship end date' AFTER start_date,
ADD COLUMN contact_email VARCHAR(255) COMMENT 'Contact email for inquiries' AFTER end_date,
ADD COLUMN website VARCHAR(500) COMMENT 'Scholarship website URL' AFTER contact_email;

-- Remove position column (deprecated)
ALTER TABLE opportunities DROP COLUMN position;

-- Add indexes for better query performance
CREATE INDEX idx_opportunities_study_mode ON opportunities(study_mode);
CREATE INDEX idx_opportunities_level ON opportunities(level);
CREATE INDEX idx_opportunities_is_public ON opportunities(is_public);
CREATE INDEX idx_opportunities_amount ON opportunities(scholarship_amount);
CREATE INDEX idx_opportunities_dates ON opportunities(start_date, end_date);

-- =====================================================
-- 3. MATCHING SERVICE DATABASE UPDATES (PostgreSQL)
-- =====================================================

-- Add new columns to opportunity_features table for enhanced matching
ALTER TABLE opportunity_features
ADD COLUMN scholarship_amount FLOAT,
ADD COLUMN study_mode VARCHAR(50),
ADD COLUMN level VARCHAR(50);

-- Add indexes
CREATE INDEX idx_opp_features_amount ON opportunity_features(scholarship_amount);
CREATE INDEX idx_opp_features_study_mode ON opportunity_features(study_mode);
CREATE INDEX idx_opp_features_level ON opportunity_features(level);

-- Note: No changes needed to applicant_features table

-- =====================================================
-- 4. DATA MIGRATION SCRIPTS
-- =====================================================

-- 4.1 Set default values for existing opportunities
-- Run AFTER adding columns, BEFORE making them NOT NULL

-- Set default scholarship amount (if you want to require it)
-- UPDATE opportunities 
-- SET scholarship_amount = 0.00 
-- WHERE scholarship_amount IS NULL;

-- Set default study mode
UPDATE opportunities 
SET study_mode = 'FULL_TIME' 
WHERE study_mode IS NULL;

-- Set default level based on existing data (example logic)
-- You may need to adjust this based on your actual data
UPDATE opportunities 
SET level = 'UNDERGRADUATE' 
WHERE level IS NULL AND title LIKE '%undergraduate%';

UPDATE opportunities 
SET level = 'GRADUATE' 
WHERE level IS NULL AND title LIKE '%graduate%';

UPDATE opportunities 
SET level = 'PHD' 
WHERE level IS NULL AND (title LIKE '%phd%' OR title LIKE '%doctoral%');

-- Set default for remaining records
UPDATE opportunities 
SET level = 'UNDERGRADUATE' 
WHERE level IS NULL;

-- Set is_public to true for all existing records
UPDATE opportunities 
SET is_public = TRUE 
WHERE is_public IS NULL;

-- 4.2 Migrate position data to tags (if needed)
-- This creates a tag from the position field before dropping it
INSERT INTO tags (name, created_at)
SELECT DISTINCT position, NOW()
FROM opportunities
WHERE position IS NOT NULL 
AND position != ''
AND position NOT IN (SELECT name FROM tags)
ON DUPLICATE KEY UPDATE name = name;

-- Link positions to opportunities via opportunity_to_tags
INSERT INTO opportunity_to_tags (opportunity_id, tag_id)
SELECT o.id, t.id
FROM opportunities o
JOIN tags t ON t.name = o.position
WHERE o.position IS NOT NULL AND o.position != ''
ON DUPLICATE KEY UPDATE opportunity_id = opportunity_id;

-- 4.3 Migrate user data (if needed)
-- Set default sex value for existing users
-- You may want to leave NULL and prompt users to update
-- UPDATE users SET sex = 'OTHER' WHERE sex IS NULL;

-- =====================================================
-- 5. VALIDATION CONSTRAINTS
-- =====================================================

-- Add CHECK constraints for enum-like fields

-- Study mode constraint
ALTER TABLE opportunities
ADD CONSTRAINT chk_study_mode 
CHECK (study_mode IN ('FULL_TIME', 'PART_TIME', 'REMOTE'));

-- Level constraint
ALTER TABLE opportunities
ADD CONSTRAINT chk_level 
CHECK (level IN ('HIGH_SCHOOL', 'UNDERGRADUATE', 'GRADUATE', 'MASTER', 'PHD', 'POSTDOCTORAL'));

-- Sex constraint
ALTER TABLE users
ADD CONSTRAINT chk_sex 
CHECK (sex IN ('MALE', 'FEMALE', 'OTHER') OR sex IS NULL);

-- Amount constraint (must be positive)
ALTER TABLE opportunities
ADD CONSTRAINT chk_scholarship_amount 
CHECK (scholarship_amount >= 0);

-- Date constraint (end date after start date)
ALTER TABLE opportunities
ADD CONSTRAINT chk_dates 
CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date);

-- =====================================================
-- 6. ROLLBACK SCRIPT (USE WITH CAUTION)
-- =====================================================

-- Uncomment and run if you need to rollback changes

-- -- Rollback opportunities table
-- ALTER TABLE opportunities DROP CONSTRAINT chk_study_mode;
-- ALTER TABLE opportunities DROP CONSTRAINT chk_level;
-- ALTER TABLE opportunities DROP CONSTRAINT chk_scholarship_amount;
-- ALTER TABLE opportunities DROP CONSTRAINT chk_dates;
-- 
-- ALTER TABLE opportunities
-- ADD COLUMN position VARCHAR(255) AFTER min_experience_level,
-- DROP COLUMN scholarship_amount,
-- DROP COLUMN study_mode,
-- DROP COLUMN level,
-- DROP COLUMN is_public,
-- DROP COLUMN start_date,
-- DROP COLUMN end_date,
-- DROP COLUMN contact_email,
-- DROP COLUMN website;
-- 
-- -- Rollback users table
-- ALTER TABLE users DROP CONSTRAINT chk_sex;
-- ALTER TABLE users DROP COLUMN sex;
-- ALTER TABLE users ADD COLUMN username VARCHAR(50) UNIQUE AFTER id;

-- =====================================================
-- 7. VERIFICATION QUERIES
-- =====================================================

-- Verify opportunities table structure
DESCRIBE opportunities;

-- Verify users table structure
DESCRIBE users;

-- Check for NULL values in new required fields
SELECT COUNT(*) as null_study_mode FROM opportunities WHERE study_mode IS NULL;
SELECT COUNT(*) as null_level FROM opportunities WHERE level IS NULL;

-- Check data distribution
SELECT study_mode, COUNT(*) as count FROM opportunities GROUP BY study_mode;

-- =====================================================
-- 8. APPLICATION TABLE UPDATES (Scholarship Service)
-- =====================================================

-- Add new columns to applications table for enhanced application data
ALTER TABLE applications
ADD COLUMN applicant_user_name VARCHAR(255) COMMENT 'Applicant user name' AFTER notes,
ADD COLUMN applicant_email VARCHAR(255) COMMENT 'Applicant email' AFTER applicant_user_name,
ADD COLUMN phone VARCHAR(50) COMMENT 'Applicant phone number' AFTER applicant_email,
ADD COLUMN gpa DECIMAL(3,2) COMMENT 'Applicant GPA' AFTER phone,
ADD COLUMN cover_letter TEXT COMMENT 'Cover letter content' AFTER gpa,
ADD COLUMN motivation TEXT COMMENT 'Motivation statement' AFTER cover_letter,
ADD COLUMN additional_info TEXT COMMENT 'Additional information' AFTER motivation,
ADD COLUMN portfolio_url VARCHAR(500) COMMENT 'Portfolio URL' AFTER additional_info,
ADD COLUMN linkedin_url VARCHAR(500) COMMENT 'LinkedIn profile URL' AFTER portfolio_url,
ADD COLUMN github_url VARCHAR(500) COMMENT 'GitHub profile URL' AFTER linkedin_url;

-- Add indexes for better query performance
CREATE INDEX idx_applications_applicant_email ON applications(applicant_email);
CREATE INDEX idx_applications_gpa ON applications(gpa);

-- =====================================================
-- 9. VERIFICATION QUERIES FOR APPLICATIONS
-- =====================================================

-- Verify applications table structure
DESCRIBE applications;

-- Check for applications with new fields populated
SELECT COUNT(*) as apps_with_email FROM applications WHERE applicant_email IS NOT NULL;
SELECT COUNT(*) as apps_with_gpa FROM applications WHERE gpa IS NOT NULL;
SELECT level, COUNT(*) as count FROM opportunities GROUP BY level;
SELECT sex, COUNT(*) as count FROM users GROUP BY sex;

-- Verify constraints
SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE 
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
WHERE TABLE_NAME = 'opportunities';

SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE 
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
WHERE TABLE_NAME = 'users';

-- =====================================================
-- 8. PERFORMANCE OPTIMIZATION
-- =====================================================

-- Analyze tables after migration for query optimizer
ANALYZE TABLE opportunities;
ANALYZE TABLE users;

-- Update table statistics (PostgreSQL)
-- ANALYZE opportunity_features;
-- ANALYZE applicant_features;

-- =====================================================
-- 9. BACKUP COMMANDS (RUN BEFORE MIGRATION)
-- =====================================================

-- MySQL Backup
-- mysqldump -u [username] -p[password] [database_name] > backup_before_migration_$(date +%Y%m%d).sql

-- PostgreSQL Backup
-- pg_dump -U [username] -d [database_name] -f backup_before_migration_$(date +%Y%m%d).sql

-- Backup specific tables only
-- mysqldump -u [username] -p[password] [database_name] users opportunities > backup_critical_tables.sql

-- =====================================================
-- 10. POST-MIGRATION CHECKLIST
-- =====================================================

-- [ ] All new columns added successfully
-- [ ] All old columns removed (position)
-- [ ] Constraints applied and tested
-- [ ] Indexes created and verified
-- [ ] Data migrated correctly
-- [ ] No NULL values in required fields
-- [ ] Backup created and verified
-- [ ] Application tested with new schema
-- [ ] Rollback script prepared and tested (in dev)

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. Always backup before running migrations
-- 2. Test in development environment first
-- 3. Run during low-traffic hours
-- 4. Monitor application logs after migration
-- 5. Have rollback plan ready
-- 6. Verify data integrity after migration
-- 7. Update API documentation
-- 8. Notify frontend team of changes
-- 9. Update any stored procedures/views
-- 10. Consider gradual rollout strategy

-- =====================================================
-- MIGRATION EXECUTION ORDER:
-- =====================================================
-- 1. Create backup (Section 9)
-- 2. Run Auth Service updates (Section 1)
-- 3. Run Scholarship Service updates (Section 2)
-- 4. Run Matching Service updates (Section 3)
-- 5. Run data migration (Section 4)
-- 6. Add constraints (Section 5)
-- 7. Run verification queries (Section 7)
-- 8. Optimize (Section 8)
-- 9. Test application thoroughly
-- 10. Monitor for 24-48 hours

-- End of migration script
