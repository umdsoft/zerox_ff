import Vue from 'vue'

Vue.directive('format', {
    bind: function (el, binding, vnode) {
        const input = el;
        input.addEventListener('input', function () {

        if (!/^\w+$/.test(binding.expression)) return;
        vnode.context.$data[binding.expression] = input.value.toString().split(' ').join('')
        });
    },
    update: function (el, binding) {
        const input = el;
        input.value = binding.value.toString().split('').filter(char => char !== " ").join('').toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }
})