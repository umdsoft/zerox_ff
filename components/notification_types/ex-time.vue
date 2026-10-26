<template>
  <div>
    <!-- SS-DEV (2026-09-26): en/kaa tillarida matn uz (lotin) shoxidan ko'rsatiladi — $apiLang() en/kaa->uz -->
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="$auth.user.id === item.creditor">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_extension_rejected') }}</b>
        </p>
        <p class="mt-2">
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha qarzni qaytarish muddatini
          uzaytirish to‘g‘risidagi so‘rovingiz
          <b>{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b> tomonidan {{
            item.created }} yil soat 23:59 ga qadar qabul qilinmaganligi sababli
          tizim tomonidan bekor qilindi. Qayta so‘rov yuborishingiz mumkin.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="$auth.user.id === item.debitor">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_extension_rejected') }}</b>
        </p>
        <p class="mt-2">
          <b>{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b> tomonidan {{
            item.created }} yilda
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha qarzni qaytarish muddatini
          uzaytirish to‘g‘risida Sizga so‘rov yuborilgan. Ushbu so‘rov Siz tomoningizdan {{ item.created }}
          yil 23:59 ga qadar qabul qilinmaganligi sababli tizim tomonidan bekor qilindi.

        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
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
      <div v-if="$auth.user.id === item.creditor">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_extension_rejected') }}</b>
        </p>
        <p class="mt-2">
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>— your request to extend the repayment term under this loan agreement, addressed to
          <b>{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b> , by 23:59 on {{
            item.created }} : it was not accepted, so the system cancelled it. You can send a new request.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="$auth.user.id === item.debitor">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_extension_rejected') }}</b>
        </p>
        <p class="mt-2">
          <b>{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b> sent you a request on {{
            item.created }} to extend the repayment term under loan agreement No.
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>. The deadline for this request was 23:59 on {{ item.created }}
          : you did not accept it, so the system cancelled it.

        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
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
      <div v-if="$auth.user.id === item.creditor">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_extension_rejected') }}</b>
        </p>
        <p class="mt-2">
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-nomerli qarız shártnaması boyınsha qarızdı qaytarıw múddetin uzaytırıw haqqındaǵı sorawıńız
          <b>{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b> tárepinen {{
            item.created }} jılı saat 23:59 ge shekem qabıllanbaǵanlıǵı sebepli sistema tárepinen biykar etildi. Qayta soraw jiberiwińiz múmkin.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="$auth.user.id === item.debitor">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_extension_rejected') }}</b>
        </p>
        <p class="mt-2">
          <b>{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b> tárepinen {{
            item.created }} jılı
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-nomerli qarız shártnaması boyınsha qarızdı qaytarıw múddetin uzaytırıw haqqında Sizge soraw jiberilgen. Usı soraw Siz tárepinen {{ item.created }}
          jılı 23:59 ge shekem qabıllanbaǵanlıǵı sebepli sistema tárepinen biykar etildi.

        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
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
      <div v-if="$auth.user.id === item.creditor">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_extension_rejected') }}</b>
        </p>
        <p class="mt-2">
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси бўйича қарзни қайтариш муддатини узайтириш тўғрисидаги сўровингиз
          <b>{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b> томонидан {{
            item.created }} йил соат 23:59 га қадар қабул қилинмаганлиги сабабли тизим томонидан
          бекор қилинди. Қайта сўров юборишингиз мумкин.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="$auth.user.id === item.debitor">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_extension_rejected') }}</b>
        </p>
        <p class="mt-2">

          <b>{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b> томонидан {{
            item.created }} йилда <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-сонли қарз шартномаси бўйича қарзни
          қайтариш муддатини узайтириш тўғрисида Сизга сўров юборилган. Ушбу сўров Сиз томонингиздан {{
            item.created }} йил соат
          23:59 га қадар қабул қилинмаганлиги сабабли тизим томонидан бекор қилинди.

        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
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
      <div v-if="$auth.user.id === item.creditor">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_extension_rejected') }}</b>
        </p>
        <p class="mt-2">

          <b>{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b> не принял(а) Ваш запрос на продление срока возврата долга по договору займа
          №<a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number
              }}</b></a> до 23:59 <b>{{ item.created }} г.</b> Поэтому этот запрос был автоматически отклонен
          системой.
          Вы можете отправить запрос повторно.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="$auth.user.id === item.debitor">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_extension_rejected') }}</b>
        </p>
        <p class="mt-2">

          <b>{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b> {{
            item.created }} г. отправил(а) Вам запрос на продление срока возврата долга по договору
          займа №<a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>. Этот запрос был автоматически отклонен системой в связи с
          тем, что он не был
          принят до 23:59 {{
            item.created }} г.

        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
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
  name: "debt-demand",
  mixins: [notificationMixin],
};
</script>
