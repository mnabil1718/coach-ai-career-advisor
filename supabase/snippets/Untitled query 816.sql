CREATE POLICY "Users can update their own sessions"
ON coaching_sessions
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());


-- SELECT * FROM public.coaching_sessions WHERE id='b0029141-ba65-438c-9d8a-2372db159ed1';





