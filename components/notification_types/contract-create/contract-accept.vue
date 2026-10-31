<template>
  <div>
    <!-- SS-DEV (2026-09-26): en/kaa tillarida matn uz (lotin) shoxidan ko'rsatiladi — $apiLang() en/kaa->uz -->
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_contract_confirmed') }}</b>
        </p>
        <div class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          va Sizning o‘rtangizda
          <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi va dalolatnoma rasmiylashtirildi. Ushbu
          shartnoma va dalolatnoma asosida Siz
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>dan
          <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b>
          miqdorida qarz oldingiz.
          <span v-if="item.token != null">
            Xizmat haqi sifatida hisobingizdan
            <b> {{ formatMoney(item.token) }} UZS</b>
            yechildi.
          </span>
        </div>

        <div class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          va Sizning o‘rtangizda
          <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi va dalolatnoma rasmiylashtirildi. Ushbu
          shartnoma va dalolatnoma asosida Siz
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>dan
          <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b>
          miqdorida qarz oldingiz.
        </div>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_contract_confirmed') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b> va
          Sizning o‘rtangizda
          <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi va dalolatnoma rasmiylashtirildi. Ushbu
          shartnoma va dalolatnoma asosida Siz
          <b v-if="item.ctypes == 2"> {{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>ga
          <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b>
          miqdorida qarz berdingiz.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>


    <div v-if="$i18n.locale == 'en'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_contract_confirmed') }}</b>
        </p>
        <div class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          and you — loan agreement No.
          <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a> and the acknowledgment act have been drawn up. Under this agreement and act, you borrowed from
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>:
          <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b>.
          <span v-if="item.token != null">
            As a service fee,
            <b> {{ formatMoney(item.token) }} UZS</b>
            was debited from your account.
          </span>
        </div>

        <div class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          and you — loan agreement No.
          <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a> and the acknowledgment act have been drawn up. Under this agreement and act, you borrowed from
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>:
          <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b>.
        </div>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_contract_confirmed') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b> and you — loan agreement No.
          <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a> and the acknowledgment act have been drawn up. Under this agreement and act, you lent to
          <b v-if="item.ctypes == 2"> {{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>:
          <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b>.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>


    <div v-if="$i18n.locale == 'kaa'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_contract_confirmed') }}</b>
        </p>
        <div class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          hám Siz arasında
          <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-nomerli qarız shártnaması hám akt rásmiylestirildi. Usı shártnama hám akt tiykarında Siz
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>degen adamnan
          <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b>
          muǵdarında qarız aldıńız.
          <span v-if="item.token != null">
            Xızmet haqı retinde
            <b> {{ formatMoney(item.token) }} UZS</b>
            esabıńızdan alındı.
          </span>
        </div>

        <div class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          hám Siz arasında
          <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-nomerli qarız shártnaması hám akt rásmiylestirildi. Usı shártnama hám akt tiykarında Siz
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>degen adamnan
          <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b>
          muǵdarında qarız aldıńız.
        </div>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_contract_confirmed') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b> hám Siz arasında
          <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-nomerli qarız shártnaması hám akt rásmiylestirildi. Usı shártnama hám akt tiykarında Siz
          <b v-if="item.ctypes == 2"> {{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>degen adamǵa
          <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b>
          muǵdarında qarız berdińiz.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>


    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_contract_confirmed') }}</b>
        </p>
        <div class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> ва
          Сизнинг ўртангизда <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси ва далолатнома расмийлаштирилди. Ушбу шартнома ва далолатнома асосида Сиз
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b v-if="item.dtypes == 1">{{
              item.dcompany }}</b>дан <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b> миқдорида қарз олдингиз.
          <span v-if="item.token != null"> Хизмат ҳақи сифатида ҳисобингиздан <b> {{
            formatMoney(item.token) }} UZS</b> ечилди.</span>
        </div>

        <div class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> ва
          Сизнинг ўртангизда <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси ва далолатнома расмийлаштирилди. Ушбу шартнома ва далолатнома асосида Сиз
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b v-if="item.dtypes == 1">{{
              item.dcompany }}</b>дан <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b> миқдорида қарз олдингиз.
        </div>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_contract_confirmed') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b> ва
          Сизнинг ўртангизда <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси ва далолатнома расмийлаштирилди. Ушбу шартнома ва далолатнома асосида Сиз
          <b v-if="item.ctypes == 2">{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b v-if="item.ctypes == 1">{{
              item.ccopmany }}</b>га <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b> миқдорида қарз бердингиз.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'ru'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_contract_confirmed') }}</b>
        </p>
        <div class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b v-if="item.dtypes == 1">{{ item.dcompany
            }}</b> выдал(а) Вам заём в размере <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b> на основании договора займа №<a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number
              }}</b></a> и акта.
          <span v-if="item.token != null">С Вашего счета списано <b> {{
            formatMoney(item.token) }} UZS</b> в качестве платы за услугу.</span>
        </div>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_contract_confirmed') }}</b>
        </p>
        <p class="mt-2" v-if="ll != null">
          <b v-if="item.ctypes == 2">{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b v-if="item.ctypes == 1">{{
              item.ccopmany }}</b> подтвердил(а)
          договор займа №<a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number
              }}</b></a> и акт. На основании этого договора и акта Вы выдали Заёмщику (<b v-if="item.ctypes == 2">{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b>)<b v-if="item.ctypes == 1">{{
              item.ccopmany }}</b> заём в размере <b>{{ formatMoney(item.amount) }}
            {{ item.currency }}</b>.

        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
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
  name: 'ContractAccept',
  mixins: [notificationMixin],

  data() {
    return {
      creditor_format_name: null,
      ll: null
    };
  },

  mounted() {
    if (this.item.c_first_name && this.item.c_last_name) {
      this.creditor_format_name = this.$latinToCyrillic(
        `${this.item.c_first_name[0]}.${this.item.c_last_name}`
      );
    }
    this.ll = this.item.cgender == 1 ? "У" : "ОЙ";
  }
};
</script>

<style scoped></style>
