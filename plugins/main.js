/**
 * ZeroX - Main Plugin
 * Vue global metodlar va direktivalar
 */

import Vue from 'vue'
import dateformat from "dateformat";

// Default placeholder rasm
const DEFAULT_IMAGE = '/placeholder-image.svg';

/**
 * Beauty Plugin - Raqam va sana formatlash
 */
const beauty = {
    install(Vue) {
        /**
         * Raqamni formatlash (1000000 -> 1 000 000)
         * @param {number|string} num - Formatlanadigan raqam
         * @returns {string}
         */
        Vue.prototype.beautySum = (num) => {
            if (num === null || num === undefined) return '0';
            const number = parseInt(num);
            if (isNaN(number)) return '0';
            return number.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
        }

        /**
         * Sanani formatlash (yyyy-mm-dd -> dd.mm.yyyy)
         * @param {Date|string} date - Formatlanadigan sana
         * @returns {string}
         */
        Vue.prototype.dateBeauty = (date) => {
            if (!date) return '';
            try {
                const date1 = dateformat(date, "isoDate");
                return date1.split("-").reverse().join(".");
            } catch {
                return '';
            }
        }
    },
}

/**
 * Click Outside Directive
 * Element tashqarisiga bosilganda funksiyani chaqiradi
 * Foydalanish: v-click-out="closeDropdown"
 */
Vue.directive('click-out', {
    bind(el, binding, vnode) {
        el._clickOutsideEvent = function(event) {
            if (!(el === event.target || el.contains(event.target))) {
                if (typeof binding.value === 'function') {
                    binding.value(event);
                } else if (vnode.context && binding.expression) {
                    const handler = vnode.context[binding.expression];
                    if (typeof handler === 'function') {
                        handler(event);
                    }
                }
            }
        }
        document.body.addEventListener('click', el._clickOutsideEvent);
    },
    unbind(el) {
        if (el._clickOutsideEvent) {
            document.body.removeEventListener('click', el._clickOutsideEvent);
            delete el._clickOutsideEvent;
        }
    },
});

/**
 * Image Fallback Directive
 * Rasm yuklanmasa placeholder ko'rsatadi
 * Foydalanish: v-img-fallback yoki v-img-fallback="/custom-placeholder.svg"
 */
Vue.directive('img-fallback', {
    bind(el, binding) {
        el.onerror = function() {
            el.onerror = null; // Infinite loop oldini olish
            el.src = binding.value || DEFAULT_IMAGE;
            el.classList.add('img-fallback-applied');
        }
    }
});

/**
 * Global Image Error Handler
 * Rasm 404 xatolarini graceful handle qilish
 */
if (typeof window !== 'undefined') {
    window.addEventListener('error', function(e) {
        if (e.target && e.target.tagName === 'IMG') {
            e.preventDefault();
            e.stopPropagation();
            if (e.target.src && !e.target.src.includes('placeholder')) {
                e.target.src = DEFAULT_IMAGE;
            }
        }
    }, true);
}

Vue.use(beauty);
