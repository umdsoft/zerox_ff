<template>
  <div v-if="newsList != null">
    <h2 class="text-sm font-bold mb-4 text-gray-800">Barcha yangiliklar</h2>

    <div class="flex flex-col gap-4 max-w-[340px]">
      <div v-for="newsItem in newsList" :key="newsItem.id" class="bg-white rounded-xl p-2 flex gap-3"
        style="width: 345px">
        <div class="flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden" style="width: 120px; height: 120px">
          <img v-if="newsItem.img" :src="`https://app.zerox.uz${newsItem.img}`" :alt="newsItem.title" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
              </path>
            </svg>
          </div>
        </div>

        <div class="flex flex-col flex-grow min-w-0">
          <nuxt-link :to="localePath({
            name: 'news-id', params: {
              id: newsItem.id,
            },
          })" class="text-sm font-semibold text-gray-900 break-words">
            {{ newsItem.title }}
          </nuxt-link>

          <div class="mt-auto text-xs text-gray-500 pt-2">
            {{ dateFormat(newsItem.created) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";

export default {
  data() {
    return {
      newsList: null
    };
  },
  mounted() {
    this.getNews()
  },
  methods: {
    async getNews() {
      try {
        const news = await this.$axios.$get(`news/get?lang=${this.$i18n.locale}&limit=2`);
        this.newsList = news.data;
      } catch (err) {
        console.error("❌ Yangiliklarni olishda xatolik:", err);
      }
    },
    dateFormat(date) {
      return dateformat(date, "dd.mm.yyyy");
    },
  },
};
</script>