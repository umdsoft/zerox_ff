<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">{{ texts.title }}</h1>
        <p class="text-gray-500 text-sm mt-1">{{ texts.subtitle }}</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
        <form @submit.prevent="submit" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.phone }}</label>
            <input
              v-model="form.telefon"
              type="text"
              inputmode="tel"
              placeholder="+998901234567"
              class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @keydown.enter="submit"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.password }}</label>
            <div class="relative">
              <input
                v-model="form.parol"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="texts.passwordPlaceholder"
                class="w-full border border-gray-300 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @keydown.enter="submit"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 text-sm transition-colors disabled:opacity-50 inline-flex items-center justify-center"
          >
            <svg v-if="loading" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ loading ? texts.loading : texts.loginBtn }}
          </button>
        </form>

        <div class="mt-6 pt-5 border-t border-gray-100 text-center">
          <nuxt-link :to="localePath({ name: 'auth-login' })" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            {{ texts.ownerLogin }}
          </nuxt-link>
        </div>
      </div>

      <p class="text-center text-xs text-gray-400 mt-6">{{ texts.hint }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XodimLogin',
  auth: false,
  layout: 'empty',
  data() {
    return {
      form: { telefon: '', parol: '' },
      showPassword: false,
      loading: false,
    };
  },
  computed: {
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: 'Xodim kirishi',
          subtitle: 'Do\'kon qarz daftarini yuritish uchun kiring',
          phone: 'Telefon raqami',
          password: 'Parol',
          passwordPlaceholder: 'Parolingizni kiriting',
          loginBtn: 'Kirish',
          loading: 'Kirilmoqda...',
          ownerLogin: 'Do\'kon egasi sifatida kirish',
          hint: 'Birinchi loginda parolingizni o\'zingiz tanlaysiz — keyingi safar shu parol bilan kiravering.',
          errInvalid: 'Telefon yoki parol noto\'g\'ri',
          errDisabled: 'Login bloklangan. Do\'kon egasiga murojaat qiling.',
          errFields: 'Telefon va parolni kiriting',
        },
        ru: {
          title: 'Вход сотрудника',
          subtitle: 'Войдите для ведения книги долгов магазина',
          phone: 'Номер телефона',
          password: 'Пароль',
          passwordPlaceholder: 'Введите пароль',
          loginBtn: 'Войти',
          loading: 'Вход...',
          ownerLogin: 'Войти как владелец магазина',
          hint: 'При первом входе вы сами задаёте пароль — далее входите с тем же паролем.',
          errInvalid: 'Неверный телефон или пароль',
          errDisabled: 'Вход заблокирован. Обратитесь к владельцу магазина.',
          errFields: 'Введите телефон и пароль',
        },
        kr: {
          title: 'Ходим кириши',
          subtitle: 'Дўкон қарз дафтарини юритиш учун киринг',
          phone: 'Телефон рақами',
          password: 'Парол',
          passwordPlaceholder: 'Паролингизни киритинг',
          loginBtn: 'Кириш',
          loading: 'Кирилмоқда...',
          ownerLogin: 'Дўкон эгаси сифатида кириш',
          hint: 'Биринчи логинда паролингизни ўзингиз танлайсиз — кейинги сафар шу парол билан киринг.',
          errInvalid: 'Телефон ёки парол нотўғри',
          errDisabled: 'Логин блокланган. Дўкон эгасига мурожаат қилинг.',
          errFields: 'Телефон ва паролни киритинг',
        },
      };
      return t[l] || t.uz;
    },
  },
  methods: {
    async submit() {
      if (this.loading) return;
      const telefon = (this.form.telefon || '').replace(/\s+/g, '');
      const parol = this.form.parol || '';
      if (!telefon || !parol) {
        this.$toast?.error(this.texts.errFields);
        return;
      }
      this.loading = true;
      try {
        const res = await this.$axios.post('/qarz-daftari/xodim/login', { telefon, parol }, { silent: true });
        const data = res?.data;
        if (data?.success && data.token) {
          // Tokenni $auth ga o'rnatamiz (localStorage'da saqlanadi → reload'da tiklanadi)
          if (this.$auth?.setUserToken) {
            await this.$auth.setUserToken(data.token);
          }
          // Xodim sessiyasi bayrog'i — axios 401 interceptori va shell shu orqali
          // xodimni tan oladi (egasining sahifalariga emas, xodim login'ga qaytaradi)
          try {
            localStorage.setItem('zx_xodim_session', '1');
            // Egasidan qolgan keshlangan ma'lumotlarni tozalaymiz (PII ko'rinmasin)
            localStorage.removeItem('user_balance');
            localStorage.removeItem('user_notifications');
          } catch (_) {}

          // To'liq sahifa navigatsiyasi — SPA loggedIn-watcher redirect poygasini
          // chetlab o'tadi va normal reload yo'lini (/user/me xodim DTO) ishga
          // tushiradi. Shu sababli identifikatsiya barqaror va egasi PII oqmaydi.
          const target = this.localePath({ name: 'qarz-daftari' });
          window.location.assign(target);
        } else {
          this.$toast?.error(data?.message || this.texts.errInvalid);
          this.loading = false;
        }
      } catch (e) {
        const code = e.response?.data?.code;
        if (code === 'login-disabled') this.$toast?.error(this.texts.errDisabled);
        else if (code === 'missing-fields') this.$toast?.error(this.texts.errFields);
        else if (code === 'too-many-attempts') this.$toast?.error(e.response?.data?.message || this.texts.errInvalid);
        else this.$toast?.error(e.response?.data?.message || this.texts.errInvalid);
        this.loading = false;
      }
    },
  },
};
</script>
