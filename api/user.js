/** Foydalanuvchi. */
/** GET /user/me (sahifalarda config: `{ silent: true }` yoki `{ background: true }`) */
export const getMe = (axios, config) => axios.$get('/user/me', config);

/** PUT /user/edit_contract (to'liq response) */
export const putEditContract = (axios, data, config) => axios.put('/user/edit_contract', data, config);
/** GET /user/sessions */
export const getSessions = (axios, config) => axios.$get('/user/sessions', config);
/** POST /user/sessions/revoke */
export const postSessionsRevoke = (axios, data, config) => axios.$post('/user/sessions/revoke', data, config);
/** POST /user/sessions/revoke-others */
export const postSessionsRevokeOthers = (axios, data, config) => axios.$post('/user/sessions/revoke-others', data, config);
/** POST /user/archive (to'liq response) */
export const postArchive = (axios, data, config) => axios.post("/user/archive", data, config);
/** POST /user/phoneChangeReg (to'liq response) */
export const postPhoneChangeReg = (axios, data, config) => axios.post("/user/phoneChangeReg", data, config);
/** POST /user/register (to'liq response) */
export const postRegister = (axios, data, config) => axios.post("/user/register", data, config);
/** POST /telegram/auth/pin/forgot (to'liq response) */
export const postAuthPinForgot = (axios, data, config) => axios.post('/telegram/auth/pin/forgot', data, config);
/** POST /telegram/auth/pin/reset (to'liq response) */
export const postAuthPinReset = (axios, data, config) => axios.post('/telegram/auth/pin/reset', data, config);
/** POST /telegram/auth/pin (to'liq response) */
export const postAuthPin = (axios, data, config) => axios.post('/telegram/auth/pin', data, config);
/** GET /user/candidate-search/:param */
export const getCandidateSearchById = (axios, id, config) => axios.$get(`/user/candidate-search/${id}`, config);
/** POST /user/transfer (to'liq response) */
export const postTransfer = (axios, data, config) => axios.post("/user/transfer", data, config);
/** GET /user/candidate/:param */
export const getCandidateById = (axios, id, config) => axios.$get(`/user/candidate/${id}`, config);
/** POST /user/edit-password (to'liq response) */
export const postEditPassword = (axios, data, config) => axios.post("/user/edit-password", data, config);
/** POST /user/rephone (to'liq response) */
export const postRephone = (axios, data, config) => axios.post("/user/rephone", data, config);
/** POST /user/phoneChange (to'liq response) */
export const postPhoneChange = (axios, data, config) => axios.post("/user/phoneChange", data, config);
/** POST user/search (to'liq response) */
export const postSearch = (axios, data, config) => axios.post("user/search", data, config);
/** GET /user/get-all-rating */
export const getAllRating = (axios, config) => axios.$get('/user/get-all-rating', config);
