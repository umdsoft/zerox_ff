<template>
  <div>
    <div style="min-height: 70vh" class="bg-white rounded p-10">
      <div
        @click="$router.go(-1)"
        class="hidden lg:inline-flex items-center"
        style="cursor: pointer"
      >
        <svg
          class="h-5 w-5 text-blue-500"
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
          <polyline points="15 6 9 12 15 18" />
        </svg>
        <p class="text-blue-500">{{ $t("back") }}</p>
      </div>

      <div class="MyPractices">
        <div class="MyPractices__contents">
          <div
            v-if="data != null"
            style="width: 100%"
            class="MyPractices__content"
          >
            <div class="MyPractices__title">
              <span>{{ $t("mobil.mobl") }}</span>
              <a
                v-if="$route.query.status == 1"
                style="background: #48bb78; border-radius: 5px"
                class="
                  bt
                  ml-2
                  text-white
                  bg-t_primary
                  text-center
                  font-bold
                  py-2
                  rounded
                  mr-0
                "
              >
                <div class="flex">
                  <div class="modal2">
                    <div class="modal" v-if="isLoginModal">
                      <div class="flex">
                        <button class="bt2" @click="closeModal">
                          <svg
                            width="44"
                            height="44"
                            viewBox="0 0 44 44"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="44" height="44" rx="22" fill="white" />
                            <path
                              d="M22 20.586L26.95 15.636L28.364 17.05L23.414 22L28.364 26.95L26.95 28.364L22 23.414L17.05 28.364L15.636 26.95L20.586 22L15.636 17.05L17.05 15.636L22 20.586Z"
                              fill="black"
                            />
                          </svg>
                        </button>
                        <div class="kirish">
                          <h2 class="text-black" v-if="modalData.type == 1">Komissiya</h2>
                          <h2 class="text-black" v-if="modalData.type == 2">Mobil hisobga o‘tkazma</h2>
                        </div>
                      </div>
                      <div class="texts">
                        <div
                          class="
                            result
                            flex
                            justify-center
                            items-center
                            flex-col
                            mt-7
                          "
                        >
                          <div class="icon">
                            <svg
                              width="60"
                              height="60"
                              viewBox="0 0 60 60"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M30 2.5C14.8125 2.5 2.5 14.8125 2.5 30C2.5 45.1875 14.8125 57.5 30 57.5C45.1875 57.5 57.5 45.1875 57.5 30C57.5 14.8125 45.1875 2.5 30 2.5ZM41.92 25.35C42.1395 25.0991 42.3066 24.8068 42.4115 24.4904C42.5163 24.174 42.5569 23.8398 42.5307 23.5075C42.5045 23.1751 42.4121 22.8514 42.2589 22.5553C42.1058 22.2592 41.895 21.9968 41.6389 21.7834C41.3828 21.5699 41.0866 21.4099 40.7677 21.3127C40.4489 21.2154 40.1138 21.1829 39.7822 21.2171C39.4506 21.2512 39.1292 21.3514 38.8369 21.5116C38.5445 21.6718 38.2872 21.8889 38.08 22.15L27.33 35.0475L21.7675 29.4825C21.296 29.0271 20.6645 28.7751 20.009 28.7808C19.3535 28.7865 18.7265 29.0494 18.263 29.513C17.7994 29.9765 17.5365 30.6035 17.5308 31.259C17.5251 31.9145 17.7771 32.546 18.2325 33.0175L25.7325 40.5175C25.9781 40.763 26.2722 40.9546 26.596 41.0802C26.9198 41.2057 27.2662 41.2624 27.6132 41.2466C27.9601 41.2309 28.2999 41.143 28.611 40.9886C28.9221 40.8342 29.1976 40.6167 29.42 40.35L41.92 25.35Z"
                                fill="#48BB78"
                              />
                            </svg>
                          </div>
                          <div class="uzs mt-2 mb-5">
                            {{
                              modalData.amount
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                            }}
                            UZS
                          </div>
                        </div>
<!--  -->
                        <div class="sender">
                          <h1 v-if="modalData.type != 1  && modalData.type != 2">
                            {{ $t("debt_list.a04") }}
                          </h1>
                          <h1 v-if="modalData.type != 1">
                            {{ $t("debt_list.a04") }}
                          </h1>
                          <h2 v-if="modalData.type != 1">
                            {{ modalData.cname }}
                          
                          </h2>
                          <h1 class="mt-3 mb-1" v-if="modalData.type != 1 ">
                            {{ $t("debt_list.a35") }}
                          </h1>
                          <h2 v-if="modalData.type != 1">
                            {{ modalData.dname }}
                          </h2>
                          <h1 v-if="modalData.type == 1">Shartnoma raqami</h1>
                          <h2 v-if="modalData.type == 1">
                            {{ modalData.number }}
                          </h2>
                          <h1 class="mt-3 mb-1">{{ $t("debt_list.a36") }}</h1>

                          <h3>
                            {{
                              modalData.amount
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                            }}
                            UZS
                          </h3>
                          <h1 class="mt-3 mb-1">{{ $t("debt_list.a37") }}</h1>
                          <h3>
                            {{ dateFormat(modalData.created_at) }}

                            <h4 class="inline mr-10">{{ modalData.time }}</h4>
                          </h3>
                          <h1 class="mt-3 mb-1">{{ $t("debt_list.a39") }}</h1>
                          <h3>{{ modalData.id }}</h3>
                          <button class="btn1">
                            <svg
                              width="25"
                              height="25"
                              viewBox="0 0 25 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M24.9999 14.2858V12.5001H19.6427V21.4286H21.4284V17.8572H24.107V16.0715H21.4284V14.2858H24.9999ZM15.1784 21.4286H11.607V12.5001H15.1784C15.8886 12.5008 16.5695 12.7833 17.0717 13.2854C17.5739 13.7876 17.8563 14.4685 17.857 15.1787V18.75C17.8563 19.4602 17.5739 20.1411 17.0717 20.6433C16.5695 21.1454 15.8886 21.4279 15.1784 21.4286ZM13.3927 19.6429H15.1784C15.4152 19.6427 15.6421 19.5485 15.8095 19.3811C15.9769 19.2137 16.0711 18.9868 16.0713 18.75V15.1787C16.0711 14.9419 15.9769 14.715 15.8095 14.5476C15.6421 14.3802 15.4152 14.2861 15.1784 14.2858H13.3927V19.6429ZM8.03557 12.5001H3.57129V21.4286H5.357V18.75H8.03557C8.50896 18.7493 8.96275 18.561 9.29748 18.2262C9.63222 17.8915 9.82058 17.4377 9.82129 16.9644V14.2858C9.82082 13.8124 9.63253 13.3584 9.29774 13.0237C8.96296 12.6889 8.50903 12.5006 8.03557 12.5001V12.5001ZM5.357 16.9644V14.2858H8.03557L8.03647 16.9644H5.357Z"
                                fill="white"
                              />
                              <path
                                d="M17.8571 10.7145V7.14307C17.8603 7.02573 17.838 6.9091 17.7917 6.80121C17.7455 6.69332 17.6764 6.59673 17.5893 6.51808L11.3393 0.268157C11.2607 0.180966 11.1641 0.111865 11.0562 0.0656216C10.9483 0.0193781 10.8316 -0.00290695 10.7143 0.000303604H1.78571C1.31255 0.00171674 0.859165 0.190306 0.524585 0.524882C0.190004 0.859458 0.00141315 1.31284 0 1.786V23.2143C0 23.6879 0.188137 24.1421 0.523024 24.477C0.85791 24.8119 1.31211 25 1.78571 25H16.0714V23.2143H1.78571V1.786H8.92857V7.14307C8.92998 7.61624 9.11858 8.06961 9.45316 8.40419C9.78774 8.73877 10.2411 8.92735 10.7143 8.92877H16.0714V10.7145H17.8571ZM10.7143 7.14307V2.14313L15.7143 7.14307H10.7143Z"
                                fill="white"
                              />
                            </svg>

                            <h5>{{ $t("debt_list.a33") }}</h5>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="/jonatuvchi?status=0">
                  <span class="ml-2 pr-2" style="color: #fff">{{
                    $t("debt_list.Kirm")
                  }}</span>
                </a>
              </a>
              <a
                v-if="$route.query.status == 0"
                style="background: #48bb78; border-radius: 5px"
                class="
                  bt
                  ml-2
                  text-white
                  bg-t_primary
                  text-center
                  font-bold
                  py-2
                  rounded
                  mr-0
                "
              >
                <div class="flex">
                  <div class="modal2">
                    <div class="modal" v-if="isLoginModal">
                      <div class="flex">
                        <button class="bt2" @click="closeModal">
                          <svg
                            width="44"
                            height="44"
                            viewBox="0 0 44 44"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="44" height="44" rx="22" fill="white" />
                            <path
                              d="M22 20.586L26.95 15.636L28.364 17.05L23.414 22L28.364 26.95L26.95 28.364L22 23.414L17.05 28.364L15.636 26.95L20.586 22L15.636 17.05L17.05 15.636L22 20.586Z"
                              fill="black"
                            />
                          </svg>
                        </button>
                        <div class="kirish">
                          <h2 class="text-black">{{ $t("debt_list.a05") }}</h2>
                        </div>
                      </div>

                      <div class="texts">
                        <div
                          class="
                            result
                            flex
                            justify-center
                            items-center
                            flex-col
                            mt-7
                          "
                        >
                          <div class="icon">
                            <svg
                              width="60"
                              height="60"
                              viewBox="0 0 60 60"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M30 2.5C14.8125 2.5 2.5 14.8125 2.5 30C2.5 45.1875 14.8125 57.5 30 57.5C45.1875 57.5 57.5 45.1875 57.5 30C57.5 14.8125 45.1875 2.5 30 2.5ZM41.92 25.35C42.1395 25.0991 42.3066 24.8068 42.4115 24.4904C42.5163 24.174 42.5569 23.8398 42.5307 23.5075C42.5045 23.1751 42.4121 22.8514 42.2589 22.5553C42.1058 22.2592 41.895 21.9968 41.6389 21.7834C41.3828 21.5699 41.0866 21.4099 40.7677 21.3127C40.4489 21.2154 40.1138 21.1829 39.7822 21.2171C39.4506 21.2512 39.1292 21.3514 38.8369 21.5116C38.5445 21.6718 38.2872 21.8889 38.08 22.15L27.33 35.0475L21.7675 29.4825C21.296 29.0271 20.6645 28.7751 20.009 28.7808C19.3535 28.7865 18.7265 29.0494 18.263 29.513C17.7994 29.9765 17.5365 30.6035 17.5308 31.259C17.5251 31.9145 17.7771 32.546 18.2325 33.0175L25.7325 40.5175C25.9781 40.763 26.2722 40.9546 26.596 41.0802C26.9198 41.2057 27.2662 41.2624 27.6132 41.2466C27.9601 41.2309 28.2999 41.143 28.611 40.9886C28.9221 40.8342 29.1976 40.6167 29.42 40.35L41.92 25.35Z"
                                fill="#48BB78"
                              />
                            </svg>
                          </div>
                          <div class="uzs mt-2 mb-5">
                            {{
                              modalData.amount
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                            }}
                            UZS
                          </div>
                        </div>

                        <div class="sender">
                          <h1 v-if="modalData.type != 4">
                            {{ $t("debt_list.a04") }}
                          </h1>
                          <h2 v-if="modalData.type != 4">
                            {{ modalData.dname }}
                          </h2>
                          <h1 class="mt-3 mb-1">{{ $t("debt_list.a35") }}</h1>
                          <h2>{{ modalData.cname }}</h2>

                          <h1 class="mt-3 mb-1">{{ $t("debt_list.a36") }}</h1>
                          <h3>
                            {{
                              modalData.amount
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                            }}
                            UZS
                          </h3>
                          <h1 class="mt-3 mb-1">{{ $t("debt_list.a37") }}</h1>
                          <h3>
                            {{ dateFormat(modalData.created_at) }}

                            <h4 class="inline mr-10">{{ modalData.time }}</h4>
                          </h3>
                          <h1 class="mt-3 mb-1">{{ $t("debt_list.a39") }}</h1>
                          <h3>{{ modalData.id }}</h3>
                          <button class="btn1">
                            <svg
                              width="25"
                              height="25"
                              viewBox="0 0 25 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M24.9999 14.2858V12.5001H19.6427V21.4286H21.4284V17.8572H24.107V16.0715H21.4284V14.2858H24.9999ZM15.1784 21.4286H11.607V12.5001H15.1784C15.8886 12.5008 16.5695 12.7833 17.0717 13.2854C17.5739 13.7876 17.8563 14.4685 17.857 15.1787V18.75C17.8563 19.4602 17.5739 20.1411 17.0717 20.6433C16.5695 21.1454 15.8886 21.4279 15.1784 21.4286ZM13.3927 19.6429H15.1784C15.4152 19.6427 15.6421 19.5485 15.8095 19.3811C15.9769 19.2137 16.0711 18.9868 16.0713 18.75V15.1787C16.0711 14.9419 15.9769 14.715 15.8095 14.5476C15.6421 14.3802 15.4152 14.2861 15.1784 14.2858H13.3927V19.6429ZM8.03557 12.5001H3.57129V21.4286H5.357V18.75H8.03557C8.50896 18.7493 8.96275 18.561 9.29748 18.2262C9.63222 17.8915 9.82058 17.4377 9.82129 16.9644V14.2858C9.82082 13.8124 9.63253 13.3584 9.29774 13.0237C8.96296 12.6889 8.50903 12.5006 8.03557 12.5001V12.5001ZM5.357 16.9644V14.2858H8.03557L8.03647 16.9644H5.357Z"
                                fill="white"
                              />
                              <path
                                d="M17.8571 10.7145V7.14307C17.8603 7.02573 17.838 6.9091 17.7917 6.80121C17.7455 6.69332 17.6764 6.59673 17.5893 6.51808L11.3393 0.268157C11.2607 0.180966 11.1641 0.111865 11.0562 0.0656216C10.9483 0.0193781 10.8316 -0.00290695 10.7143 0.000303604H1.78571C1.31255 0.00171674 0.859165 0.190306 0.524585 0.524882C0.190004 0.859458 0.00141315 1.31284 0 1.786V23.2143C0 23.6879 0.188137 24.1421 0.523024 24.477C0.85791 24.8119 1.31211 25 1.78571 25H16.0714V23.2143H1.78571V1.786H8.92857V7.14307C8.92998 7.61624 9.11858 8.06961 9.45316 8.40419C9.78774 8.73877 10.2411 8.92735 10.7143 8.92877H16.0714V10.7145H17.8571ZM10.7143 7.14307V2.14313L15.7143 7.14307H10.7143Z"
                                fill="white"
                              />
                            </svg>

                            <h5>{{ $t("debt_list.a33") }}</h5>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a href="/jonatuvchi?status=1">
                    <span class="ml-2 pr-2" style="color: #fff">{{
                      $t("debt_list.Chiqim")
                    }}</span>
                  </a>
                </div>
              </a>
            </div>
            <table class="MyPractices__table">
              <tr>
                <th></th>
                <th>{{ $t("result.Amaliyot") }}</th>
                <th class="z">{{ $t("result.sana") }}</th>
                <th v-if="$route.query.status == 1">
                  {{ $t("debt_list.Chiqim") }}
                </th>
                <th v-if="$route.query.status == 0">
                  {{ $t("debt_list.Kirm") }}
                </th>
              </tr>

              <tr
                class="MyPractices__table-row"
                v-for="(item, index) in data"
                :key="index"
                @click="openModalAction(item)"
              >
                <td class="MyPractices__Icon">
                  <span v-if="item.type == 1">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="40" height="40" rx="10" fill="#3182CE" />
                      <path
                        d="M30 33H15C14.4697 32.9995 13.9613 32.8037 13.5864 32.4555C13.2114 32.1073 13.0005 31.6353 13 31.1429V25.5714H15V31.1429H30V10.7143H21V8.85715H30C30.5303 8.85764 31.0387 9.05346 31.4136 9.40163C31.7886 9.74981 31.9995 10.2219 32 10.7143V31.1429C31.9995 31.6353 31.7886 32.1073 31.4136 32.4555C31.0387 32.8037 30.5303 32.9995 30 33Z"
                        fill="white"
                      />
                      <path
                        d="M21 14.4286H28V16.2857H21V14.4286ZM20 19.0714H28V20.9286H20V19.0714ZM19 23.7143H28V25.5714H19V23.7143ZM13 22.7857C11.6743 22.7845 10.4033 22.2949 9.46593 21.4245C8.52853 20.5541 8.00132 19.3738 8 18.1429V7.92857H10V18.1429C10 18.8817 10.3161 19.5902 10.8787 20.1127C11.4413 20.6351 12.2044 20.9286 13 20.9286C13.7956 20.9286 14.5587 20.6351 15.1213 20.1127C15.6839 19.5902 16 18.8817 16 18.1429V9.78571C16 9.53944 15.8946 9.30326 15.7071 9.12912C15.5196 8.95497 15.2652 8.85714 15 8.85714C14.7348 8.85714 14.4804 8.95497 14.2929 9.12912C14.1054 9.30326 14 9.53944 14 9.78571V19.0714H12V9.78571C12 9.0469 12.3161 8.33834 12.8787 7.81592C13.4413 7.29349 14.2044 7 15 7C15.7956 7 16.5587 7.29349 17.1213 7.81592C17.6839 8.33834 18 9.0469 18 9.78571V18.1429C17.9987 19.3738 17.4715 20.5541 16.5341 21.4245C15.5967 22.2949 14.3257 22.7845 13 22.7857Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  <span v-if="item.type == 2 || item.type == 3">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="40" height="40" rx="10" fill="#3182CE" />
                      <path
                        d="M32.8811 17.8774C32.9994 17.5809 33.0303 17.2547 32.9699 16.9401C32.9096 16.6254 32.7607 16.3363 32.542 16.1095L24.7296 8L22.5203 10.2934L27.6655 15.6343H8.00018V18.8781H31.4373C31.7463 18.8782 32.0484 18.7831 32.3054 18.605C32.5624 18.4269 32.7627 18.1737 32.8811 17.8774ZM8.11893 23.1226C8.00064 23.4191 7.96972 23.7453 8.03007 24.0599C8.09043 24.3746 8.23935 24.6637 8.45799 24.8905L16.2704 33L18.4797 30.7066L13.3345 25.3657H32.9998V22.1219H9.56266C9.25361 22.1216 8.95143 22.2165 8.69441 22.3947C8.43739 22.5729 8.23711 22.8262 8.11893 23.1226Z"
                        fill="white"
                      /></svg
                  ></span>
                  <span v-if="item.type == 4">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="40" height="40" rx="10" fill="#3182CE" />
                      <path
                        d="M8 15.8667V12.9333C8 12.1554 8.29266 11.4093 8.81359 10.8592C9.33453 10.309 10.0411 10 10.7778 10H13.5556M8 15.8667C9.85139 15.8667 13.5556 14.6933 13.5556 10M8 15.8667V21.7333M33 15.8667V12.9333C33 12.1554 32.7073 11.4093 32.1864 10.8592C31.6655 10.309 30.9589 10 30.2222 10H27.4444M33 15.8667C31.1486 15.8667 27.4444 14.6933 27.4444 10M33 15.8667V18.8M13.5556 10H27.4444M8 21.7333V24.6667C8 25.4446 8.29266 26.1907 8.81359 26.7408C9.33453 27.291 10.0411 27.6 10.7778 27.6H13.5556M8 21.7333C9.85139 21.7333 13.5556 22.9067 13.5556 27.6M13.5556 27.6H19.1111"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M20.4999 21.7333C22.0341 21.7333 23.2777 20.42 23.2777 18.8C23.2777 17.18 22.0341 15.8667 20.4999 15.8667C18.9658 15.8667 17.7222 17.18 17.7222 18.8C17.7222 20.42 18.9658 21.7333 20.4999 21.7333Z"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M28.8332 23.2V27.6M28.8332 32V27.6M28.8332 27.6H24.6665M28.8332 27.6H32.9998"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </td>
                <td style="font-size: 14px">
                  <span v-if="item.type == 1"
                    >{{ item.number }}-sonli qarz shartnomasi
                    rasmiylashtirildi.</span
                  >
                  <span v-if="item.type == 2">
                    {{ item.dname }} Mobil hisobiga o‘tkazma
                  </span>
                  <span v-if="item.type == 3">
                    {{ item.dname }} Mobil hisobidan o‘tkazma
                  </span>
                  <span v-if="item.type == 4"> Hisobni to’ldirish </span>
                </td>
                <td class="MyPractices__date">
                  <div>
                    <img
                      src="../../assets/img/Date.png"
                      alt=""
                      class="MyPractices__date_icon"
                    />
                    <span style="font-size: 14px"
                      >{{ dateFormat(item.created_at) }}
                      {{ item.time.slice(0, 5) }}</span
                    >
                  </div>
                </td>
                <td class="MyPractices__table-output-input">
                  <span
                    v-if="item.all == 1"
                    style="color: rgb(192, 0, 0); font-weight: 600"
                    >-
                    {{
                      item.amount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    }}
                    UZS</span
                  >
                  <span
                    v-if="item.all == 0"
                    style="color: #48bb78; font-weight: 600"
                    >+
                    {{
                      item.amount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    }}
                    UZS</span
                  >
                </td>
              </tr>
            </table>

            <div
              class="over"
              v-if="isModal || isLoginModal"
              @click="closeModal"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
export default {
  middleware: "auth",

  data() {
    return {
      data: null,
      status: this.$route.query.status,
      isLoginModal: false,
      modalData: null,
    };
  },
  computed: {
    isModal() {
      return this.$store.getters.isModal;
    },
  },
  async mounted() {
    let links = [{ title: "Qo'llab quvvatlash", name: "call-center" }];
    this.$store.commit("changeBreadCrumb", links);
    this.getData();
  },

  methods: {
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    async getData() {
      const dd = await this.$axios.$get(`/home/cs?status=${this.status}`);
      this.data = dd.data;
    },
    closeModal() {
      this.isLoginModal = false;
    },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    openModalAction(item) {
      this.modalData = item;
      this.isLoginModal = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.MyPractices {
  &__Icon {
    display: grid;
    justify-content: center;
    align-items: start;
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
    cursor: pointer;
  }
  cursor: pointer;

  &__table-row {
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 10px !important;
  }

  &__table-output-input {
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
  }
}

.MyPractices__cart-All {
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.z {
  padding: 0 50px;
}

.MyPractices__date div {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 10px;
  width: max-content;
  padding: 2px 8px;

  span {
    margin: 0 0 0 10px;
  }
}

.ModalForms__IconAndPirce {
  margin: 27px 0 0 0;
  display: flex;
  align-items: center;
  flex-direction: column;

  span {
    font-weight: 600;
    font-size: 16px;
    color: #48bb78;
    margin: 7px 0 0 0;
  }
}

.ModalForms__Info {
  span {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;
  }
  .ModalForms__name {
    span {
      font-weight: 600;
      font-size: 15px;
      line-height: 18px;
      letter-spacing: 1px;

      color: #3d95ff;
    }
  }
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  text-align: left;
}

td {
  border: 1px solid #ddd;
  padding: 5px;

  &:not(:first-child) {
    border-left: hidden;
  }
  &:not(:last-child) {
    border-right: hidden;
  }
}
.modal {
  position: fixed;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 410px;
  background: #fff;
  border-radius: 10px;
  z-index: 2;

  .bt2 {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.over {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgb(0, 0, 0, 0.5);
  z-index: 1;
}
.uzs {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1px;
  color: #48bb78;
}
.texts {
  h1 {
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    color: #000000;
  }
  h2 {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;
    color: #3d95ff;
    margin-top: 4px;
  }
  h3 {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;

    color: #000000;
  }
  h5 {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;
    color: #ffffff;
  }
  .btn1 {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 20px auto;
    width: 200px;
    height: 40px;
    background: #3d95ff;
    border-radius: 5px;
  }
  .sender {
    flex-direction: column;
    align-items: flex-start;
    display: flex;
  }
}
</style>
