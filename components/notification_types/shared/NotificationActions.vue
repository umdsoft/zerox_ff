<template>
  <div class="notification-actions">
    <div>
      <span><b>{{ $t("comp.time") }}:</b> {{ time }}</span>
    </div>
    <div class="notification-actions__buttons">
      <!-- PDF ko'rish -->
      <a v-if="pdfUrl" :href="pdfUrl" target="_blank">
        <button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
          {{ $t("comp.full") }}
        </button>
      </a>

      <!-- Custom action button -->
      <button
        v-if="customAction"
        class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
        @click="$emit('custom-action')"
      >
        {{ customActionText }}
      </button>

      <!-- Accept button (qisman qaytarish uchun) -->
      <button
        v-if="showAccept"
        class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
        @click="$emit('accept')"
      >
        {{ $t("process.accept") }}
      </button>

      <!-- Full return button (to'liq qaytarish uchun) -->
      <button
        v-if="showFullReturn"
        class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
        @click="$emit('full-return')"
      >
        {{ $t("process.accept") }}
      </button>

      <!-- Ok button -->
      <button
        v-if="showOk"
        class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
        @click="$emit('ok')"
      >
        Ok
      </button>

      <!-- Cancel button -->
      <button
        v-if="showCancel"
        class="bg-red-500 py-1 px-4 rounded text-white"
        @click="$emit('cancel')"
      >
        {{ $t("comp.cancel") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationActions',
  props: {
    time: {
      type: String,
      default: ''
    },
    pdfUrl: {
      type: String,
      default: ''
    },
    showAccept: {
      type: Boolean,
      default: true
    },
    showFullReturn: {
      type: Boolean,
      default: false
    },
    showOk: {
      type: Boolean,
      default: false
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    customAction: {
      type: Boolean,
      default: false
    },
    customActionText: {
      type: String,
      default: ''
    }
  }
};
</script>
