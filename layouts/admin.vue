<template>
    <div>
        <AdminMenu />
        <div class="content-admin">
         
            <Nuxt />
        </div>
    </div>
</template>

<script>
export default {
  // SS-DEV (2026-09-26): <html lang> joriy UI tiliga mos (uz/ru/kr/kaa/en) — ilgari nuxt.config'da qat'iy "uz" edi.
  head() {
    return { htmlAttrs: { lang: (this.$i18n && this.$i18n.locale) || 'uz' } };
  },};
</script>

<style></style>
