<template>
  <div>
    <ZModal v-if="openModal" :width="520" @closeModal="$emit('closeModal')">
      <template #modal_body v-if="data">
        <div class="text-center font-semibold text-xl mb-8">
          {{ data.number }} - {{ $t("debt_list.sonli") }}
        </div>

        44

        <button @click="pdfDownload">PDF</button>

        <div class="pdf-content">
          <vue-html2pdf
            :show-layout="false"
            :float-layout="true"
            :enable-download="true"
            :preview-modal="false"
            :paginate-elements-by-height="1400"
            filename="hee hee"
            :pdf-quality="2"
            :manual-pagination="false"
            pdf-format="a4"
            pdf-orientation="landscape"
            pdf-content-width="800px"
            ref="html2Pdf"
          >
            <section slot="pdf-content">
              <h1>Bu PDF content</h1>
            </section>
          </vue-html2pdf>
        </div>
      </template>
    </ZModal>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    openModal: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    pdfDownload() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
};
</script>

<style></style>
