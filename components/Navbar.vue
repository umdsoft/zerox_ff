<template>
  <div class="nav">
    <div
      class="media-navas px-6 py-3.5 rounded-xl bg-white"
      style="padding-bottom: 5rem"
    >
      <div class="flex justify-center mb-3.5">
        <nuxt-link to="/"
          ><img src="@/assets/img/logo.png" alt="" />
        </nuxt-link>
      </div>
      <h1 class="text-sm font-mono text-center font-medium mb-3.5">
        {{ $t("logo.description") }}
      </h1>
      <hr />
      <h2 class="text-center font-medium mt-3">Tizimga kirish</h2>
      <nuxt-link :to="{ name: 'auth-login___' + $i18n.locale }">
        <div
          @click="$store.commit('Media_Menu_Close', false)"
          style="background-color: #3182ce; cursor: pointer"
          class="flex mt-6 px-2 py-2 rounded items-center"
        >
          <nuxt-link to="/"
            ><div class="p-2 mr-2">
              <svg
                width="25"
                height="25"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.74534 1.89199C9.17522 1.27646 8.37893 0.9375 7.50003 0.9375C6.61643 0.9375 5.81751 1.27441 5.25003 1.88613C4.6764 2.50459 4.3969 3.34512 4.46253 4.25273C4.59261 6.04336 5.9552 7.5 7.50003 7.5C9.04485 7.5 10.4051 6.04365 10.5372 4.25332C10.6037 3.35391 10.3225 2.51514 9.74534 1.89199Z"
                  fill="white"
                />
                <path
                  d="M12.6564 14.0625H2.34392C2.20894 14.0643 2.07526 14.0359 1.95262 13.9795C1.82997 13.9231 1.72145 13.84 1.63493 13.7364C1.4445 13.5088 1.36775 13.1979 1.42458 12.8836C1.67185 11.5119 2.44353 10.3597 3.65642 9.55078C4.73396 8.83271 6.0989 8.4375 7.50016 8.4375C8.90143 8.4375 10.2664 8.83301 11.3439 9.55078C12.5568 10.3594 13.3285 11.5116 13.5757 12.8833C13.6326 13.1977 13.5558 13.5085 13.3654 13.7361C13.2789 13.8398 13.1704 13.9229 13.0478 13.9794C12.9251 14.0358 12.7914 14.0642 12.6564 14.0625Z"
                  fill="white"
                />
              </svg>
            </div>
          </nuxt-link>
          <div class="">
            <h2 class="text-white font-s font-bold mr-3">{{ $t("login.user") }}</h2>
          </div>
        </div>
      </nuxt-link>
      <nuxt-link :to="{ name: 'auth-legal___' + $i18n.locale }">
        <div
            @click="$store.commit('Media_Menu_Close', false)"
          style="background-color: #3182ce; cursor: pointer"
          class="flex mt-2 px-2 py-2 rounded items-center"
        >
          <nuxt-link to="/"
            ><div class="p-2 mr-3">
              <svg width="25" height="25" viewBox="0 0 106 122" style="fill:white;" xmlns="http://www.w3.org/2000/svg">
                <path d="M53 61C69.7281 61 83.2857 47.3465 83.2857 30.5C83.2857 13.6535 69.7281 0 53 0C36.2719 0 22.7143 13.6535 22.7143 30.5C22.7143 47.3465 36.2719 61 53 61ZM75.667 68.768L64.3571 114.375L56.7857 81.9688L64.3571 68.625H41.6429L49.2143 81.9688L41.6429 114.375L30.333 68.768C13.4629 69.5781 0 83.4699 0 100.65V110.562C0 116.877 5.08705 122 11.3571 122H94.6429C100.913 122 106 116.877 106 110.562V100.65C106 83.4699 92.537 69.5781 75.667 68.768Z"/>
                </svg>
                
            </div>
          </nuxt-link>
          <div class="">
            <h2 class="text-white font-s font-bold mr-2">{{ $t("login.legal") }}</h2>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .nav {
    height: 100%;
    .rounded-xl {
      border-radius: 0 !important;
    }
  }
  .media-navas {
    border-radius: 0 !important;
    height: 100%;
  }
}
</style>
