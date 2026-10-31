/**
 * wave C: shartnoma ro'yxati sahifalari (debt-list, credit-list, expired/_type, hisobot/_type, near-expiration/_type,
 * near-expiration-creditor-notification) uchun umumiy SCRIPT mantiq: sahifalash, ro'yxat + eksport so'rovi (api/contracts),
 * lokal qidiruv, XLSX eksport, modal ochish/yopish. Shablonlar sahifalarda qoladi (ular bir-biridan farq qiladi).
 *
 * Sahifa BERISHI KERAK:
 *   - `fetchContractPages(start, end)` -> `{ response, expResponse }` (api/contracts chaqiruvlari, tartib va config
 *     sahifadagidek: ro'yxat so'rovi `await` qilinadi, KEYIN eksport so'rovi).
 * Sahifa ixtiyoriy override qiladi (methods ichida, sahifa metodi mixin'nikidan ustun):
 *   - `onContractsStart()` — so'rovdan oldin (masalan `_isSearchActive = false`);
 *   - `onContractsLoaded(response)` — `act`/`pass` kabi qo'shimcha maydonlar (contracts/exportss/length'dan KEYIN chaqiriladi);
 *   - `onContractsError(error)` — xato toast'i (default: `errors.loadFailed`);
 *   - `contractExcelFileName(type)` — default `this.excelFileName` (computed);
 *   - `contractNameOf(item)` / `contractNameMatches(name, q)` — lokal qidiruv maydoni va moslash;
 *   - `getPartyFullName`, `getPartyUid`, `getPartyName` — shablonda ishlatiladigan juftlik yordamchilari.
 */
export default {
  data() {
    return {
      localSearchQuery: '',
      sortDate: null,
      sortModal: false,
      viewModal: false,
      page: 0,
      limit: 10,
      length: 0,
      contracts: [],
      exportss: null,
      viewData: null,
    };
  },

  computed: {
    contractType() {
      return this.$route.params.type || 'creditor';
    },
    isCreditor() {
      return this.contractType === 'creditor';
    },
    // Lokal qidiruv: exportss dan filtrlash (saqlangan foydalanuvchilardek)
    displayedContracts() {
      if (!this.localSearchQuery) {return this.contracts;}
      const q = this.localSearchQuery.toLowerCase();
      const qNum = q.replace(/\s/g, '');
      return (this.exportss || []).filter(item => {
        const name = this.contractNameOf(item);
        const number = (item.number || '').toString().toLowerCase();
        const amount = (item.amount || '').toString();
        return this.contractNameMatches(name, q) || number.includes(q) || amount.includes(qNum);
      }).map(item => ({
        ...item,
        cuid: item.cuid || item.creditor_uid,
        duid: item.duid || item.debitor_uid,
      }));
    },
    displayedLength() {
      if (!this.localSearchQuery) {return this.length;}
      return this.displayedContracts.length;
    },
  },

  methods: {
    // ---- qidiruv (sahifa override qilishi mumkin) ----
    contractNameOf(item) {
      return (item.creditor_name || item.debitor_name || '').toLowerCase();
    },
    contractNameMatches(name, q) {
      return this.$fioMatch(name, q); // FISh: asl + ko'rsatilgan (transliteratsiya) shakl
    },

    // ---- juftlik (kontragent) yordamchilari ----
    getPartyUid(item) {
      return this.isCreditor ? item.duid : item.cuid;
    },
    getPartyName(item) {
      return this.isCreditor ? item.debitor_name : item.creditor_name;
    },
    getPartyFullName(item) {
      if (this.isCreditor) {
        if (item.d_last_name && item.d_first_name) {
          return `${item.d_last_name} ${item.d_first_name} ${item.d_middle_name || ''}`.trim();
        }
        return item.debitor_name || '';
      }
      if (item.c_last_name && item.c_first_name) {
        return `${item.c_last_name} ${item.c_first_name} ${item.c_middle_name || ''}`.trim();
      }
      return item.creditor_name || '';
    },

    /** "Orqaga" — Qarz shartnomasi bo'limiga (contract-dashboard). */
    goSection() {
      this.$router.push(this.localePath({ name: 'contract-dashboard' })).catch(() => {});
    },

    // ---- modal / sana qidiruvi ----
    searchDateFunction() {
      this.getContracts();
      this.sortModal = false;
    },
    viewFullItem(item) {
      this.viewModal = true;
      this.viewData = item;
    },

    // ---- yuklash ----
    contractDateRange() {
      return this.sortDate && this.sortDate.length
        ? this.sortDate.map((d) => d || '0')
        : ['0', '0'];
    },
    async fetchContractPages() {
      throw new Error('contractListMixin: sahifa fetchContractPages(start, end) ni berishi kerak');
    },
    onContractsStart() {},
    onContractsLoaded() {},
    onContractsError() {
      this.$toast.error(this.$t('errors.loadFailed'));
    },
    async getContracts() {
      this.onContractsStart();
      const [start, end] = this.contractDateRange();
      try {
        const { response, expResponse } = await this.fetchContractPages(start, end);
        this.contracts = response.data;
        this.exportss = expResponse.data;
        this.onContractsLoaded(response);
        this.length = response.count;
      } catch (error) {
        this.onContractsError(error);
      }
    },

    // ---- sahifalash ----
    async setPage({ page, limit }) {
      this.page = page;
      this.limit = limit;
      await this.getContracts();
      window.scrollTo(0, 0);
    },
    pageChange(page) {
      this.page = page;
      this.getContracts();
    },

    // ---- XLSX eksport ----
    contractExcelFileName() {
      return this.excelFileName;
    },
    async exportExcel(type, fn, dl) {
      const XLSX = await import('xlsx'); // SS-PERF (2026-09-25): faqat tugma bosilganda yuklanadi
      // SS-DEV (2026-09-24) ILDIZ SABAB: xlsx 0.20.x `table_to_book` faqat <table>
      // elementini qabul qiladi (`table.rows` o'qiydi); ilgari o'rovchi <div>
      // (`tableToExcel`) berilardi — "Cannot read properties of undefined (reading
      // 'length')" bilan yiqilib, Excel yuklanmasdi. Endi jadvalning o'zi beriladi.
      const tableRef = this.$refs.exportable_table || this.$refs.tableToExcel;
      if (!tableRef) {return;}

      const workbook = XLSX.utils.table_to_book(tableRef, { sheet: 'Sheet JS' });

      if (dl) {
        return XLSX.write(workbook, {
          bookType: type,
          bookSST: true,
          type: 'base64',
        });
      }

      XLSX.writeFile(workbook, fn || this.contractExcelFileName(type));
    },
  },
};
