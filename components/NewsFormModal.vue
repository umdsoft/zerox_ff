<template>
    <div>
        <div v-if="show" @click="close"
            class="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"></div>

        <div v-if="show"
            class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 bg-white rounded-lg shadow-lg p-6 z-50 transition-all duration-300 overflow-y-auto"
            style="height: 750px;">
            <h2 class="text-xl mb-4">
                {{ isEditMode ? "Yangilikni Tahrirlash" : "Yangilik Qo'shish" }}
            </h2>

            <form @submit.prevent="submitForm" class="space-y-4">
                <p>Tilni tanlang</p>
                <select v-model="localNews.lang"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="uz">O'zbek (lotin)</option>
                    <option value="ru">Ruscha</option>
                    <option value="kr">O'zbek (kirill)</option>
                </select>
                <input v-model="localNews.title" placeholder="Mavzu" type="text"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input v-model="localNews.youtube" placeholder="YouTube video link" type="text"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />


                <input type="file" accept="image/*" @change="handleImageUpload"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />

                <div>
                    <p>Tavsif</p>
                    <quill-editor ref="myQuillEditor" v-model="localNews.description" :options="editorOption" />
                </div>


                <div class="flex justify-end space-x-4 pt-4">
                    <button @click="close" type="button" class="btn-secondary">
                        Yopish
                    </button>
                    <button type="submit" class="btn-primary" :disabled="isLoading">
                        {{ isLoading ? 'Saqlanmoqda...' : 'Saqlash' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import FormData from 'form-data';

export default {
    props: {
        // Modalni ko'rsatish/yashirish uchun prop
        show: {
            type: Boolean,
            default: false,
        },
        // Tahrirlash uchun keladigan ma'lumot
        initialData: {
            type: Object,
            default: null,
        },
        // "add" yoki "edit" rejimi
        mode: {
            type: String,
            default: 'add',
        }
    },
    data() {
        return {
            isLoading: false,
            // Formaning lokal ma'lumotlari uchun
            localNews: {
                lang: "uz",
                title: "",
                description: "",
                youtube: "",
                img: null,
            },
            editorOption: {
                theme: 'snow',
                placeholder: 'Matnni shu yerda tahrirlang...',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'font': [] }],
                        [{ 'align': [] }],
                        ['clean'],
                        ['link', 'image', 'video']
                    ]
                }
            }
        };
    },
    computed: {
        isEditMode() {
            return this.mode === 'edit';
        }
    },
    watch: {
        // `show` prop o'zgarganda ishlaydi
        show(newValue) {
            if (newValue) {
                // Modal ochilganda, agar "edit" rejimi bo'lsa, ma'lumotlarni to'ldiramiz
                if (this.isEditMode && this.initialData) {
                    this.localNews = { ...this.initialData, img: null }; // img ni qayta tanlash uchun null qilamiz
                } else {
                    // Aks holda ("add" rejimi) formani tozalaymiz
                    this.resetForm();
                }
            }
        }
    },
    methods: {
        // Rasmni `localNews` ga saqlash
        handleImageUpload(event) {
            this.localNews.img = event.target.files[0] || null;
        },
        // Formani yopish uchun event jo'natish
        close() {
            this.$emit('close');
        },
        // Formani tozalash
        resetForm() {
            this.localNews = {
                title_uz: '', title_cyrl: '', title_ru: '',
                description_uz: '', description_cyrl: '', description_ru: '',
                img: null,
            };
        },
        // Formani serverga jo'natish
        async submitForm() {
            this.isLoading = true;
            const formData = new FormData();

            // localNews dagi har bir maydonni FormData ga qo'shish
            for (const key in this.localNews) {
                if (this.localNews[key] !== null) {
                    formData.append(key, this.localNews[key]);
                }
            }

            try {
                if (this.isEditMode) {
                    // Tahrirlash
                    await this.$axios.$put(`news/${this.initialData.id}`, formData);
                } else {
                    // Qo'shish
                    await this.$axios.$post("news/create", formData);
                }
                this.$emit('form-submitted'); // Ota-komponentga "ish bajarildi" signalini yuborish
                this.close(); // Modalni yopish
            } catch (error) {
                console.error("Xatolik yuz berdi:", error);
                alert("Xatolik yuz berdi! Konsolni tekshiring.");
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

<style>
/* ----- INPUT MAYDONLARI UCHUN STILLAR ----- */
.form-input {
    width: 100%;
    padding: 0.5rem;
    /* 8px */
    border: 1px solid #d1d5db;
    /* gray-300 */
    border-radius: 0.375rem;
    /* 6px */
    transition: border-color 0.2s ease-in-out;
}

.form-input:focus {
    outline: none;
    border-color: #60a5fa;
    /* blue-400 */
}

/* ----- ASOSIY TUGMA (SAQLASH) UCHUN STILLAR ----- */
.btn-primary {
    background-color: #16a34a;
    /* green-600 */
    color: white;
    padding: 0.5rem 1rem;
    /* 8px 16px */
    border-radius: 0.375rem;
    /* 6px */
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

.btn-primary:hover {
    background-color: #15803d;
    /* green-700 */
}

/* Tugma nofaol bo'lganda ishlaydigan stil */
.btn-primary:disabled {
    background-color: #9ca3af;
    /* gray-400 */
    cursor: not-allowed;
}

/* ----- IKKILAMCHI TUGMA (YOPISH) UCHUN STILLAR ----- */
.btn-secondary {
    background-color: #dc2626;
    /* red-600 */
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

.btn-secondary:hover {
    background-color: #b91c1c;
    /* red-700 */
}

/* ----- QUILL EDITOR UCHUN MINIMAL BALANDLIK ----- */
.ql-editor {
    min-height: 200px;
}
</style>