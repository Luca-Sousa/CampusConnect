ALTER TABLE post
  ADD COLUMN tags text,
  ADD COLUMN moderated boolean DEFAULT false NOT NULL,
  ADD COLUMN moderation_reasons text;
