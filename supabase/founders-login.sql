-- Callum & Niamh's login.
-- Passwords are stored scrambled (bcrypt), so nobody can read one back,
-- not even from the database. Step 1 shows the email; step 2 sets a new password.

-- STEP 1: the email address for the joint account
SELECT u.email, u.role, p.slug, p.name
FROM profiles p JOIN users u ON u.id = p.user_id
WHERE p.slug = 'callumandniamh';

-- STEP 2 (only if you need a new password):
-- replace  CHOOSE-A-PASSWORD  below with your new password, then run just this part.
UPDATE users
SET password = extensions.crypt('CHOOSE-A-PASSWORD', extensions.gen_salt('bf', 12))
WHERE id = (SELECT user_id FROM profiles WHERE slug = 'callumandniamh');
