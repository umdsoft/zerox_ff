<template>
  <div class="index">
    <div v-if="!$auth.loggedIn">
      <p>{{ asd }}</p>
      <banner />
    </div>

    <IdenMessage v-if="idenNotification" @removeIdenModal="removeIdenModal" />
    <contractModal v-if="contractM" @removeContractModal="removeContractModal"
      @closeContractModal="closeContractModal" />

    <div>
      <!-- charts -->
      <div v-if="$auth.loggedIn" class="mt-10 self-stretch">

        <!-- ✅ Desktop/Tablet (>= md): KOD O'ZGARMAGAN — aynan siz jo'natgan parcha -->
        <div class="hidden md:grid gap-5 items-stretch grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8">
          <!-- Debitor chart -->
          <div class="shadow debtor-sum flex justify-center rounded-xl bg-white p-5 h-full">
            <div>
              <h1 class="text-xl font-normal text-center text-t_bl mb-1 texs font-bold">
                {{ $t('home.contracts') }}
              </h1>

              <div class="justify-center" v-if="isChart">
                <client-only>
                  <apexchart v-if="dall != 0" type="pie" width="380" :options="chartOptions" :series="seriesd"
                    :key="chartKeyD" />
                </client-only>

                <div v-if="$auth.user.is_active == 0 || dall == 0" class="flex justify-center">
                  <IconPiePlaceholder :width="200" :height="200" />
                </div>
              </div>
            </div>
          </div>

          <!-- Kreditor chart -->
          <div class="shadow debtor-sum flex justify-center rounded-xl bg-white p-5 h-full">
            <div>
              <h1 class="text-xl font-normal text-center text-t_bl mb-1 texs font-bold">
                {{ $t('home.contracts1') }}
              </h1>

              <div class="justify-center" v-if="isChart">
                <client-only>
                  <apexchart v-if="call != 0" type="pie" width="380" :options="chartOptions2" :series="seriesc"
                    :key="chartKeyC" />
                </client-only>

                <div v-if="$auth.user.is_active == 0 || call == 0" class="flex justify-center">
                  <IconPiePlaceholder :width="200" :height="200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ Mobile (< md): Karusel + indikatorlar -->
        <div class="md:hidden">
          <div ref="carousel"
            class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 space-x-4 scrollbar-hide">
            <!-- Slide 1 -->
            <section ref="slide0" class="min-w-[88%] flex-shrink-0 snap-center">
              <div class="shadow rounded-xl bg-white p-5">
                <h1 class="text-lg font-bold text-center texs text-t_bl mb-1">
                  {{ $t('home.contracts') }}
                </h1>

                <div class="justify-center" v-if="isChart">
                  <client-only>
                    <!-- Mobil uchun: legend pastda, markazda; width 100% -->
                    <!-- Debitor slayd -->
                    <apexchart v-if="dall != 0" type="pie" width="100%" :options="chartOptionsMobileRightDeb"
                      :series="seriesd" :key="`m-${chartKeyD}`" />
                  </client-only>

                  <div v-if="$auth.user.is_active == 0 || dall == 0" class="flex justify-center">
                    <IconPiePlaceholder :width="200" :height="200" />
                  </div>
                </div>
              </div>
            </section>

            <!-- Slide 2 -->
            <section ref="slide1" class="min-w-[88%] flex-shrink-0 snap-center">
              <div class="shadow rounded-xl bg-white p-5">
                <h1 class="text-lg font-bold text-center texs text-t_bl mb-1">
                  {{ $t('home.contracts1') }}
                </h1>

                <div class="justify-center" v-if="isChart">
                  <client-only>
                    <apexchart v-if="call != 0" type="pie" width="100%" :options="chartOptionsMobileRightCred"
                      :series="seriesc" :key="`m-${chartKeyC}`" />
                  </client-only>

                  <div v-if="$auth.user.is_active == 0 || call == 0" class="flex justify-center">
                    <IconPiePlaceholder :width="200" :height="200" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- indikator nuqtalar -->
          <div class="mt-3 flex items-center justify-center space-x-2 select-none">
            <button v-for="i in 2" :key="`dot-${i}`" class="h-2.5 w-2.5 rounded-full transition-all duration-200"
              :class="activeSlide === (i - 1) ? 'bg-gray-800 scale-110' : 'bg-gray-300'" @click="goTo(i - 1)"
              aria-label="slide dot" />
          </div>
        </div>

      </div>

      <!-- give/take -->
      <div class="mt-4 md:mt-10">

        <!-- ✅ Desktop/Tablet (>=md): sizning asl grid (o‘zgarmagan) -->
        <div class="hidden md:grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-stretch gap-x-8">
          <div @click="giveMoney"
            class="shadow flex justify-between items-center bg-t_primary w-full rounded-xl p-5 cursor-pointer">
            <div class="text">
              <h1 class="text-white text-2xl font-normal">{{ $t('home.give') }}</h1>
            </div>
            <div class="iconn bg-white p-3 rounded-lg flex items-center">
              <IconGiveMoney :width="26" :height="25" />
            </div>
          </div>

          <div @click="takeMoney"
            class="shadow debtor flex justify-between items-center bg-t_primary w-full rounded-xl p-5 cursor-pointer">
            <div class="text">
              <h1 class="text-white text-2xl font-normal">{{ $t('home.take') }}</h1>
            </div>
            <div class="iconn bg-white p-3 rounded-lg flex items-center">
              <IconTakeMoney :width="26" :height="26" />
            </div>
          </div>
        </div>

        <!-- ✅ Mobile (<md): give/take karusel (kengroq, pastroq) -->
        <div class="md:hidden">
          <div ref="gtCarousel"
            class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 space-x-4 scrollbar-hide">
            <!-- Slide 1 -->
            <section ref="gtSlide0" class="min-w-[94%] flex-shrink-0 snap-center">
              <button @click="giveMoney"
                class="w-full shadow bg-t_primary rounded-xl px-5 py-3 flex items-center justify-between">
                <span class="text-white text-xl font-normal leading-none truncate">
                  {{ $t('home.give') }}
                </span>
                <span class="bg-white ml-3 px-2 py-2 rounded-lg flex items-center shrink-1">
                  <IconGiveMoney :width="20" :height="19" />
                </span>
              </button>
            </section>

            <!-- Slide 2 -->
            <section ref="gtSlide1" class="min-w-[94%] flex-shrink-0 snap-center">
              <button @click="takeMoney"
                class="w-full shadow bg-t_primary rounded-xl px-5 py-3 flex items-center justify-between">
                <span class="text-white text-xl font-normal leading-none truncate">
                  {{ $t('home.take') }}
                </span>
                <span class="bg-white ml-2 px-2 py-2 rounded-lg flex items-center shrink-0">
                  <IconTakeMoney :width="24" :height="24" />
                </span>
              </button>
            </section>
          </div>

          <!-- indikator nuqtalar (o‘sha-o‘sha) -->
          <!-- <div class="mt-3 flex items-center justify-center space-x-2 select-none">
    <button
      v-for="i in 2"
      :key="'gtdot-'+i"
      class="h-2.5 w-2.5 rounded-full transition-all duration-200"
      :class="activeGT === (i-1) ? 'bg-gray-800 scale-110' : 'bg-gray-300'"
      @click="goToGT(i-1)"
      aria-label="slide dot"
    />
  </div> -->
        </div>

      </div>


      <!-- debitor/creditor cards -->
      <div class="mt-10 self-stretch">
        <!-- >=md: ASL GRID — O'ZGARMAGAN -->
        <div class="hidden md:grid gap-5 items-stretch grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8">
          <nuxt-link :to="localePath({ name: 'debt-list' })">
            <div class="shadow debtor-sum flex justify-between rounded-xl bg-white p-5 h-full">
              <div>
                <h1 class="text-xl font-normal text-t_bl mb-1">{{ $t('home.debitor') }}</h1>
                <h2 v-if="debitorUzs != null" class="text-xl font-semibold text-t_gr">
                  {{ formatNum(debitorUzs.residual_amount) }} <span>UZS</span>
                </h2>
                <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>UZS</span></h2>
                <h2 v-if="debitorUsd != null" class="text-xl font-semibold text-t_gr mb-1">
                  {{ formatNum(debitorUsd.residual_amount) }} <span>USD</span>
                </h2>
                <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>USD</span></h2>
              </div>
              <div class="iconn">
                <IconDebitor :width="48" :height="48" />
              </div>
            </div>
          </nuxt-link>

          <nuxt-link :to="localePath({ name: 'credit-list' })">
            <div class="shadow debtor-sum flex justify-between rounded-xl bg-white p-5 h-full">
              <div>
                <h1 class="text-xl font-normal text-t_bl mb-1">{{ $t('home.creditor') }}</h1>
                <h2 v-if="creditorUzs != null" class="text-xl font-semibold text-t_gr">
                  {{ formatNum(creditorUzs.residual_amount) }} <span>UZS</span>
                </h2>
                <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>UZS</span></h2>
                <h2 v-if="creditorUsd != null" class="text-xl font-semibold text-t_gr mb-1">
                  {{ formatNum(creditorUsd.residual_amount) }} <span>USD</span>
                </h2>
                <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>USD</span></h2>
              </div>
              <div class="iconn">
                <IconCreditor :width="48" :height="48" />
              </div>
            </div>
          </nuxt-link>
        </div>

        <!-- <md: KARUSEL (ranglar o'sha, JS ifodalar o'sha) -->
        <div class="md:hidden">
          <div ref="dcCarousel"
            class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 space-x-4 scrollbar-hide">
            <!-- Debitor -->
            <section ref="dcSlide0" class="min-w-[94%] flex-shrink-0 snap-center">
              <nuxt-link :to="localePath({ name: 'debt-list' })" class="block">
                <div class="shadow debtor-sum flex justify-between rounded-xl bg-white p-4">
                  <div>
                    <h1 class="text-xl font-normal text-t_bl mb-1">{{ $t('home.debitor') }}</h1>
                    <h2 v-if="debitorUzs != null" class="text-xl font-semibold text-t_gr">
                      {{ formatNum(debitorUzs.residual_amount) }} <span>UZS</span>
                    </h2>
                    <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>UZS</span></h2>
                    <h2 v-if="debitorUsd != null" class="text-xl font-semibold text-t_gr mb-1">
                      {{ formatNum(debitorUsd.residual_amount) }} <span>USD</span>
                    </h2>
                    <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>USD</span></h2>
                  </div>
                  <div class="iconn ml-3">
                    <IconDebitor :width="44" :height="44" />
                  </div>
                </div>
              </nuxt-link>
            </section>

            <!-- Creditor -->
            <section ref="dcSlide1" class="min-w-[94%] flex-shrink-0 snap-center">
              <nuxt-link :to="localePath({ name: 'credit-list' })" class="block">
                <div class="shadow debtor-sum flex justify-between rounded-xl bg-white p-4">
                  <div>
                    <h1 class="text-xl font-normal text-t_bl mb-1">{{ $t('home.creditor') }}</h1>
                    <h2 v-if="creditorUzs != null" class="text-xl font-semibold text-t_gr">
                      {{ formatNum(creditorUzs.residual_amount) }} <span>UZS</span>
                    </h2>
                    <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>UZS</span></h2>
                    <h2 v-if="creditorUsd != null" class="text-xl font-semibold text-t_gr mb-1">
                      {{ formatNum(creditorUsd.residual_amount) }} <span>USD</span>
                    </h2>
                    <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>USD</span></h2>
                  </div>
                  <div class="iconn ml-3">
                    <IconCreditor :width="44" :height="44" />
                  </div>
                </div>
              </nuxt-link>
            </section>
          </div>

          <!-- indikator -->
          <!-- <div class="mt-3 flex items-center justify-center space-x-2 select-none">
      <button v-for="i in 2" :key="'dcdot-'+i"
        class="h-2.5 w-2.5 rounded-full transition-all duration-200"
        :class="activeDC === (i-1) ? 'bg-gray-800 scale-110' : 'bg-gray-300'"
        @click="goToDC(i-1)" />
    </div> -->
        </div>
      </div>


      <!-- expired -->
      <div class="mt-10 self-stretch">

        <!-- ✅ Desktop/Tablet (>=md): AYNAN O'ZGARMAGAN KODINGIZ -->
        <div class="hidden md:grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 items-center self-stretch">
          <div>
            <nuxt-link :to="localePath({ name: 'expired-debitor' })"
              class="shadow debtor-sum flex h-full justify-between rounded-xl px-4 py-4 bg-white">
              <div class="text">
                <h1 class="text-xl font-normal text-t_bl mb-3">{{ $t('home.expiredD') }}</h1>
                <h2 v-if="expiredDebitorUzs != null" class="text-xl font-semibold text-t_gr">
                  {{ formatNum(expiredDebitorUzs.residual_amount) }} UZS
                </h2>
                <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>UZS</span></h2>
                <h2 v-if="expiredDebitorUsd != null" class="text-xl font-semibold text-t_gr">
                  {{ formatNum(expiredDebitorUsd.residual_amount) }} USD
                </h2>
                <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>USD</span></h2>
              </div>
              <IconExpiredD :width="48" :height="48" />
            </nuxt-link>
          </div>

          <div>
            <nuxt-link :to="localePath({ name: 'expired-creditor' })"
              class="shadow debtor-sum h-full flex justify-between rounded-xl px-4 py-4 bg-white">
              <div class="text">
                <h1 class="text-xl font-normal text-t_bl mb-3">{{ $t('home.expiredC') }}</h1>
                <h2 v-if="expiredCreditorUzs != null" class="text-xl font-semibold text-t_gr">
                  {{ formatNum(expiredCreditorUzs.residual_amount) }} UZS
                </h2>
                <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>UZS</span></h2>
                <h2 v-if="expiredCreditorUsd != null" class="text-xl font-semibold text-t_gr">
                  {{ formatNum(expiredCreditorUsd.residual_amount) }} USD
                </h2>
                <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>USD</span></h2>
              </div>
              <IconExpiredC :width="48" :height="48" />
            </nuxt-link>
          </div>
        </div>

        <!-- ✅ Mobile (<md): karusel + indikator (ranglar va JS ifodalar aynan) -->
        <div class="md:hidden">
          <div ref="exCarousel"
            class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 space-x-4 scrollbar-hide">
            <!-- Slide 1: Expired Debitor -->
            <section ref="exSlide0" class="min-w-[94%] flex-shrink-0 snap-center">
              <nuxt-link :to="localePath({ name: 'expired-debitor' })" class="block">
                <div class="shadow debtor-sum flex h-full justify-between rounded-xl px-4 py-4 bg-white">
                  <div class="text">
                    <h1 class="text-xl font-normal text-t_bl mb-3">{{ $t('home.expiredD') }}</h1>
                    <h2 v-if="expiredDebitorUzs != null" class="text-xl font-semibold text-t_gr">
                      {{ formatNum(expiredDebitorUzs.residual_amount) }} UZS
                    </h2>
                    <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>UZS</span></h2>
                    <h2 v-if="expiredDebitorUsd != null" class="text-xl font-semibold text-t_gr">
                      {{ formatNum(expiredDebitorUsd.residual_amount) }} USD
                    </h2>
                    <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>USD</span></h2>
                  </div>
                  <!-- ikonani mobilda biroz kichikroq -->
                  <IconExpiredD :width="44" :height="44" class="ml-3" />
                </div>
              </nuxt-link>
            </section>

            <!-- Slide 2: Expired Creditor -->
            <section ref="exSlide1" class="min-w-[94%] flex-shrink-0 snap-center">
              <nuxt-link :to="localePath({ name: 'expired-creditor' })" class="block">
                <div class="shadow debtor-sum h-full flex justify-between rounded-xl px-4 py-4 bg-white">
                  <div class="text">
                    <h1 class="text-xl font-normal text-t_bl mb-3">{{ $t('home.expiredC') }}</h1>
                    <h2 v-if="expiredCreditorUzs != null" class="text-xl font-semibold text-t_gr">
                      {{ formatNum(expiredCreditorUzs.residual_amount) }} UZS
                    </h2>
                    <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>UZS</span></h2>
                    <h2 v-if="expiredCreditorUsd != null" class="text-xl font-semibold text-t_gr">
                      {{ formatNum(expiredCreditorUsd.residual_amount) }} USD
                    </h2>
                    <h2 v-else class="text-xl font-semibold text-t_gr mb-1">0 <span>USD</span></h2>
                  </div>
                  <IconExpiredC :width="44" :height="44" class="ml-3" />
                </div>
              </nuxt-link>
            </section>
          </div>

          <!-- indikator nuqtalar -->
          <div class="mt-3 flex items-center justify-center space-x-2 select-none">
            <!-- <button v-for="i in 2" :key="'exdot-' + i" class="h-2.5 w-2.5 rounded-full transition-all duration-200"
              :class="activeEX === (i - 1) ? 'bg-gray-800 scale-110' : 'bg-gray-300'" @click="goToEX(i - 1)"
              aria-label="expired slide dot" /> -->
          </div>
        </div>
      </div>


      <!-- near-expiration lists (UZS/USD tabs) -->
      <div class="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 mt-10 items-stretch self-stretch">
        <!-- Debitor -->
        <div class="shadow debitor w-full rounded-xl px-5 py-4 bg-white mb-10">
          <h1 class="text-xl font-normal text-t_bl border-b-2">{{ $t('home.ozD') }}</h1>

          <div class="flex items-center justify-between gap-3 mt-3">
            <div @click="handleTab('left', 1)" style="cursor:pointer"
              :class="tabLeft == 1 ? 'flex-1 py-1.5 rounded bg-blue-400 text-white font-medium text-center' : 'flex-1 py-1.5 rounded bg-gray-100 text-gray-700 text-center'">
              UZS
            </div>
            <div @click="handleTab('left', 2)" style="cursor:pointer"
              :class="tabLeft == 2 ? 'flex-1 py-1.5 rounded bg-blue-400 text-white font-medium text-center' : 'flex-1 py-1.5 rounded bg-gray-100 text-gray-700 text-center'">
              USD
            </div>
          </div>

          <div class="mt-3 overflow-hidden rounded-lg ring-1 ring-gray-200">
            <div class="grid grid-cols-2 bg-gray-50 px-3 py-2  font-medium text-gray-700 text-center">
              <span>{{ $t('home.time') }}</span>
              <span>{{ $t('home.sum') }}</span>
            </div>

            <ul role="list" class="divide-y divide-gray-100">
              <li v-for="(item, i) in debitorData" :key="i" class="m-0">
                <nuxt-link
                  :to="localePath({ name: 'near-expiration-debitor', query: { day: item.end_date, type: item.currency } })"
                  class="grid grid-cols-2 px-3 py-2 items-center text-center hover:bg-blue-50 focus:bg-blue-50 transition block">
                  <span v-html="getDays(item.end_date)"></span>
                  <span class="font-medium">{{ formatNum(item.residual_amount) }} {{ item.currency }}</span>
                </nuxt-link>
              </li>
              <li v-if="debitorData.length === 0" class="px-3 py-4 text-center text-gray-500">
                {{ $t('empty') }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Kreditor -->
        <div class="shadow debitor w-full rounded-xl px-5 py-4 bg-white mb-10">
          <h1 class="text-xl font-normal text-t_bl border-b-2">{{ $t('home.ozC') }}</h1>

          <div class="flex items-center justify-between gap-3 mt-3">
            <div @click="handleTab('right', 1)" style="cursor:pointer"
              :class="tabRight == 1 ? 'flex-1 py-1.5 rounded bg-blue-400 text-white font-medium text-center' : 'flex-1 py-1.5 rounded bg-gray-100 text-gray-700 text-center'">
              UZS
            </div>
            <div @click="handleTab('right', 2)" style="cursor:pointer"
              :class="tabRight == 2 ? 'flex-1 py-1.5 rounded bg-blue-400 text-white font-medium text-center' : 'flex-1 py-1.5 rounded bg-gray-100 text-gray-700 text-center'">
              USD
            </div>
          </div>

          <div class="mt-3 overflow-hidden rounded-lg ring-1 ring-gray-200">
            <div class="grid grid-cols-2 bg-gray-50 px-3 py-2 font-medium text-gray-700 text-center">
              <span>{{ $t('home.time') }}</span>
              <span>{{ $t('home.sum') }}</span>
            </div>

            <ul role="list" class="divide-y divide-gray-100">
              <li v-for="(item, i) in creditorData" :key="i" class="m-0">
                <nuxt-link
                  :to="localePath({ name: 'near-expiration-creditor', query: { day: item.end_date, type: item.currency } })"
                  class="grid grid-cols-2 px-3 py-2 items-center text-center hover:bg-blue-50 focus:bg-blue-50 transition block">
                  <span v-html="getDays(item.end_date)"></span>
                  <span class="font-medium">{{ formatNum(item.residual_amount) }} {{ item.currency }}</span>
                </nuxt-link>
              </li>
              <li v-if="creditorData.length === 0" class="px-3 py-4 text-center text-gray-500">
                {{ $t('empty') }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- reports -->
      <div class="mt-10 self-stretch">

        <!-- ✅ Desktop/Tablet (>=md): AYNAN O'ZGARMAGAN KODINGIZ -->
        <div class="hidden md:grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-stretch gap-x-8 self-stretch">
          <nuxt-link :to="localePath({ name: 'hisobot-debitor' })"
            class="shadow debtor flex bg-white justify-between items-center w-full rounded-xl p-4 h-full">
            <div class="text">
              <h1 class="text-xl font-normal text-t_bl">{{ $t('home.reportD') }}</h1>
            </div>
            <div class="iconn">
              <IconReportD :width="48" :height="48" />
            </div>
          </nuxt-link>

          <nuxt-link :to="localePath({ name: 'hisobot-creditor' })"
            class="shadow debtor flex bg-white justify-between items-center w-full rounded-xl p-4 h-full">
            <div class="text">
              <h1 class="text-xl font-normal text-t_bl">{{ $t('home.reportC') }}</h1>
            </div>
            <IconReportC :width="48" :height="48" />
          </nuxt-link>
        </div>

        <!-- ✅ Mobile (<md): Karusel + indikator (ranglar/JS aynan) -->
        <div class="md:hidden">
          <div ref="rpCarousel"
            class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 space-x-4 scrollbar-hide">
            <!-- Slide 1: Debitor hisobot -->
            <section ref="rpSlide0" class="min-w-[94%] flex-shrink-0 snap-center">
              <nuxt-link :to="localePath({ name: 'hisobot-debitor' })"
                class="shadow debtor flex bg-white justify-between items-center w-full rounded-xl p-4 h-full">
                <div class="text">
                  <h1 class="text-xl font-normal text-t_bl">{{ $t('home.reportD') }}</h1>
                </div>
                <!-- ikonani mobilda biroz kichikroq -->
                <div class="iconn">
                  <IconReportD :width="44" :height="44" class="ml-3"/>
                </div>
              </nuxt-link>
            </section>

            <!-- Slide 2: Creditor hisobot -->
            <section ref="rpSlide1" class="min-w-[94%] flex-shrink-0 snap-center">
              <nuxt-link :to="localePath({ name: 'hisobot-creditor' })"
                class="shadow debtor flex bg-white justify-between items-center w-full rounded-xl p-4 h-full">
                <div class="text">
                  <h1 class="text-xl font-normal text-t_bl">{{ $t('home.reportC') }}</h1>
                </div>
                <IconReportC :width="44" :height="44" class="ml-3"/>
              </nuxt-link>
            </section>
          </div>

          <!-- indikator nuqtalar -->
          <!-- <div class="mt-3 flex items-center justify-center space-x-2 select-none">
            <button v-for="i in 2" :key="'rpdot-' + i" class="h-2.5 w-2.5 rounded-full transition-all duration-200"
              :class="activeRP === (i - 1) ? 'bg-gray-800 scale-110' : 'bg-gray-300'" @click="goToRP(i - 1)"
              aria-label="reports slide dot" />
          </div> -->
        </div>
      </div>

    </div>

    <div>
      <bottom />
    </div>
  </div>
</template>

<script>
import Banner from "@/components/Banner.vue";
import NewsCard from "@/components/NewsCard.vue";
import LoginCard from "@/components/LoginCard.vue";
import Notification from "@/components/Notification.vue";
import IdenMessage from "@/components/IdenMessage.vue";
import Bottom from "@/components/bottom.vue";
import ContractModal from "../components/contractModal.vue";
import IconPiePlaceholder from '@/components/icons/IconPiePlaceholder.vue'
import IconGiveMoney from '@/components/icons/IconGiveMoney.vue'
import IconTakeMoney from '@/components/icons/IconTakeMoney.vue'
import IconDebitor from '@/components/icons/IconDebitor.vue'
import IconCreditor from '@/components/icons/IconCreditor.vue'
import IconExpiredD from '@/components/icons/IconExpiredD.vue'
import IconExpiredC from '@/components/icons/IconExpiredC.vue'
import IconReportD from '@/components/icons/IconReportD.vue'
import IconReportC from '@/components/icons/IconReportC.vue'

export default {
  auth: false,
  props: ["forceUpdateFuncs"],
  components: {
    Banner,
    NewsCard,
    LoginCard,
    Notification,
    Bottom,
    IdenMessage,
    ContractModal,
    IconPiePlaceholder,
    IconGiveMoney,
    IconTakeMoney,
    IconDebitor,
    IconCreditor,
    IconExpiredD,
    IconExpiredC,
    IconReportD,
    IconReportC
  },
  data() {
    return {
      // UI / modal
      idenNotification: false,
      contractM: false,

      // socket
      socket: null,

      // charts
      isChart: false,
      seriesd: [],
      seriesc: [],
      chartOptions: {
        chart: {
          type: "pie",
          width: 380,
          height: 300,
          toolbar: { show: false },
          animations: { enabled: false },       // ⚡
          redrawOnWindowResize: false,
          redrawOnParentResize: false,
        },
        dataLabels: { enabled: false },          // ⚡
        labels: [],
        legend: { position: "right", horizontalAlign: "center", offsetY: 30 },
        plotOptions: { pie: { expandOnClick: false } },
      },
      chartOptions2: {
        chart: {
          type: "pie",
          width: 380,
          height: 300,
          toolbar: { show: false },
          animations: { enabled: false },       // ⚡
          redrawOnWindowResize: false,
          redrawOnParentResize: false,
        },
        dataLabels: { enabled: false },          // ⚡
        labels: [],
        legend: { position: "right", horizontalAlign: "center", offsetY: 30 },
        plotOptions: { pie: { expandOnClick: false } },
      },

      // home data
      tabLeft: 1,
      activeSlide: 0,
      chartOptionsMobileRight: null,
      chartOptions2MobileRight: null,
      _ioCharts: null,
      chartOptionsMobileRightDeb: null,
      chartOptionsMobileRightCred: null,
      tabRight: 1,
      debitorUsd: null,
      debitorUzs: null,
      creditorUsd: null,
      creditorUzs: null,
      expiredDebitorUsd: null,
      expiredDebitorUzs: null,
      expiredCreditorUsd: null,
      expiredCreditorUzs: null,
      nearCreditor: [],
      nearDebitor: [],
      debitorData: [],
      creditorData: [],
      dall: 0,
      call: 0,

      // diff guard (bir xil ma’lumot kelsa re-render qilmaslik)
      lastSigD: "",
      lastSigC: "",
    };
  },

  computed: {
    isLoggedIn() { return !!this.$auth?.loggedIn; },
    userId() { return this.$auth?.user?.id || null; },
  },

  watch: {
    isLoggedIn(v) {
      if (v) { this.resetForNewUser(); this.safeInit(); }
      else { this.cleanupAll(); }
    },
    userId() {
      if (this.isLoggedIn) { this.resetForNewUser(); this.safeInit(); }
    },
  },
  created() {
    // i18n yordamchilari
    const t = (k) => (this.$te && this.$te(k)) ? this.$t(k) : k;

    // labels massivini **har doim** tarjima qilamiz (faqat mobil nusxada)
    const translatedLabels = (labels, fallback = []) => {
      const base = (labels && labels.length) ? labels : fallback;
      return base.map(l => t(l));
    };

    // legendda sonlarni ko'rsatish uchun formatter
    const makeLegendFormatter = (labelMapArr) => {
      // labelMapArr = ["Jarayonda", "Tugallangan", "Rad qilingan"]
      return (seriesName, opts) => {
        const idx = opts.seriesIndex;
        const name = labelMapArr[idx] || seriesName;
        const val = opts.w?.globals?.series?.[idx];
        return `${name}: ${val != null ? val : ''}`;
      };
    };

    // umumiy mobil sozlama (legend o‘ngda + pie chapda)
    const makeMobileRight = (opts = {}, fallbackLabels = []) => {
      const clone = JSON.parse(JSON.stringify(opts || {}));

      const labelsT = translatedLabels(opts.labels, fallbackLabels);
      clone.labels = labelsT;

      clone.legend = Object.assign({}, clone.legend, {
        position: 'right',
        horizontalAlign: 'left',
        offsetY: -8,
        offsetX: 6,
        floating: false,
        itemMargin: { horizontal: 8, vertical: 4 },
        markers: Object.assign({}, clone?.legend?.markers, { width: 8, height: 8, radius: 12 }),
        formatter: makeLegendFormatter(labelsT),   // ⬅️ shu yerda sonlar chiqadi
      });

      clone.chart = Object.assign({}, clone.chart, {
        width: '100%',
        height: 240,
        offsetX: -12, // pie’ni biroz chapga surish
      });

      clone.plotOptions = Object.assign({}, clone.plotOptions, {
        pie: Object.assign({}, (clone.plotOptions && clone.plotOptions.pie) || {}, {
          offsetY: 6,
          expandOnClick: false,
        })
      });

      return clone;
    };

    // Fallback label’lar (agar desktop opsiyalarda labels yo'q bo'lsa)
    const commonFallback = [
      this.$t("home.jarayon") || 'Jarayonda',
      this.$t('home.Completeds') || 'Tugallangan',
      this.$t('home.Rejected') || 'Rad qilingan'
    ];

    this.chartOptionsMobileRightDeb = makeMobileRight(this.chartOptions, commonFallback);
    this.chartOptionsMobileRightCred = makeMobileRight(this.chartOptions2, commonFallback);
  },

  // (IntersectionObserver/indikatorlar kodi avvalgidek qoladi)

  mounted() {
    this.$nuxt.$emit("forceUpdateParent");
    if (this.isLoggedIn) this.safeInit();
    if (!process.client) return

    // DOM tayyor bo‘lgach ishlatamiz
    this.$nextTick(() => {
      const container = this.$refs.carousel
      // Desktopda mobil blok umuman render qilinmagan bo‘lishi mumkin
      if (!container || !(container instanceof Element)) return

      // Slayd ref’larini to‘plab, faqat real DOM elementlarini qoldiramiz
      const rawSlides = [this.$refs.slide0, this.$refs.slide1]
      const slides = rawSlides.filter(el => el && el instanceof Element)
      if (!slides.length) return

      // IntersectionObserver
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = slides.indexOf(e.target)
            if (idx !== -1) this.activeSlide = idx
          }
        })
      }, { root: container, threshold: 0.6 })

      // Har bir slaydni xavfsiz observe qilamiz
      slides.forEach(el => io.observe(el))
      this._ioCharts = io
    })
  },

  beforeDestroy() {
    this.cleanupAll();
    if (this._ioCharts) {
      try { this._ioCharts.disconnect() } catch (e) { }
      this._ioCharts = null
    }
  },

  methods: {
    goTo(i) {
      const container = this.$refs.carousel
      const targets = [this.$refs.slide0, this.$refs.slide1].filter(el => el && el instanceof Element)
      const target = targets[i]
      if (!container || !target) return
      container.scrollTo({ left: target.offsetLeft - container.offsetLeft, behavior: 'smooth' })
      this.activeSlide = i
    },
    onScroll() {
      // bo‘sh
    },
    async safeInit() {
      try {
        await this.trySocketConnect();
        await this.loadChartData();
      } catch (e) { console.error(e); }
    },
    formatNum(val) {
      if (val == null) return '0'
      try {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      } catch (e) {
        return String(val)
      }
    },
    resetForNewUser() {
      this.isChart = false;
      this.seriesd = [];
      this.seriesc = [];
      this.nearCreditor = [];
      this.nearDebitor = [];
      this.debitorData = [];
      this.creditorData = [];
      this.debitorUsd = this.debitorUzs = null;
      this.creditorUsd = this.creditorUzs = null;
      this.expiredDebitorUsd = this.expiredDebitorUzs = null;
      this.expiredCreditorUsd = this.expiredCreditorUzs = null;
      this.dall = 0; this.call = 0;
      this.lastSigD = ""; this.lastSigC = "";
    },

    cleanupAll() {
      if (this.socket) {
        try { this.socket.close && this.socket.close(); } catch (_) { }
      }
      this.socket = null;
      this.isChart = false;
    },

    async trySocketConnect() {
      if (!this.isLoggedIn || !this.userId) return;
      if (this.socket) {
        try { this.socket.close && this.socket.close(); } catch (_) { }
        this.socket = null;
      }

      this.socket = this.$nuxtSocket({
        name: "home",
        channel: "/",
        secure: true,
        default: false,
        query: { uid: this.userId },
      });

      this.socket.emit("notification", { userId: this.userId }, () => { });

      if (this.$auth.user.is_active === 1 && this.$auth.user.is_contract === 0) {
        this.$router.push(this.localePath({ name: "unversal_contract" }));
      }
    },

    // juda tez ishlaydigan kichik “hash”
    _sig(j, t) {
      // faqat kerakli sonlarni qo‘shamiz
      return [
        t, j.chart?.jarayon | 0, j.chart?.tugallangan | 0, j.chart?.rad | 0, j.chart?.all | 0,
        (j.five?.length || 0), (j.expired?.length || 0), (j.data?.length || 0)
      ].join("-");
    },

    async loadChartData() {
      try {
        const headers = { "Cache-Control": "no-cache" };
        const [deb, cre] = await Promise.all([
          this.$axios.$get("/home/my?type=debitor", { headers }),
          this.$axios.$get("/home/my?type=creditor", { headers }),
        ]);

        const pack = d => ({
          five: d?.data?.five || [],
          chart: {
            jarayon: d?.data?.chart?.jarayon || 0,
            tugallangan: d?.data?.chart?.tugallangan || 0,
            rad: d?.data?.chart?.rad || 0,
            all: d?.data?.chart?.all || 0,
          },
          data: d?.data?.data || [],
          expired: d?.data?.expired || [],
        });

        const debitor = pack(deb);
        const creditor = pack(cre);

        // Agar ma’lumot o‘zgarmagan bo‘lsa — hech narsa qilmaymiz
        const sigD = this._sig(debitor, "d");
        const sigC = this._sig(creditor, "c");
        const sameD = sigD === this.lastSigD;
        const sameC = sigC === this.lastSigC;

        // --- Debitor
        if (!sameD) {
          const sD = [
            debitor.chart.jarayon,
            debitor.chart.tugallangan,
            debitor.chart.rad,
          ];
          // massivni joyida yangilash ⚡
          this.seriesd.splice(0, this.seriesd.length, ...sD);

          const newLabelsD = [
            `${this.$t("home.jarayon")}: ${sD[0]}`,
            `${this.$t("home.Completeds")}: ${sD[1]}`,
            `${this.$t("home.Rejected")}: ${sD[2]}`,
          ];
          if (String(this.chartOptions.labels) !== String(newLabelsD)) {
            this.chartOptions.labels = newLabelsD;
          }

          this.nearDebitor = debitor.five;
          this.dall = debitor.chart.all;
          this.debitorData = debitor.five.filter(i => i.currency === "UZS");
          this.debitorUsd = debitor.data.find(i => i.currency === "USD") || null;
          this.debitorUzs = debitor.data.find(i => i.currency === "UZS") || null;
          this.expiredDebitorUsd = debitor.expired.find(i => i.currency === "USD") || null;
          this.expiredDebitorUzs = debitor.expired.find(i => i.currency === "UZS") || null;

          this.lastSigD = sigD;
        }

        // --- Creditor
        if (!sameC) {
          const sC = [
            creditor.chart.jarayon,
            creditor.chart.tugallangan,
            creditor.chart.rad,
          ];
          this.seriesc.splice(0, this.seriesc.length, ...sC);

          const newLabelsC = [
            `${this.$t("home.jarayon")}: ${sC[0]}`,
            `${this.$t("home.Completeds")}: ${sC[1]}`,
            `${this.$t("home.Rejected")}: ${sC[2]}`,
          ];
          if (String(this.chartOptions2.labels) !== String(newLabelsC)) {
            this.chartOptions2.labels = newLabelsC;
          }

          this.nearCreditor = creditor.five;
          this.call = creditor.chart.all;
          this.creditorData = creditor.five.filter(i => i.currency === "UZS");
          this.creditorUsd = creditor.data.find(i => i.currency === "USD") || null;
          this.creditorUzs = creditor.data.find(i => i.currency === "UZS") || null;
          this.expiredCreditorUsd = creditor.expired.find(i => i.currency === "USD") || null;
          this.expiredCreditorUzs = creditor.expired.find(i => i.currency === "UZS") || null;

          this.lastSigC = sigC;
        }

        // Chartlar mavjud bo‘lsa – faqat joyida yangilaymiz ⚡
        this.isChart = true;
        this.$nextTick(() => this.refreshCharts());
      } catch (e) {
        console.error("Error loading chart data:", e);
        this.$toast?.error(this.$t("debt_list.a70"));
      }
    },

    refreshCharts() {
      // Agar apexchart'ga ref qo'ygan bo'lsangiz, shular bilan yangilaydi:
      // <apexchart ref="debitorChart" ...>
      // <apexchart ref="creditorChart" ...>
      try {
        if (this.$refs.debitorChart) {
          this.$refs.debitorChart.updateSeries(this.seriesd, true);
          this.$refs.debitorChart.updateOptions({ labels: this.chartOptions.labels }, false, true);
        }
        if (this.$refs.creditorChart) {
          this.$refs.creditorChart.updateSeries(this.seriesc, true);
          this.$refs.creditorChart.updateOptions({ labels: this.chartOptions2.labels }, false, true);
        }
      } catch (_) { }
    },

    handleTab(side, val) {
      const cur = val === 1 ? "UZS" : "USD";
      if (side === "left") { this.debitorData = this.nearDebitor.filter(i => i.currency === cur); this.tabLeft = val; }
      else { this.creditorData = this.nearCreditor.filter(i => i.currency === cur); this.tabRight = val; }
    },

    getDays(time) {
      const restTimeMillisec = new Date(time) - Date.now();
      if (restTimeMillisec < 0) {
        return `<span class='text-red-500'>${$nuxt.$t('a1.a56')}</span>`;
      }
      const fixedNumber = restTimeMillisec / (24 * 60 * 60 * 1000).toFixed(2);

      if (Math.ceil(fixedNumber) > 1 && Math.ceil(fixedNumber) < 4) {
        return `<span class='text-red-500'>${Math.ceil(fixedNumber).toFixed(
          0
        )} ${$nuxt.$t('a1.a57')}</span>`;
      }
      if (Math.ceil(fixedNumber) > 3 && Math.ceil(fixedNumber) < 5) {
        return `${Math.ceil(fixedNumber).toFixed(0)} ${$nuxt.$t('a1.a57')}`;
      }
      if (Math.ceil(fixedNumber) >= 5) {
        return `${Math.ceil(fixedNumber).toFixed(0)} ${$nuxt.$t('a1.a60')}`;
      }
      if (fixedNumber < 1 && fixedNumber > 0) {
        return `<span class='text-red-500' > ${$nuxt.$t('a1.a55')}</span>`;
      }
    },
    removeIdenModal() { clearTimeout(this.timeoutFunc); this.idenNotification = false; },
    removeContractModal() { this.contractM = false; if (process.client) window.location.reload(); },
    closeContractModal() { this.contractM = false; },

    giveMoney() {
      if (this.$auth.user.expiry_date && new Date(this.$auth.user.expiry_date) < new Date()) {
        return this.$toast.error(this.$t('a1.a104'))
      }
      if (!this.isLoggedIn) return this.$router.push(this.localePath({ name: "auth-login" }));
      if (this.$auth.user.is_active !== 1) return (this.idenNotification = true);
      if (!this.$auth.user.is_contract) return (this.contractM = true);
      this.$router.push(this.localePath({ name: "search-debitor" }));
    },
    takeMoney() {
      if (this.$auth.user.expiry_date && new Date(this.$auth.user.expiry_date) < new Date()) {
        return this.$toast.error(this.$t('a1.a104'))
      }
      if (!this.isLoggedIn) return this.$router.push(this.localePath({ name: "auth-login" }));
      if (this.$auth.user.is_active !== 1) return (this.idenNotification = true);
      if (!this.$auth.user.is_contract) return (this.contractM = true);
      this.$router.push(this.localePath({ name: "search-creditor" }));
    },
  },
};
</script>



<style lang="scss" scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media (max-width: 700px) {
  .news {
    display: block !important;
  }
}

.shadow {
  box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.06);
}

.news {
  display: grid;
  margin-top: 20px;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
}

div.debt {
  div.debt-left {
    width: 465px;

    div.debtor {
      padding: 20px 23px;
      cursor: pointer;
    }

    div.debtor-sum {
      padding: 18px 23px 11px 23px;
    }

    div.debitor {
      h1 {
        padding: 28px 106px 15px 23px;
      }

      table {
        width: 100%;

        th {
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          line-height: 15px;

          color: #a0aec0;
        }

        tr {
          td {
            padding: 14px 0;
          }
        }
      }

      // tr {
      //   border: 1px solid #e2e8f0;
      //   border-collapse: collapse;
      // }
    }
  }
}

.texs {
  color: rgb(11, 115, 242);
}
</style>
