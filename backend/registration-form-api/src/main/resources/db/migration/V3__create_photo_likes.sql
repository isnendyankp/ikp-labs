-- V3: Create photo_likes table for Photo Likes feature
-- Created: December 10, 2024

CREATE TABLE photo_likes (
    id BIGSERIAL PRIMARY KEY,
    photo_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_photo_likes_photo
        FOREIGN KEY (photo_id)
        REFERENCES gallery_photos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_photo_likes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_photo_likes_photo_user
        UNIQUE (photo_id, user_id)
);

CREATE INDEX idx_photo_likes_photo_id ON photo_likes(photo_id);
CREATE INDEX idx_photo_likes_user_id ON photo_likes(user_id);
CREATE INDEX idx_photo_likes_created_at ON photo_likes(created_at DESC);

-- Migration complete
