/**
 * wave C: publicPages — raw `$axios` chaqiruvlari shu yerga ko'chirildi (URL, metod, config sahifadagidek; `$get` -> data, `get` -> to'liq response).
 */

/**
 * GET `${url}&search=${query}` (to'liq response). ISTISNO: bazaviy `url` chaqiruvchidan keladi (SearchComponent `url` prop —
 * sahifaga qarab /contract/... yoki /user/...), shu sabab URL literali bu yerda emas — dinamik passthrough.
 */
export const getSearchByUrl = (axios, url, searchQuery, config) => axios.get(`${url}&search=${encodeURIComponent(searchQuery)}`, config);
/** GET /news/:param (to'liq response) */
export const getNewsById = (axios, id, config) => axios.get(`/news/${id}`, config);
/** GET /pay/:param */
export const getPayByCode = (axios, code, config) => axios.$get(`/pay/${code}`, config);
