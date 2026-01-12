<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasi va dalolatnoma tasdiqlanganligi to‘g‘risida</b>
        </p>
        <div class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          va Sizning o‘rtangizda
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qqarz shartnomasi va dalolatnoma rasmiylashtirildi. Ushbu
          shartnoma va dalolatnoma asosida Siz
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>dan
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          miqdorida qarz oldingiz.
          <span v-if="item.token != null">
            Xizmat haqi sifatida hisobingizdan
            <b> {{ item.token.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} UZS</b>
            yechildi.
          </span>
        </div>

        <div class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          va Sizning o‘rtangizda
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi va dalolatnoma rasmiylashtirildi. Ushbu
          shartnoma va dalolatnoma asosida Siz
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>dan
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
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
          <b>Qarz shartnomasi va dalolatnoma tasdiqlanganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b> va
          Sizning o‘rtangizda
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi va dalolatnoma rasmiylashtirildi. Ushbu
          shartnoma va dalolatnoma asosida Siz
          <b v-if="item.ctypes == 2"> {{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>ga
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
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

    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз шартномаси ва далолатнома тасдиқганлиги тўғрисида</b>
        </p>
        <div class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> ва
          Сизнинг ўртангизда <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси ва далолатнома расмийлаштирилди. Ушбу шартнома ва далолатнома асосида Сиз
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{
            item.d_middle_name }}</b><b v-if="item.dtypes == 1">{{
              item.dcompany }}</b>дан <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b> миқдорида қарз олдингиз.
          <span v-if="item.token != null"> Хизмат ҳақи сифатида ҳисобингиздан <b> {{
            item.token.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} UZS</b> ечилди.</span>
        </div>

        <div class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> ва
          Сизнинг ўртангизда <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси ва далолатнома расмийлаштирилди. Ушбу шартнома ва далолатнома асосида Сиз
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{
            item.d_middle_name }}</b><b v-if="item.dtypes == 1">{{
              item.dcompany }}</b>дан <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
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
          <b>Қарз шартномаси ва далолатнома тасдиқганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b> ва
          Сизнинг ўртангизда <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси ва далолатнома расмийлаштирилди. Ушбу шартнома ва далолатнома асосида Сиз
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{
            item.c_middle_name }}</b><b v-if="item.ctypes == 1">{{
              item.ccopmany }}</b>га <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
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
          <b>О подтверждении договора займа и акта</b>
        </p>
        <div class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name
            }}</b><b v-if="item.dtypes == 1">{{ item.dcompany
            }}</b> выдал(а) Вам заём в размере <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b> на основании договора займа №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a>и акта.
          <span v-if="item.token != null">С Вашего счета списано <b> {{
            item.token.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} UZS</b> в качестве платы за услугу.</span>
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
          <b>О подтверждении договора займа и акта</b>
        </p>
        <p class="mt-2" v-if="ll != null">
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name
            }}</b><b v-if="item.ctypes == 1">{{
              item.ccopmany }}</b> подтвердил(а)
          договор займа №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a> и акт. На основании этого договора и акта Вы выдали Заёмщику (<b v-if="item.ctypes == 2">{{
                item.c_last_name
              }} {{ item.c_first_name }} {{ item.c_middle_name
            }}</b>)<b v-if="item.ctypes == 1">{{
              item.ccopmany }}</b> заём в размере <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
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

<style></style>
