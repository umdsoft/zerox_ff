/**
 * Qarz daftari — amaliyot (tranzaksiya) tafsilotini sahifalar orasida uzatish.
 *
 * NEGA KERAK:
 * "Amaliyotlar tarixi" ro'yxatidagi qator ALLAQACHON tafsilot uchun kerak
 * bo'lgan ma'lumotning deyarli hammasini saqlaydi (summa, valyuta, turi, sana,
 * ota-qarz, bajaruvchi, mahsulot). Ilgari qatorga bosilganda modal ochilib,
 * qayta so'rov yuborilardi va foydalanuvchi bo'sh spinner ko'rardi.
 *
 * Endi ro'yxat shu tayyor ma'lumotni shu yerga qo'yadi va tafsilot sahifasi
 * DARHOL chizadi — qo'shimcha so'rov (bo'lib to'lash jadvali) fon rejimida
 * yuklanadi.
 *
 * ⚠️ Modul-darajasidagi `let cache` ishlatilmadi: SSR'da u so'rovlar orasida
 * oqib ketadi. Vuex store Nuxt'da har bir so'rov uchun alohida yaratiladi.
 */
export const namespaced = true;

export const state = () => ({
  /** { tranzaksiya, qarz, mijozId, turi, bolibTolash, bajaruvchi, mahsulot } */
  payload: null,
});

export const mutations = {
  SET_PAYLOAD(state, payload) {
    state.payload = payload || null;
  },
  CLEAR_PAYLOAD(state) {
    state.payload = null;
  },
};
