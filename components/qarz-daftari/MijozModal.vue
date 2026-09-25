<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style="z-index: 100"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4">
        {{ texts.title }}
      </h3>

      <form @submit.prevent="save" novalidate>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ texts.fishLabel }}
          </label>
          <input
            v-model="form.fish"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :placeholder="texts.fishPlaceholder"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ texts.telefonLabel }}
          </label>
          <input
            v-model="form.telefon"
            type="tel"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+998XXXXXXXXX"
          />
          <p v-if="telefonError" class="text-xs text-red-500 mt-1">{{ telefonError }}</p>
        </div>

        <!-- SS-DEV (2026-09-24), hujjat-4 9-band: telefon bo'yicha DUBLIKAT — backend 409
             `phone-exists` + `existing_id`. Yangi mijoz yaratilmaydi; mavjudini tanlash taklifi. -->
        <div v-if="existing" class="mb-4 rounded-lg border p-3" style="border-color:#FCD34D;background:#FFFBEB">
          <p class="text-sm font-semibold" style="color:#92400E">{{ texts.dupTitle }}</p>
          <p class="text-sm text-gray-800 mt-1">👤 <b>{{ existing.fish }}</b> <span class="text-gray-500">{{ existing.telefon }}</span></p>
          <p class="text-xs text-gray-500 mt-1">{{ texts.dupHint }}</p>
          <button type="button" class="mt-2 w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700" @click="useExisting">{{ texts.dupUse }}</button>
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            @click="$emit('close')"
          >
            {{ texts.cancel }}
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? texts.saving : texts.save }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MijozModal',
  props: {
    faoliyatId: {
      type: [Number, String],
      required: true,
    },
    mijoz: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        fish: this.mijoz ? this.mijoz.fish : '',
        // SS11 (2026-09-17): yangi mijoz uchun "+998" tayyor turadi (faqat 9 raqam kiritiladi)
        telefon: this.mijoz ? this.mijoz.telefon : '+998',
      },
      loading: false,
      existing: null, // SS-DEV (2026-09-24): 409 phone-exists → mavjud mijoz
    }
  },
  computed: {
    isEdit() {
      return !!this.mijoz
    },
    telefonError() {
      if (!this.form.telefon) return '';
      const cleaned = this.form.telefon.replace(/[\s\-()]/g, '');
      // SS11: faqat "+998" prefiksi qolgan bo'lsa — hali kiritilmagan, xato ko'rsatilmaydi
      if (cleaned === '+998' || cleaned === '') return '';
      if (cleaned && !/^\+998\d{9}$/.test(cleaned)) {
        return this.texts.telefonFormatError;
      }
      return '';
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: this.isEdit ? "Mijozni tahrirlash" : "Yangi mijoz qo'shish", fishLabel: "F.I.Sh", fishPlaceholder: "Familiya Ism Sharif", telefonLabel: "Telefon", telefonFormatError: "Telefon formati noto'g'ri (+998XXXXXXXXX)", fishRequired: "FISH kiritilishi shart", cancel: "Bekor qilish", save: "Saqlash", saving: "Saqlanmoqda...", dupTitle: "Bu telefon raqamli mijoz allaqachon mavjud", dupHint: "Yangi mijoz yaratilmaydi — mavjud mijozni tanlang yoki boshqa raqam kiriting.", dupUse: "Mavjud mijozni tanlash" },
        ru: { title: this.isEdit ? "Редактировать клиента" : "Добавить нового клиента", fishLabel: "Ф.И.О", fishPlaceholder: "Фамилия Имя Отчество", telefonLabel: "Телефон", telefonFormatError: "Неверный формат телефона (+998XXXXXXXXX)", fishRequired: "Необходимо ввести ФИО", cancel: "Отмена", save: "Сохранить", saving: "Сохранение...", dupTitle: "Клиент с этим номером уже существует", dupHint: "Новый клиент не создаётся — выберите существующего или введите другой номер.", dupUse: "Выбрать существующего клиента" },
        kr: { title: this.isEdit ? "Мижозни таҳрирлаш" : "Янги мижоз қўшиш", fishLabel: "Ф.И.Ш", fishPlaceholder: "Фамилия Исм Шариф", telefonLabel: "Телефон", telefonFormatError: "Телефон формати нотўғри (+998XXXXXXXXX)", fishRequired: "ФИШ киритилиши шарт", cancel: "Бекор қилиш", save: "Сақлаш", saving: "Сақланмоқда...", dupTitle: "Бу телефон рақамли мижоз аллақачон мавжуд", dupHint: "Янги мижоз яратилмайди — мавжуд мижозни танланг ёки бошқа рақам киритинг.", dupUse: "Мавжуд мижозни танлаш" },
        // SS-DEV (2026-09-26): en/kaa
        en: { title: this.isEdit ? "Edit customer" : "Add a new customer", fishLabel: "Full name", fishPlaceholder: "Last name First name Patronymic", telefonLabel: "Phone", telefonFormatError: "Invalid phone format (+998XXXXXXXXX)", fishRequired: "Full name is required", cancel: "Cancel", save: "Save", saving: "Saving...", dupTitle: "A customer with this phone number already exists", dupHint: "No new customer will be created — select the existing customer or enter a different number.", dupUse: "Select the existing customer" },
        kaa: { title: this.isEdit ? "Klientti ózgertiw" : "Jańa klient qosıw", fishLabel: "F.A.Á.", fishPlaceholder: "Familiyası Atı Ákesiniń atı", telefonLabel: "Telefon", telefonFormatError: "Telefon formatı nadurıs (+998XXXXXXXXX)", fishRequired: "F.A.Á. kiritiliwi shárt", cancel: "Biykar etiw", save: "Saqlaw", saving: "Saqlanbaqta...", dupTitle: "Bul telefon nomerli klient álle qashan bar", dupHint: "Jańa klient jaratılmaydı — bar klientti saylań yamasa basqa nomer kiritiń.", dupUse: "Bar klientti saylaw" },
      };
      return t[l] || t.uz;
    },
  },
  methods: {
    /** SS-DEV (2026-09-24): dublikat telefon — mavjud mijoz tanlanadi (sahifa qarz formasiga o'tadi) */
    useExisting() {
      if (!this.existing) return;
      this.$emit('saved', { id: this.existing.id, fish: this.existing.fish, telefon: this.existing.telefon, existing: true });
      this.$emit('close');
    },
    async save() {
      if (!this.form.fish || !this.form.fish.trim()) {
        this.$toast?.error(this.texts.fishRequired);
        return;
      }
      if (this.form.telefon) {
        this.form.telefon = this.form.telefon.replace(/[\s\-()]/g, '');
        // SS11: faqat "+998" prefiksi kiritilgan bo'lsa — telefonsiz saqlanadi
        if (this.form.telefon === '+998') this.form.telefon = '';
        if (this.form.telefon && this.telefonError) {
          this.$toast?.error(this.texts.telefonFormatError);
          return;
        }
      }

      this.loading = true
      try {
        let response
        if (this.isEdit) {
          response = await this.$axios.$put(
            `/qarz-daftari/mijozlar/${this.mijoz.id}`,
            this.form,
            { silent: true }
          )
        } else {
          response = await this.$axios.$post(
            `/qarz-daftari/savdo-faoliyat/${this.faoliyatId}/mijozlar`,
            this.form,
            { silent: true }
          )
        }
        this.$emit('saved', response?.data || response)
        this.$emit('close')
      } catch (e) {
        const status = e.response?.status;
        const code = e.response?.data?.code;
        // 409 — telefon raqam mavjud (phone-exists) → mavjud mijozni ko'rsatamiz (SS-DEV 2026-09-24)
        if (status === 409 || code === 'phone-exists') {
          const ex = e.response?.data?.existing_mijoz;
          const exId = e.response?.data?.existing_id || (ex && ex.id);
          if (exId) this.existing = { id: exId, fish: (ex && ex.fish) || '', telefon: (ex && ex.telefon) || this.form.telefon };
          this.$toast?.error(e.response?.data?.message || "Ushbu telefon raqamli mijoz allaqachon mavjud.");
        } else {
          this.$toast?.error(e.response?.data?.message || 'Xatolik yuz berdi');
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
