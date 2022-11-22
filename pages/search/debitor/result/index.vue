<template>
  <div style="background: #eaf2fb" class="py-6 rounded">
    <div class="px-4">
      <div class="search">
       
        <div class="search__content items-center flex flex-wrap">
          <div class="user__avatar mx-auto lg:mx-12">
            <svg
              width="120"
              height="120"
              viewBox="0 0 26 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="13" cy="12.5" rx="13" ry="12.5" fill="white" />
              <path
                d="M15.2107 6.94546C14.6493 6.33576 13.8653 6 12.9999 6C12.13 6 11.3434 6.33373 10.7846 6.93965C10.2198 7.55226 9.94464 8.38483 10.0093 9.28386C10.1373 11.0575 11.4789 12.5004 12.9999 12.5004C14.521 12.5004 15.8603 11.0578 15.9903 9.28444C16.0558 8.39354 15.7789 7.56271 15.2107 6.94546Z"
                fill="#3182CE"
              />
              <path
                d="M18.0768 19.0002H7.92322C7.79032 19.0019 7.6587 18.9738 7.53795 18.9179C7.41719 18.8621 7.31034 18.7798 7.22516 18.6772C7.03766 18.4517 6.96209 18.1438 7.01805 17.8324C7.2615 16.4737 8.02129 15.3324 9.21549 14.5311C10.2764 13.8199 11.6203 13.4284 13 13.4284C14.3797 13.4284 15.7236 13.8202 16.7845 14.5311C17.9787 15.3321 18.7385 16.4734 18.982 17.8321C19.0379 18.1435 18.9623 18.4514 18.7748 18.6769C18.6897 18.7796 18.5828 18.8619 18.4621 18.9178C18.3413 18.9737 18.2097 19.0019 18.0768 19.0002Z"
                fill="#3182CE"
              />
            </svg>
          </div>
          <div class="user__info mt-5">
            <div class="user__info__left">
              <h1><b>{{ user.type == 1 ? "Korxona nomi" : "FISH" }} :</b> </h1>
              <h1 class="text-black">
                {{
                  user.type === 1
                    ? user.company
                    : `${user.last_name} ${user.first_name} ${user.middle_name}`
                }}
              </h1>
              <h1><b>Tizimda ro‘yxatdan o‘tgan vaqti :</b></h1>
              <p class="text-black">{{ dateFormat(user.created_at) }}</p>
              <h1><b>ID raqami :</b></h1>
              <p class="text-black">{{ user.uid }}</p>
              <h1><b>Status:</b> </h1>
              <h1 class="text-black">
                {{ user.rating }}
                <span v-if="user.rating_type == 1">
                  <svg
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 5L0 9.5L7 4.5L14 9.5V5L7 0L0 5Z"
                      fill="#049D26"
                    />
                  </svg>
                </span>
                <span v-if="user.rating_type == 2">
                  <svg
                    width="14"
                    height="17"
                    viewBox="0 0 14 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 5L0 9.5L7 4.5L14 9.5V5L7 0L0 5Z"
                      fill="#049D26"
                    />
                    <path
                      d="M0 12L0 16.5L7 11.5L14 16.5V12L7 7L0 12Z"
                      fill="#049D26"
                    />
                  </svg>
                </span>
                <span v-if="user.rating_type == 3">
                  <svg
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 4.5V0L7 5L0 0V4.5L7 9.5L14 4.5Z"
                      fill="#FF0000"
                    />
                  </svg>
                </span>
                <span v-if="user.rating_type == 4">
                  <svg
                    width="14"
                    height="17"
                    viewBox="0 0 14 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 11.5V7L7 12L0 7V11.5L7 16.5L14 11.5Z"
                      fill="#FF0000"
                    />
                    <path
                      d="M14 4.5V0L7 5L0 0V4.5L7 9.5L14 4.5Z"
                      fill="#FF0000"
                    />
                  </svg>
                </span>
              </h1>
            </div>
          
          </div>
        </div>
      </div>

      <div>
        <div
          class="
            grid
            gap-5
            grid-cols-1
            lg:grid-cols-2
            md:grid-cols-2
            gap-x-8
            mt-10
            items-stretch
            self-stretch
          "
        >
          <div
            class="
              debtor-sum
              flex
              justify-between
              rounded-xl
              bg-white
              p-5
              h-full
            "
          >
            <div class="">
              <h1 class="text-xl font-normal text-t_bl mb-1">
                Berilgan qarz (debitor)
              </h1>
              <h2
                v-if="debitorUzs != null"
                class="text-xl font-semibold text-t_gr"
              >
                {{
                  debitorUzs.residual_amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                <span>so’m</span>
              </h2>
              <h2 v-else class="text-xl font-semibold text-t_gr">
                0
                <span>so’m</span>
              </h2>
              <h2
                v-if="debitorUsd != null"
                class="text-xl font-semibold text-t_gr mb-1"
              >
                {{
                  debitorUsd.residual_amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                <span>$</span>
              </h2>
            </div>
            <div class="iconn">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                  fill="#3182CE"
                />
                <rect width="48" height="48" rx="8" fill="#3182CE" />
                <path
                  d="M17.1964 17.5695H31.2589C31.4232 17.5694 31.5873 17.5799 31.7502 17.6007C31.695 17.213 31.5618 16.8405 31.3588 16.5057C31.1557 16.1708 30.8869 15.8806 30.5686 15.6524C30.2503 15.4243 29.8891 15.263 29.5068 15.1782C29.1245 15.0934 28.7289 15.0869 28.344 15.1591L16.779 17.1336H16.7658C16.0398 17.2724 15.3943 17.6831 14.9609 18.2819C15.6138 17.8175 16.3953 17.5685 17.1964 17.5695V17.5695Z"
                  fill="white"
                />
                <path
                  d="M31.2593 18.625H17.1968C16.4511 18.6258 15.7362 18.9224 15.2089 19.4497C14.6817 19.9769 14.3851 20.6918 14.3843 21.4375V29.875C14.3851 30.6207 14.6817 31.3356 15.2089 31.8628C15.7362 32.3901 16.4511 32.6867 17.1968 32.6875H31.2593C32.0049 32.6867 32.7198 32.3901 33.2471 31.8628C33.7744 31.3356 34.071 30.6207 34.0718 29.875V21.4375C34.071 20.6918 33.7744 19.9769 33.2471 19.4497C32.7198 18.9224 32.0049 18.6258 31.2593 18.625V18.625ZM29.1719 27.0625C28.8937 27.0625 28.6219 26.98 28.3906 26.8255C28.1593 26.671 27.9791 26.4514 27.8727 26.1944C27.7662 25.9374 27.7384 25.6547 27.7926 25.3819C27.8469 25.1091 27.9808 24.8585 28.1775 24.6619C28.3742 24.4652 28.6247 24.3313 28.8975 24.277C29.1703 24.2228 29.4531 24.2506 29.71 24.357C29.967 24.4635 30.1866 24.6437 30.3411 24.875C30.4956 25.1062 30.5781 25.3781 30.5781 25.6562C30.5781 26.0292 30.43 26.3869 30.1662 26.6506C29.9025 26.9143 29.5448 27.0625 29.1719 27.0625Z"
                  fill="white"
                />
                <path
                  d="M14.4062 24.4023V20.0298C14.4062 19.0775 14.9336 17.481 16.7639 17.1351C18.3174 16.8437 19.8555 16.8438 19.8555 16.8438C19.8555 16.8438 20.8662 17.5469 20.0312 17.5469C19.1963 17.5469 19.2183 18.6235 20.0312 18.6235C20.8442 18.6235 20.0312 19.6562 20.0312 19.6562L16.7573 23.3696L14.4062 24.4023Z"
                  fill="white"
                />
                <path
                  d="M15.9238 23.5859V22.0566H18.3262V19.6543H19.8672V22.0566H22.2695V23.5859H19.8672V26H18.3262V23.5859H15.9238Z"
                  fill="#3182CE"
                />
              </svg>
            </div>
          </div>
          <div
            class="
              debtor-sum
              flex
              justify-between
              rounded-xl
              bg-white
              p-5
              h-full
            "
          >
            <div class="text">
              <h1 class="text-xl font-normal text-t_bl mb-1">
                Olingan qarz (kreditor)
              </h1>
              <h2
                v-if="creditorUzs != null"
                class="text-xl font-semibold text-t_gr"
              >
                {{
                  creditorUzs.residual_amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                <span>so‘m</span>
              </h2>
              <h2 v-else class="text-xl font-semibold text-t_gr">
                0
                <span>so‘m</span>
              </h2>
              <h2
                v-if="creditorUsd != null"
                class="text-xl font-semibold text-t_gr mb-1"
              >
                {{
                  creditorUsd.residual_amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                <span>$</span>
              </h2>
            </div>
            <div class="iconn">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                  fill="#3182CE"
                />
                <rect width="48" height="48" rx="8" fill="#3182CE" />
                <path
                  d="M17.1967 17.5676H31.2592C31.4234 17.5675 31.5875 17.5779 31.7505 17.5988C31.6953 17.2111 31.5621 16.8386 31.359 16.5037C31.1559 16.1689 30.8871 15.8786 30.5688 15.6505C30.2506 15.4223 29.8894 15.261 29.507 15.1762C29.1247 15.0914 28.7292 15.0849 28.3443 15.1572L16.7792 17.1316H16.766C16.0401 17.2704 15.3945 17.6812 14.9612 18.2799C15.614 17.8155 16.3955 17.5665 17.1967 17.5676Z"
                  fill="white"
                />
                <path
                  d="M31.2593 18.625H17.1968C16.4511 18.6258 15.7362 18.9224 15.2089 19.4497C14.6817 19.9769 14.3851 20.6918 14.3843 21.4375V29.875C14.3851 30.6207 14.6817 31.3356 15.2089 31.8628C15.7362 32.3901 16.4511 32.6867 17.1968 32.6875H31.2593C32.0049 32.6867 32.7198 32.3901 33.2471 31.8628C33.7744 31.3356 34.071 30.6207 34.0718 29.875V21.4375C34.071 20.6918 33.7744 19.9769 33.2471 19.4497C32.7198 18.9224 32.0049 18.6258 31.2593 18.625ZM29.1719 27.0625C28.8937 27.0625 28.6219 26.98 28.3906 26.8255C28.1593 26.671 27.9791 26.4514 27.8727 26.1944C27.7662 25.9374 27.7384 25.6547 27.7926 25.3819C27.8469 25.1091 27.9808 24.8585 28.1775 24.6619C28.3742 24.4652 28.6247 24.3313 28.8975 24.277C29.1703 24.2228 29.4531 24.2506 29.71 24.357C29.967 24.4635 30.1866 24.6437 30.3411 24.875C30.4956 25.1062 30.5781 25.3781 30.5781 25.6562C30.5781 26.0292 30.43 26.3869 30.1662 26.6506C29.9025 26.9143 29.5448 27.0625 29.1719 27.0625Z"
                  fill="white"
                />
                <path
                  d="M14.4062 24.4014V20.0288C14.4062 19.0765 14.9336 17.48 16.7639 17.1341C18.3174 16.8428 19.8555 16.8428 19.8555 16.8428C19.8555 16.8428 20.8662 17.5459 20.0312 17.5459C19.1963 17.5459 19.2183 18.6226 20.0312 18.6226C20.8442 18.6226 20.0312 19.6553 20.0312 19.6553L16.7573 23.3687L14.4062 24.4014Z"
                  fill="white"
                />
                <line x1="17" y1="21.5" x2="22" y2="21.5" stroke="#3182CE" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div
        class="
          grid
          gap-5
          grid-cols-1
          lg:grid-cols-2
          md:grid-cols-2
          gap-x-8
          mt-10
          items-center
          self-stretch
        "
      >
        <div>
          <div
            class="
              debtor-sum
              flex
              justify-between
              rounded-xl
              px-4
              py-4
              bg-white
              mb-10
            "
          >
            <div class="text">
              <h1 class="text-xl font-normal text-t_bl mb-3">
                Muddati o’tgan (debitor)
              </h1>
              <h2
                v-if="expiredDebitorUzs != null"
                class="text-xl font-semibold text-t_gr"
              >
                {{
                  expiredDebitorUzs.residual_amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                <span>so’m</span>
              </h2>
              <h2 v-else class="text-xl font-semibold text-t_gr">
                0
                <span>so’m</span>
              </h2>
              <h2
                v-if="expiredDebitorUsd != null"
                class="text-xl font-semibold text-t_gr mb-1"
              >
                {{
                  expiredDebitorUsd.residual_amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                <span>$</span>
              </h2>
            </div>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                fill="#3182CE"
              />
              <rect width="48" height="48" rx="8" fill="#3182CE" />
              <path
                d="M24 35.25C21.775 35.25 19.5999 34.5902 17.7498 33.354C15.8998 32.1179 14.4578 30.3609 13.6064 28.3052C12.7549 26.2495 12.5321 23.9875 12.9662 21.8052C13.4003 19.623 14.4717 17.6184 16.0451 16.0451C17.6184 14.4717 19.623 13.4003 21.8052 12.9662C23.9875 12.5321 26.2495 12.7549 28.3052 13.6064C30.3609 14.4578 32.1179 15.8998 33.354 17.7498C34.5902 19.5999 35.25 21.775 35.25 24C35.25 26.9837 34.0647 29.8452 31.955 31.955C29.8452 34.0647 26.9837 35.25 24 35.25ZM24 14.25C22.0716 14.25 20.1866 14.8218 18.5832 15.8932C16.9798 16.9645 15.7301 18.4873 14.9922 20.2688C14.2542 22.0504 14.0611 24.0108 14.4373 25.9021C14.8136 27.7935 15.7422 29.5307 17.1057 30.8943C18.4693 32.2579 20.2066 33.1865 22.0979 33.5627C23.9892 33.9389 25.9496 33.7458 27.7312 33.0078C29.5127 32.2699 31.0355 31.0202 32.1068 29.4168C33.1782 27.8134 33.75 25.9284 33.75 24C33.75 21.4141 32.7228 18.9342 30.8943 17.1057C29.0658 15.2772 26.5859 14.25 24 14.25Z"
                fill="white"
              />
              <path
                d="M27.18 28.245L23.4675 24.5325C23.398 24.4624 23.343 24.3793 23.3057 24.2879C23.2684 24.1966 23.2494 24.0987 23.25 24V18H24.75V23.6925L28.245 27.18L27.18 28.245Z"
                fill="white"
              />
              <path
                d="M16.6929 21.1895V20.0425H18.4946V18.2407H19.6504V20.0425H21.4521V21.1895H19.6504V23H18.4946V21.1895H16.6929Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        <div>
          <div
            class="
              debtor-sum
              flex
              justify-between
              rounded-xl
              px-4
              py-4
              bg-white
              mb-10
            "
          >
            <div class="text">
              <h1 class="text-xl font-normal text-t_bl mb-3">
                Muddati o‘tgan (kreditor)
              </h1>
              <h2
                v-if="expiredCreditorUzs != null"
                class="text-xl font-semibold text-t_gr"
              >
                {{
                  expiredCreditorUzs.residual_amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                <span>so’m</span>
              </h2>
              <h2 v-else class="text-xl font-semibold text-t_gr">
                0
                <span>so‘m</span>
              </h2>
              <h2
                v-if="expiredCreditorUsd != null"
                class="text-xl font-semibold text-t_gr mb-1"
              >
                {{
                  expiredCreditorUsd.residual_amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                <span>$</span>
              </h2>
            </div>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                fill="#3182CE"
              />
              <rect width="48" height="48" rx="8" fill="#3182CE" />
              <path
                d="M24 35.25C21.775 35.25 19.5999 34.5902 17.7498 33.354C15.8998 32.1179 14.4578 30.3609 13.6064 28.3052C12.7549 26.2495 12.5321 23.9875 12.9662 21.8052C13.4003 19.623 14.4717 17.6184 16.0451 16.0451C17.6184 14.4717 19.623 13.4003 21.8052 12.9662C23.9875 12.5321 26.2495 12.7549 28.3052 13.6064C30.3609 14.4578 32.1179 15.8998 33.354 17.7498C34.5902 19.5999 35.25 21.775 35.25 24C35.25 26.9837 34.0647 29.8452 31.955 31.955C29.8452 34.0647 26.9837 35.25 24 35.25ZM24 14.25C22.0716 14.25 20.1866 14.8218 18.5832 15.8932C16.9798 16.9645 15.7301 18.4873 14.9922 20.2688C14.2542 22.0504 14.0611 24.0108 14.4373 25.9021C14.8136 27.7935 15.7422 29.5307 17.1057 30.8943C18.4693 32.2579 20.2066 33.1865 22.0979 33.5627C23.9892 33.9389 25.9496 33.7458 27.7312 33.0078C29.5127 32.2699 31.0355 31.0202 32.1068 29.4168C33.1782 27.8134 33.75 25.9284 33.75 24C33.75 21.4141 32.7228 18.9342 30.8943 17.1057C29.0658 15.2772 26.5859 14.25 24 14.25Z"
                fill="white"
              />
              <path
                d="M27.18 28.245L23.4675 24.5325C23.398 24.4624 23.343 24.3793 23.3057 24.2879C23.2684 24.1966 23.2494 24.0987 23.25 24V18H24.75V23.6925L28.245 27.18L27.18 28.245Z"
                fill="white"
              />
              <line x1="17" y1="20.5" x2="21" y2="20.5" stroke="white" />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="
          grid
          gap-5
          grid-cols-1
          lg:grid-cols-2
          md:grid-cols-2
          gap-x-8
          mt-10
          items-stretch
          self-stretch
        "
      >
        <div class="debitor w-full rounded-xl px-4 py-4 bg-white mb-10">
          <h1 class="text-xl font-normal text-t_bl border-b-2">
            Muddati oz qolgan (debitor)
          </h1>
          <div class="flex items-center justify-between">
            <div
              style="cursor: pointer"
              @click="handleTab('left', 1)"
              :class="[
                tabLeft == 1
                  ? 'flex w-full text-white bg-blue-400 rounded py-1 m-2 justify-center'
                  : 'flex w-full  rounded py-1 m-2 justify-center',
              ]"
            >
              <span style=""> UZS </span>
            </div>
            <div
              style="cursor: pointer"
              @click="handleTab('left', 2)"
              :class="[
                tabLeft == 2
                  ? 'flex w-full text-white bg-blue-400 rounded py-1 m-2 justify-center'
                  : 'flex w-full  rounded py-1 m-2 justify-center',
              ]"
            >
              <span style=""> USD </span>
            </div>
          </div>
          <table class="divide-y-2 w-full">
            <thead class="bg-t_grayy py-1 flex items-center">
              <th class="w-1/2 text-sm">QOLGAN VAQT</th>
              <th class="w-1/2 text-sm">SUMMA</th>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in debitorData"
                :key="i"
                class="text-center py-1 flex items-center"
              >
                <td class="w-1/2" v-html="getDays(item.end_date)"></td>
                <td class="w-1/2">
                  {{
                    item.residual_amount
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                  }}
                  {{ item.currency }}
                </td>
              </tr>
            </tbody>
          </table>
          <div
            class="flex justify-center items-center py-4"
            v-if="debitorData.length === 0"
          >
            Malumot mavjud emas
          </div>
        </div>
        <div class="debitor w-full rounded-xl px-4 py-4 bg-white mb-10">
          <h1 class="text-xl font-normal text-t_bl border-b-2">
            Muddati oz qolgan (kreditor)
          </h1>
          <div class="flex items-center justify-between">
            <div
              style="cursor: pointer"
              @click="handleTab('right', 1)"
              :class="[
                tabRight == 1
                  ? 'flex w-full text-white bg-blue-400 rounded py-1 m-2 justify-center'
                  : 'flex w-full  rounded py-1 m-2 justify-center',
              ]"
              class="flex w-full items-center justify-center"
            >
              <span style="">UZS</span>
            </div>
            <div
              style="cursor: pointer"
              @click="handleTab('right', 2)"
              :class="[
                tabRight == 2
                  ? 'flex w-full text-white bg-blue-400 rounded py-1 m-2 justify-center'
                  : 'flex w-full  rounded py-1 m-2 justify-center',
              ]"
            >
              <span>USD</span>
            </div>
          </div>
          <table class="divide-y-2 w-full">
            <thead class="bg-t_grayy py-1 flex items-center">
              <th class="w-1/2 text-sm">QOLGAN VAQT</th>
              <th class="w-1/2 text-sm">SUMMA</th>
            </thead>

            <tbody>
              <tr
                v-for="(item, i) in creditorData"
                :key="i"
                class="text-center flex items-center py-1"
              >
                <td class="w-1/2" v-html="getDays(item.end_date)"></td>

                <td class="w-1/2">
                  {{
                    item.residual_amount
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                  }}
                  {{ item.currency }}
                </td>
              </tr>
            </tbody>
          </table>
          <div
            class="flex justify-center items-center py-4"
            v-if="creditorData.length === 0"
          >
            Malumot mavjud emas
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="$auth.user.id !== $auth.user2.id"
      class="flex justify-between pl-4 pr-4"
    >
      <nuxt-link
      :to="{ path: '/give-money', query: { id: user.uid } }"
        class="
          w-72
          mx-auto
          lg:mx-0
          md:mx-0
          px-4
          py-6
          flex
          justify-between
          items-center
          bg-t_primary
          rounded-xl
          mb-10
        "
      >
        <div class="text cursor-pointer">
          <h1 class="text-white text-2xl font-normal">Qarz berish</h1>
        </div>

        <div class="iconn bg-white p-3 rounded-lg flex items-center">
          <svg
            width="26"
            height="25"
            viewBox="0 0 26 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.6982 1.13244L11.1396 0.0993364C10.794 0.0733843 10.4521 0.185612 10.1891 0.411398C9.92605 0.637184 9.76332 0.958088 9.7366 1.3037L9.18032 8.60445C9.15437 8.95012 9.26659 9.29198 9.49238 9.55501C9.71816 9.81804 10.0391 9.98077 10.3847 10.0075L23.9432 11.0406C24.2889 11.0665 24.6307 10.9543 24.8938 10.7285C25.1568 10.5027 25.3195 10.1818 25.3462 9.83622L25.9025 2.53548C25.9285 2.1898 25.8163 1.84795 25.5905 1.58491C25.3647 1.32188 25.0438 1.15916 24.6982 1.13244ZM14.7108 8.76359L11.1275 5.08125L15.2273 1.98433L20.3721 2.37634L23.9554 6.05868L19.8555 9.1556L14.7108 8.76359ZM24.2119 4.07252L22.7366 2.5565L24.3182 2.67701L24.2119 4.07252ZM12.8627 1.80416L11.1748 3.07915L11.2812 1.68365L12.8627 1.80416ZM10.871 7.0674L12.3462 8.58342L10.7646 8.46291L10.871 7.0674ZM22.2201 9.33576L23.908 8.06077L23.8017 9.45627L22.2201 9.33576ZM17.76 2.70181C17.1927 2.65859 16.6254 2.78455 16.1297 3.06377C15.634 3.34299 15.2322 3.76292 14.9752 4.27046C14.7182 4.77801 14.6175 5.35037 14.6858 5.91517C14.754 6.47997 14.9883 7.01184 15.3588 7.44352C15.7294 7.8752 16.2196 8.1873 16.7675 8.34036C17.3155 8.49343 17.8965 8.48057 18.4371 8.30342C18.9777 8.12627 19.4537 7.79278 19.8048 7.34513C20.1559 6.89748 20.3664 6.35577 20.4096 5.7885C20.4667 5.02802 20.2197 4.27595 19.723 3.69728C19.2263 3.11861 18.5203 2.76061 17.76 2.70181ZM17.4421 6.87366C17.1842 6.85402 16.938 6.75835 16.7345 6.59876C16.5311 6.43917 16.3795 6.22283 16.2989 5.97709C16.2184 5.73135 16.2126 5.46725 16.2822 5.21819C16.3517 4.96913 16.4936 4.7463 16.6898 4.57786C16.886 4.40943 17.1278 4.30296 17.3845 4.27193C17.6412 4.24089 17.9014 4.28668 18.1321 4.40351C18.3628 4.52034 18.5537 4.70295 18.6806 4.92826C18.8075 5.15357 18.8648 5.41145 18.8451 5.6693C18.8184 6.01491 18.6557 6.33582 18.3926 6.5616C18.1296 6.78739 17.7878 6.89962 17.4421 6.87366Z"
              fill="#3182CE"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.57469 15.0735C4.33731 14.7908 3.95401 14.6512 3.57313 14.74L0.778962 15.3922C0.507458 15.4556 0.274429 15.6286 0.135048 15.8701C-0.00433401 16.1113 -0.0374855 16.3998 0.0433365 16.6667L2.22892 23.8782C2.38306 24.3869 2.9055 24.6884 3.4231 24.5676L6.21726 23.9155C6.48877 23.8521 6.7218 23.6791 6.86118 23.4378C6.93135 23.3161 6.97467 23.1828 6.99015 23.046C8.76049 23.0393 12.021 23.0003 14.5395 22.8188C16.2818 22.6935 17.6976 22.4546 18.2113 22.1773C19.4989 21.4824 23.5872 18.6403 24.7804 16.9048C25.3643 16.0559 25.353 15.2949 25.0493 14.8095C24.679 14.2181 24.242 13.8686 23.7394 13.6896C23.2649 13.5204 22.7081 13.5015 22.0308 13.6794C21.4972 13.8195 20.8506 14.1065 20.0504 14.5198C19.9188 14.2604 19.7182 14.0114 19.4358 13.7837C19.2533 13.6368 18.9087 13.4604 18.4209 13.3723C17.6603 13.2351 16.4282 13.2678 15.1321 13.8713C14.6092 14.1147 14.1669 13.9485 13.6933 13.7595C13.1779 13.5541 12.6412 13.2959 12.035 13.1137C10.623 12.6892 8.90544 13.0248 7.36014 13.6431C6.27873 14.076 5.28636 14.6328 4.57469 15.0735ZM3.11143 16.9186L3.11481 16.9292L4.71117 22.1964L3.8848 22.3893L2.2853 17.1114L3.11143 16.9186ZM15.0167 17.3103C15.9851 16.7768 17.6836 15.8117 17.7204 15.7919C17.8595 15.7169 17.9802 15.6356 18.0783 15.5473C18.1225 15.5076 18.1709 15.4447 18.2024 15.4001C17.9684 15.3757 16.8659 15.2883 15.9832 15.6992C15.0382 16.1391 14.2102 16.0683 13.3659 15.7873C12.7704 15.5891 12.1647 15.2581 11.4545 15.0449C10.4408 14.7403 9.21905 15.0713 8.10956 15.5153C6.93159 15.9867 5.87341 16.6241 5.25248 17.0306L6.46505 21.0308C8.00817 21.0301 11.65 21.0054 14.3946 20.8077C15.7443 20.7104 16.8555 20.6178 17.2533 20.4029C18.2684 19.855 21.2289 17.8432 22.673 16.3008C22.8668 16.0937 23.1899 15.7873 23.0624 15.5889C22.8985 15.3346 22.4339 15.6361 21.9488 15.8376C21.163 16.1641 20.1714 16.7168 18.886 17.4466C18.8192 17.4877 18.6546 17.5789 18.6428 17.5848C17.8675 18.0254 16.9888 18.5261 15.9895 19.0766C15.5425 19.3227 14.9061 19.4272 14.2271 19.3984C13.431 19.3648 12.571 19.1671 12.0698 19.0243C11.5348 18.8719 11.2241 18.3136 11.3766 17.7783C11.529 17.2431 12.0873 16.9326 12.6225 17.0851C13.0153 17.1969 13.6885 17.3573 14.3125 17.3837C14.5809 17.395 14.84 17.4076 15.0167 17.3103Z"
              fill="#3182CE"
            />
          </svg>
        </div>
      </nuxt-link>
      <div></div>
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
export default {
  middleware: "auth",
  data: () => ({
    step: 1,
    user: null,
    userDebtInfo: null,
    tabLeft: 1,
    tabRight: 1,
    debitorData: [],
    expiredDebitor: [],
    expiredCreditor: [],
    creditorData: [],
    expiredDebitorUsd: null,
    expiredDebitorUzs: null,
    creditorUsd: null,
    creditorUzs: null,
    expiredCreditorUsd: null,
    expiredCreditorUzs: null,
    debitorUsd: null,
    debitorUzs: null,
  }),

  async mounted() {
    const debitor = await this.$axios.get(
      `/home/by/${this.user.id}?type=debitor`
    );
    const creditor = await this.$axios.get(
      `/home/by/${this.user.id}?type=creditor`
    );
    this.nearCreditor = creditor.data.data.five;
    this.nearDebitor = debitor.data.data.five;
    this.debitorData = debitor.data.data.five.filter(
      (item) => item.currency === "UZS"
    );
    this.creditorData = creditor.data.data.five.filter(
      (item) => item.currency === "UZS"
    );
    this.debitorUsd = debitor.data.data.data.find(
      (item) => item.currency == "USD"
    );
    this.debitorUzs = debitor.data.data.data.find(
      (item) => item.currency == "UZS"
    );
    this.expiredDebitorUsd = debitor.data.data.expired.find(
      (item) => item.currency == "USD"
    );
    this.expiredDebitorUzs = debitor.data.data.expired.find(
      (item) => item.currency == "UZS"
    );
    this.creditorUsd = creditor.data.data.data.find(
      (item) => item.currency == "USD"
    );
    this.creditorUzs = creditor.data.data.data.find(
      (item) => item.currency == "UZS"
    );
    this.expiredCreditorUsd = creditor.data.data.expired.find(
      (item) => item.currency == "USD"
    );
    this.expiredCreditorUzs = creditor.data.data.expired.find(
      (item) => item.currency == "UZS"
    );
  },

  methods: {
    handleTab(tab, value) {
      if (tab == "left") {
        const currency = value === 1 ? "UZS" : "USD";
        this.debitorData = this.nearDebitor.filter(
          (item) => item.currency === currency
        );
        this.tabLeft = value;
      } else if (tab == "right") {
        const currency = value === 1 ? "UZS" : "USD";
        this.creditorData = this.nearCreditor.filter(
          (item) => item.currency === currency
        );
        this.tabRight = value;
      }
    },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },

    getDays(time) {
      const restTimeMillisec = new Date(time) - Date.now();
      if (restTimeMillisec < 0) {
        return "<span class='text-red-500'>Bugun</span>";
      }
      const fixedNumber = restTimeMillisec / (24 * 60 * 60 * 1000).toFixed(2);

      if (Math.ceil(fixedNumber) > 1 && Math.ceil(fixedNumber) < 4) {
        return `<span class='text-red-500'>${Math.ceil(fixedNumber).toFixed(
          0
        )} kun</span>`;
      }
      if (Math.ceil(fixedNumber) > 3) {
        return `${Math.ceil(fixedNumber).toFixed(0)} kun`;
      }
      if (fixedNumber < 1 && fixedNumber > 0) {
        return "<span class='text-red-500' > 1 kun</span>";
      }
    },
  },
  created() {
    if (!this.$auth.user2) {
      return this.$router.go(-1);
    }
    // if (!this.$route.query.secret) {
    //   return this.$router.go(-1);
    // }
    this.user = this.$auth.user2;
  },
};
</script>

<style lang="scss" scoped>
.user__info__left {
  height: 100%;
  color: #195a96;
  font-weight: 500;
}
.user__info__right {
  margin-left: 25px;
  height: 100%;
}
.user__avatar {
  width: 100px;
  max-height: 100px;
  border-radius: 50%;
}

.user__info {
  display: flex;
}
div.debt {
  div.debt-left {
    width: 465px;

    div.debtor-sum {
      padding: 18px 23px 11px 23px;
    }
    div.debitor {
      h1 {
        padding: 28px 106px 15px 23px;
      }
      table {
        width: 100%;
        th {
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          line-height: 15px;
          /* identical to box height */

          /* Gray/Gray-400 */

          color: #a0aec0;
        }
        tr {
          td {
            padding: 14px 0;
          }
          td:first-child {
            font-weight: 500;
            font-size: 14px;
            line-height: 17px;

            color: #718096;
          }
        }
      }

      // tr {
      //   border: 1px solid #e2e8f0;
      //   border-collapse: collapse;
      // }
    }
  }
}
</style>
