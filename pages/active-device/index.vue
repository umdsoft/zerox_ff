<template>
  <div class="ad-page">
    <div class="ad-container">
      <!-- Header -->
      <div class="ad-header">
        <h1 class="ad-title">{{ $t('page_labels.devices_title') }}</h1>
        <p class="ad-subtitle">{{ $t('page_labels.devices_subtitle') }}</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="ad-loading">
        <div class="ad-spinner"></div>
      </div>

      <template v-else>
        <!-- This device -->
        <div v-if="currentDevice" class="ad-section">
          <h2 class="ad-section-title">{{ $t('page_labels.this_device') }}</h2>
          <div class="ad-card ad-card-current">
            <div class="ad-icon-box ad-icon-current">
              <component :is="deviceType(currentDevice) === 'mobile' ? 'PhoneIcon' : 'PcIcon'" />
            </div>
            <div class="ad-card-body">
              <div class="ad-device-row">
                <span class="ad-device-name">{{ deviceName(currentDevice) }}</span>
                <span class="ad-badge-current">
                  <span class="ad-dot"></span>
                  {{ $t('page_labels.this_device') }}
                </span>
              </div>
              <p class="ad-line">{{ platformLabel(currentDevice) }}</p>
              <p class="ad-line ad-muted" v-if="currentDevice.ip_address">IP: {{ currentDevice.ip_address }}</p>
              <p class="ad-line ad-muted" v-if="currentDevice.location">{{ currentDevice.location }}</p>
            </div>
          </div>

          <!-- Terminate all others -->
          <div v-if="devices.length > 1" class="ad-terminate-all">
            <button type="button" class="ad-btn-danger" @click="revokeOthers">
              {{ $t('page_labels.terminate_others') }}
            </button>
            <p class="ad-hint">{{ $t('page_labels.terminate_others_hint') }}</p>
          </div>
        </div>

        <!-- Other devices -->
        <div class="ad-section">
          <h2 class="ad-section-title">{{ $t('page_labels.other_devices') }}</h2>

          <div v-if="otherDevices.length" class="ad-list">
            <div
              v-for="(item, i) in otherDevices"
              :key="item.id || i"
              class="ad-card ad-card-other"
            >
              <div class="ad-icon-box ad-icon-other">
                <component :is="deviceType(item) === 'mobile' ? 'PhoneIcon' : 'PcIcon'" />
              </div>
              <div class="ad-card-body">
                <span class="ad-device-name">{{ deviceName(item) }}</span>
                <p class="ad-line ad-muted" v-if="item.ip_address">IP: {{ item.ip_address }}</p>
                <p class="ad-line ad-muted" v-if="item.location">{{ item.location }}</p>
                <p class="ad-line ad-muted">
                  {{ $t('page_labels.last_active') }}: {{ formatDateTime(item.last_time || item.created_at) }}
                </p>
              </div>
              <button
                type="button"
                class="ad-btn-x"
                :title="$t('page_labels.terminate')"
                @click="revokeOne(item)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="ad-empty">
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.6" />
              <path d="M8 20H16M12 16V20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
            <p>{{ $t('page_labels.no_other_devices') }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// Inline SVG icon components (Tailwind v2 safe, no arbitrary classes)
const PcIcon = {
  render(h) {
    return h(
      'svg',
      {
        attrs: {
          width: '26',
          height: '26',
          viewBox: '0 0 24 24',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
      },
      [
        h('rect', {
          attrs: {
            x: '3',
            y: '4',
            width: '18',
            height: '12',
            rx: '2',
            stroke: 'currentColor',
            'stroke-width': '1.7',
          },
        }),
        h('path', {
          attrs: {
            d: 'M8 20H16M12 16V20',
            stroke: 'currentColor',
            'stroke-width': '1.7',
            'stroke-linecap': 'round',
          },
        }),
      ]
    );
  },
};

const PhoneIcon = {
  render(h) {
    return h(
      'svg',
      {
        attrs: {
          width: '26',
          height: '26',
          viewBox: '0 0 24 24',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
      },
      [
        h('rect', {
          attrs: {
            x: '6',
            y: '2',
            width: '12',
            height: '20',
            rx: '3',
            stroke: 'currentColor',
            'stroke-width': '1.7',
          },
        }),
        h('path', {
          attrs: {
            d: 'M10 18H14',
            stroke: 'currentColor',
            'stroke-width': '1.7',
            'stroke-linecap': 'round',
          },
        }),
      ]
    );
  },
};

export default {
  components: { PcIcon, PhoneIcon },
  data: () => ({
    devices: [],
    loading: true,
    myDeviceId: '',
    geo: { ip: null, location: null },
  }),
  computed: {
    currentDevice() {
      return this.devices.find((d) => d.device_id === this.myDeviceId) || null;
    },
    otherDevices() {
      return this.devices.filter((d) => d.device_id !== this.myDeviceId);
    },
  },
  methods: {
    // ---- Persistent browser device id ----
    initDeviceId() {
      let id = '';
      try {
        id = localStorage.getItem('zx_device_id') || '';
      } catch (e) {
        id = '';
      }
      if (!id) {
        id =
          (window.crypto &&
            typeof window.crypto.randomUUID === 'function' &&
            window.crypto.randomUUID()) ||
          this.fallbackUuid();
        try {
          localStorage.setItem('zx_device_id', id);
        } catch (e) {
          // storage unavailable; keep in-memory id for this visit
        }
      }
      this.myDeviceId = id;
    },
    fallbackUuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    // ---- This browser parsing (for registration) ----
    parseThisBrowser() {
      const ua =
        (typeof navigator !== 'undefined' && navigator.userAgent) || '';
      const browser = this.browserFromUa(ua);
      const os = this.osFromUa(ua);
      let name;
      if (browser && os) name = `${browser} (${os})`;
      else if (browser) name = browser;
      else if (os) name = os;
      else name = 'Web';
      return {
        device_name: name,
        os_type: os || 'Web',
        system_version: this.browserVersion(ua, browser),
      };
    },
    // ---- Row helpers (active_device row) ----
    deviceName(row) {
      if (row && row.device_name) return row.device_name;
      const os = (row && row.os_type) || '';
      const ver = (row && row.system_version) || '';
      if (os && ver) return `${os} ${ver}`;
      if (os) return os;
      if (ver) return ver;
      return 'ZeroX qurilma';
    },
    isBrowserRow(row) {
      const name = ((row && row.device_name) || '').toLowerCase();
      return (
        /chrome|safari|firefox|edge|opera|internet explorer/.test(name) ||
        name.indexOf('(') !== -1
      );
    },
    deviceType(row) {
      const os = ((row && row.os_type) || '').toLowerCase();
      const name = ((row && row.device_name) || '').toLowerCase();
      if (os === 'android' || os === 'ios') return 'mobile';
      if (
        name.indexOf('android') !== -1 ||
        name.indexOf('iphone') !== -1 ||
        name.indexOf('ipad') !== -1 ||
        name.indexOf('ipod') !== -1 ||
        name.indexOf('mobile') !== -1
      ) {
        return 'mobile';
      }
      return 'pc';
    },
    platformLabel(row) {
      // Browser device_name (has a browser name or "(OS)") => web; else native app.
      return this.isBrowserRow(row) ? 'ZeroX Web' : 'ZeroX ilova';
    },
    browserFromUa(ua) {
      const s = ua || '';
      // Order matters: Edge/Opera masquerade as Chrome.
      if (/Edg(e|A|iOS)?\//i.test(s)) return 'Edge';
      if (/OPR\/|Opera/i.test(s)) return 'Opera';
      if (/Firefox\/|FxiOS/i.test(s)) return 'Firefox';
      if (/Chrome\/|CriOS/i.test(s)) return 'Chrome';
      if (/Safari\//i.test(s) && /Version\//i.test(s)) return 'Safari';
      if (/MSIE|Trident/i.test(s)) return 'Internet Explorer';
      return '';
    },
    osFromUa(ua) {
      const s = ua || '';
      if (/Windows/i.test(s)) return 'Windows';
      if (/Android/i.test(s)) return 'Android';
      if (/iPhone|iPad|iPod|iOS/i.test(s)) return 'iOS';
      if (/Mac OS X|Macintosh/i.test(s)) return 'macOS';
      if (/Linux/i.test(s)) return 'Linux';
      return '';
    },
    browserVersion(ua, browser) {
      const s = ua || '';
      let m = null;
      if (browser === 'Edge') m = s.match(/Edg(?:e|A|iOS)?\/([\d.]+)/i);
      else if (browser === 'Opera') m = s.match(/(?:OPR|Opera)\/([\d.]+)/i);
      else if (browser === 'Firefox') m = s.match(/(?:Firefox|FxiOS)\/([\d.]+)/i);
      else if (browser === 'Chrome') m = s.match(/(?:Chrome|CriOS)\/([\d.]+)/i);
      else if (browser === 'Safari') m = s.match(/Version\/([\d.]+)/i);
      else if (browser === 'Internet Explorer')
        m = s.match(/(?:MSIE |rv:)([\d.]+)/i);
      return (m && m[1]) || '';
    },
    // ---- Formatting ----
    formatDateTime(v) {
      if (!v) return '';
      const d = new Date(v);
      if (isNaN(d.getTime())) return '';
      const pad = (n) => (n < 10 ? '0' + n : '' + n);
      const day = pad(d.getDate());
      const month = pad(d.getMonth() + 1);
      const year = d.getFullYear();
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      return `${day}.${month}.${year} ${hh}:${mm}`;
    },
    // ---- Geo / IP (this browser only) ----
    async loadGeo() {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data) {
          this.geo.ip = data.ip || null;
          const loc = [data.city, data.country_name].filter(Boolean).join(', ');
          this.geo.location = loc || null;
        }
      } catch (e) {
        // best-effort; leave ip/location null on failure
      }
    },
    // ---- Data (active_device endpoints) ----
    async fetchDevices() {
      try {
        const res = await this.$axios.$get('/user/devices');
        this.devices = (res && res.data) || [];
      } catch (e) {
        this.$toast.error(this.$t('a1.a42'));
      }
    },
    async registerThisDevice() {
      try {
        const res = await this.$axios.$get('/user/devices');
        const list = (res && res.data) || [];
        const exists = list.some((d) => d.device_id === this.myDeviceId);
        if (exists) {
          // Already registered; do not create a duplicate.
          this.devices = list;
          return;
        }
        const info = this.parseThisBrowser();
        await this.$axios.$post('/user/active-device', {
          device_id: this.myDeviceId,
          device_name: info.device_name,
          os_type: info.os_type,
          system_version: info.system_version,
          ip_address: this.geo.ip,
          active: 1,
          last_time: new Date().toISOString(),
          location: this.geo.location,
        });
        await this.fetchDevices();
      } catch (e) {
        this.$toast.error(this.$t('a1.a42'));
      }
    },
    async revokeOne(row) {
      if (!row || row.id == null) return;
      if (!window.confirm(this.$t('page_labels.confirm_terminate'))) return;
      try {
        await this.$axios.$delete('/user/close-device', {
          data: { device_ids: [row.id] },
        });
        this.$toast.success(this.$t('page_labels.session_terminated'));
        await this.fetchDevices();
      } catch (e) {
        this.$toast.error(this.$t('a1.a42'));
      }
    },
    async revokeOthers() {
      if (!window.confirm(this.$t('page_labels.terminate_others'))) return;
      const ids = this.otherDevices
        .map((d) => d.id)
        .filter((id) => id != null);
      if (!ids.length) return;
      try {
        await this.$axios.$delete('/user/close-device', {
          data: { device_ids: ids },
        });
        this.$toast.success(this.$t('page_labels.session_terminated'));
        await this.fetchDevices();
      } catch (e) {
        this.$toast.error(this.$t('a1.a42'));
      }
    },
  },
  async mounted() {
    if (!this.$auth.loggedIn) {
      return this.$router.push(this.localePath({ name: 'auth-login' }));
    }
    if (this.$auth.user.is_active == 1 && this.$auth.user.is_contract == 0) {
      return this.$router.push(this.localePath({ name: 'universal_contract' }));
    }
    this.loading = true;
    this.initDeviceId();
    // Resolve geo first so the freshly registered device carries IP + location.
    await this.loadGeo();
    await this.registerThisDevice();
    this.loading = false;
  },
};
</script>

<style scoped>
.ad-page {
  min-height: 100vh;
  background: #f4f6fa;
  padding: 24px 16px 48px;
}
.ad-container {
  max-width: 640px;
  margin: 0 auto;
}

/* Header */
.ad-header {
  padding: 8px 4px 20px;
}
.ad-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 6px;
}
.ad-subtitle {
  font-size: 14px;
  color: #718096;
  line-height: 1.5;
  margin: 0;
}

/* Sections */
.ad-section {
  margin-bottom: 28px;
}
.ad-section-title {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #94a3b8;
  margin: 0 4px 12px;
}

/* Cards */
.ad-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border: 1px solid #eef1f6;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.04);
}
.ad-card-current {
  border-color: #d3f0e0;
  background: linear-gradient(180deg, #ffffff 0%, #f6fdf9 100%);
}
.ad-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ad-card-body {
  flex: 1;
  min-width: 0;
}

/* Icon boxes */
.ad-icon-box {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ad-icon-current {
  background: #e6f7ef;
  color: #12b76a;
}
.ad-icon-other {
  background: #ebf2fe;
  color: #3182ce;
}

/* Device text */
.ad-device-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}
.ad-device-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a202c;
  word-break: break-word;
}
.ad-line {
  font-size: 13px;
  color: #4a5568;
  margin: 2px 0 0;
  line-height: 1.45;
  word-break: break-word;
}
.ad-muted {
  color: #94a3b8;
}

/* Current badge */
.ad-badge-current {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #12b76a;
  background: #e6f7ef;
  padding: 3px 10px;
  border-radius: 999px;
}
.ad-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #12b76a;
  display: inline-block;
}

/* Terminate all others */
.ad-terminate-all {
  margin-top: 16px;
  text-align: center;
}
.ad-btn-danger {
  width: 100%;
  background: #ffffff;
  color: #e11d48;
  border: 1px solid #fbd5dd;
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.ad-btn-danger:hover {
  background: #fff1f3;
  border-color: #f4a9b8;
}
.ad-hint {
  font-size: 12px;
  color: #94a3b8;
  margin: 8px 0 0;
}

/* X terminate button */
.ad-btn-x {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: none;
  background: #f8fafc;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.ad-btn-x:hover {
  background: #fff1f3;
  color: #e11d48;
}

/* Empty state */
.ad-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 36px 16px;
  background: #ffffff;
  border: 1px dashed #e2e8f0;
  border-radius: 16px;
  color: #cbd5e1;
}
.ad-empty p {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

/* Loading */
.ad-loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}
.ad-spinner {
  width: 34px;
  height: 34px;
  border: 3px solid #e2e8f0;
  border-top-color: #3182ce;
  border-radius: 50%;
  animation: ad-spin 0.8s linear infinite;
}
@keyframes ad-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
