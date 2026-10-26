<template>
  <!--  -->
  <div>
    <!-- SS-DEV (2026-09-26): en/kaa tillarida matn uz (lotin) shoxidan ko'rsatiladi — $apiLang() en/kaa->uz -->
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_refund_rejected') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          <b> {{ item.created_at }}</b> yildagi
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-sonli qarz shartnomasiga asosan
          <b>
            {{
              item.refundable_amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}
          </b>
          qarz mablag‘ini qaytarish bo‘yicha Sizga so‘rov yuborgan.
          Biroq ushbu so‘rov {{ item.created }} yil soat 23:59 ga
          qadar Siz tomoningizdan qabul qilinmaganligi sababli tizim tomonidan
          bekor qilindi.
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

      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_refund_rejected') }}</b>
        </p>
        <p class="mt-2">
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha
          <b>{{
            item.refundable_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>
          qaytarilganligi yuzasidan yuborgan so‘rovingiz
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> tomonidan
          {{ item.created }} yil soat 23:59 ga qadar qabul
          qilinmaganligi sababli tizim tomonidan bekor qilindi. Qayta so‘rov
          yuborishingiz mumkin.
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
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_refund_rejected') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          <b> — {{ item.created_at }}</b>, loan agreement No.
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>— a request to repay the loan amount of
          <b>
            {{
              item.refundable_amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}
          </b>
          was sent to you. However, the deadline for this request was 23:59 on {{ item.created }} : it was not accepted by you, so the system cancelled it.
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

      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_refund_rejected') }}</b>
        </p>
        <p class="mt-2">
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>— your request for the return of
          <b>{{
            item.refundable_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>
          under this loan agreement, addressed to
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> , by 23:59 on
          {{ item.created }} : it was not accepted by that person, so the system cancelled it. You can send a new request.
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
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_refund_rejected') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          <b> {{ item.created_at }}</b> jılındaǵı
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-nomerli qarız shártnaması tiykarında
          <b>
            {{
              item.refundable_amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}
          </b>
          qarız qarjısın qaytarıw boyınsha Sizge soraw jibergen. Biraq usı soraw {{ item.created }} jılı saat 23:59 ge shekem Siz tárepinen qabıllanbaǵanlıǵı sebepli sistema tárepinen biykar etildi.
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

      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_refund_rejected') }}</b>
        </p>
        <p class="mt-2">
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-nomerli qarız shártnaması boyınsha
          <b>{{
            item.refundable_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>
          qaytarılǵanlıǵı boyınsha jibergen sorawıńız
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> tárepinen
          {{ item.created }} jılı saat 23:59 ge shekem qabıllanbaǵanlıǵı sebepli sistema tárepinen biykar etildi. Qayta soraw jiberiwińiz múmkin.
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
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_refund_rejected') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          <b> {{ item.created_at }}</b> йилдаги
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-сонли қарз шартномасига асосан
          <b>
            {{
              item.refundable_amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}
          </b>
          қарз маблағини қайтариш бўйича Сизга сўров юборган.
          Бироқ ушбу сўров {{ item.created }} йил соат 23:59 га
          қадар Сиз томонингиздан қабул қилинмаганлиги сабабли тизим томонидан
          бекор қилинди.
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

      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_refund_rejected') }}</b>
        </p>
        <p class="mt-2">
          <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-сонли қарз шартномаси бўйича
          <b>{{
            item.refundable_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>
          қайтарилганлиги юзасидан юборган сўровингиз
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> томонидан
          {{ item.created }} йил соат 23:59 га қадар қабул
          қилинмаганлиги сабабли тизим томонидан бекор қилинди. Қайта сўров
          юборишингиз мумкин.
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
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_refund_rejected') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.c_last_name, item.c_first_name, item.c_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> не принял(а) Ваш запрос о возврате <b>{{
              item.refundable_amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}</b> по договору займа №<a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a> до 23:59
          <b>{{ item.created }} г.</b> Поэтому этот запрос был автоматически отклонен системой. Вы можете
          отправить запрос
          повторно.
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

      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_refund_rejected') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> отправил(а)
          Вам запрос на возврат суммы займа в размере <b>{{
            item.refundable_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b> по договору займа №<a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a> от <b>{{ item.created_at }}</b> г.
            Однако Вы не приняли этот запрос до 23:59 <b>{{ item.created }} г.</b>  Поэтому этот запрос был автоматически отклонен системой.

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
  mixins: [notificationMixin],
};
</script>

<style></style>
