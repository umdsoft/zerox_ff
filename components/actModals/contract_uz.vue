<template>
  <div>
    <div class="act_content bg-white">
      <!-- SS-DEV (2026-09-26): en/kaa tillarida matn uz (lotin) shoxidan ko'rsatiladi — $apiLang() en/kaa->uz -->
      <div v-if="$apiLang() == 'uz'">
        <div class="acts">
          <div class="container">
            <div
              @click="$store.commit('HIDE_ACT_MODAL')"
              class="mt-12"
              style="cursor: pointer; display: flex; justify-content: flex-end"
            >
              <svg
                class="h-8 w-8 text-black"
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
            </div>

            <div class="box qarz">
              <div class="content-title">
                <h2 class="font-bold">Д А Л О Л А Т Н О М А</h2>


              </div>
              <div class="content-body">


                <p>
                  Мазкур далолатнома Имзо орқали тасдиқланган ҳолда электрон
                  тарзда тузилди.
                </p>
                <p>
                  Далолатнома икки томоннинг “ZeroX” дастуридаги шахсий
                  кабинетида сақланади.
                </p>
                <p>
                  Махсус электрон имзо орқали тасдиқланган Далолатноманинг
                  сақланишини Жамият ўз зиммасига олади.
                </p>
              </div>
            </div>

            <div class="box qarz">
              <div class="content-title">
                <h2>Томонларнинг реквизитлари</h2>
              </div>
              <div class="content-body">
                <div class="flex">
                  <div class="rekvizit">
                    <div class="rek-title">
                      <h2>Қарз берувчи (дебитор):</h2>
                      <h2>

                      </h2>
                    </div>

                    <div class="rek-body">
                      <h2>

                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// SS-AUDIT (2026-09-25): ishlatilmagan komponent ro'yxati/importi olib tashlandi (vueqr)
export default {
  // props: ["contract"],
  data: () => ({}),
  methods: {},
};
</script>

<style lang="scss" scoped>
@import url("../../assets/style/actModalStyles.css");
</style>>
