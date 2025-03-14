<template>
  <div>
    <ZModal v-if="openModal" :width="400" @closeModal="$emit('closeModal')">
      <template #modal_body v-if="data">
        <div class="text-center font-semibold text-xl mb-8">
          {{ $t('a1.a26') }}
        </div>
        <div class="modal2">
          <div class="texts">
            <div class="result flex justify-center items-center flex-col mt-7">
              <div class="icon">

                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M30 0C13.41 0 0 13.41 0 30C0 46.59 13.41 60 30 60C46.59 60 60 46.59 60 30C60 13.41 46.59 0 30 0ZM42.9 42.9C42.6225 43.1781 42.2928 43.3988 41.9299 43.5493C41.567 43.6998 41.1779 43.7773 40.785 43.7773C40.3921 43.7773 40.003 43.6998 39.6401 43.5493C39.2772 43.3988 38.9475 43.1781 38.67 42.9L30 34.23L21.33 42.9C20.7691 43.4609 20.0083 43.7761 19.215 43.7761C18.4217 43.7761 17.6609 43.4609 17.1 42.9C16.5391 42.3391 16.2239 41.5783 16.2239 40.785C16.2239 40.3922 16.3013 40.0033 16.4516 39.6404C16.6019 39.2775 16.8223 38.9477 17.1 38.67L25.77 30L17.1 21.33C16.5391 20.7691 16.2239 20.0083 16.2239 19.215C16.2239 18.4217 16.5391 17.6609 17.1 17.1C17.6609 16.5391 18.4217 16.2239 19.215 16.2239C20.0083 16.2239 20.7691 16.5391 21.33 17.1L30 25.77L38.67 17.1C38.9477 16.8223 39.2775 16.6019 39.6404 16.4516C40.0033 16.3013 40.3922 16.2239 40.785 16.2239C41.1778 16.2239 41.5667 16.3013 41.9296 16.4516C42.2925 16.6019 42.6223 16.8223 42.9 17.1C43.1777 17.3777 43.3981 17.7075 43.5484 18.0704C43.6987 18.4333 43.7761 18.8222 43.7761 19.215C43.7761 19.6078 43.6987 19.9967 43.5484 20.3596C43.3981 20.7225 43.1777 21.0523 42.9 21.33L34.23 30L42.9 38.67C44.04 39.81 44.04 41.73 42.9 42.9Z"
                    fill="#FA3B35" />
                </svg>

              </div>
              <div class="text-red-500 font-bold mt-2 mb-5">{{ data.amount.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} UZS</div>
            </div>

            <div class="sender">
              <h1 class="mt-3 mb-1">
                {{ $t('debt_list.a34') }}
              </h1>
              <h3>{{ data.dname }}</h3>


              <h1 class="mt-3 mb-1">{{ $t('a1.a26') }}</h1>
              <h3>{{ data.amount.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} UZS</h3>
              <h1 class="mt-3 mb-1">{{ $t("debt_list.a37") }}</h1>
              <h3>
                <h3>
                  {{ dateFormat(data.created_at) }}

                  <h4 class="inline mr-10">{{ data.time }}</h4>
                </h3>

              </h3>
              <h1 class="mt-3 mb-1">{{ $t("debt_list.a39") }}</h1>
              <h3>{{ data.id }}</h3>
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

        <div class="pdf-content">
          <vue-html2pdf :show-layout="false" :float-layout="true" :enable-download="true" :preview-modal="false"
            :paginate-elements-by-height="1400" :filename="name" :pdf-quality="2" :manual-pagination="false"
            pdf-format="a5" pdf-orientation="portrait" pdf-content-width="400px" ref="html2Pdf">
            <section slot="pdf-content" style="margin:30px;">
              <div class="text-center font-semibold text-xl mb-8">
                {{ $t('a1.a26') }}
              </div>
              <div class="modal2">
                <div class="texts">
                  <div class="result flex justify-center items-center flex-col mt-7">
                    <div class="icon">
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M30 0C13.41 0 0 13.41 0 30C0 46.59 13.41 60 30 60C46.59 60 60 46.59 60 30C60 13.41 46.59 0 30 0ZM42.9 42.9C42.6225 43.1781 42.2928 43.3988 41.9299 43.5493C41.567 43.6998 41.1779 43.7773 40.785 43.7773C40.3921 43.7773 40.003 43.6998 39.6401 43.5493C39.2772 43.3988 38.9475 43.1781 38.67 42.9L30 34.23L21.33 42.9C20.7691 43.4609 20.0083 43.7761 19.215 43.7761C18.4217 43.7761 17.6609 43.4609 17.1 42.9C16.5391 42.3391 16.2239 41.5783 16.2239 40.785C16.2239 40.3922 16.3013 40.0033 16.4516 39.6404C16.6019 39.2775 16.8223 38.9477 17.1 38.67L25.77 30L17.1 21.33C16.5391 20.7691 16.2239 20.0083 16.2239 19.215C16.2239 18.4217 16.5391 17.6609 17.1 17.1C17.6609 16.5391 18.4217 16.2239 19.215 16.2239C20.0083 16.2239 20.7691 16.5391 21.33 17.1L30 25.77L38.67 17.1C38.9477 16.8223 39.2775 16.6019 39.6404 16.4516C40.0033 16.3013 40.3922 16.2239 40.785 16.2239C41.1778 16.2239 41.5667 16.3013 41.9296 16.4516C42.2925 16.6019 42.6223 16.8223 42.9 17.1C43.1777 17.3777 43.3981 17.7075 43.5484 18.0704C43.6987 18.4333 43.7761 18.8222 43.7761 19.215C43.7761 19.6078 43.6987 19.9967 43.5484 20.3596C43.3981 20.7225 43.1777 21.0523 42.9 21.33L34.23 30L42.9 38.67C44.04 39.81 44.04 41.73 42.9 42.9Z"
                          fill="#FA3B35" />
                      </svg>

                    </div>
                    <div class="text-red-500 font-bold mt-2 mb-5">{{ data.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} UZS</div>
                  </div>

                  <div class="sender">
                    <h1>
                      {{ $t('debt_list.a34') }}
                    </h1>
                    <h3>{{ data.dname }}</h3>

                    <h1 class="mt-3 mb-1">{{ $t('a1.a26') }}</h1>
                    <h3>{{ data.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} UZS</h3>
                    <h1 class="mt-3 mb-1">{{ $t("debt_list.a37") }}</h1>
                    <h3>
                      <h3>
                        {{ dateFormat(data.created_at) }}

                        <h4 class="inline mr-10">{{ data.time }}</h4>
                      </h3>

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
import dateformat from "dateformat";
export default {
  name: null,
  props: {
    data: {
      type: Object,
      default: () => { },
    },
    openModal: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    if (this.$i18n.locale == 'uz') {
      this.name = `bekor_qilingan_to'lov_${this.data.id}`
    }
    if (this.$i18n.locale == 'kr') {
      this.name = `Бекор қилинган тўлов_${this.data.id}`
    }
    if (this.$i18n.locale == 'ru') {
      this.name = `Отмененный платеж ${this.data.id}`
    }
  },
  methods: {
    pdfDownload() {
      this.$refs.html2Pdf.generatePdf();
    },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
  },
};
</script>

<style></style>
