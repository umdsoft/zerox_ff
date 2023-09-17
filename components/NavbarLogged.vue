<template>
  <div class="nav media-nava max-h-[600px] px-6 w-[400px] rounded-xl bg-white">
    <div>
      <div class="px-2 pt-3.5 rounded-xl bg-white" style="width: 300px">
        <div class="flex justify-between">
          <nuxt-link
            to="/"
            @click="$store.commit('Media_Menu_Close', false)"
            class="
              flex
              justify-center
              mx-auto
              cursor-pointer
              items-center
              flex-col
              mb-3.5
            "
          >
          <img src="@/assets/img/logo.svg" alt="" width="250" height="250"/>
          </nuxt-link>

          <h2
            @click="$store.commit('Media_Menu_Close', false)"
            class="mt-4 cursor-pointer lg:hidden"
          >
            <svg
              class="h-6 w-6 text-black"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </h2>
        </div>

        <hr />
        <nuxt-link :to="{ name: 'index___' + $i18n.locale }">
          <div
            @click="$store.commit('Media_Menu_Close', false)"
            class="nav-wrapper flex mt-6 items-center px-2 py-3"
          >
            <div class="icon rounded-lg flex align-middle p-2 mr-5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_254_25374)">
                  <path
                    d="M8.16289 3.46736C8.11927 3.42563 8.06124 3.40234 8.00088 3.40234C7.94052 3.40234 7.88248 3.42563 7.83887 3.46736L2.44531 8.61979C2.42241 8.64171 2.40418 8.66804 2.39175 8.69719C2.37931 8.72635 2.37291 8.75773 2.37295 8.78942L2.37207 13.6252C2.37207 13.8738 2.47084 14.1123 2.64666 14.2881C2.82247 14.4639 3.06093 14.5627 3.30957 14.5627H6.125C6.24932 14.5627 6.36855 14.5133 6.45645 14.4254C6.54436 14.3375 6.59375 14.2182 6.59375 14.0939V10.1095C6.59375 10.0474 6.61844 9.98777 6.6624 9.94381C6.70635 9.89986 6.76596 9.87517 6.82812 9.87517H9.17187C9.23403 9.87517 9.29365 9.89986 9.3376 9.94381C9.38156 9.98777 9.40625 10.0474 9.40625 10.1095V14.0939C9.40625 14.2182 9.45563 14.3375 9.54354 14.4254C9.63145 14.5133 9.75068 14.5627 9.875 14.5627H12.6893C12.9379 14.5627 13.1764 14.4639 13.3522 14.2881C13.528 14.1123 13.6268 13.8738 13.6268 13.6252V8.78942C13.6268 8.75773 13.6204 8.72635 13.608 8.69719C13.5955 8.66804 13.5773 8.64171 13.5544 8.61979L8.16289 3.46736Z"
                    fill="#3182CE"
                  />
                  <path
                    d="M14.8821 7.65283L12.6907 5.55635V2.375C12.6907 2.25068 12.6413 2.13145 12.5534 2.04354C12.4655 1.95564 12.3463 1.90625 12.222 1.90625H10.8157C10.6914 1.90625 10.5722 1.95564 10.4843 2.04354C10.3964 2.13145 10.347 2.25068 10.347 2.375V3.3125L8.65011 1.69004C8.49132 1.52949 8.25518 1.4375 8.00001 1.4375C7.74571 1.4375 7.51016 1.52949 7.35138 1.69033L1.11993 7.65225C0.937706 7.82803 0.914855 8.11719 1.08068 8.30762C1.12232 8.35568 1.1733 8.39477 1.23053 8.42251C1.28776 8.45025 1.35003 8.46605 1.41356 8.46896C1.47709 8.47186 1.54054 8.46181 1.60006 8.43941C1.65958 8.41701 1.71392 8.38274 1.75978 8.33867L7.83888 2.52969C7.88249 2.48796 7.94053 2.46468 8.00089 2.46468C8.06125 2.46468 8.11928 2.48796 8.1629 2.52969L14.2426 8.33867C14.3321 8.42455 14.4521 8.47142 14.5762 8.46901C14.7002 8.46659 14.8183 8.41509 14.9044 8.32578C15.0843 8.13945 15.0693 7.83183 14.8821 7.65283Z"
                    fill="#3182CE"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_254_25374">
                    <rect
                      width="15"
                      height="15"
                      fill="white"
                      transform="translate(0.5 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div class="ml-2">
              <h2 class="text-gray-700 font-xs">{{ $t("menu.home") }}</h2>
            </div>
          </div>
        </nuxt-link>
        <nuxt-link :to="{ name: 'qr-code___' + $i18n.locale }">
          <div
            @click="$store.commit('Media_Menu_Close', false)"
            class="nav-wrapper flex px-2 py-3 items-center rounded-lg"
          >
            <div class="icon rounded-lg flex px-2 py-2 align-middle mr-7">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.40625 1.40625H5.15625V0.46875H0.46875V5.15625H1.40625V1.40625Z"
                  fill="#3182CE"
                />
                <path
                  d="M5.15625 5.15625V2.34375H2.34375V5.15625H5.15625ZM3.28125 3.28125H4.21875V4.21875H3.28125V3.28125Z"
                  fill="#3182CE"
                />
                <path
                  d="M9.60938 1.40625H13.5938V5.15625H14.5312V0.46875H9.60938V1.40625Z"
                  fill="#3182CE"
                />
                <path
                  d="M12.6562 5.15625V2.34375H9.84375V5.15625H12.6562ZM10.7812 3.28125H11.7188V4.21875H10.7812V3.28125Z"
                  fill="#3182CE"
                />
                <path
                  d="M5.15625 13.5938H1.40625V9.84375H0.46875V14.5312H5.15625V13.5938Z"
                  fill="#3182CE"
                />
                <path
                  d="M5.15625 9.84375H2.34375V12.6562H5.15625V9.84375ZM4.21875 11.7188H3.28125V10.7812H4.21875V11.7188Z"
                  fill="#3182CE"
                />
                <path
                  d="M13.5938 13.5938H9.60938V14.5312H14.5312V9.84375H13.5938V13.5938Z"
                  fill="#3182CE"
                />
                <path
                  d="M7.96875 8.90625H11.7188V10.7812H12.6562V7.96875H7.96875V8.90625Z"
                  fill="#3182CE"
                />
                <path
                  d="M12.6562 12.6562V11.7188H7.03125V7.96875H2.34375V8.90625H6.09375V12.6562H12.6562Z"
                  fill="#3182CE"
                />
                <path
                  d="M7.03125 2.34375H6.09375V5.15625H7.03125V2.34375Z"
                  fill="#3182CE"
                />
                <path
                  d="M2.34375 7.03125H8.90625V2.34375H7.96875V6.09375H2.34375V7.03125Z"
                  fill="#3182CE"
                />
                <path
                  d="M12.6562 6.09375H9.84375V7.03125H12.6562V6.09375Z"
                  fill="#3182CE"
                />
                <path
                  d="M10.7812 9.84375H9.84375V10.7812H10.7812V9.84375Z"
                  fill="#3182CE"
                />
                <path
                  d="M8.90625 9.84375H7.96875V10.7812H8.90625V9.84375Z"
                  fill="#3182CE"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-gray-700 font-xs">{{ $t("menu.qr") }}</h2>
            </div>
          </div>
        </nuxt-link>
        <nuxt-link :to="{ name: 'instruction___' + $i18n.locale }">
          <div
            @click="$store.commit('Media_Menu_Close', false)"
            class="nav-wrapper px-2 flex py-3 items-center"
          >
            <div class="icon rounded-lg flex px-2 py-2 align-middle mr-7">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.9999 0H2.99992C1.34981 0 0 1.34981 0 2.99992V11.9999C0 13.65 1.34981 15 2.99992 15H11.9998C13.65 15 14.9999 13.65 14.9999 11.9999V2.99992C15 1.34981 13.6502 0 11.9999 0ZM3.03146 11.5678H1.875V3.43217H3.03146V4.75497L3.68267 4.10489H4.61946L4.65242 4.13714L3.03146 5.75824V11.5678ZM3.36909 6.55331L5.81906 4.10418H6.75515L6.78881 4.13643L4.37179 6.55331H3.36909ZM5.50421 6.55331L7.95418 4.10418H8.89168L8.92393 4.13643L6.50677 6.55331H5.50421ZM7.63918 6.55331L10.0899 4.10418H11.0267L11.0595 4.13643L8.6426 6.55331H7.63918ZM13.125 11.5678H11.9684V5.36389L10.7783 6.55331H9.77557L11.9684 4.36048V3.43217H13.125V11.5678Z"
                  fill="#3182CE"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-gray-700 font-xs">{{ $t("menu.foy") }}</h1>
            </div>
          </div>
        </nuxt-link>
        <a href="https://t.me/zeroxuz_bot" target="_blank">
          <div
            @click="$store.commit('Media_Menu_Close', false)"
            class="nav-wrapper flex px-2 py-3 items-center rounded-lg"
          >
            <div class="icon rounded-lg flex px-2 py-2 align-middle mr-7">
             
<svg width="15" height="13" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.3125 0.144655L1.16735 9.1051C-0.343973 9.74205 -0.33523 10.6267 0.890063 11.0212L6.57562 12.8822L19.7303 4.17338C20.3524 3.77628 20.9207 3.9899 20.4535 4.42501L9.7956 14.5178H9.7931L9.7956 14.5191L9.40341 20.6684C9.97796 20.6684 10.2315 20.3918 10.5538 20.0655L13.3154 17.2477L19.0596 21.6998C20.1188 22.3118 20.8794 21.9973 21.143 20.671L24.9138 2.02403C25.2997 0.400219 24.323 -0.335018 23.3125 0.144655Z" fill="#3182CE"/>
</svg>

            </div>
            <div>
              <h2 class="text-gray-700 font-xs">{{$t('home.chatt')}}</h2>
            </div>
          </div>
        </a>
       
        <nuxt-link :to="{ name: 'price___' + $i18n.locale }">
          <div
            @click="$store.commit('Media_Menu_Close', false)"
            class="nav-wrapper px-2 flex py-3 items-center"
          >
            <div class="icon rounded-lg flex px-2 py-2 align-middle mr-7">
           
<svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_107_2)">
<path d="M9.05001 0.435C8.47001 -0.145 7.53001 -0.145 6.95001 0.435L0.436007 6.95C-0.143993 7.53 -0.143993 8.469 0.436007 9.048L6.95201 15.564C7.53201 16.144 8.47101 16.144 9.05001 15.564L15.566 9.048C16.146 8.468 16.146 7.529 15.566 6.95L9.05001 0.435ZM5.49501 6.033C5.46277 6.03344 5.43079 6.02729 5.40101 6.01494C5.37123 6.0026 5.34429 5.9843 5.32182 5.96118C5.29935 5.93806 5.28184 5.9106 5.27035 5.88048C5.25887 5.85036 5.25364 5.81821 5.25501 5.786C5.35001 4.091 6.73701 3.5 8.00501 3.5C9.40101 3.5 10.677 4.23 10.677 5.74C10.677 6.82 10.042 7.334 9.43301 7.797C8.69601 8.356 8.42301 8.565 8.42301 9.283V9.388C8.42301 9.4543 8.39667 9.51789 8.34978 9.56478C8.3029 9.61166 8.23931 9.638 8.17301 9.638H7.36301C7.29739 9.63801 7.2344 9.61222 7.18763 9.5662C7.14086 9.52017 7.11406 9.45761 7.11301 9.392L7.10901 9.175C7.07101 8.248 7.60401 7.677 8.27701 7.188C8.86701 6.744 9.24201 6.452 9.24201 5.817C9.24201 4.992 8.61401 4.649 7.92801 4.649C7.12501 4.649 6.67501 5.127 6.58601 5.783C6.56801 5.92 6.45801 6.033 6.32001 6.033H5.49501V6.033ZM7.82001 12.476C7.23601 12.476 6.81101 12.082 6.81101 11.549C6.81101 10.997 7.23601 10.609 7.82101 10.609C8.43001 10.609 8.84901 10.997 8.84901 11.549C8.84901 12.082 8.42901 12.476 7.82001 12.476Z" fill="#3182CE"/>
</g>
<defs>
<clipPath id="clip0_107_2">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>

            </div>
            <div>
              <h1 class="text-gray-700 font-xs">
                Tariflar
              </h1>
            </div>
          </div>
        </nuxt-link>
        <nuxt-link :to="{ name: 'active-device___' + $i18n.locale }">
          <div
            @click="$store.commit('Media_Menu_Close', false)"
            class="nav-wrapper px-2 flex py-3 items-center"
          >
            <div class="icon rounded-lg flex px-2 py-2 align-middle mr-7">
              <svg
                width="15"
                height="14"
                viewBox="0 0 15 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 13.5H1.5C0.671573 13.5 0 12.8284 0 12V4.5C0 3.67157 0.671573 3 1.5 3H2.25V1.5C2.25 0.671573 2.92157 0 3.75 0H13.5C14.3284 0 15 0.671573 15 1.5V9.75C15 10.5784 14.3284 11.25 13.5 11.25H7.5V12C7.5 12.8284 6.82843 13.5 6 13.5ZM1.5 4.5V12H6V4.5H1.5ZM3.75 3H6C6.82843 3 7.5 3.67157 7.5 4.5V9.75H13.5V1.5H3.75V3Z"
                  fill="#3182CE"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-gray-700 font-xs">{{ $t("menu.active") }}</h1>
            </div>
          </div>
        </nuxt-link>
        <!-- <nuxt-link :to="{ name: 'about___' + $i18n.locale }">
          <div
            @click="$store.commit('Media_Menu_Close', false)"
            class="nav-wrapper px-2 flex py-3 items-center"
          >
            <div class="icon rounded-lg flex px-2 py-2 align-middle mr-7">
              <svg
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.9375 0.8125V1.28125V9.71875V10.1875H1.40625H3.28125V11.5938V12.5752L4.04297 11.96L6.25488 10.1875H13.5938H14.0625V9.71875V1.28125V0.8125H13.5938H1.40625H0.9375ZM1.875 1.75H13.125V9.25H6.09375H5.93262L5.80078 9.35254L4.21875 10.6123V9.71875V9.25H3.75H1.875V1.75ZM7.03125 2.6875V3.625H7.96875V2.6875H7.03125ZM7.03125 4.5625V8.3125H7.96875V4.5625H7.03125Z"
                  fill="#3182CE"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-gray-700 font-xs">{{ $t("menu.about") }}</h1>
            </div>
          </div>
        </nuxt-link> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .nav {
    border-top-right-radius: 50px;
  }
}
.flex:active {
  background: #ffffff;
  box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.nuxt-link-active {
  color: blue;
}
</style>
