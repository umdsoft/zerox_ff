<template>
  <div>
    <div class="act_content bg-white">
      <div v-if="$i18n.locale == 'uz'">
        <div class="acts">
          <div class="container pagebreak">
            <div
              @click="$store.commit('HIDE_ACT_MODAL')"
              class="mt-6"
              style="cursor: pointer; display: flex; justify-content: end"
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
                <h2 class="font-bold">D А L O L А T N O M А</h2>

                <p>
                  ( <span>{{ contract.number }}</span> - sonli qarz shartnomasi bo‘yicha qarz mablag‘i qaytarilganligi to‘g‘risida )
                </p>
              </div>
              <div class="content-body">
                <p>
                  Biz quyida imzo qo‘yuvchilar, 
                  fuqaro
                  <span
                    >{{ contract.debitor_name }}
                  </span
                  >
                  (pasport:
                  <span
                    >{{ contract.debitor_passport }}.
                    {{ dateFormat(contract.debitor_issued_date) }}</span
                  >
                  yilda <b>{{ contract.debitor_issued }} </b> tomonidan
                  berilgan) bir tomondan va
                  fuqaro
                  <span>
                    {{ contract.creditor_name }}
            
                  </span>
                  (pasport:
                  <span
                    >{{ contract.creditor_passport }}.<b> {{ dateFormat(contract.creditor_issued_date) }}</b
                    >.</span
                  > <b>{{ contract.creditor_issued }}</b>
                  tomonidan berilgan) ikkinchi tomondan, ushbu dalolatnoma
                  quyidagilar haqida tuzildi:
                </p>
                <p>Men
                  <span
                    >{{ contract.creditor_name }} 
                </span
                  >
                  fuqaro <span>{{contract.creditor_name}}</span>dan
                 
                  
                  <b>{{ dateFormat(contract.created_at) }}</b> yildagi
                  <span>{{ contract.number }}</span>-sonli qarz shartnomasiga asosan 
                 <b> {{ contract.amount &&  contract.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} {{ contract.currency }}</b>  miqdorida
                  olingan qarz mablag'ini
                  <b>{{ dateFormat(new Date()) }}</b> yilda to‘liq
                  qaytardim
                </p>

                <p>
                  Men  <span>{{contract.debitor_name}}</span> fuqaro <span>{{contract.creditor_name}}</span> dan {{dateFormat(contract.created_at)}} yildagi <span>{{contract.number}}</span>-sonli qarz shartnomasiga asosan 
                   <b>{{contract.amount &&  contract.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} {{contract.currency}}</b> miqdorida berilgan qarz mablag‘ini {{dateFormat(new Date())}} yilda to‘liq qabul qilib oldim.
                </p>

                <p>
                  Mazkur dalolatnoma QR-kod orqali tasdiqlangan holda elektron tarzda tuzildi. 
                </p>
                <p>
                  Dalolatoma ikki tomonning “ZeroX” dasturidagi shaxsiy kabinetida saqlanadi.
                </p>
                <p>
                 QR-kod orqali tasdiqlangan Dalolatnomaning saqlanishini Jamiyat o‘z zimmasiga oladi.
                </p>
              </div>
            </div>

            <div class="box qarz">
              <div class="content-title">
                <h2>Tomonlarning rekvizitlari</h2>
              </div>
              <div class="content-body flex justify-between px-4">
                  <div class="flex">
                  <div class="rekvizit">
                    <div class="rek-title">
                      <h2 class="font-bold mb-4">{{$t('debt_list.Debt')}}i (kreditor):</h2>
                      <h2 class="font-bold">
                      FISH : {{ contract.creditor_name }}
                      </h2>
                    </div>
                    <div class="rek-body flex">
                         <h2 class="font-bold">Maxsus elektron imzo:</h2>
                      <div class="ml-2" style="border-bottom:1px solid black;width:100px;height:10px"></div>
                    </div>
                    <div class="rek-body">
                      <h2 class="font-bold">
                        {{ $t('comp.time') }}: <span>{{ dateFormat(new Date()) }}</span> yil
                      </h2>
                    </div>
                  </div>
                </div>


                   <div class="flex">
                  <div class="rekvizit">
                    <div class="rek-title">
                      <h2 class="font-bold mb-4">Qarz beruvchi (debitor):</h2>
                      <h2 class="font-bold">
                       FISH : {{ contract.debitor_name }}
                      </h2>
                    </div>
                    <div class="rek-body flex">
                      <h2 class="font-bold">Maxsus elektron imzo:</h2>
                      <div class="ml-2" style="border-bottom:1px solid black;width:100px;height:10px"></div>
                    </div>
                    <div class="rek-body">
                      <h2 class="font-bold">
                        {{ $t('comp.time') }}: <span>{{ dateFormat(new Date()) }}</span> yil
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="$i18n.locale == 'kr'">
        <div class="acts">
          <div class="container pagebreak">
            <div
              @click="$store.commit('HIDE_ACT_MODAL')"
              class="mн-6"
              style="cursor: pointer; display: flex; justify-content: end"
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
            <div style="display: flex; justify-content: end">
              <div class="date">
                <span>{{ dateFormat(new Date()) }}</span>
              </div>
            </div>

          <div class="box qarz">
              <div class="content-title">
                <h2 class="font-bold">Д А Л О Л А Т Н О М А</h2>

                <p>
                  ( <span>{{ contract.number }}</span>-сонли қарз шартномаси бўйича қарз маблағи қайтарилганлиги тўғрисида)
                </p>
              </div>
              <div class="content-body">
                <p>
                  Биз қуйида имзо қўювчилар,
                  фуқаро 
                  <span
                    >{{ contract.debitor_name }}
                  </span
                  >
                  (паспорт:
                  <span
                    >{{ contract.debitor_passport }}.
                    {{ dateFormat(contract.debitor_issued_date) }}</span
                  >
                  йилда <b>{{ contract.debitor_issued }} </b> томонидан
                  берилган) бир томондан ва фукаро
                  <span>
                    {{ contract.creditor_name }}
            
                  </span>
                  (паспорт:
                  <span
                    >{{ contract.creditor_passport }}.<b> {{ dateFormat(contract.creditor_issued_date) }}</b
                    >.</span
                  > <b>{{ contract.creditor_issued }}</b>
                  томонидан берилган) иккинчи томондан, ушбу далолатнома қуйидагилар ҳақида тузилди:
                </p>
                <p>
                Мен  <span
                    >{{ contract.creditor_name }}
                </span
                  >
                  фукаро
                  <span>
                    {{ contract.debitor_name }}
                  </span
                  > дан
                  {{ dateFormat(contract.created_at) }} йилдаги
                  <span>{{ contract.number }}</span> - сонли қарз шартномасига
                  asosan <b>{{contract.amount &&  contract.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} {{ contract.currency }}</b> микдорида
                  олинган қарз маблағини 
                  {{ dateFormat(new Date()) }} йилда тўлиқ қайтардим.
                </p>

                <p>
                     Мен  <span
                    >{{ contract.debitor_name }}
                </span> фукаро <span>{{contract.creditor_name}}</span> дан {{ dateFormat(contract.created_at)}} йилдаги <span>{{contract.number}}</span>-сонли қарз шартномасига асосан 
              <b>  {{ contract.amount && contract.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{contract.currency}}</b> миқдорида берилган қарз маблағини {{ dateFormat(contract.end_date)}} йилда тўлиқ қабул қилиб олдим.
                </p>

                <p>
                  Мазкур далолатнома электрон рақамли имзо орқали тасдиқланган ҳолда электрон тарзда тузилди. 
                </p>
                <p>
                 Мазкур далолатнома электрон рақамли имзо орқали тасдиқланган ҳолда электрон тарзда тузилди. 
                </p>
                <p>
                  Электрон рақамли имзо орқали тасдиқланган Далолатномани сақланишини “ZeroX” дастури маъмурияти ўз зиммасига олади.
                </p>
              </div>
            </div>

            <div class="box qarz">
              <div class="content-body flex justify-between px-4">
                <div class="flex">
                  <div class="rekvizit">
                    <div class="rek-title">
                      <h2 class="font-bold mb-4">Қарз олувчи (кредитор):</h2>
                      <h2 class="font-bold">
                      ФИШ : {{ contract.creditor_name }}
                      </h2>
                    </div>
                    <div class="rek-body flex">
                         <h2 class="font-bold">Махсус электрон имзо:</h2>
                      <div class="ml-2" style="border-bottom:1px solid black;width:100px;height:10px"></div>
                    </div>
                    <div class="rek-body">
                      <h2 class="font-bold">
                        Сана: <span>{{ dateFormat(new Date()) }}</span> йил
                      </h2>
                    </div>
                  </div>
                </div>


                   <div class="flex">
                  <div class="rekvizit">
                    <div class="rek-title">
                      <h2 class="font-bold mb-4">Қарз берувчи (дебитор):</h2>
                      <h2 class="font-bold">
                       ФИШ : {{ contract.debitor_name }}
                      </h2>
                    </div>
                    <div class="rek-body flex">
                      <h2 class="font-bold">Махсус электрон имзо:</h2>
                      <div class="ml-2" style="border-bottom:1px solid black;width:100px;height:10px"></div>
                    </div>
                    <div class="rek-body">
                      <h2 class="font-bold">
                        Сана: <span>{{ dateFormat(new Date()) }}</span> йил
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
import vueqr from "vue-qr";
import dateformat from "dateformat";
export default {
  props: ["contract"],
  data: () => ({}),
  components: {
    vueqr,
  },
  methods: {
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("../../assets/style/actModalStyles.css");
</style>>
