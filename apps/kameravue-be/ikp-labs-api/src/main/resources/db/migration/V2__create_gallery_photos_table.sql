-- Database Migration: Create gallery_photos table
-- Version: V2
-- Date: 2025-11-11
-- Description: Create table for storing user gallery photos with privacy control

-- Create gallery_photos table
CREATE TABLE IF NOT EXISTS gallery_photos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    title VARCHAR(100),
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    upload_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Foreign key constraint
    CONSTRAINT fk_gallery_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Add indexes for better query performance
-- Index for querying photos by user
CREATE INDEX idx_gallery_user_id ON gallery_photos(user_id);

-- Index for querying public photos (for public gallery page)
CREATE INDEX idx_gallery_public ON gallery_photos(is_public) WHERE is_public = TRUE;

-- Composite index for user's photos sorted by date
CREATE INDEX idx_gallery_user_created ON gallery_photos(user_id, created_at DESC);

-- Add column comments for documentation
COMMENT ON TABLE gallery_photos IS 'Stores user gallery photos with privacy control. Each user can have multiple photos that can be set as public or private.';

COMMENT ON COLUMN gallery_photos.id IS 'Primary key, auto-generated unique identifier for each photo';
COMMENT ON COLUMN gallery_photos.user_id IS 'Foreign key to users table, identifies photo owner';
COMMENT ON COLUMN gallery_photos.file_path IS 'Relative path to photo file. Example: gallery/user-83/photo-156-1731238845123.jpg';
COMMENT ON COLUMN gallery_photos.title IS 'Optional photo title set by user';
COMMENT ON COLUMN gallery_photos.description IS 'Optional photo description set by user';
COMMENT ON COLUMN gallery_photos.is_public IS 'Privacy flag: true = public (visible to all), false = private (only owner can see)';
COMMENT ON COLUMN gallery_photos.upload_order IS 'User-defined order for sorting photos in gallery, default 0';
COMMENT ON COLUMN gallery_photos.created_at IS 'Timestamp when photo was uploaded';
COMMENT ON COLUMN gallery_photos.updated_at IS 'Timestamp when photo metadata was last updated';

-- Migration Notes:
-- 1. This creates a NEW table for gallery photos (separate from profile pictures)
-- 2. Profile picture: single photo in users.profile_picture column
-- 3. Gallery photos: multiple photos in gallery_photos table
-- 4. ON DELETE CASCADE: when user deleted, all their gallery photos are deleted
-- 5. Default is_public = FALSE for privacy-first approach
-- 6. file_path format: gallery/user-{userId}/photo-{photoId}-{timestamp}.{extension}
-- 7. Actual files stored in: backend/ikp-labs-api/uploads/gallery/user-{userId}/

-- Rollback (if needed):
-- DROP INDEX IF EXISTS idx_gallery_user_created;
-- DROP INDEX IF EXISTS idx_gallery_public;
-- DROP INDEX IF EXISTS idx_gallery_user_id;
-- DROP TABLE IF EXISTS gallery_photos;

-- Verification queries:
-- Check table structure:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'gallery_photos'
-- ORDER BY ordinal_position;

-- Check indexes:
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'gallery_photos';

-- Check foreign key constraints:
-- SELECT constraint_name, table_name, constraint_type
-- FROM information_schema.table_constraints
-- WHERE table_name = 'gallery_photos';
