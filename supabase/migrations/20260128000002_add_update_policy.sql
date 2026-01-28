-- Allow users to update their own community reports
create policy "Users can update their own community reports."
  on community_reports for update
  using ( auth.uid() = user_id );
