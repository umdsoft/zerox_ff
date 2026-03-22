<template>
    <div>
        <div v-if="$i18n.locale == 'uz'">
            <div>
                <p class="text-gray-700 mb-2">
                    <b>ID karta (pasport) ning amal qilish muddati o‘tganligi to‘g‘risida</b>
                </p>
                <p class="mt-2">
                    ID karta (pasport)ning amal qilish muddati tugagan. Iltimos, tizimdan to’liq foydalanish uchun qayta identifikatsiyadan o’ting.
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
                    ID карта (паспорт)нинг амал қилиш муддати тугаган. Илтимос, тизимдан тўлиқ фойдаланиш учун қайта идентификациядан ўтинг.
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
                    Срок действия ID-карты (паспорта) истек. Пожалуйста, пройдите повторную идентификацию, чтобы в полной мере использовать систему.
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
import notificationMixin from '~/mixins/notificationMixin';

export default {
    name: "debt-demand",
    mixins: [notificationMixin],
    methods: {
        async update() {
            try {
                await this.$router.push(this.localePath({ name: `near-expiration-creditor-notification` }));

            } catch (err) {
                this.$toast.error(this.$t('a1.a42'));
            }
        },
    },
};
</script>

<style></style>
