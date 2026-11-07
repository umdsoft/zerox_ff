/** 07.11: elektron imzo (bir martalik kod) — spetsifikatsiya §2. */

/** POST /sign/challenge — `{ purpose, contract?, act?, notification?, payload? }` → `{ challenge_id, channel, destination_masked, expires_in, doc_hash }` */
export const postSignChallenge = (axios, data, config) => axios.$post('/sign/challenge', data, config);

/** GET /sign/events?contract=:id — imzolash varag'i (faqat shartnoma tomonlari) */
export const getSignEvents = (axios, contractId, config) =>
  axios.$get(`/sign/events?contract=${encodeURIComponent(contractId)}`, config);
