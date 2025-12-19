-- V4: Create photo_favorites table for Photo Favorites feature
-- Created: December 20, 2024
-- Purpose: Private bookmarking system for photos (different from public likes)

CREATE TABLE photo_favorites (
    id BIGSERIAL PRIMARY KEY,
    photo_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key to gallery_photos table
    CONSTRAINT fk_photo_favorites_photo
        FOREIGN KEY (photo_id)
        REFERENCES gallery_photos(id)
        ON DELETE CASCADE,

    -- Foreign key to users table
    CONSTRAINT fk_photo_favorites_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    -- Unique constraint to prevent duplicate favorites
    -- One user can only favorite a photo once
    CONSTRAINT uk_photo_favorites_photo_user
        UNIQUE (photo_id, user_id)
);

-- Create indexes for performance optimization
-- Index on photo_id for fast lookups by photo
CREATE INDEX idx_photo_favorites_photo_id ON photo_favorites(photo_id);

-- Index on user_id for fast lookups of user's favorited photos
CREATE INDEX idx_photo_favorites_user_id ON photo_favorites(user_id);

-- Index on created_at for ordering by most recently favorited
CREATE INDEX idx_photo_favorites_created_at ON photo_favorites(created_at DESC);

-- Migration complete
