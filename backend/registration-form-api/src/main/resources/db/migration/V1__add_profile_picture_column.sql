-- Database Migration: Add profile_picture column to users table
-- Version: V1
-- Date: 2025-10-27
-- Description: Add support for user profile pictures by adding a column to store file path

-- Add profile_picture column
-- Type: VARCHAR(255) - stores file path, not binary data
-- Nullable: YES - profile picture is optional for users
-- Example value: "/uploads/profiles/user-83.jpg"
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255);

-- Add comment to column for documentation
COMMENT ON COLUMN users.profile_picture IS 'Relative path to user profile picture file. Example: /uploads/profiles/user-83.jpg. NULL if user has not uploaded a profile picture.';

-- Optional: Add index for faster queries filtering by users with/without profile pictures
-- Uncomment if you need to query users based on profile picture existence
-- CREATE INDEX idx_users_profile_picture ON users(profile_picture) WHERE profile_picture IS NOT NULL;

-- Migration Notes:
-- 1. This is a NON-BREAKING change (nullable column)
-- 2. Existing users will have NULL profile_picture (no photo yet)
-- 3. New users can optionally upload profile pictures
-- 4. File path format: /uploads/profiles/user-{userId}.{extension}
-- 5. Actual files stored in: backend/registration-form-api/uploads/profiles/
-- 6. Database only stores PATH, not binary file data

-- Rollback (if needed):
-- ALTER TABLE users DROP COLUMN IF EXISTS profile_picture;

-- Verification query:
-- SELECT column_name, data_type, is_nullable, character_maximum_length
-- FROM information_schema.columns
-- WHERE table_name = 'users' AND column_name = 'profile_picture';
