<template>
  <!-- SS18 (2026-09-21): "Qarz daftariga kiritish" (do'kon tanlash) sahifasi
       BEKOR QILINDI.

       Sabab: do'kon tanlovi endi YAGONA joyda — "Qarz daftari" bosh sahifasidagi
       "Barcha do'konlar" kartasida (localStorage `zx_qd_dokon`). Ikkinchi tanlash
       oqimi foydalanuvchini chalkashtirardi, ustiga "Orqaga" tugmasi ba'zi
       sahifalardan aynan shu yerga olib kelardi.

       Fayl O'CHIRILMADI, chunki brauzer tarixida va eski xatcho'plarda bu manzil
       qolgan bo'lishi mumkin — u holda 404 o'rniga jimgina bosh sahifaga
       qaytaramiz. `replace` ishlatiladi: bu yozuv tarixda QOLMAYDI, shuning
       uchun foydalanuvchi "Orqaga" bosganda bu yerga qaytib tushmaydi. -->
  <div class="py-16 text-center text-gray-400 text-sm">{{ texts.redirecting }}</div>
</template>

<script>
export default {
  name: 'QarzDaftariKiritishRedirect',

  computed: {
    texts() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz';
      return {
        uz: { redirecting: "Yo'naltirilmoqda…" },
        ru: { redirecting: 'Перенаправление…' },
        kr: { redirecting: "Йўналтирилмоқда…" },
      }[l] || { redirecting: "Yo'naltirilmoqda…" };
    },
  },

  mounted() {
    this.$router.replace(this.localePath({ name: 'qarz-daftari' }));
  },
};
</script>
