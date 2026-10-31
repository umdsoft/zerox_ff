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
                <span v-if="thisDeviceView.ip">{{ thisDeviceView.ip }}</span>
                <template v-if="thisDeviceView.location">
                  <span v-if="thisDeviceView.ip" class="cd-sep">&middot;</span><span>{{ thisDeviceView.location }}</span>
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
                  <span v-if="item.ip">{{ item.ip }}</span>
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

      <!-- SS-DEV (2026-09-23): seansni tugatish tasdiqlash modali (orqa fon blur).
           Ilgari brauzerning oddiy `window.confirm` oynasi chiqardi. -->
      <transition name="cd-fade">
        <div v-if="confirm" class="cd-confirm-overlay" @click.self="cancelConfirm">
          <div class="cd-confirm-card" role="dialog" aria-modal="true">
            <div class="cd-confirm-head">
              <div class="cd-confirm-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9v4m0 4h.01M10.3 3.9L2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="cd-confirm-text">
                <h3 class="cd-confirm-title">
                  {{ confirm.type === 'one' ? $t('page_labels.dev_confirm_title') : $t('page_labels.terminate_others') }}
                </h3>
                <p class="cd-confirm-desc">
                  <template v-if="confirm.type === 'one'">
                    <span class="cd-confirm-device">{{ deviceName(confirm.item) }}</span>
                    <span v-if="confirm.item.ip"> &middot; {{ confirm.item.ip }}</span>
                    <br />{{ $t('page_labels.dev_confirm_desc') }}
                  </template>
                  <template v-else>{{ $t('page_labels.terminate_others_hint') }}</template>
                </p>
              </div>
            </div>
            <div class="cd-confirm-actions">
              <button type="button" class="cd-btn-ghost" :disabled="revoking" @click="cancelConfirm">
                {{ $t('page_labels.dev_cancel') }}
              </button>
              <button type="button" class="cd-btn-confirm" :disabled="revoking" @click="confirmRevoke">
                {{ revoking ? $t('page_labels.dev_terminating') : $t('page_labels.terminate') }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { fmtDMYHM, parseDateSafe } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
import { getRefreshToken } from '@/utils/tokenStorage';
import { postSessionsRevokeOthers, postSessionsRevoke, getSessions } from '@/api/user';

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
    confirm: null, // { type: 'one', item } | { type: 'others' } — tasdiqlash modali
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
        if (!rt) {return null;}
        const p = rt.split('.')[1];
        if (!p) {return null;}
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
      if (/YaBrowser/i.test(s)) {return 'Yandex';}
      if (/Edg(e|A|iOS)?\//i.test(s)) {return 'Edge';}
      if (/OPR\/|Opera/i.test(s)) {return 'Opera';}
      if (/Chrome\/|CriOS/i.test(s)) {return 'Chrome';}
      if (/Firefox\/|FxiOS/i.test(s)) {return 'Firefox';}
      if (/Safari\//i.test(s)) {return 'Safari';}
      return 'Brauzer';
    },
    osOf(ua) {
      const s = ua || '';
      if (/Windows/i.test(s)) {return 'Windows';}
      if (/Android/i.test(s)) {return 'Android';}
      if (/iPhone|iPad|iPod/i.test(s)) {return 'iOS';}
      if (/Mac OS X|Macintosh/i.test(s)) {return 'macOS';}
      if (/Linux/i.test(s)) {return 'Linux';}
      return '';
    },
    isMobileApp(ua) {
      const s = (ua || '').trim();
      if (!s) {return true;}
      return /ZeroX|okhttp|Expo|Dart|CFNetwork|ReactNative|Flutter/i.test(s);
    },
    deviceName(s) {
      const ua = (s && s.user_agent) || '';
      if (this.isMobileApp(ua)) {return 'ZeroX mobil ilovasi';}
      const os = this.osOf(ua);
      return os ? `${this.browserOf(ua)} (${os})` : this.browserOf(ua);
    },
    deviceKind(s) {
      const ua = (s && s.user_agent) || '';
      if (this.isMobileApp(ua)) {return 'mobile';}
      const os = this.osOf(ua);
      return os === 'Android' || os === 'iOS' ? 'mobile' : 'pc';
    },
    platformLabel(s) {
      return this.isMobileApp((s && s.user_agent) || '') ? 'ZeroX' : 'ZeroX Web';
    },

    // ---- formatting ----
    formatDateTime(v) { return parseDateSafe(v) ? fmtDMYHM(v) : '—' }, // SS-AUDIT (2026-09-25): utils/helpers

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
      const res = await getSessions(this.$axios, {
        params: { current: this.myFam },
      });
      this.sessions = (res && res.data) || [];
    },
    // SS-DEV (2026-09-23): brauzerning `window.confirm` oynasi o'rniga sayt
    // uslubidagi tasdiqlash modali (orqa fon blur). Tugma bosilganda faqat
    // `confirm` holati o'rnatiladi; haqiqiy so'rov `confirmRevoke` da ketadi.
    revokeOne(s) {
      if (this.revoking || !s || s.family_id == null) {return;}
      this.confirm = { type: 'one', item: s };
    },
    revokeOthers() {
      if (this.revoking) {return;}
      this.confirm = { type: 'others' };
    },
    cancelConfirm() {
      if (this.revoking) {return;}
      this.confirm = null;
    },
    async confirmRevoke() {
      const c = this.confirm;
      if (!c || this.revoking) {return;}
      this.revoking = true;
      try {
        if (c.type === 'one') {
          await postSessionsRevoke(this.$axios, { family_id: c.item.family_id });
        } else {
          await postSessionsRevokeOthers(this.$axios, { current: this.myFam });
        }
        this.$toast.success(this.$t('page_labels.session_terminated'));
        this.confirm = null;
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
    // SS-DEV (2026-09-29): ofertani tasdiqlamagan foydalanuvchi endi universal_contract'ga majburan
    // yo'naltirilmaydi — oferta faqat qarz shartnomasi AMALIDA so'raladi (plugins/oferta-gate.client.js).
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

<style scoped src="../../assets/page-styles/active-device.css"></style>
