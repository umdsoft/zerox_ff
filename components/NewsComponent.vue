<template>
    <div
        class="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300">
        <div v-if="item.img && !item.youtube" class="w-full">
            <img :src="imageUrl" :alt="item.title" class="w-full h-48 object-cover">
        </div>

        <div v-else-if="item.youtube" class="w-full">
            <iframe :src="item.youtube" class="w-full h-48" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800">{{ item.title }}</h3>
            <div class="pt-2">
                <i class="fas fa-calendar"></i>
                <span>{{ $formatDate(item.created) }}</span>
            </div>
            <p class="text-gray-600 mt-2">{{ item.description }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewsCard',
    props: ["item", "getNews"],
    computed: {
        imageUrl() {
            if (!this.item?.img) return '';
            if (this.item.img.startsWith('http')) return this.item.img;
            const base = this.$config?.backendURL || '';
            return `${base}${this.item.img}`;
        },
    },
    methods: {
    }
}
</script>