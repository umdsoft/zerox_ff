/**
 * ZeroX - Main Plugin
 * Vue global metodlar va direktivalar
 */

import Vue from 'vue'
import { beautySum, dateBeauty } from "@/utils/format";

// Default placeholder rasm
const DEFAULT_IMAGE = '/placeholder-image.svg';

/**
 * Beauty Plugin - Raqam va sana formatlash
 */
const beauty = {
    install(Vue) {
        // Amallar utils/format.js da (xatti-harakat o'zgarmagan)
        Vue.prototype.beautySum = beautySum
        Vue.prototype.dateBeauty = dateBeauty
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
