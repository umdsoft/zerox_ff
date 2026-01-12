<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasini rasmiylashtirish va qarz berilganligini tasdiqlash to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          Sizdan
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          miqdorida qarz berishingizni so‘ramoqda. Agar “Tasdiqlash”ni
          tanlasangiz,
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtiriladi.
        </p>
        <p>Shuningdek, Siz ushbu so‘rovni qabul qilish orqali <b>{{
          item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b> miqdorida qarz berganligingizni tasdiqlaysiz
          va bu bo‘yicha dalolatnoma rasmiylashtiriladi.</p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <a :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button @click="oneContract2(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>
            <button @click="oneContract2(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasini rasmiylashtirish va qarz olinganligini tasdiqlash to‘g‘risida</b>

        </p>
        <p class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Sizga
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          miqdorida qarz bermoqda. Agar “Tasdiqlash”ni tanlasangiz,
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtiriladi va mobil hisobingizdan
          xizmat haqi sifatida
          <b>{{
            item.token?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            UZS</b>
          yechiladi.
        </p>
        <p> Shuningdek, Siz ushbu so‘rovni qabul qilish orqali <b>{{
          item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b> miqdorida qarz olganligingizni tasdiqlaysiz va bu bo‘yicha dalolatnoma
          rasmiylashtiriladi.</p>
        <p class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Sizga
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          miqdorida qarz bermoqda. Agar “Tasdiqlash”ni tanlasangiz,
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtiriladi.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <a :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button @click="oneContract(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>
            <button @click="oneContract(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз шартномасини расмийлаштириш ва қарз берилганлигини тасдиқлаш тўғрисида</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          Сиздан
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          миқдорида қарз беришингизни сўрамоқда. Агар “Тасдиқлаш”ни танласангиз, <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси расмийлаштирилади.
        </p>
        <p>Шунингдек, Сиз ушбу сўровни қабул қилиш орқали <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
          " ") }}
            {{ item.currency }}</b> миқдорида қарз берганлигингизни тасдиқлайсиз ва бу
          бўйича далолатнома расмийлаштирилади.</p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <a :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button @click="oneContract2(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>
            <button @click="oneContract2(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз шартномасини расмийлаштириш ва қарз олинганлигини тасдиқлаш тўғрисида</b>
        </p>
        <p class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Сизга
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          миқдорида қарз бермоқда. Агар “Тасдиқлаш”ни танласангиз, <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a>-сонли қарз шартномаси расмийлаштирилади ва мобил ҳисобингиздан хизмат ҳақи сифатида
          <b>{{
            item.token?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            UZS</b> ечилади.
        </p>
        <p> Шунингдек, Сиз ушбу сўровни қабул қилиш орқали <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
          " ") }}
            {{ item.currency }}</b> миқдорида қарз олганлигингизни тасдиқлайсиз ва бу бўйича далолатнома
          расмийлаштирилади.</p>
        <p class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Сизга
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          миқдорида қарз бермоқда. Агар “Тасдиқлаш”ни танласангиз,
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a>-сонли қарз шартномаси расмийлаштирилади.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <a :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button @click="oneContract(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>
            <button @click="oneContract(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'ru'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Об оформлении договора займа и подтверждении выдачи займа</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          просит Вас выдать заём в размере <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b> . Если Вы выберете "Подтвердить", будет оформлен договор займа №<a
            class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a>.
        </p>
        <p>Также, принимая данный запрос, Вы подтверждаете, что выдали заём в размере <b>{{
          item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>, и по этому поводу
          будет оформлен акт.</p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <a :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button @click="oneContract2(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>
            <button @click="oneContract2(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Об оформлении договора займа и подтверждении получения займа</b>
        </p>
        <p class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          выдает Вам заём в размере <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>. Если Вы выберете "Подтвердить", будет
          оформлен договор займа №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a> и с Вашего мобильного счета будет списана сумма платы за услугу в размере
          <b>{{
            item.token?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            UZS</b>.
        </p>
        <p> Также, принимая данный запрос, Вы подтверждаете, что получили заём в размере <b>{{
          item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>, и по этому поводу будет оформлен акт.</p>
        <p class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          выдает Вам заём в размере <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>. Если вы выберете "Подтвердить", будет
          оформлен договор займа № <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a>.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <a :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button @click="oneContract(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>
            <button @click="oneContract(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import notificationMixin from '~/mixins/notificationMixin';

export default {
  name: 'ContractCreate',
  mixins: [notificationMixin],

  methods: {
    // Kreditor tomonidan tasdiqlash
    oneContract(id, status) {
      return this.confirmContract(id, status);
    },

    // Debitor tomonidan tasdiqlash
    oneContract2(id, status) {
      return this.confirmContractAsDebitor(id, status);
    }
  }
};
</script>

<style></style>
