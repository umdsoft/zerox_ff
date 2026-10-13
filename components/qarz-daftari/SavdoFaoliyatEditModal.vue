<template>
  <!-- 10.10 (sayt hujjati, 3-rasm): "Do'konni tahrirlash" — 4 ta karta:
       1) Do'kon rekvizitlari (nom, viloyat, tuman — AVTOMATIK saqlanadi),
       2) Xodimlar, 3) Karta ulash, 4) Eslatma. Pastdagi "Bekor qilish / Saqlash" tugmalari olib tashlandi.
       Yangi do'kon yaratish — avvalgidek SavdoFaoliyatModal (bu oyna faqat TAHRIRLASH uchun). -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    style="z-index: 100"
    @click.self="close"
  >
    <div
      class="w-full max-w-lg overflow-y-auto rounded-2xl bg-gray-50 shadow-2xl"
      style="max-height: 92vh"
      role="dialog"
      aria-modal="true"
      :aria-label="tx.title"
    >
      <!-- Sarlavha -->
      <div class="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-4">
        <button
          v-if="view !== 'main'"
          type="button"
          class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :aria-label="tx.back"
          :title="tx.back"
          @click="backToMain"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>
        </span>
        <div class="min-w-0 flex-1">
          <h3 class="text-lg font-semibold leading-tight text-gray-900">{{ viewTitle }}</h3>
          <p class="truncate text-sm text-gray-500">{{ savedSnap.nomi || faoliyat.nomi }}</p>
        </div>
        <button
          type="button"
          class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :aria-label="tx.close"
          :title="tx.close"
          @click="close"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="space-y-3 p-4 sm:p-5">
        <!-- 1) Do'kon rekvizitlari — 11.10 (sayt hujjati, 5-rasm): boshqa kartalar kabi ALOHIDA bosiladigan
             karta (nom va manzil ko'rinadi). Bosilganda oyna ichida "Do'kon rekvizitlari" sahifasi ochiladi:
             Do'kon nomi, Viloyat, Tuman / shahar (avto-saqlash avvalgidek); "Orqaga" — kartalarga qaytish. -->
        <button
          v-if="view === 'main'"
          type="button"
          class="group flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          @click="openRek"
        >
          <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" /></svg>
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-semibold text-gray-900">{{ tx.rekTitle }}</span>
            <span class="block text-xs text-gray-500">{{ tx.rekDesc }}</span>
            <span class="mt-3 block truncate text-sm font-semibold text-gray-800">{{ savedSnap.nomi || '—' }}</span>
            <span class="mt-1 flex items-start gap-1.5 text-xs" :class="savedPlace ? 'text-gray-600' : 'text-amber-600'">
              <svg class="mt-px h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              <span class="min-w-0">{{ savedPlace || tx.addressNone }}</span>
            </span>
          </span>
          <svg class="h-4 w-4 flex-shrink-0 text-gray-300 transition-colors group-hover:text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>

        <section v-if="view === 'rek'" class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div class="mb-4 flex items-start gap-3">
            <span class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" /></svg>
            </span>
            <div class="min-w-0 flex-1">
              <h4 class="text-sm font-semibold text-gray-900">{{ tx.rekTitle }}</h4>
              <p class="text-xs text-gray-500">{{ tx.rekDesc }}</p>
            </div>
            <!-- Saqlash holati -->
            <span :class="['inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', statusChip.cls]" aria-live="polite">
              <svg v-if="statusChip.icon === 'spin'" class="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" /></svg>
              <svg v-else-if="statusChip.icon === 'check'" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              <svg v-else-if="statusChip.icon === 'warn'" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span v-else class="h-1.5 w-1.5 rounded-full bg-current"></span>
              {{ statusChip.label }}
            </span>
          </div>

          <!-- Nomi -->
          <label class="mb-1.5 block text-xs font-semibold text-gray-600" :for="nameId">{{ tx.nameLabel }}</label>
          <input
            :id="nameId"
            v-model="form.nomi"
            type="text"
            :maxlength="MAX_LEN"
            :placeholder="tx.placeholder"
            autocomplete="off"
            :class="[
              'w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2',
              nameError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
            ]"
            @input="onNameInput"
          />
          <div class="mt-1 mb-4 flex items-start justify-between gap-3" style="min-height: 1.25rem">
            <p :class="['flex-1 text-xs leading-snug', nameError ? 'text-red-500' : 'text-gray-400']">{{ nameError || tx.hint }}</p>
            <span :class="['flex-shrink-0 text-xs tabular-nums', charCount >= MAX_LEN ? 'font-semibold text-amber-500' : 'text-gray-400']">{{ charCount }}/{{ MAX_LEN }}</span>
          </div>

          <!-- Viloyat + tuman -->
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-600" :for="regionId">
                <svg class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                {{ tx.regionLabel }}
              </label>
              <div class="relative">
                <select
                  :id="regionId"
                  v-model="form.region"
                  class="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @change="onRegionChange"
                >
                  <option value="" disabled>{{ tx.regionPlaceholder }}</option>
                  <option v-for="r in regions" :key="r.name" :value="r.name">{{ r.name }}</option>
                </select>
                <svg class="pointer-events-none absolute h-4 w-4 text-gray-400" style="right: 0.75rem; top: 50%; margin-top: -0.5rem" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            <div>
              <label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-600" :for="districtId">
                <svg class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                {{ tx.districtLabel }}
              </label>
              <div class="relative">
                <select
                  :id="districtId"
                  v-model="form.district"
                  :disabled="!form.region"
                  :class="['w-full appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500', addressMissing && form.region && !form.district ? 'border-amber-400' : 'border-gray-300']"
                  :style="!form.region ? 'cursor:not-allowed; background:#F3F4F6; color:#9CA3AF' : ''"
                >
                  <option value="" disabled>{{ form.region ? tx.districtPlaceholder : tx.districtPickRegionFirst }}</option>
                  <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
                </select>
                <svg class="pointer-events-none absolute h-4 w-4 text-gray-400" style="right: 0.75rem; top: 50%; margin-top: -0.5rem" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          <p v-if="addressMissing" class="mt-2 text-xs text-amber-600">{{ tx.addressRequired }}</p>
          <div v-if="status === 'error'" class="mt-3 flex items-center justify-between gap-3 rounded-lg bg-red-50 px-3 py-2">
            <p class="text-xs text-red-600">{{ errorMsg || tx.genericError }}</p>
            <button type="button" class="flex-shrink-0 text-xs font-semibold text-red-700 hover:underline" @click="saveRek">{{ tx.retry }}</button>
          </div>
          <!-- 13.10 ("Xatolar yangi sayt 13.10", 2-rasm): avto-saqlash o'rniga ANIQ "Saqlash" / "Bekor qilish" -->
          <div class="mt-5 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              :disabled="status === 'saving'"
              @click="cancelRek"
            >{{ tx.cancelBtn }}</button>
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="status === 'saving'"
              :style="status === 'saving' ? 'opacity:.6;cursor:wait' : ''"
              @click="saveRek"
            >
              <svg v-if="status === 'saving'" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" /></svg>
              {{ tx.saveBtn }}
            </button>
          </div>
        </section>

        <!-- 2) Xodimlar  3) Karta ulash -->
        <div v-if="view === 'main'" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            class="group flex flex-col rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:border-purple-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            @click="view = 'staff'"
          >
            <span class="mb-3 flex w-full items-center justify-between">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <svg class="h-4 w-4 text-gray-300 transition-colors group-hover:text-purple-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </span>
            <span class="text-sm font-semibold text-gray-900">{{ tx.staffTitle }}</span>
            <span class="mt-0.5 text-xs text-gray-500">{{ tx.staffDesc }}</span>
            <span class="mt-3 inline-flex items-center gap-1.5 text-xs font-medium" :class="staffCount ? 'text-purple-700' : 'text-gray-400'">
              <span class="h-1.5 w-1.5 rounded-full" :class="staffCount ? 'bg-purple-500' : 'bg-gray-300'"></span>
              {{ staffLabel }}
            </span>
          </button>

          <button
            type="button"
            class="group flex flex-col rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            @click="view = 'card'"
          >
            <span class="mb-3 flex w-full items-center justify-between">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
              </span>
              <svg class="h-4 w-4 text-gray-300 transition-colors group-hover:text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </span>
            <span class="text-sm font-semibold text-gray-900">{{ tx.cardTitle }}</span>
            <span class="mt-0.5 text-xs text-gray-500">{{ tx.cardDesc }}</span>
            <span class="mt-3 inline-flex items-center gap-1.5 text-xs font-medium" :class="cardLast4 ? 'text-emerald-700' : 'text-gray-400'">
              <span class="h-1.5 w-1.5 rounded-full" :class="cardLast4 ? 'bg-emerald-500' : 'bg-gray-300'"></span>
              <template v-if="cardLast4">{{ tx.cardLinked }} · <span class="tabular-nums">•••• {{ cardLast4 }}</span></template>
              <template v-else>{{ tx.cardNone }}</template>
            </span>
          </button>
        </div>

        <!-- 13.10 ("Shaxsiy moliya yangi sayt 12.10", 3-rasm): Xodimlar va Karta ulash — boshqa sahifaga
             o'tmasdan, Do'kon rekvizitlari kabi SHU OYNA ichida (sahifalar `embedded` rejimida qayta ishlatiladi). -->
        <QarzDaftariXodimlarPanel
          v-if="view === 'staff'"
          embedded
          :faoliyat-id-prop="faoliyat.id"
          @changed="(n) => { staffCount = n }"
        />
        <QarzDaftariKartaPanel
          v-if="view === 'card'"
          embedded
          :faoliyat-id-prop="faoliyat.id"
          @saved="onCardSaved"
        />

        <!-- 4) Eslatma — qarz kiritishni eslatish (10.10): yoqilsa, belgilangan kun/vaqtda, o'sha kuni
             qarz kiritilmagan bo'lsa ilova bildirishnomalariga eslatma. Avto-saqlanadi. -->
        <section v-if="view === 'main'" class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
            </span>
            <div class="min-w-0 flex-1">
              <h4 class="text-sm font-semibold text-gray-900">{{ tx.remTitle }}</h4>
              <p class="text-xs text-gray-500">{{ tx.remDesc }}</p>
            </div>
            <span v-if="remStatus === 'saved'" class="text-xs font-medium text-emerald-600">{{ tx.remSaved }}</span>
            <button
              type="button"
              role="switch"
              :aria-checked="rem.enabled ? 'true' : 'false'"
              :aria-label="tx.remTitle"
              :class="rem.enabled ? 'bg-blue-600' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              @click="toggleReminder"
            >
              <span :class="rem.enabled ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"></span>
            </button>
          </div>

          <div :class="['mt-4 space-y-3', rem.enabled ? '' : 'pointer-events-none']" :style="rem.enabled ? '' : 'opacity: 0.45'">
            <div class="flex items-center justify-between gap-3">
              <label class="text-xs font-semibold text-gray-600" :for="remTimeId">{{ tx.remTime }}</label>
              <input
                :id="remTimeId"
                v-model="rem.time"
                type="time"
                step="300"
                class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold tabular-nums text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @change="scheduleReminder"
              />
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-xs font-semibold text-gray-600">{{ tx.remRepeat }}</span>
              <span class="truncate text-xs text-gray-500">{{ remRepeatLabel }}</span>
            </div>
            <div class="grid grid-cols-7 gap-1.5">
              <button
                v-for="w in remWeek"
                :key="w.day"
                type="button"
                :aria-pressed="rem.days.includes(w.day) ? 'true' : 'false'"
                :class="['rounded-lg border py-2 text-xs font-semibold transition-colors', rem.days.includes(w.day) ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-400 hover:border-gray-300']"
                @click="toggleDay(w.day)"
              >{{ w.label }}</button>
            </div>
            <p v-if="rem.enabled && !rem.days.length" class="text-xs text-amber-600">{{ tx.remNoDays }}</p>
            <p class="text-xs leading-relaxed text-gray-400">{{ tx.remHint }}</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import uzbRegions from '@/assets/uzbekistan-regions.js'
import { SHOP_NAME_MAX_LEN as MAX_LEN, normalizeShopName, checkShopName } from '@/utils/shopName'
import { shopEditTexts } from '@/utils/shopEditTexts'
import QarzDaftariXodimlarPanel from '~/pages/qarz-daftari/faoliyat/_id/xodimlar.vue'
import QarzDaftariKartaPanel from '~/pages/qarz-daftari/faoliyat/_id/karta.vue'

/** O'zgarishdan keyin shuncha kutib saqlanadi (har harfda so'rov yubormaslik uchun). */
/** "Saqlandi" belgisi shuncha ko'rinib, keyin "Saqlangan" ga qaytadi. */
const JUST_SAVED_MS = 2500

function snapOf(f) {
  return {
    nomi: String((f && f.nomi) || '').trim(),
    region: (f && f.region) || '',
    district: (f && f.district) || '',
  }
}
const sameSnap = (a, b) => a.nomi === b.nomi && a.region === b.region && a.district === b.district

export default {
  name: 'SavdoFaoliyatEditModal',
  components: { QarzDaftariXodimlarPanel, QarzDaftariKartaPanel },
  props: {
    faoliyat: { type: Object, required: true },
  },
  data() {
    const snap = snapOf(this.faoliyat)
    return {
      /** 11.10: 'main' — 4 karta; 'rek' — Do'kon rekvizitlari; 13.10: 'staff' — Xodimlar, 'card' — Karta ulash */
      view: 'main',
      /** 13.10: karta oyna ichida saqlansa — holat (•••• 1234) darhol yangilanadi */
      cardInfo: null,
      MAX_LEN,
      regions: uzbRegions,
      form: { ...snap, nomi: this.faoliyat.nomi || '' },
      savedSnap: snap,
      /** idle | pending | saving | saved | invalid | error */
      status: 'idle',
      errorMsg: '',
      staffCount: null,
      timer: null,
      justSavedTimer: null,
      inflight: null,
      uid: Math.random().toString(36).slice(2, 8),
      // 10.10: qarz kiritish eslatmasi (GET/PUT /qarz-daftari/savdo-faoliyat/:id/eslatma)
      rem: { enabled: false, time: '21:00', days: [0, 1, 2, 3, 4, 5, 6] },
      remSavedKey: '',
      remStatus: 'idle',
      remTimer: null,
    }
  },
  computed: {
    tx() { return shopEditTexts((this.$i18n && this.$i18n.locale) || 'uz') },
    nameId() { return `shop-name-${this.uid}` },
    regionId() { return `shop-region-${this.uid}` },
    districtId() { return `shop-district-${this.uid}` },
    remTimeId() { return `shop-rem-time-${this.uid}` },
    /** Dushanbadan boshlab; `day` — JS hafta kuni (0 = Yakshanba), backend bilan bir xil. */
    remWeek() { return [1, 2, 3, 4, 5, 6, 0].map((day, i) => ({ day, label: this.tx.remDays[i] })) },
    remRepeatLabel() {
      const set = new Set(this.rem.days)
      if (set.size === 7) return this.tx.remEveryDay
      if (set.size === 5 && [1, 2, 3, 4, 5].every((d) => set.has(d))) return this.tx.remWorkdays
      if (set.size === 2 && set.has(0) && set.has(6)) return this.tx.remWeekend
      return this.remWeek.filter((w) => set.has(w.day)).map((w) => w.label).join(', ')
    },
    charCount() { return (this.form.nomi || '').length },
    /** Saqlangan manzil: "Viloyat, Tuman" (karta ustida ko'rsatiladi). */
    savedPlace() { return [this.savedSnap.region, this.savedSnap.district].filter(Boolean).join(', ') },
    districts() {
      const r = this.regions.find((x) => x.name === this.form.region)
      return r ? r.districts : []
    },
    current() { return snapOf(this.form) },
    dirty() { return !sameSnap(this.current, this.savedSnap) },
    nameError() {
      const r = checkShopName(this.form.nomi)
      if (r.code === 'len') return this.tx.errLen
      if (r.code === 'banned') return this.tx.errBanned.replace('{c}', r.char)
      if (r.code === 'nonLatin') return this.tx.errNonLatin
      if (this.dirty && !this.current.nomi) return this.tx.nameRequired
      return ''
    },
    addressMissing() { return this.dirty && (!this.form.region || !this.form.district) },
    /** Saqlab bo'lmaydigan holat (nom xato yoki manzil to'liq emas) */
    invalid() { return !!this.nameError || !this.current.nomi || !this.form.region || !this.form.district },
    statusChip() {
      const t = this.tx
      switch (this.status) {
        case 'pending': return { label: t.stPending, icon: 'dot', cls: 'bg-blue-50 text-blue-600' }
        case 'saving': return { label: t.stSaving, icon: 'spin', cls: 'bg-blue-50 text-blue-600' }
        case 'saved': return { label: t.stJustSaved, icon: 'check', cls: 'bg-emerald-50 text-emerald-700' }
        case 'invalid': return { label: t.stInvalid, icon: 'warn', cls: 'bg-amber-50 text-amber-700' }
        case 'error': return { label: t.stError, icon: 'warn', cls: 'bg-red-50 text-red-600' }
        default: return { label: t.stSaved, icon: 'check', cls: 'bg-gray-100 text-gray-500' }
      }
    },
    staffLabel() {
      if (this.staffCount == null) return '…'
      return this.staffCount ? this.tx.staffCount.replace('{n}', this.staffCount) : this.tx.staffNone
    },
    cardLast4() {
      const src = this.cardInfo || this.faoliyat
      const d = String(src.karta_raqami || '').replace(/\D/g, '')
      return d.length === 16 && src.telegram_telefon ? d.slice(-4) : ''
    },
    viewTitle() {
      if (this.view === 'rek') return this.tx.rekTitle
      if (this.view === 'staff') return this.tx.staffTitle
      if (this.view === 'card') return this.tx.cardTitle
      return this.tx.title
    },
  },
  watch: {
    current() { this.schedule() },
  },
  mounted() {
    document.addEventListener('keydown', this.onKeydown)
    this.loadStaffCount()
    this.loadReminder()
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown)
    clearTimeout(this.timer)
    clearTimeout(this.justSavedTimer)
    clearTimeout(this.remTimer)
  },
  methods: {
    onKeydown(e) {
      if (e.key !== 'Escape') return
      // Ichki oynalar (xodim qo'shish / o'chirish tasdig'i) ochiq bo'lsa — ular o'zi yopiladi
      if (this.view === 'main') this.close()
      else this.backToMain()
    },
    onCardSaved(f) {
      if (f) this.cardInfo = { karta_raqami: f.karta_raqami, telegram_telefon: f.telegram_telefon }
      this.$emit('updated', f)
    },
    openRek() { this.view = 'rek' },
    /** Rekvizitlar sahifasidan kartalarga qaytish — 13.10: saqlanmagan o'zgarish bo'lsa, tashlab yuborish tasdiqlanadi. */
    backToMain() {
      if (this.view !== 'rek') { this.view = 'main'; return }
      if (this.dirty && !window.confirm(this.tx.unsavedConfirm)) return
      this.cancelRek()
    },
    /** "Bekor qilish" — kiritilgan o'zgarishlar tashlanadi, oxirgi saqlangan holatga qaytiladi. */
    cancelRek() {
      if (this.status === 'saving') return
      this.form = { ...this.savedSnap }
      this.status = 'idle'
      this.errorMsg = ''
      this.view = 'main'
    },
    /** "Saqlash" — yaroqli bo'lsa saqlaydi va kartalarga qaytadi. */
    async saveRek() {
      if (!this.dirty) { this.view = 'main'; return }
      if (this.invalid) { this.status = 'invalid'; return }
      if (await this.flush()) this.view = 'main'
    },
    onNameInput() {
      const v = normalizeShopName(this.form.nomi)
      if (v !== this.form.nomi) this.form.nomi = v
    },
    onRegionChange() {
      // Eski tuman yangi viloyatga to'g'ri kelmaydi — tozalanadi (tuman tanlanguncha saqlanmaydi).
      this.form.district = ''
    },
    async loadStaffCount() {
      try {
        const res = await this.$axios.$get(`/qarz-daftari/savdo-faoliyat/${this.faoliyat.id}/xodimlar`, { silent: true })
        this.staffCount = res && Array.isArray(res.data) ? res.data.length : 0
      } catch (_) {
        this.staffCount = null
      }
    },
    /** Har o'zgarishda holat belgisi yangilanadi. 13.10: avto-saqlash YO'Q — faqat "Saqlash" tugmasi saqlaydi. */
    schedule() {
      if (this.status === 'saving') return // tugagach `save` o'zi qayta tekshiradi
      if (!this.dirty) { this.status = this.status === 'saved' ? 'saved' : 'idle'; return }
      this.status = this.invalid ? 'invalid' : 'pending'
    },
    /**
     * Kutib turgan o'zgarishni DARHOL saqlaydi (yopish / boshqa sahifaga o'tish / blur).
     * @returns {Promise<boolean>} saqlanmagan o'zgarish qolmadimi
     */
    async flush() {
      clearTimeout(this.timer)
      this.timer = null
      if (this.inflight) await this.inflight
      if (!this.dirty) return true
      if (this.invalid) { this.status = 'invalid'; return false }
      this.inflight = this.save()
      let ok = false
      try { ok = await this.inflight } finally { this.inflight = null }
      // Saqlash paytida yana o'zgartirilgan bo'lsa — oxirgi holatni ham shu yerda saqlaymiz.
      if (!ok && this.status !== 'error' && this.dirty && !this.invalid) return this.flush()
      return ok
    },
    async save() {
      const snap = this.current
      this.status = 'saving'
      this.errorMsg = ''
      try {
        const res = await this.$axios.$put(
          `/qarz-daftari/savdo-faoliyat/${this.faoliyat.id}`,
          { nomi: snap.nomi, region: snap.region, district: snap.district },
          { silent: true },
        )
        this.savedSnap = snap
        this.$emit('updated', res)
        if (this.dirty) { this.status = 'idle'; this.schedule(); return false }
        this.status = 'saved'
        clearTimeout(this.justSavedTimer)
        this.justSavedTimer = setTimeout(() => { if (this.status === 'saved') this.status = 'idle' }, JUST_SAVED_MS)
        return true
      } catch (e) {
        this.status = 'error'
        this.errorMsg = (e && e.response && e.response.data && e.response.data.message) || this.tx.genericError
        return false
      }
    },
    remKey(r) { return JSON.stringify([!!r.enabled, r.time, [...r.days].sort()]) },
    async loadReminder() {
      try {
        const res = await this.$axios.$get(`/qarz-daftari/savdo-faoliyat/${this.faoliyat.id}/eslatma`, { silent: true })
        const d = res && res.data
        if (d) {
          this.rem = { enabled: !!d.enabled, time: d.time || '21:00', days: Array.isArray(d.days) ? d.days : [] }
          this.remSavedKey = this.remKey(this.rem)
        }
      } catch (_) { /* yuklanmasa — standart qiymatlar */ }
    },
    toggleReminder() {
      this.rem.enabled = !this.rem.enabled
      if (this.rem.enabled && !this.rem.days.length) this.rem.days = [0, 1, 2, 3, 4, 5, 6]
      this.scheduleReminder()
    },
    toggleDay(day) {
      this.rem.days = this.rem.days.includes(day) ? this.rem.days.filter((d) => d !== day) : [...this.rem.days, day]
      this.scheduleReminder()
    },
    scheduleReminder() {
      clearTimeout(this.remTimer)
      this.remTimer = setTimeout(() => { this.saveReminder() }, 500)
    },
    async saveReminder() {
      clearTimeout(this.remTimer)
      this.remTimer = null
      const r = { enabled: this.rem.enabled, time: this.rem.time, days: [...this.rem.days] }
      if (this.remKey(r) === this.remSavedKey) return true
      if (r.enabled && !r.days.length) return false
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(r.time)) return false
      try {
        await this.$axios.$put(`/qarz-daftari/savdo-faoliyat/${this.faoliyat.id}/eslatma`, r, { silent: true })
        this.remSavedKey = this.remKey(r)
        this.remStatus = 'saved'
        return true
      } catch (e) {
        this.remStatus = 'error'
        if (this.$toast && this.$toast.error) this.$toast.error((e && e.response && e.response.data && e.response.data.message) || this.tx.genericError)
        return false
      }
    },
    /** 13.10: rekvizitlar avto-saqlanmaydi — saqlanmagan o'zgarish bo'lsa, yopishdan oldin tasdiq so'raladi. */
    async settle() {
      if (this.remTimer) await this.saveReminder()
      if (this.inflight) await this.inflight
      if (!this.dirty) return true
      return window.confirm(this.tx.unsavedConfirm)
    },
    async close() {
      if (!(await this.settle())) return
      this.$emit('close')
    },
  },
}
</script>
