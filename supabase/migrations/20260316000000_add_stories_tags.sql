-- Add tags column to stories for AI-generated stories
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS tags TEXT[];
