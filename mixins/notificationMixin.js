/**
 * Notification Component Mixin
 * Barcha notification komponentlari uchun umumiy metodlar va funksiyalar
 */
import dateformat from "dateformat";

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    getNotifications: {
      type: Function,
      required: false,
      default: () => {}
    }
  },

  computed: {
    // PDF URL yaratish
    pdfUrl() {
      return `https://pdf.zerox.uz/index.php?id=${this.item.uid}&lang=${this.$i18n.locale}&download=0`;
    },

    // Kreditor to'liq ismi
    creditorName() {
      if (this.item.ctypes == 1) {
        return this.item.ccopmany || this.item.ccompany;
      }
      return `${this.item.c_last_name} ${this.item.c_first_name} ${this.item.c_middle_name}`;
    },

    // Debitor to'liq ismi
    debitorName() {
      if (this.item.dtypes == 1) {
        return this.item.dcompany;
      }
      return `${this.item.d_last_name} ${this.item.d_first_name} ${this.item.d_middle_name}`;
    },

    // Foydalanuvchi debitormi
    isDebitor() {
      return this.item.debitor === this.item.reciver;
    },

    // Foydalanuvchi kreditormi
    isCreditor() {
      return this.item.creditor === this.item.reciver;
    },

    // Summani formatlash
    formattedAmount() {
      return this.formatMoney(this.item.amount);
    },

    // Qoldiq summani formatlash
    formattedResidualAmount() {
      return this.formatMoney(this.item.residual_amount);
    },

    // Qaytarilayotgan summani formatlash
    formattedRefundableAmount() {
      return this.formatMoney(this.item.refundable_amount);
    },

    // Token (xizmat haqi) summani formatlash
    formattedToken() {
      return this.item.token ? this.formatMoney(this.item.token) : null;
    },

    // Vaqtni formatlash
    formattedTime() {
      return `${this.item.created} ${this.item?.time?.slice(0, 5) || ''}`;
    }
  },

  methods: {
    /**
     * Sanani formatlash
     * @param {string|Date} date - Sana
     * @returns {string} - Formatlangan sana (dd.mm.yyyy)
     */
    dateFormat(date) {
      if (!date) return '';
      const formatted = dateformat(date, "isoDate");
      return formatted.split("-").reverse().join(".");
    },

    /**
     * Pulni formatlash (ming ajratgich bilan)
     * @param {number|string} amount - Summa
     * @returns {string} - Formatlangan summa
     */
    formatMoney(amount) {
      if (amount === null || amount === undefined) return '0';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },

    /**
     * Notification'ni o'qilgan deb belgilash
     * @param {number} id - Notification ID
     */
    async ok(id) {
      try {
        await this.$axios.$put(`/notification/ok/${id}`, {}, { silent: true });
        this.$toast.success(this.$t('messages.success'));
        if (typeof this.getNotifications === 'function') {
          this.getNotifications(this.item.id || this.item._id);
        }
      } catch (err) {
        this.$toast.error(this.$t('messages.error_occurred'));
      }
    },

    /**
     * Qarzni to'liq qaytarish
     * @param {number} id - Notification ID
     * @param {number} status - Status (1 - qabul, 2 - rad)
     */
    async fullReturn(id, status) {
      const data = {
        debitor: this.item.debitor,
        creditor: this.item.creditor,
        act: this.item.act,
        contract: this.item.contract,
        stype: status,
        reciver: this.item.reciver == this.item.debitor
          ? this.item.creditor
          : this.item.debitor,
      };

      try {
        await this.$axios.post(`/notification/toliq-qaytarish/${id}`, data, { silent: true });
        this.showStatusMessage(status);
        if (typeof this.getNotifications === 'function') {
          this.getNotifications(this.item.id || this.item._id);
        }
      } catch (e) {
        this.$toast.error(this.$t('messages.error_occurred'));
      }
    },

    /**
     * Qarzni qisman qaytarish
     * @param {number} id - Notification ID
     * @param {number} status - Status (1 - qabul, 2 - rad)
     */
    async partialReturn(id, status) {
      const data = {
        debitor: this.item.debitor,
        creditor: this.item.creditor,
        contract: this.item.contract,
        act: this.item.act,
        stype: status,
        reciver: this.item.reciver == this.item.debitor
          ? this.item.creditor
          : this.item.debitor,
      };

      try {
        await this.$axios.post(`/notification/qisman-qaytarish/${id}`, data, { silent: true });
        this.showStatusMessage(status);
        if (typeof this.getNotifications === 'function') {
          this.getNotifications(this.item.id || this.item._id);
        }
      } catch (e) {
        this.$toast.error(this.$t('messages.error_occurred'));
      }
    },

    /**
     * Shartnomani tasdiqlash (kreditor)
     * @param {number} id - Notification ID
     * @param {number} status - Status (1 - qabul, 2 - rad)
     */
    async confirmContract(id, status) {
      if (this.isUserIdExpired()) {
        return this.$toast.error(this.$t('errors.id_expired'));
      }

      const data = {
        debitor: this.item.debitor,
        creditor: this.item.creditor,
        act: this.item.act,
        contract: this.item.contract,
        stype: status,
        reciver: this.item.debitor,
        sender: this.$auth.user.id == this.item.creditor
          ? this.item.debitor
          : this.item.creditor,
        res: this.$auth.user.id,
      };

      try {
        const response = await this.$axios.put(`/notification/success/${id}`, data, { silent: true });
        if (response.data.success === false && response.data.msg === 'not-con-suc') {
          return this.$toast.error(this.$t('messages.error_occurred'));
        }
        this.showStatusMessage(status);
        if (typeof this.getNotifications === 'function') {
          this.getNotifications(this.item.id || this.item._id);
        }
      } catch (e) {
        this.handleContractError(e, 'creditor');
      }
    },

    /**
     * Shartnomani tasdiqlash (debitor)
     * @param {number} id - Notification ID
     * @param {number} status - Status (1 - qabul, 2 - rad)
     */
    async confirmContractAsDebitor(id, status) {
      if (this.isUserIdExpired()) {
        return this.$toast.error(this.$t('errors.id_expired'));
      }

      const data = {
        debitor: this.item.debitor,
        creditor: this.item.creditor,
        act: this.item.act,
        contract: this.item.contract,
        stype: status,
        reciver: this.item.creditor,
        sender: this.$auth.user.id == this.item.debitor
          ? this.item.creditor
          : this.item.debitor,
        res: this.$auth.user.id,
      };

      try {
        const response = await this.$axios.put(`/notification/success/${id}`, data, { silent: true });
        if (response.data.success === false && response.data.msg === 'not-con-suc') {
          return this.$toast.error(this.$t('messages.error_occurred'));
        }
        this.showStatusMessage(status);
        if (typeof this.getNotifications === 'function') {
          this.getNotifications(this.item.id || this.item._id);
        }
      } catch (e) {
        this.handleContractError(e, 'debitor');
      }
    },

    /**
     * Status bo'yicha xabar ko'rsatish
     * @param {number} status - Status (1 - qabul, 2 - rad)
     */
    showStatusMessage(status) {
      if (status === 1) {
        this.$toast.success(this.$t('request.confirmed'));
      } else if (status === 2) {
        this.$toast.success(this.$t('home.rejected'));
      }
    },

    /**
     * Shartnoma tasdiqlash xatolarini to'g'ri qayta ishlash
     * @param {Error} e - Xatolik
     * @param {string} role - 'creditor' yoki 'debitor'
     */
    handleContractError(e, role) {
      // Backend javob qaytargan bo'lsa — uni tahlil qilamiz
      if (e?.response) {
        const msg = e.response.data?.msg;
        const message = e.response.data?.message || e.response.data?.err;

        if (msg === 'deb_expiry_date' || msg === 'cred_expiry_date') {
          return this.$toast.error(this.$t('errors.id_expired'));
        }
        if (msg === 'not-con-suc') {
          return this.$toast.error(this.$t('messages.error_occurred'));
        }
        if (e.response.data?.err === 'You have not enough money') {
          return this.$toast.error(role === 'creditor'
            ? this.$t('mobil.insufficient')
            : this.$t('errors.receiver_insufficient'));
        }
        if (message) {
          return this.$toast.error(typeof message === 'string' ? message : this.$t('messages.error_occurred'));
        }
        return this.$toast.error(this.$t('messages.error_occurred'));
      }

      // Javob kelmagan — timeout yoki network xatosi
      if (e?.code === 'ECONNABORTED') {
        const msgs = {
          uz: "Server javob bermayapti. Qayta urinib ko'ring.",
          ru: 'Сервер не отвечает. Попробуйте снова.',
          kr: 'Сервер жавоб бермаяпти. Қайта уриниб кўринг.',
        };
        return this.$toast.error(msgs[this.$i18n?.locale] || msgs.uz);
      }

      // Boshqa noma'lum xatolik
      this.$toast.error(this.$t('messages.error_occurred'));
    },

    /**
     * Foydalanuvchi ID muddati o'tganmi tekshirish
     * @returns {boolean}
     */
    isUserIdExpired() {
      return this.$auth.user.expiry_date &&
             new Date(this.$auth.user.expiry_date) < new Date();
    }
  }
};
