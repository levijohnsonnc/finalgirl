-- Create storage bucket for poster images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('posters', 'posters', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read poster images (public bucket)
CREATE POLICY "Public can view posters"
ON storage.objects FOR SELECT
USING (bucket_id = 'posters');

-- Allow anyone to upload posters (since we don't have auth yet)
CREATE POLICY "Anyone can upload posters"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'posters');

-- Allow anyone to update their posters
CREATE POLICY "Anyone can update posters"
ON storage.objects FOR UPDATE
USING (bucket_id = 'posters');

-- Allow anyone to delete posters
CREATE POLICY "Anyone can delete posters"
ON storage.objects FOR DELETE
USING (bucket_id = 'posters');