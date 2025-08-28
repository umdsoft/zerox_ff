<template>
    <div
        class="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300">
        <div v-if="item.img && !item.youtube" class="w-full">
            <img :src="`https://app.zerox.uz${item.img}`" :alt="item.title" class="w-full h-48 object-cover">
        </div>

        <div v-else-if="item.youtube" class="w-full">
            <iframe :src="item.youtube" class="w-full h-48" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800">{{ item.title }}</h3>
            <div class="pt-2">
                <i class="fas fa-calendar"></i>
                <span>{{ dateFormat(item.created) }}</span>
            </div>
            <p class="text-gray-600 mt-2">{{ item.description }}</p>
        </div>
    </div>
</template>

<script>
import dateformat from "dateformat";

export default {
    name: 'NewsCard',
    props: ["item", "getNews"],
    data() {
        return {
            image: null // O'zgaruvchi null bilan boshlangan holda saqlanadi
        };
    },
    mounted() {
        // Null kontrol
        if (this.item && this.item.img) {
            this.image = `http://localhost:5000/${this.item.img}`;
        } else {
            console.warn("Rasm manzili topilmadi");
        }
    },
    methods: {
        dateFormat(date) {
            return dateformat(date, "dd.mm.yyyy");
        }
    }
}
</script>