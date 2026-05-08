-- Create buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('goal-attachments', 'goal-attachments', false),
  ('board-packs', 'board-packs', false)
ON CONFLICT (id) DO NOTHING;

-- AVATARS: public read, owner-folder writes
CREATE POLICY "Avatars are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- GOAL ATTACHMENTS: private, owner folder
CREATE POLICY "Owners read their goal attachments"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'goal-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users upload to their goal attachments folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'goal-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Owners delete their goal attachments"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'goal-attachments'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR has_role_level(auth.uid(), 'admin'::text)
    )
  );

-- BOARD PACKS: private, org-folder (first segment = organization_id)
CREATE POLICY "Org members read board pack files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'board-packs'
    AND is_organization_member(((storage.foldername(name))[1])::uuid, auth.uid())
  );

CREATE POLICY "Org admins upload board pack files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'board-packs'
    AND is_organization_admin(((storage.foldername(name))[1])::uuid, auth.uid())
  );

CREATE POLICY "Org admins delete board pack files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'board-packs'
    AND is_organization_admin(((storage.foldername(name))[1])::uuid, auth.uid())
  );