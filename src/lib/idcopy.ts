// Owner wording for /verification (the design's copy is written for sitters).
export const OWNER_HINT = 'Sitters can see you are verified before they apply or share their details.';
export function ownerUnlocks(verified: boolean) {
  return [
    { title: 'Post sits and confirm sitters', body: 'Posting a sit, messaging sitters and confirming one all open once your ID is approved.' },
    { title: 'The badge shows on your page', body: 'Sitters see a verified tick on your profile and on every sit you post.' },
    { title: 'Sitters apply with confidence', body: 'Every member is checked, so both sides know who they are dealing with.' },
  ].map((u, i) => ({ ...u, on: verified, i }));
}
