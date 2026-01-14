/**
 * Telegram WebApp Plugin
 * Telegram Mini App integratsiyasi
 */

export default ({ app, store, $axios }, inject) => {
  // Telegram WebApp ob'ekti
  const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;

  const telegram = {
    // WebApp mavjudmi?
    isAvailable: !!tg,

    // WebApp ob'ekti
    webApp: tg,

    // Foydalanuvchi ma'lumotlari
    get user() {
      return tg?.initDataUnsafe?.user || null;
    },

    // initData (autentifikatsiya uchun)
    get initData() {
      return tg?.initData || null;
    },

    // Platform (ios, android, web, etc.)
    get platform() {
      return tg?.platform || 'unknown';
    },

    // Tema rangi
    get colorScheme() {
      return tg?.colorScheme || 'light';
    },

    // Tema ranglari
    get themeParams() {
      return tg?.themeParams || {};
    },

    // WebApp tayyor ekanligini bildirish
    ready() {
      if (tg) {
        tg.ready();
        tg.expand(); // To'liq ekran
      }
    },

    // Back button ko'rsatish/yashirish
    showBackButton(show = true) {
      if (tg?.BackButton) {
        if (show) {
          tg.BackButton.show();
        } else {
          tg.BackButton.hide();
        }
      }
    },

    // Back button callback
    onBackButton(callback) {
      if (tg?.BackButton) {
        tg.BackButton.onClick(callback);
      }
    },

    // Main button sozlash
    setMainButton(text, callback, options = {}) {
      if (tg?.MainButton) {
        tg.MainButton.text = text;
        tg.MainButton.onClick(callback);

        if (options.color) {
          tg.MainButton.color = options.color;
        }
        if (options.textColor) {
          tg.MainButton.textColor = options.textColor;
        }

        tg.MainButton.show();
      }
    },

    // Main button yashirish
    hideMainButton() {
      if (tg?.MainButton) {
        tg.MainButton.hide();
      }
    },

    // Haptic feedback
    hapticFeedback(type = 'impact') {
      if (tg?.HapticFeedback) {
        switch (type) {
          case 'impact':
            tg.HapticFeedback.impactOccurred('medium');
            break;
          case 'notification':
            tg.HapticFeedback.notificationOccurred('success');
            break;
          case 'selection':
            tg.HapticFeedback.selectionChanged();
            break;
        }
      }
    },

    // Alert ko'rsatish
    showAlert(message) {
      if (tg) {
        tg.showAlert(message);
      } else {
        alert(message);
      }
    },

    // Confirm dialog
    showConfirm(message, callback) {
      if (tg) {
        tg.showConfirm(message, callback);
      } else {
        const result = confirm(message);
        if (callback) callback(result);
      }
    },

    // Popup ko'rsatish
    showPopup(params, callback) {
      if (tg) {
        tg.showPopup(params, callback);
      }
    },

    // Ma'lumotlarni botga yuborish va yopish
    sendData(data) {
      if (tg) {
        tg.sendData(JSON.stringify(data));
      }
    },

    // WebApp ni yopish
    close() {
      if (tg) {
        tg.close();
      }
    },

    // Linkni tashqi brauzerda ochish
    openLink(url, options = {}) {
      if (tg) {
        tg.openLink(url, options);
      } else {
        window.open(url, '_blank');
      }
    },

    // Telegram linkni ochish
    openTelegramLink(url) {
      if (tg) {
        tg.openTelegramLink(url);
      }
    },

    // Cloud storage
    cloudStorage: {
      async setItem(key, value) {
        return new Promise((resolve, reject) => {
          if (tg?.CloudStorage) {
            tg.CloudStorage.setItem(key, value, (err, success) => {
              if (err) reject(err);
              else resolve(success);
            });
          } else {
            localStorage.setItem(`tg_${key}`, value);
            resolve(true);
          }
        });
      },

      async getItem(key) {
        return new Promise((resolve, reject) => {
          if (tg?.CloudStorage) {
            tg.CloudStorage.getItem(key, (err, value) => {
              if (err) reject(err);
              else resolve(value);
            });
          } else {
            resolve(localStorage.getItem(`tg_${key}`));
          }
        });
      },

      async removeItem(key) {
        return new Promise((resolve, reject) => {
          if (tg?.CloudStorage) {
            tg.CloudStorage.removeItem(key, (err, success) => {
              if (err) reject(err);
              else resolve(success);
            });
          } else {
            localStorage.removeItem(`tg_${key}`);
            resolve(true);
          }
        });
      }
    },

    // Autentifikatsiya
    async authenticate() {
      if (!this.initData) {
        throw new Error('Telegram WebApp ma\'lumotlari topilmadi');
      }

      try {
        const response = await $axios.post('/telegram/auth', {
          initData: this.initData
        });

        if (response.data.success) {
          const { token, refreshToken, user, needsPhone } = response.data.data;

          // Tokenlarni saqlash
          if (token) {
            localStorage.setItem('token', token);
            $axios.setToken(token, 'Bearer');
          }

          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }

          return {
            user,
            needsPhone,
            token
          };
        }

        throw new Error(response.data.message || 'Autentifikatsiya xatosi');
      } catch (error) {
        console.error('Telegram auth error:', error);
        throw error;
      }
    }
  };

  // Global qilish
  inject('telegram', telegram);

  // Agar Telegram WebApp ichida bo'lsak, tayyor signalini yuborish
  if (telegram.isAvailable) {
    telegram.ready();

    // Tema o'zgarishini kuzatish
    if (tg) {
      tg.onEvent('themeChanged', () => {
        // Tema o'zgarganda event emit qilish
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('telegram-theme-changed', {
            detail: telegram.themeParams
          }));
        }
      });
    }
  }
};
