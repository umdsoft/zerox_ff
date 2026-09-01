<template>
  <div class="cd-page">
    <div class="cd-container">
      <!-- Header -->
      <div class="cd-header">
        <div class="cd-header-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 3l7 3v5c0 4.2-2.8 7.5-7 9-4.2-1.5-7-4.8-7-9V6l7-3z"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linejoin="round"
            />
            <path
              d="M9 12l2 2 4-4.5"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="cd-header-text">
          <h1 class="cd-title">{{ $t('page_labels.devices_title') }}</h1>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="cd-loading">
        <div class="cd-skeleton cd-skeleton-lg"></div>
        <div class="cd-skeleton"></div>
        <div class="cd-skeleton"></div>
        <div class="cd-spinner"></div>
      </div>

      <template v-else>
        <!-- This device -->
        <div class="cd-section">
          <h2 class="cd-section-title">{{ $t('page_labels.this_device') }}</h2>

          <div class="cd-card cd-card-current">
            <div class="cd-icon-box cd-icon-current">
              <device-icon :kind="thisDeviceView.kind" :size="28" />
            </div>
            <div class="cd-card-body">
              <div class="cd-device-row">
                <span class="cd-device-name">{{ thisDeviceView.name }}</span>
                <span class="cd-badge-current">
                  <span class="cd-dot"></span>
                  {{ $t('page_labels.current_session') }}
                </span>
              </div>
              <p class="cd-line cd-muted">
                <span>{{ thisDeviceView.platform }}</span>
                <template v-if="thisDeviceView.ip">
                  <span class="cd-sep">&middot;</span><span>{{ thisDeviceView.ip }}</span>
                </template>
                <template v-if="thisDeviceView.location">
                  <span class="cd-sep">&middot;</span><span>{{ thisDeviceView.location }}</span>
                </template>
              </p>
            </div>
          </div>

          <!-- Terminate all others -->
          <div v-if="sessions.length > 1" class="cd-terminate-all">
            <button
              type="button"
              class="cd-btn-danger"
              :disabled="revoking"
              @click="revokeOthers"
            >
              {{ $t('page_labels.terminate_others') }}
            </button>
            <p class="cd-hint">{{ $t('page_labels.terminate_others_hint') }}</p>
          </div>
        </div>

        <!-- Other devices -->
        <div class="cd-section">
          <h2 class="cd-section-title">{{ $t('page_labels.other_devices') }}</h2>

          <div v-if="otherDevices.length" class="cd-list">
            <div
              v-for="(item, i) in otherDevices"
              :key="item.family_id || i"
              class="cd-card cd-card-other"
            >
              <div class="cd-icon-box cd-icon-other">
                <device-icon :kind="deviceKind(item)" :size="24" />
              </div>
              <div class="cd-card-body">
                <span class="cd-device-name">{{ deviceName(item) }}</span>
                <p class="cd-line cd-muted">
                  <span>{{ platformLabel(item) }}</span>
                  <template v-if="item.ip">
                    <span class="cd-sep">&middot;</span><span>{{ item.ip }}</span>
                  </template>
                </p>
                <p class="cd-line cd-muted cd-line-time">
                  {{ $t('page_labels.last_active') }}:
                  {{ formatDateTime(item.last_used_at || item.created_at) }}
                </p>
              </div>
              <button
                type="button"
                class="cd-btn-terminate"
                :disabled="revoking"
                @click="revokeOne(item)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m2 0v12a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19V7"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>{{ $t('page_labels.terminate') }}</span>
              </button>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="cd-empty">
            <div class="cd-empty-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 3l7 3v5c0 4.2-2.8 7.5-7 9-4.2-1.5-7-4.8-7-9V6l7-3z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
                <path d="M9.5 12l1.8 1.8L15 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <p>{{ $t('page_labels.no_other_devices') }}</p>
          </div>
        </div>

        <!-- Footer note -->
        <p class="cd-footnote">{{ $t('page_labels.revoke_note') }}</p>
      </template>
    </div>
  </div>
</template>

<script>
import { getRefreshToken } from '@/utils/tokenStorage';

// Inline-SVG device icon (Tailwind v2 safe — no arbitrary classes, no external deps)
const DeviceIcon = {
  name: 'DeviceIcon',
  props: {
    kind: { type: String, default: 'pc' },
    size: { type: [Number, String], default: 24 },
  },
  render(h) {
    const s = String(this.size);
    const svg = {
      attrs: {
        width: s,
        height: s,
        viewBox: '0 0 24 24',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
      },
    };
    if (this.kind === 'mobile') {
      return h('svg', svg, [
        h('rect', {
          attrs: { x: '6', y: '2', width: '12', height: '20', rx: '2.6', stroke: 'currentColor', 'stroke-width': '1.7' },
        }),
        h('path', {
          attrs: { d: 'M10.4 18.6h3.2', stroke: 'currentColor', 'stroke-width': '1.7', 'stroke-linecap': 'round' },
        }),
      ]);
    }
    return h('svg', svg, [
      h('rect', {
        attrs: { x: '3', y: '4.5', width: '18', height: '12', rx: '2', stroke: 'currentColor', 'stroke-width': '1.7' },
      }),
      h('path', {
        attrs: { d: 'M8.5 20.5h7M12 16.5v4', stroke: 'currentColor', 'stroke-width': '1.7', 'stroke-linecap': 'round' },
      }),
    ]);
  },
};

export default {
  components: { DeviceIcon },
  data: () => ({
    sessions: [],
    loading: true,
    revoking: false,
    myFam: null,
    myGeo: { ip: null, location: null },
  }),
  computed: {
    currentDevice() {
      return this.sessions.find((s) => s && s.is_current) || null;
    },
    otherDevices() {
      return this.sessions.filter((s) => !(s && s.is_current));
    },
    // Normalized "this device" view — uses the server-marked current session when
    // available, otherwise falls back to this browser's user-agent + geo.
    thisDeviceView() {
      const cd = this.currentDevice;
      const ip = (this.myGeo && this.myGeo.ip) || (cd && cd.ip) || '';
      const location = (this.myGeo && this.myGeo.location) || '';
      if (cd) {
        return {
          name: this.deviceName(cd),
          kind: this.deviceKind(cd),
          platform: this.platformLabel(cd),
          ip,
          location,
        };
      }
      const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
      const os = this.osOf(ua);
      return {
        name: os ? `${this.browserOf(ua)} (${os})` : this.browserOf(ua),
        kind: os === 'Android' || os === 'iOS' ? 'mobile' : 'pc',
        platform: 'ZeroX Web',
        ip,
        location,
      };
    },
  },
  methods: {
    // Decode the refresh token payload (no verify) to read its `fam` claim.
    currentFam() {
      try {
        const rt = getRefreshToken();
        if (!rt) return null;
        const p = rt.split('.')[1];
        if (!p) return null;
        const json = decodeURIComponent(
          atob(p.replace(/-/g, '+').replace(/_/g, '/'))
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(json).fam || null;
      } catch (e) {
        return null;
      }
    },

    // ---- user_agent parsing ----
    browserOf(ua) {
      const s = ua || '';
      if (/YaBrowser/i.test(s)) return 'Yandex';
      if (/Edg(e|A|iOS)?\//i.test(s)) return 'Edge';
      if (/OPR\/|Opera/i.test(s)) return 'Opera';
      if (/Chrome\/|CriOS/i.test(s)) return 'Chrome';
      if (/Firefox\/|FxiOS/i.test(s)) return 'Firefox';
      if (/Safari\//i.test(s)) return 'Safari';
      return 'Brauzer';
    },
    osOf(ua) {
      const s = ua || '';
      if (/Windows/i.test(s)) return 'Windows';
      if (/Android/i.test(s)) return 'Android';
      if (/iPhone|iPad|iPod/i.test(s)) return 'iOS';
      if (/Mac OS X|Macintosh/i.test(s)) return 'macOS';
      if (/Linux/i.test(s)) return 'Linux';
      return '';
    },
    isMobileApp(ua) {
      const s = (ua || '').trim();
      if (!s) return true;
      return /ZeroX|okhttp|Expo|Dart|CFNetwork|ReactNative|Flutter/i.test(s);
    },
    deviceName(s) {
      const ua = (s && s.user_agent) || '';
      if (this.isMobileApp(ua)) return 'ZeroX mobil ilova';
      const os = this.osOf(ua);
      return os ? `${this.browserOf(ua)} (${os})` : this.browserOf(ua);
    },
    deviceKind(s) {
      const ua = (s && s.user_agent) || '';
      if (this.isMobileApp(ua)) return 'mobile';
      const os = this.osOf(ua);
      return os === 'Android' || os === 'iOS' ? 'mobile' : 'pc';
    },
    platformLabel(s) {
      return this.isMobileApp((s && s.user_agent) || '') ? 'ZeroX ilova' : 'ZeroX Web';
    },

    // ---- formatting ----
    formatDateTime(v) {
      if (!v) return '—';
      const d = new Date(v);
      if (isNaN(d.getTime())) return '—';
      const pad = (n) => (n < 10 ? '0' + n : '' + n);
      return (
        `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ` +
        `${pad(d.getHours())}:${pad(d.getMinutes())}`
      );
    },

    // ---- geo (best-effort, current device only) ----
    async loadGeo() {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data) {
          const loc = [data.city, data.country_name].filter(Boolean).join(', ');
          this.myGeo = { ip: data.ip || null, location: loc || null };
        }
      } catch (e) {
        // best-effort; leave geo empty on failure
      }
    },

    // ---- data ----
    async fetchSessions() {
      const res = await this.$axios.$get('/user/sessions', {
        params: { current: this.myFam },
      });
      this.sessions = (res && res.data) || [];
    },
    async revokeOne(s) {
      if (this.revoking || !s || s.family_id == null) return;
      if (!window.confirm(this.$t('page_labels.confirm_terminate'))) return;
      this.revoking = true;
      try {
        await this.$axios.$post('/user/sessions/revoke', { family_id: s.family_id });
        this.$toast.success(this.$t('page_labels.session_terminated'));
        await this.fetchSessions();
      } catch (e) {
        this.$toast.error(this.$t('a1.a42'));
      } finally {
        this.revoking = false;
      }
    },
    async revokeOthers() {
      if (this.revoking) return;
      if (!window.confirm(this.$t('page_labels.terminate_others'))) return;
      this.revoking = true;
      try {
        await this.$axios.$post('/user/sessions/revoke-others', { current: this.myFam });
        this.$toast.success(this.$t('page_labels.session_terminated'));
        await this.fetchSessions();
      } catch (e) {
        this.$toast.error(this.$t('a1.a42'));
      } finally {
        this.revoking = false;
      }
    },
  },
  async mounted() {
    if (!this.$auth.loggedIn) {
      return this.$router.push(this.localePath({ name: 'auth-login' }));
    }
    if (this.$auth.user && this.$auth.user.is_active == 1 && this.$auth.user.is_contract == 0) {
      return this.$router.push(this.localePath({ name: 'universal_contract' }));
    }
    this.myFam = this.currentFam();
    this.loading = true;
    try {
      await this.fetchSessions();
    } catch (e) {
      this.$toast.error(this.$t('a1.a42'));
    }
    await this.loadGeo();
    this.loading = false;
  },
};
</script>

<style scoped>
.cd-page {
  min-height: 100vh;
  background: #f4f6fb;
  padding: 28px 16px 56px;
}
.cd-container {
  max-width: 672px;
  margin: 0 auto;
}

/* Header */
.cd-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 2px 24px;
}
.cd-header-badge {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.28);
}
.cd-header-text {
  min-width: 0;
}
.cd-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 3px;
  line-height: 1.2;
}
.cd-subtitle {
  font-size: 13.5px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

/* Sections */
.cd-section {
  margin-bottom: 26px;
}
.cd-section-title {
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: #94a3b8;
  margin: 0 4px 12px;
}

/* Cards */
.cd-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border: 1px solid #eef1f6;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px rgba(16, 24, 40, 0.03);
}
.cd-card-current {
  border-color: #c9f0dd;
  background: linear-gradient(180deg, #ffffff 0%, #f4fdf8 100%);
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 10px 28px rgba(16, 185, 129, 0.08);
}
.cd-card-other {
  transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
}
.cd-card-other:hover {
  border-color: #e2e8f0;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05), 0 12px 30px rgba(16, 24, 40, 0.06);
}
.cd-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cd-card-body {
  flex: 1;
  min-width: 0;
}

/* Icon boxes */
.cd-icon-box {
  flex-shrink: 0;
  width: 54px;
  height: 54px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cd-icon-current {
  color: #ffffff;
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}
.cd-icon-other {
  width: 48px;
  height: 48px;
  color: #4f46e5;
  background: #eef2ff;
}

/* Device text */
.cd-device-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 5px;
}
.cd-device-name {
  font-size: 15.5px;
  font-weight: 600;
  color: #0f172a;
  word-break: break-word;
}
.cd-line {
  font-size: 13px;
  color: #475569;
  margin: 3px 0 0;
  line-height: 1.5;
  word-break: break-word;
}
.cd-line-time {
  margin-top: 5px;
}
.cd-muted {
  color: #94a3b8;
}
.cd-sep {
  margin: 0 6px;
  color: #cbd5e1;
}

/* Current badge */
.cd-badge-current {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: #059669;
  background: #dcfce7;
  padding: 4px 11px;
  border-radius: 999px;
  white-space: nowrap;
}
.cd-dot {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
}
.cd-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #10b981;
  animation: cd-pulse 1.8s ease-out infinite;
}
@keyframes cd-pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}

/* Terminate all others */
.cd-terminate-all {
  margin-top: 16px;
  text-align: center;
}
.cd-btn-danger {
  width: auto;
  display: inline-block;
  background: #ffffff;
  color: #e11d48;
  border: 1px solid #fbcfd8;
  border-radius: 14px;
  padding: 13px 16px;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.cd-btn-danger:hover:not(:disabled) {
  background: #fff1f3;
  border-color: #f6a8b8;
  box-shadow: 0 6px 16px rgba(225, 29, 72, 0.12);
}
.cd-btn-danger:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.cd-hint {
  font-size: 12px;
  color: #94a3b8;
  margin: 9px 0 0;
}

/* Terminate (row) button */
.cd-btn-terminate {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #fbcfd8;
  background: #fff5f6;
  color: #e11d48;
  border-radius: 11px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.cd-btn-terminate:hover:not(:disabled) {
  background: #ffe4e8;
  border-color: #f6a8b8;
}
.cd-btn-terminate:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Empty state */
.cd-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 16px;
  background: #ffffff;
  border: 1px dashed #dbe2ec;
  border-radius: 18px;
}
.cd-empty-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a5b4fc;
  background: #eef2ff;
}
.cd-empty p {
  font-size: 13.5px;
  color: #94a3b8;
  margin: 0;
  text-align: center;
}

/* Footer note */
.cd-footnote {
  font-size: 12px;
  color: #a3adba;
  text-align: center;
  line-height: 1.5;
  margin: 4px 8px 0;
}

/* Loading */
.cd-loading {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 4px;
}
.cd-skeleton {
  height: 78px;
  border-radius: 18px;
  background: linear-gradient(90deg, #eef1f6 25%, #f6f8fb 37%, #eef1f6 63%);
  background-size: 400% 100%;
  animation: cd-shimmer 1.4s ease infinite;
}
.cd-skeleton-lg {
  height: 90px;
}
@keyframes cd-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
.cd-spinner {
  position: absolute;
  top: 32px;
  left: 50%;
  margin-left: -17px;
  width: 34px;
  height: 34px;
  border: 3px solid rgba(79, 70, 229, 0.18);
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: cd-spin 0.8s linear infinite;
}
@keyframes cd-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .cd-page {
    padding: 20px 12px 44px;
  }
  .cd-title {
    font-size: 20px;
  }
  .cd-btn-terminate span {
    display: none;
  }
  .cd-btn-terminate {
    padding: 9px 10px;
  }
}
</style>
