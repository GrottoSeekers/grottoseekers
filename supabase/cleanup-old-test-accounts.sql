-- Remove the old test accounts left over from before the fresh start:
--   /niamh, /niamh-roche, /callum-disley
-- Keeps Callum & Niamh (/callumandniamh) and every account made since.
-- Removes everything belonging to those three profiles: their sits,
-- applications, messages, saved sits, notifications and logins.
-- Safe to run more than once (the second time it does nothing).

DO $$
DECLARE
  ids  uuid[];   -- profiles to remove
  uids uuid[];   -- their logins
  lids uuid[];   -- their sit listings
  cids uuid[];   -- their conversations
BEGIN
  SELECT array_agg(id), array_agg(user_id) INTO ids, uids
  FROM profiles
  WHERE slug IN ('niamh', 'niamh-roche', 'callum-disley');

  IF ids IS NULL THEN
    RAISE NOTICE 'Nothing to remove: those profiles are already gone.';
    RETURN;
  END IF;

  -- Never touch the founders' login, even if it somehow owns one of these.
  uids := ARRAY(SELECT unnest(uids) EXCEPT SELECT user_id FROM profiles WHERE slug = 'callumandniamh');

  SELECT array_agg(id) INTO lids FROM listings WHERE profile_id = ANY(ids);
  SELECT array_agg(id) INTO cids FROM conversations
  WHERE sitter_profile_id = ANY(ids) OR owner_profile_id = ANY(ids);

  DELETE FROM notifications WHERE profile_id = ANY(ids);
  DELETE FROM invites       WHERE sitter_profile_id = ANY(ids) OR owner_profile_id = ANY(ids) OR listing_id = ANY(lids);
  DELETE FROM applications  WHERE profile_id = ANY(ids) OR listing_id = ANY(lids);
  DELETE FROM saved_sits    WHERE profile_id = ANY(ids) OR listing_id = ANY(lids);
  DELETE FROM sits          WHERE sitter_profile_id = ANY(ids) OR sitter_user_id = ANY(uids) OR listing_id = ANY(lids);
  DELETE FROM messages      WHERE sender_profile_id = ANY(ids) OR conversation_id = ANY(cids);
  DELETE FROM conversations WHERE id = ANY(cids);
  DELETE FROM listings      WHERE id = ANY(lids);
  DELETE FROM profiles      WHERE id = ANY(ids);
  DELETE FROM users         WHERE id = ANY(uids) AND id NOT IN (SELECT user_id FROM profiles);

  RAISE NOTICE 'Removed % old test profile(s).', array_length(ids, 1);
END $$;

-- What's left (should be Callum & Niamh plus the accounts you're testing with):
SELECT p.slug, p.name, u.email, u.role
FROM profiles p JOIN users u ON u.id = p.user_id
ORDER BY p.slug;
