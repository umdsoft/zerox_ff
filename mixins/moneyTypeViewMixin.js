/**
 * wave D: pages/money/_type/index.vue dan ajratilgan computed'lar.
 * Computed sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
export default {
  computed: {
    /**
     * Get transfer type from route params
     */
    transferType() {
      return this.$route.params.type || 'take';
    },

    /**
     * Check if this is take-money (qarz olish)
     */
    isTake() {
      return this.transferType === 'take';
    },

    /**
     * Page title based on type
     */
    pageTitle() {
      return this.isTake ? this.$t("process.take") : this.$t("home.give");
    },

    /**
     * Page subtitle based on type
     */
    pageSubtitle() {
      return this.isTake ? this.$t("money.take_subtitle") : this.$t("money.give_subtitle");
    },

    /**
     * Info text based on type
     */
    infoText() {
      return this.isTake ? this.$t('money.take_info') : this.$t('money.give_info');
    },

    /**
     * Get creditor user based on transfer type
     * Qarz beruvchi (kreditor) - pul beruvchi tomon
     * Qarz berish: men beraman -> men kreditor
     * Qarz olish: boshqa odam beradi -> u kreditor
     */
    creditorUser() {
      return this.isTake ? this.user : this.$auth.user;
    },

    /**
     * Get debitor user based on transfer type
     * Qarz oluvchi (debitor) - pul oluvchi tomon
     * Qarz berish: boshqa odam oladi -> u debitor
     * Qarz olish: men olaman -> men debitor
     */
    debitorUser() {
      return this.isTake ? this.$auth.user : this.user;
    },

    /**
     * Header gradient class based on type
     */
    headerGradient() {
      return this.isTake ? 'from-green-600 to-green-700' : 'from-blue-600 to-blue-700';
    },

    /**
     * Loader border color
     */
    loaderBorderColor() {
      return this.isTake ? 'border-green-500' : 'border-blue-500';
    },

    /**
     * Primary color class
     */
    primaryColor() {
      return this.isTake ? 'text-green-500' : 'text-blue-500';
    },

    /**
     * Info box background class
     */
    infoBgClass() {
      return this.isTake ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100';
    },

    /**
     * Info icon background class
     */
    infoIconBgClass() {
      return this.isTake ? 'bg-green-100' : 'bg-blue-100';
    },

    /**
     * Info icon color
     */
    infoIconColor() {
      return this.isTake ? 'text-green-600' : 'text-blue-600';
    },

    /**
     * Info title color
     */
    infoTitleColor() {
      return this.isTake ? 'text-green-800' : 'text-blue-800';
    },

    /**
     * Info text color
     */
    infoTextColor() {
      return this.isTake ? 'text-green-600' : 'text-blue-600';
    },

    /**
     * Active currency selection class
     */
    activeCurrencyClass() {
      return this.isTake ? 'border-green-500 bg-green-50 shadow-sm' : 'border-blue-500 bg-blue-50 shadow-sm';
    },

    /**
     * Active text class
     */
    activeTextClass() {
      return this.isTake ? 'text-green-700' : 'text-blue-700';
    },

    /**
     * Input focus class
     */
    inputFocusClass() {
      return this.isTake ? 'focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent';
    },

    /**
     * Checkbox color
     */
    checkboxColor() {
      return this.isTake ? 'text-green-600 focus:ring-green-500' : 'text-blue-600 focus:ring-blue-500';
    },

    /**
     * Link color
     */
    linkColor() {
      return this.isTake ? 'text-green-600 hover:text-green-700' : 'text-blue-600 hover:text-blue-700';
    },

    /**
     * Submit button class
     */
    submitButtonClass() {
      return this.isTake
        ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30'
        : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30';
    },

    /**
     * Form validation
     */
    isValidate() {
      return this.amount && this.currency && this.isAffirmed ? false : true;
    },
  },
};
