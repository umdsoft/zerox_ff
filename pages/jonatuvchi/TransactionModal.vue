<template>
  <div>
    <ZModal v-if="openModal" :width="400" @closeModal="$emit('closeModal')">
      <template #modal_body v-if="data">
        <div class="text-center font-semibold text-xl mb-8">
          {{ modalTitle }}
        </div>
        <div class="modal2">
          <div class="texts">
            <div class="result flex justify-center items-center flex-col mt-7">
              <div class="icon">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M30 2.5C14.8125 2.5 2.5 14.8125 2.5 30C2.5 45.1875 14.8125 57.5 30 57.5C45.1875 57.5 57.5 45.1875 57.5 30C57.5 14.8125 45.1875 2.5 30 2.5ZM41.92 25.35C42.1395 25.0991 42.3066 24.8068 42.4115 24.4904C42.5163 24.174 42.5569 23.8398 42.5307 23.5075C42.5045 23.1751 42.4121 22.8514 42.2589 22.5553C42.1058 22.2592 41.895 21.9968 41.6389 21.7834C41.3828 21.5699 41.0866 21.4099 40.7677 21.3127C40.4489 21.2154 40.1138 21.1829 39.7822 21.2171C39.4506 21.2512 39.1292 21.3514 38.8369 21.5116C38.5445 21.6718 38.2872 21.8889 38.08 22.15L27.33 35.0475L21.7675 29.4825C21.296 29.0271 20.6645 28.7751 20.009 28.7808C19.3535 28.7865 18.7265 29.0494 18.263 29.513C17.7994 29.9765 17.5365 30.6035 17.5308 31.259C17.5251 31.9145 17.7771 32.546 18.2325 33.0175L25.7325 40.5175C25.9781 40.763 26.2722 40.9546 26.596 41.0802C26.9198 41.2057 27.2662 41.2624 27.6132 41.2466C27.9601 41.2309 28.2999 41.143 28.611 40.9886C28.9221 40.8342 29.1976 40.6167 29.42 40.35L41.92 25.35Z"
                    fill="#48BB78" />
                </svg>
              </div>
              <div class="uzs mt-2 mb-5">{{ formatAmount(data.amount) }} UZS</div>
            </div>

            <div class="sender">
              <!-- Primary Party -->
              <h1 class="mt-3 mb-1">{{ primaryPartyLabel }}</h1>
              <h3>{{ primaryPartyName }}</h3>

              <!-- Secondary Party (if applicable) -->
              <template v-if="showSecondaryParty">
                <h1 class="mt-3 mb-1">{{ secondaryPartyLabel }}</h1>
                <h3>{{ secondaryPartyName }}</h3>
              </template>

              <!-- Contract Number (if applicable) -->
              <template v-if="showContractNumber">
                <h1 class="mt-3 mb-1">{{ $t('debt_list.a11') }}</h1>
                <h2>
                  <a class="text-blue-400"
                    :href="`https://pdf.zerox.uz/index.php?id=${data.uid}&lang=${$i18n.locale}&download=0`"
                    target="_blank">
                    <b>{{ data.number }}</b>
                  </a>
                </h2>
              </template>

              <!-- Amount -->
              <h1 class="mt-3 mb-1">{{ amountLabel }}</h1>
              <h3>{{ formatAmount(data.amount) }} UZS</h3>

              <!-- Date/Time -->
              <h1 class="mt-3 mb-1">{{ $t("debt_list.a37") }}</h1>
              <h3>
                {{ dateFormat(data.created_at) }}
                <h4 class="inline mr-10">{{ data.time }}</h4>
              </h3>

              <!-- Transaction ID -->
              <h1 class="mt-3 mb-1">{{ $t("debt_list.a39") }}</h1>
              <h3>{{ data.id }}</h3>

              <!-- Download Button -->
              <button class="btn1" @click="pdfDownload">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M24.9999 14.2858V12.5001H19.6427V21.4286H21.4284V17.8572H24.107V16.0715H21.4284V14.2858H24.9999ZM15.1784 21.4286H11.607V12.5001H15.1784C15.8886 12.5008 16.5695 12.7833 17.0717 13.2854C17.5739 13.7876 17.8563 14.4685 17.857 15.1787V18.75C17.8563 19.4602 17.5739 20.1411 17.0717 20.6433C16.5695 21.1454 15.8886 21.4279 15.1784 21.4286ZM13.3927 19.6429H15.1784C15.4152 19.6427 15.6421 19.5485 15.8095 19.3811C15.9769 19.2137 16.0711 18.9868 16.0713 18.75V15.1787C16.0711 14.9419 15.9769 14.715 15.8095 14.5476C15.6421 14.3802 15.4152 14.2861 15.1784 14.2858H13.3927V19.6429ZM8.03557 12.5001H3.57129V21.4286H5.357V18.75H8.03557C8.50896 18.7493 8.96275 18.561 9.29748 18.2262C9.63222 17.8915 9.82058 17.4377 9.82129 16.9644V14.2858C9.82082 13.8124 9.63253 13.3584 9.29774 13.0237C8.96296 12.6889 8.50903 12.5006 8.03557 12.5001V12.5001ZM5.357 16.9644V14.2858H8.03557L8.03647 16.9644H5.357Z"
                    fill="white" />
                  <path
                    d="M17.8571 10.7145V7.14307C17.8603 7.02573 17.838 6.9091 17.7917 6.80121C17.7455 6.69332 17.6764 6.59673 17.5893 6.51808L11.3393 0.268157C11.2607 0.180966 11.1641 0.111865 11.0562 0.0656216C10.9483 0.0193781 10.8316 -0.00290695 10.7143 0.000303604H1.78571C1.31255 0.00171674 0.859165 0.190306 0.524585 0.524882C0.190004 0.859458 0.00141315 1.31284 0 1.786V23.2143C0 23.6879 0.188137 24.1421 0.523024 24.477C0.85791 24.8119 1.31211 25 1.78571 25H16.0714V23.2143H1.78571V1.786H8.92857V7.14307C8.92998 7.61624 9.11858 8.06961 9.45316 8.40419C9.78774 8.73877 10.2411 8.92735 10.7143 8.92877H16.0714V10.7145H17.8571ZM10.7143 7.14307V2.14313L15.7143 7.14307H10.7143Z"
                    fill="white" />
                </svg>
                <h5>{{ $t("debt_list.a33") }}</h5>
              </button>
            </div>
          </div>
        </div>

        <!-- PDF Content -->
        <div class="pdf-content">
          <vue-html2pdf
            :show-layout="false"
            :float-layout="true"
            :enable-download="true"
            :preview-modal="false"
            :paginate-elements-by-height="1400"
            :filename="pdfFileName"
            :pdf-quality="2"
            :manual-pagination="false"
            pdf-format="a5"
            pdf-orientation="landscape"
            :pdf-content-width="pdfContentWidth"
            ref="html2Pdf"
          >
            <section slot="pdf-content" style="margin:30px;">
              <div class="text-center font-semibold text-xl mb-8">
                {{ modalTitle }}
              </div>
              <div class="modal2">
                <div class="texts">
                  <div class="result flex justify-center items-center flex-col mt-7">
                    <div class="icon">
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M30 2.5C14.8125 2.5 2.5 14.8125 2.5 30C2.5 45.1875 14.8125 57.5 30 57.5C45.1875 57.5 57.5 45.1875 57.5 30C57.5 14.8125 45.1875 2.5 30 2.5ZM41.92 25.35C42.1395 25.0991 42.3066 24.8068 42.4115 24.4904C42.5163 24.174 42.5569 23.8398 42.5307 23.5075C42.5045 23.1751 42.4121 22.8514 42.2589 22.5553C42.1058 22.2592 41.895 21.9968 41.6389 21.7834C41.3828 21.5699 41.0866 21.4099 40.7677 21.3127C40.4489 21.2154 40.1138 21.1829 39.7822 21.2171C39.4506 21.2512 39.1292 21.3514 38.8369 21.5116C38.5445 21.6718 38.2872 21.8889 38.08 22.15L27.33 35.0475L21.7675 29.4825C21.296 29.0271 20.6645 28.7751 20.009 28.7808C19.3535 28.7865 18.7265 29.0494 18.263 29.513C17.7994 29.9765 17.5365 30.6035 17.5308 31.259C17.5251 31.9145 17.7771 32.546 18.2325 33.0175L25.7325 40.5175C25.9781 40.763 26.2722 40.9546 26.596 41.0802C26.9198 41.2057 27.2662 41.2624 27.6132 41.2466C27.9601 41.2309 28.2999 41.143 28.611 40.9886C28.9221 40.8342 29.1976 40.6167 29.42 40.35L41.92 25.35Z"
                          fill="#48BB78" />
                      </svg>
                    </div>
                    <div class="uzs mt-2 mb-5">{{ formatAmount(data.amount) }} UZS</div>
                  </div>

                  <div class="sender">
                    <h1 class="mt-3 mb-1">{{ primaryPartyLabel }}</h1>
                    <h3>{{ primaryPartyName }}</h3>

                    <template v-if="showSecondaryParty">
                      <h1 class="mt-3 mb-1">{{ secondaryPartyLabel }}</h1>
                      <h3>{{ secondaryPartyName }}</h3>
                    </template>

                    <template v-if="showContractNumber">
                      <h1 class="mt-3 mb-1">{{ $t('debt_list.a11') }}</h1>
                      <h2>{{ data.number }}</h2>
                    </template>

                    <h1 class="mt-3 mb-1">{{ amountLabel }}</h1>
                    <h3>{{ formatAmount(data.amount) }} UZS</h3>

                    <h1 class="mt-3 mb-1">{{ $t("debt_list.a37") }}</h1>
                    <h3>
                      {{ dateFormat(data.created_at) }}
                      <h4 class="inline mr-10">{{ data.time }}</h4>
                    </h3>

                    <h1 class="mt-3 mb-1">{{ $t("debt_list.a39") }}</h1>
                    <h3>{{ data.id }}</h3>
                  </div>
                </div>
              </div>
              <br />
            </section>
          </vue-html2pdf>
        </div>
      </template>
    </ZModal>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
import { dateFormatMixin } from '@/mixins';

/**
 * Transaction Modal Types:
 * - commission: Komissiya to'lovi
 * - transfer-outgoing: Chiquvchi o'tkazma
 * - transfer-incoming: Kiruvchi o'tkazma
 * - balance-add: Balansni to'ldirish
 * - balance-withdraw: Balansdan yechish
 */
const MODAL_CONFIGS = {
  commission: {
    titleKey: 'a1.a28',
    primaryPartyKey: 'debt_list.a34',
    primaryField: 'dname',
    amountKey: 'a1.a29',
    showSecondary: false,
    showContract: true,
    pdfPrefix: { uz: "Komissiya", kr: "Комиссия", ru: "Комиссия" },
    pdfWidth: '400px',
  },
  'transfer-outgoing': {
    titleKey: 'debt_list.a05',
    primaryPartyKey: 'debt_list.a04',
    primaryField: 'cname',
    secondaryPartyKey: 'debt_list.a35',
    secondaryField: 'dname',
    amountKey: 'debt_list.a36',
    showSecondary: true,
    showContract: false,
    pdfPrefix: { uz: "O'tkazma", kr: "Ўтказма", ru: "Перевод" },
    pdfWidth: '500px',
  },
  'transfer-incoming': {
    titleKey: 'debt_list.a05',
    primaryPartyKey: 'debt_list.a04',
    primaryField: 'dname',
    secondaryPartyKey: 'debt_list.a35',
    secondaryField: 'cname',
    amountKey: 'debt_list.a36',
    showSecondary: true,
    showContract: false,
    pdfPrefix: { uz: "O'tkazma", kr: "Ўтказма", ru: "Перевод" },
    pdfWidth: '500px',
  },
  'balance-add': {
    titleKey: 'debt_list.a08',
    primaryPartyKey: 'debt_list.a35',
    primaryField: 'dname',
    amountKey: 'debt_list.a09',
    showSecondary: false,
    showContract: false,
    pdfPrefix: { uz: "To'ldirish", kr: "Тўлдириш", ru: "Пополнение" },
    pdfWidth: '500px',
  },
  'balance-withdraw': {
    titleKey: 'a1.a30',
    primaryPartyKey: 'debt_list.a35',
    primaryField: 'cname',
    amountKey: 'debt_list.a36',
    showSecondary: false,
    showContract: false,
    pdfPrefix: { uz: "Yechish", kr: "Ечиш", ru: "Вывод" },
    pdfWidth: '500px',
  },
};

export default {
  name: 'TransactionModal',

  components: {
    VueHtml2pdf,
  },

  mixins: [dateFormatMixin],

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    openModal: {
      type: Boolean,
      default: false,
    },
    modalType: {
      type: String,
      default: 'transfer-outgoing',
      validator: (value) => Object.keys(MODAL_CONFIGS).includes(value),
    },
  },

  computed: {
    /**
     * Get current modal configuration
     */
    config() {
      return MODAL_CONFIGS[this.modalType] || MODAL_CONFIGS['transfer-outgoing'];
    },

    /**
     * Modal title based on type
     */
    modalTitle() {
      return this.$t(this.config.titleKey);
    },

    /**
     * Primary party label
     */
    primaryPartyLabel() {
      return this.$t(this.config.primaryPartyKey);
    },

    /**
     * Primary party name from data
     */
    primaryPartyName() {
      return this.data[this.config.primaryField] || '-';
    },

    /**
     * Secondary party label
     */
    secondaryPartyLabel() {
      return this.config.secondaryPartyKey ? this.$t(this.config.secondaryPartyKey) : '';
    },

    /**
     * Secondary party name from data
     */
    secondaryPartyName() {
      return this.config.secondaryField ? (this.data[this.config.secondaryField] || '-') : '';
    },

    /**
     * Amount label
     */
    amountLabel() {
      return this.$t(this.config.amountKey);
    },

    /**
     * Show secondary party field
     */
    showSecondaryParty() {
      return this.config.showSecondary;
    },

    /**
     * Show contract number
     */
    showContractNumber() {
      return this.config.showContract && this.data.number;
    },

    /**
     * PDF file name
     */
    pdfFileName() {
      const prefix = this.config.pdfPrefix[this.$i18n.locale] || this.config.pdfPrefix.uz;
      return `${prefix}_${this.data.id}`;
    },

    /**
     * PDF content width
     */
    pdfContentWidth() {
      return this.config.pdfWidth;
    },
  },

  methods: {
    /**
     * Format amount with thousand separators
     */
    formatAmount(amount) {
      if (!amount) return '0';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },

    /**
     * Download PDF
     */
    pdfDownload() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
};
</script>

<style scoped>
</style>
