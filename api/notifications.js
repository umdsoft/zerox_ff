/** Bildirishnomalar. */
/** GET /notification/me (sahifalarda `{ falseLoading: true }`, Header'da `+ silent: true`) */
export const getMyNotifications = (axios, config) => axios.$get('/notification/me', config);

/** POST /notification/qisman-qaytarish/:param (to'liq response) */
export const postQismanQaytarishById = (axios, id, data, config) => axios.post(`/notification/qisman-qaytarish/${id}`, data, config);
/** POST /notification/time/:param (to'liq response) */
export const postTimeById = (axios, id, data, config) => axios.post(`/notification/time/${id}`, data, config);
/** PUT /notification/success/:param (to'liq response) */
export const putSuccessById = (axios, id, data, config) => axios.put(`/notification/success/${id}`, data, config);
/** PUT /notification/ok/:param */
export const putOkById = (axios, id, data, config) => axios.$put(`/notification/ok/${id}`, data, config);
/** POST /notification/eby/:param */
export const postEbyById = (axios, id, data, config) => axios.$post(`/notification/eby/${id}`, data, config);
/** POST /notification/toliq-qaytarish/:param (to'liq response) */
export const postToliqQaytarishById = (axios, id, data, config) => axios.post(`/notification/toliq-qaytarish/${id}`, data, config);
/** POST notification/reqquest (to'liq response) */
export const postReqquest = (axios, data, config) => axios.post("notification/reqquest", data, config);
/** GET notification/by/:param (to'liq response) */
export const getByById = (axios, id, config) => axios.get(`notification/by/${id}`, config);
