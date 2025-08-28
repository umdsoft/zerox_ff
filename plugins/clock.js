// plugins/clock.js
export default ({ $axios }, inject) => {
  /**
   * Server va klient sanasini solishtirish (soatni hisobga olmaydi)
   * @param {string} endpoint - server vaqti API manzili
   * @returns {Promise<boolean>} true = sana tafovuti bor, false = bir xil, null = xatolik
   */
  const checkDateMismatch = async (endpoint = "https://app.zerox.uz/api/v1/dashboard/get-time") => {
    try {
      // 1) Serverdan vaqt olish
      const resp = await $axios.$get(endpoint); 
      // Masalan: { success:true, data:"18/08/2025, 08:06:19" }

      if (!resp?.data) return null;

      // 2) Server sanasini ajratish
      const datePart = resp.data.split(",")[0].trim(); // "18/08/2025"
      const [dd, mm, yyyy] = datePart.split("/").map(v => parseInt(v, 10));
      const serverDate = new Date(yyyy, mm - 1, dd);

      // 3) Klient sanasi (sana, vaqtini 00:00 qilib normalize qilamiz)
      const clientNow = new Date();
      const clientDate = new Date(
        clientNow.getFullYear(),
        clientNow.getMonth(),
        clientNow.getDate()
      );

      // 4) Sana tengligini solishtirish
      return serverDate.getTime() !== clientDate.getTime();
    } catch (e) {
      console.error("⏰ checkDateMismatch error:", e);
      return null;
    }
  };

  inject("checkDateMismatch", checkDateMismatch);
};
