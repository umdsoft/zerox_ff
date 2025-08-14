<template>
  <div class="message" style="">
    <div class="card show">
      <div class="card_header flex">
        <svg @click="closeContractModal" style="margin: 1rem 30px 15px 0; cursor: pointer" class="h-6 w-6 text-black"
          width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
          stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>

      <div class="card_content px-8">
        <iframe :src="url" width="100%" height="540px" />
      </div>
      <div class="card__footer">
        <div class="market mt-1">
          <span><b>
              {{ $t('a1.a41') }}</b></span>
          <div class="market-box flex justify-between mb-8" style="align-items: center">
            <div class="appstore ml-2 cursor-pointer">
              <div class="flex items-center justify-center mt-6">
                <input @change="validate" class="w-4 h-4 mr-2" v-model="isAffirmed" type="checkbox" id="1" />
                <label for="1">
                  {{ $t('a1.a40') }}
                </label>
              </div>
            </div>
            <div>
              <button :disabled="isValidate" :class="isBtnDisabled ? 'bg-t_error' : 'bg-t_primary'"
                @click="editContract" class="text-white mt-2 text-center font-bold w-full py-3 px-8 rounded">
                {{ $t("process.accept") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "idenMessage",
  data: () => ({
    isAffirmed: false,
    isBtnDisabled: true,
    url: null,
  }),
  async mounted() {
    this.url = `https://pdf.zerox.uz/oferta.php?id=${this.$auth.user.uid}&lang=${this.$i18n.locale}&download=0`
  },
  methods: {
    validate() {
      if (this.isAffirmed) {
        this.isBtnDisabled = false;
      } else {
        this.isBtnDisabled = true;
      }
    },
    toIdentification() {
      this.removeIdenModal();
      this.$router.push(this.localePath({ name: 'identification' }));
    },
    async editContract() {
      try {
        if (this.isAffirmed) {
          const con = await this.$axios.put("/user/edit_contract");

          if (con.data.msg == 'is_contract_true') {
            this.$toast.error($nuxt.$t('a1.a102'));
          } else {
            this.$toast.success($nuxt.$t('a1.a43'));
          }

       //   2 soniya kutib reload qilish
          setTimeout(() => {
            window.location.reload();
          }, 2000);

        }
      } catch {
        this.$toast.error($nuxt.$t('a1.a42'));
      }
    },
    removeContractModal() {
      this.$emit("removeContractModal");
    },

    closeContractModal() {
      this.$emit("closeContractModal");
    }
  },
};
</script>

<style scoped>
.message {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  overflow-y: auto;
  box-sizing: border-box;
}

.card {
  background: white;
  width: 100%;
  max-width: 900px;
  max-height: 95vh;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  opacity: 1;
}

.card_header {
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem 1rem 0 0;
}

.card_content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0 1.5rem;
}

.card_content iframe {
  width: 100%;
  height: 60vh;
  border: none;
}

.card__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
}

.market-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

button {
  min-width: 180px;
}

@media (max-width: 600px) {
  .card_content iframe {
    height: 50vh;
  }

  .card__footer {
    padding: 1rem;
  }

  .market-box {
    flex-direction: column;
    align-items: stretch;
  }

  button {
    width: 100%;
  }
}
</style>
