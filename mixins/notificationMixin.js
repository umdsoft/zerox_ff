/**
 * Notification Component Mixin
 * Barcha notification komponentlari uchun umumiy metodlar va funksiyalar
 */
import dateformat from "dateformat";
import { formatNumber } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
import { putSuccessById, postQismanQaytarishById, postToliqQaytarishById, putOkById } from '@/api/notifications';
import { contractRoleOf, contractActionError, ROLE_LENDER } from '@/utils/contractRole';
import { signAndSend, confirmReject, SIGN_PURPOSES, signErrorOf, signErrorText } from '@/utils/signFlow';

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
      // SS-DEV (2026-09-24): muhitga qarab index.php / index_test.php (plugins/pdf-url.js)
      return this.$pdfLink('index', { id: this.item.uid, lang: this.$apiLang(), download: 0 });
    },

    // Kreditor to'liq ismi
    creditorName() {
      if (this.item.ctypes == 1) {
        return this.item.ccopmany || this.item.ccompany;
      }
      return this.$fio(`${this.item.c_last_name} ${this.item.c_first_name} ${this.item.c_middle_name}`);
    },

    // Debitor to'liq ismi
    debitorName() {
      if (this.item.dtypes == 1) {
        return this.item.dcompany;
      }
      return this.$fio(`${this.item.d_last_name} ${this.item.d_first_name} ${this.item.d_middle_name}`);
    },

    // Foydalanuvchi debitormi
    isDebitor() {
      return this.item.debitor === this.item.reciver;
    },

    // Foydalanuvchi kreditormi
    isCreditor() {
      return this.item.creditor === this.item.reciver;
    },

    /**
     * 07.11: joriy foydalanuvchi shu bildirishnoma shartnomasida QARZ BERUVCHImi (`item.debitor`).
     * Qaytarish va muddat uzaytirish so'rovini faqat qarz beruvchi tasdiqlaydi/rad etadi (server 403 only-lender).
     */
    isCurrentUserLender() {
      const u = this.$auth && this.$auth.user;
      return !!u && contractRoleOf(this.item, u.id) === ROLE_LENDER;
    },

    /**
     * 07.11: yangi shartnomani faqat QARSHI tomon tasdiqlaydi — yaratuvchi (`contracts.sender`, inbox'da `csender`)
     * o'z shartnomasini tasdiqlay olmaydi (server 403 creator-cannot-approve). `csender` kelmasa — cheklanmaydi.
     */
    canDecideContract() {
      const u = this.$auth && this.$auth.user;
      if (!u) {return false;}
      const creator = this.item.csender;
      return !(creator != null && creator !== '' && String(creator) === String(u.id));
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
    formatMoney: formatNumber, // SS-AUDIT (2026-09-25): utils/helpers ("79000.00" -> "79 000")

    /**
     * Notification'ni o'qilgan deb belgilash
     * @param {number} id - Notification ID
     */
    async ok(id) {
      try {
        await putOkById(this.$axios, id, {}, { silent: true });
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
        // 07.11: tasdiqlash — elektron imzo (bir martalik kod); rad etish — kodsiz, tasdiqlash oynasi bilan
        const res = await this.sendSigned(status, {
          purpose: SIGN_PURPOSES.REPAYMENT_CONFIRM,
          docType: 'repayment_confirm_full',
          ctx: { contract: this.item.contract, act: this.item.act, notification: id },
          send: (sign) => postToliqQaytarishById(this.$axios, id, sign ? { ...data, sign } : data, { silent: true }),
        });
        if (!res) {return;}
        this.showStatusMessage(status);
        if (typeof this.getNotifications === 'function') {
          this.getNotifications(this.item.id || this.item._id);
        }
      } catch (e) {
        if (this.retryAfterOferta(e, () => this.fullReturn(id, status))) return; // 04.10: oferta oynasi
        if (this.handleActionError(e)) {return;} // 07.11: only-lender / already-processed / ...
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
        const res = await this.sendSigned(status, {
          purpose: SIGN_PURPOSES.REPAYMENT_CONFIRM,
          docType: Number(this.item.residual_amount) === 0 ? 'repayment_confirm_full' : 'repayment_confirm_partial',
          ctx: { contract: this.item.contract, act: this.item.act, notification: id },
          send: (sign) => postQismanQaytarishById(this.$axios, id, sign ? { ...data, sign } : data, { silent: true }),
        });
        if (!res) {return;}
        this.showStatusMessage(status);
        if (typeof this.getNotifications === 'function') {
          this.getNotifications(this.item.id || this.item._id);
        }
      } catch (e) {
        if (this.retryAfterOferta(e, () => this.partialReturn(id, status))) return; // 04.10: oferta oynasi
        if (this.handleActionError(e)) {return;} // 07.11: only-lender / already-processed / ...
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
      // SS-DEV (2026-10-04): kelgan shartnomani QABUL qilish (status 1) — oferta tasdiqlanmagan bo'lsa
      // oferta oynasi ochiladi, tasdiqlangach shu amal o'zi davom etadi. Rad etish (2) — ofertasiz.
      if (status === 1 && this.$oferta && !this.$oferta.require(() => this.confirmContract(id, status))) return;

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
        const response = await this.sendSigned(status, {
          purpose: SIGN_PURPOSES.CONTRACT_APPROVE,
          docType: 'contract_approve',
          ctx: { contract: this.item.contract, notification: id },
          summary: { amount: this.item.amount, endDate: this.item.end_date },
          send: (sign) => putSuccessById(this.$axios, id, sign ? { ...data, sign } : data, { silent: true }),
        });
        if (!response) {return;}
        // 07.11: 'not-con-suc' — boshqa so'rov allaqachon tasdiqlagan/rad etgan: aniq xabar + ro'yxat yangilanadi
        if (response.data && response.data.success === false && this.handleActionError(response.data)) {return;}
        this.showStatusMessage(status);
        if (typeof this.getNotifications === 'function') {
          this.getNotifications(this.item.id || this.item._id);
        }
      } catch (e) {
        // 04.10: backend 403 OFERTA_REQUIRED/OFFER_REQUIRED — oyna (axios) ochiq; tasdiqlangach qayta urinish
        if (this.retryAfterOferta(e, () => this.confirmContract(id, status))) return;
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
      // SS-DEV (2026-10-04): kelgan shartnomani QABUL qilish (status 1) — oferta tasdiqlanmagan bo'lsa
      // oferta oynasi ochiladi, tasdiqlangach shu amal o'zi davom etadi. Rad etish (2) — ofertasiz.
      if (status === 1 && this.$oferta && !this.$oferta.require(() => this.confirmContractAsDebitor(id, status))) return;

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
        const response = await this.sendSigned(status, {
          purpose: SIGN_PURPOSES.CONTRACT_APPROVE,
          docType: 'contract_approve',
          ctx: { contract: this.item.contract, notification: id },
          summary: { amount: this.item.amount, endDate: this.item.end_date },
          send: (sign) => putSuccessById(this.$axios, id, sign ? { ...data, sign } : data, { silent: true }),
        });
        if (!response) {return;}
        // 07.11: 'not-con-suc' — boshqa so'rov allaqachon tasdiqlagan/rad etgan: aniq xabar + ro'yxat yangilanadi
        if (response.data && response.data.success === false && this.handleActionError(response.data)) {return;}
        this.showStatusMessage(status);
        if (typeof this.getNotifications === 'function') {
          this.getNotifications(this.item.id || this.item._id);
        }
      } catch (e) {
        // 04.10: backend 403 OFERTA_REQUIRED/OFFER_REQUIRED — oyna (axios) ochiq; tasdiqlangach qayta urinish
        if (this.retryAfterOferta(e, () => this.confirmContractAsDebitor(id, status))) return;
        this.handleContractError(e, 'debitor');
      }
    },

    /**
     * 07.11 (imzolash spetsifikatsiyasi §4): imzo oynasidagi hujjat shartlari (bildirishnoma ma'lumotidan).
     * `item.debitor` — qarz beruvchi, `item.creditor` — qarz oluvchi.
     */
    signSummary(docType, extra = {}) {
      return {
        docType,
        number: this.item.number,
        lender: this.debitorName,
        borrower: this.creditorName,
        amount: this.item.refundable_amount != null && Number(this.item.refundable_amount) > 0 ? this.item.refundable_amount : this.item.amount,
        currency: this.item.currency,
        ...extra,
      };
    },

    /**
     * Tasdiqlash (status 1) — elektron imzo oynasi orqali `send({ challenge_id, code })`;
     * rad etish (status 2) — kodsiz, tasdiqlash oynasidan keyin `send()`.
     * @returns {Promise<any|null>} null — foydalanuvchi bekor qildi
     */
    async sendSigned(status, { purpose, docType, ctx = {}, summary = {}, send }) {
      if (Number(status) === 1) {
        return signAndSend(this, { purpose, ...ctx, summary: this.signSummary(docType, summary), submit: (sign) => send(sign) });
      }
      if (!(await confirmReject(this))) {return null;}
      return send(undefined);
    },

    /** Bildirishnomalar ro'yxatini yangilash (shu bildirishnoma ro'yxatdan darhol olib tashlanadi). */
    refreshNotifications() {
      if (typeof this.getNotifications === 'function') {
        this.getNotifications(this.item.id || this.item._id);
      }
    },

    /**
     * 07.11: server rol/holat xatosi (only-lender, already-processed, ...) — aniq lokallashtirilgan toast;
     * 409 / eskirgan bildirishnoma bo'lsa ro'yxat yangilanadi.
     * @returns {boolean} true — xato tanildi va ko'rsatildi
     */
    handleActionError(e) {
      const se = signErrorOf(e); // 07.11: imzo xatosi oynadan tashqarida kelsa (masalan 428 SIGN_REQUIRED)
      if (se) {
        this.$toast.error(signErrorText(se, this.$i18n && this.$i18n.locale));
        return true;
      }
      const r = contractActionError(e);
      if (!r) {return false;}
      this.$toast.error(this.$t(r.key));
      if (r.refresh) {this.refreshNotifications();}
      return true;
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
    /**
     * SS-DEV (2026-10-04): backend "oferta tasdiqlanmagan" (403) qaytardimi — oferta oynasi ochiladi
     * (plugins/axios.js), tasdiqlangach `retry` bajariladi. Xato toast'i chiqarilmaydi.
     * @returns {boolean} true — xato oferta bilan bog'liq va qayta ishlandi
     */
    retryAfterOferta(e, retry) {
      const res = e && e.response;
      const code = res && res.data && res.data.code;
      if (!res || res.status !== 403 || !['OFERTA_REQUIRED', 'OFFER_REQUIRED'].includes(code)) return false;
      if (this.$oferta) this.$oferta.open(retry);
      return true;
    },

    handleContractError(e, role) {
      // Backend javob qaytargan bo'lsa — uni tahlil qilamiz
      if (e?.response) {
        // 07.11: notification-type-mismatch / creator-cannot-approve / 409 ...
        if (this.handleActionError(e)) {return;}
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
          en: "The server is not responding. Please try again.", // SS-DEV (2026-09-26): en/kaa
          kaa: "Server juwap bermey atır. Qayta urınıp kóriń.",
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
