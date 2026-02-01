-- CREATE POLICY "Users can upload to their own folder"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'uploads' AND 
--   (storage.foldername(name))[1] = 'resumes' AND -- Must be in resumes/
--   (storage.foldername(name))[2] = auth.uid()::text -- Must match their ID
-- );

CREATE POLICY "Users can list their own resumes"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'uploads'
  AND (storage.foldername(name))[1] = 'resumes'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

