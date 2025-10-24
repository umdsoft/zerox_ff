<template>
    <div>
        <div v-if="$i18n.locale == 'uz'">
            <div>
                <p class="text-gray-700 mb-2">
                    <b>ID karta (pasport) ning amal qilish muddati o‘tganligi to‘g‘risida</b>
                </p>
                <p class="mt-2">
                    Hurmatli foydalanuvchi, ID karta (pasport) muddati o‘tganligi sababli Siz tizimning asosiy
                    funksiyalaridan foydalana olmaysiz. Iltimos, tizimdan to‘liq foydalanish uchun quyidagi havola
                    orqali mobil ilovani yuklab oling va qayta identifikatsiyadan o‘ting.
                </p>
                <div class="notification-actions">
                    <div>
                        <span><b>{{ $t("comp.time") }}:</b>
                            {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
                    </div>
                    <div class="notification-actions__buttons">
                        <!-- <button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white" @click="update(item.id, 1)">
                            Identifikatsiyadan o‘tish
                        </button> -->
                        <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="$i18n.locale == 'kr'">
            <div>
                <p class="text-gray-700 mb-2">
                    <b>ID карта (паспорт) нинг амал қилиш муддати ўтганлиги тўғрисида</b>
                </p>
                <p class="mt-2">
                    Ҳурматли фойдаланувчи, ID карта (паспорт) муддати ўтганлиги сабабли Сиз тизимнинг асосий
                    функцияларидан фойдалана олмайсиз. Илтимос, тизимдан тўлиқ фойдаланиш учун қуйидаги ҳавола орқали
                    мобил иловани юклаб олинг ва қайта идентификациядан ўтинг.
                </p>
                <div class="notification-actions">
                    <div>
                        <span><b>{{ $t("comp.time") }}:</b>
                            {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
                    </div>
                    <div class="notification-actions__buttons">
                        <!-- <button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white" @click="update(item.id, 1)">
                            Идентификациядан ўтиш
                        </button> -->
                        <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="$i18n.locale == 'ru'">
            <div>
                <p class="text-gray-700 mb-2">
                    <b>Срок действия ID-карты (паспорта) истёк</b>
                </p>
                <p class="mt-2">
                    Уважаемый пользователь, Вы не можете использовать основные функции системы, потому что срок действия вашей ID-карты (паспорта) истек. Пожалуйста, загрузите мобильное приложение по ссылке ниже и пройдите повторную идентификацию, чтобы в полной мере использовать систему.
                </p>
                <div class="notification-actions">
                    <div>
                        <span><b>{{ $t("comp.time") }}:</b>
                            {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
                    </div>
                    <div class="notification-actions__buttons">
                        <!-- <button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white" @click="update(item.id, 1)">
                            Пройти идентификацию
                        </button> -->
                        <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dateformat from "dateformat";
export default {
    name: "debt-demand",
    props: ["item", "getNotifications"],
    mounted() {

    },
    methods: {
        dateFormat(date) {
            let date1 = dateformat(date, "isoDate");
            date1 = date1.split("-").reverse();
            date1 = date1.join(".");
            return date1;
        },
        async ok(id) {
            try {
                await this.$axios.$put(`/notification/ok/${id}`);
                this.$toast.success($nuxt.$t('a1.a43'));

            } catch (err) {
                this.$toast.error($nuxt.$t('a1.a42'));
            }
        },
        async update() {
            try {
                await this.$router.push(this.localePath({ name: `near-expiration-creditor-notification` }));

            } catch (err) {
                this.$toast.error($nuxt.$t('a1.a42'));
            }
        },
    },
};
</script>

<style></style>
