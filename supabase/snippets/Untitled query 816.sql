-- CREATE POLICY "Users can upload to their own folder"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'uploads' AND 
--   (storage.foldername(name))[1] = 'resumes' AND -- Must be in resumes/
--   (storage.foldername(name))[2] = auth.uid()::text -- Must match their ID
-- );

-- CREATE POLICY "Users can list their own resumes"
-- ON storage.objects
-- FOR SELECT
-- TO authenticated
-- USING (
--   bucket_id = 'uploads'
--   AND (storage.foldername(name))[1] = 'resumes'
--   AND (storage.foldername(name))[2] = auth.uid()::text
-- );

SELECT * FROM public.cv_reviews WHERE session_id = '9230d8d1-260c-4b22-bae7-aa800b7ce63f';

