/**
 * wave D: pages/finance/gap/_id.vue dan ajratilgan uchrashuv joyi (Leaflet xarita), taklif va karta metodlari.
 * Metodlar sahifa holatini (data) `this` orqali ishlatadi — holat sahifada qoladi.
 */
export default {
  methods: {
    // Uchrashuv joyini kirita oladimi: tashkilotchi yoki shu davra qabul qiluvchisi (navbati kelgan)
    // SS-DEV (2026-09-24): ogohlantirish/taklif yuborish huquqi — sanadan QAT'I
    // NAZAR (muddati o'tgan, yakunlanmagan davrada to'lov eslatmasi kerak).
    canSendNotice(r) {
      if (!this.gap || !r) {return false}
      if (r.status === 'completed') {return false}
      return !!this.gap.is_organizer || (!!this.gap.my_member_id && r.recipient_member_id === this.gap.my_member_id)
    },
    canSetVenue(r) {
      if (!this.gap || !r) {return false}
      if (r.status === 'completed') {return false}
      // Tadbir kuni o'tib ketgan bo'lsa — joy kiritish/tahrirlash yopiq (venue faqat ko'rinadi)
      const today = new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10)
      if (r.due_date && String(r.due_date).slice(0, 10) < today) {return false}
      return !!this.gap.is_organizer || (!!this.gap.my_member_id && r.recipient_member_id === this.gap.my_member_id)
    },
    // SS2/SS3: manzil (location) va plastik karta ALOHIDA oynalarda. mode='location' → xarita
    // ko'rinadi (karta yo'q); mode='card' → faqat karta+FISH (xarita YO'Q).
    openVenue(r, mode = 'location') {
      this.venueRound = r
      this.venueMode = mode === 'card' ? 'card' : 'location'
      this.venueForm = { venue: r.venue || '', location: r.location || '', card_number: r.card_number || '', card_holder: r.card_holder || '' }
      this.showVenue = true
      // Xarita FAQAT location rejimida ishga tushadi (SS3: karta oynasida xarita chiqmasin).
      if (this.venueMode === 'location') {this.$nextTick(() => { this.initVenueMap() })}
    },
    // SS2: YANDEX Maps JS API'ni bir marta yuklash (O'zbekistonда bemalol ochiladi + mahalliy
    // manzillar to'liq). Lazy — venue modal ochilganda. ymaps.ready() bilan tayyorlikni kutamiz.
    loadYmaps() {
      return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {return reject(new Error('no window'))}
        if (window.ymaps && window.ymaps.Map) {return resolve(window.ymaps)}
        if (!window.__ymapsLoading) {
          window.__ymapsLoading = new Promise((res, rej) => {
            const s = document.createElement('script')
            s.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
            s.async = true
            s.onload = () => { if (window.ymaps && window.ymaps.ready) {window.ymaps.ready(() => res(window.ymaps));} else {rej(new Error('ymaps yo\'q'))} }
            s.onerror = rej
            document.head.appendChild(s)
          })
        }
        window.__ymapsLoading.then(resolve).catch(reject)
      })
    },
    // Havoladan koordinata: Yandex (ll/pt = lng,lat) yoki Google (q = lat,lng) — tartibni aniqlaymiz
    parseLatLng(url) {
      if (!url) {return null}
      const s = String(url)
      const m = s.match(/(-?\d{1,3}\.\d+)[,\s]+(-?\d{1,3}\.\d+)/)
      if (!m) {return null}
      const a = parseFloat(m[1]); const b = parseFloat(m[2])
      if (isNaN(a) || isNaN(b)) {return null}
      const yandex = /yandex\./i.test(s) || /[?&](ll|pt)=/.test(s)
      return yandex ? { lat: b, lng: a } : { lat: a, lng: b }
    },
    async initVenueMap() {
      try {
        const ymaps = await this.loadYmaps()
        await this.$nextTick()
        const el = this.$refs.venueMap
        if (!el) {return}
        this.destroyVenueMap()
        let center = [41.311081, 69.240562] // Toshkent (default) — [lat, lng]
        let zoom = 12
        const parsed = this.parseLatLng(this.venueForm.location)
        if (parsed) { center = [parsed.lat, parsed.lng]; zoom = 16 }
        const map = new ymaps.Map(el, { center, zoom, controls: ['zoomControl', 'geolocationControl'] }, { suppressMapOpenBlock: true })
        let placemark = null
        const setPoint = (lat, lng) => {
          if (placemark) { placemark.geometry.setCoordinates([lat, lng]) }
          else { placemark = new ymaps.Placemark([lat, lng], {}, { preset: 'islands#redDotIcon', draggable: true }); map.geoObjects.add(placemark); placemark.events.add('dragend', () => { const c = placemark.geometry.getCoordinates(); this._commitPoint(c[0], c[1]) }) }
          this._commitPoint(lat, lng)
        }
        this._commitPoint = (lat, lng) => {
          this.venueForm.location = `https://yandex.uz/maps/?ll=${lng.toFixed(6)},${lat.toFixed(6)}&z=16&pt=${lng.toFixed(6)},${lat.toFixed(6)}`
          this.venueCoords = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        }
        if (parsed) {setPoint(parsed.lat, parsed.lng)}
        map.events.add('click', (e) => { const c = e.get('coords'); setPoint(c[0], c[1]) })
        this._venueMap = map
        this._venueSetPoint = setPoint
        if (parsed) {this.venueCoords = `${parsed.lat.toFixed(5)}, ${parsed.lng.toFixed(5)}`}
      } catch (_) { /* Yandex yuklanmasa — URL input qoladi */ }
    },
    // "Mening joylashuvim" — brauzer geolokatsiyasi bilan lokatsiyani belgilash.
    // 🔴 FIX (2026-09-13): ilgari natija FAQAT `this._venueMap` mavjud bo'lsa qo'llanardi —
    // xarita hali yuklanmagan (yoki tayl'lar chiqmagan) bo'lsa joylashuv JIM YO'QOLARDI
    // ("chiqmasdan turibdi"). Endi: (1) forma/koordinata HAR DOIM yangilanadi (xaritasiz ham);
    // (2) yuqori aniqlik ishlamasa past aniqlik bilan qayta urinamiz; (3) aniq xato xabari.
    async locateMe() {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        this.$toast && this.$toast.error && this.$toast.error(this.$t('finance.gap_venue_geo_denied'))
        return
      }
      if (this.locating) {return}
      this.locating = true
      const applyPos = (lat, lng) => {
        this.venueForm.location = `https://yandex.uz/maps/?ll=${lng.toFixed(6)},${lat.toFixed(6)}&z=16&pt=${lng.toFixed(6)},${lat.toFixed(6)}`
        this.venueCoords = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        if (this._venueMap && this._venueSetPoint) {
          try { this._venueMap.setCenter([lat, lng], 16); this._venueSetPoint(lat, lng) } catch (_) {}
        }
      }
      const geo = (opts) => new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, opts))
      try {
        let pos
        try {
          pos = await geo({ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 })
        } catch (e1) {
          if (e1 && e1.code === 1) {throw e1} // PERMISSION_DENIED — qayta urinmaymiz
          // Desktop'да GPS yo'q → yuqori aniqlik uzoq/ishlamasligi mumkin; past aniqlik bilan qayta.
          pos = await geo({ enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 })
        }
        applyPos(pos.coords.latitude, pos.coords.longitude)
        this.$toast && this.$toast.success && this.$toast.success(this.$t('finance.gap_venue_located'))
      } catch (err) {
        const denied = err && err.code === 1
        const msg = denied
          ? this.$t('finance.gap_venue_geo_denied')
          : (this.$t('finance.gap_venue_geo_unavailable'))
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally {
        this.locating = false
      }
    },
    destroyVenueMap() {
      if (this._venueMap) { try { this._venueMap.destroy() } catch (_) {} this._venueMap = null }
      this._venueSetPoint = null
      this.venueCoords = ''
    },
    async saveVenue() {
      if (!this.venueRound) {return}
      // SS3: rejimga qarab FAQAT tegishli maydonlarni yuboramiz (partial update).
      let payload
      if (this.venueMode === 'card') {
        const card = String(this.venueForm.card_number || '').replace(/\D/g, '').slice(0, 16)
        if (!card) { this.$toast && this.$toast.error && this.$toast.error(this.$t('finance.gap_card_required')); return }
        payload = { card_number: card, card_holder: String(this.venueForm.card_holder || '').trim() || null }
      } else {
        const v = String(this.venueForm.venue || '').trim()
        if (!v) {return}
        payload = { venue: v, location: String(this.venueForm.location || '').trim() || null }
      }
      try {
        this.busy = true
        const res = await this.$api.setGapRoundVenue(this.gapId, this.venueRound.id, payload)
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success(this.$t('finance.gap_venue_saved'))
          this.showVenue = false
          await this.load()
        }
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    // SS4: "Taklif yuborish" — saqlangan ma'lumot bo'yicha a'zolarga Telegram taklifi (avtomatik emas).
    async sendInvite(r) {
      if (!r || this.inviteBusy) {return}
      try {
        this.inviteBusy = r.id
        const res = await this.$api.notifyGapRound(this.gapId, r.id)
        if (res && res.data && res.data.success) {
          const n = (res.data.data && res.data.data.sent) || 0
          this.$toast && this.$toast.success && this.$toast.success((this.$t('finance.gap_invite_sent')) + (n ? ` (${n})` : ''))
        }
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.inviteBusy = null }
    },
    // SS3: karta raqamini 4talik guruhlab formatlash
    onCardInput(e) {
      const d = String(e.target.value || '').replace(/\D/g, '').slice(0, 16)
      this.venueForm.card_number = d.replace(/(.{4})/g, '$1 ').trim()
    },
    // SS3: karta raqamini nusxalash (probellarsiz)
    async copyCard(num) {
      const t = String(num || '').replace(/\s/g, '')
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {await navigator.clipboard.writeText(t)}
        this.$toast && this.$toast.success && this.$toast.success(this.$t('finance.gap_card_copied'))
      } catch (_) { /* clipboard bloklansa jim */ }
    },
  },
};
