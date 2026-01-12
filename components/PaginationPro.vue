<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <!-- Info text -->
    <div class="text-sm text-gray-600">
      <span class="font-medium text-gray-900">{{ startItem }}-{{ endItem }}</span>
      dan
      <span class="font-medium text-gray-900">{{ totalItems }}</span>
      ta
    </div>

    <!-- Pagination controls -->
    <div class="flex items-center gap-1">
      <!-- First page -->
      <button
        @click="goToPage(0)"
        :disabled="currentPage === 0"
        :class="[
          'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all',
          currentPage === 0
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
        ]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>

      <!-- Previous page -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 0"
        :class="[
          'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all',
          currentPage === 0
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
        ]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Page numbers -->
      <div class="flex items-center gap-1">
        <template v-for="(pageNum, index) in visiblePages">
          <span
            v-if="pageNum === '...'"
            :key="'dots-' + index"
            class="w-9 h-9 flex items-center justify-center text-gray-400"
          >
            ...
          </span>
          <button
            v-else
            :key="pageNum"
            @click="goToPage(pageNum)"
            :class="[
              'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all',
              currentPage === pageNum
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
            ]"
          >
            {{ pageNum + 1 }}
          </button>
        </template>
      </div>

      <!-- Next page -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages - 1"
        :class="[
          'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all',
          currentPage >= totalPages - 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
        ]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Last page -->
      <button
        @click="goToPage(totalPages - 1)"
        :disabled="currentPage >= totalPages - 1"
        :class="[
          'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all',
          currentPage >= totalPages - 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
        ]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginationPro',
  props: {
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    page: {
      type: Number,
      default: 0
    },
    maxVisiblePages: {
      type: Number,
      default: 5
    }
  },
  computed: {
    currentPage() {
      return this.page
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage) || 1
    },
    startItem() {
      if (this.totalItems === 0) return 0
      return this.currentPage * this.itemsPerPage + 1
    },
    endItem() {
      const end = (this.currentPage + 1) * this.itemsPerPage
      return Math.min(end, this.totalItems)
    },
    visiblePages() {
      const pages = []
      const total = this.totalPages
      const current = this.currentPage
      const maxVisible = this.maxVisiblePages

      if (total <= maxVisible + 2) {
        for (let i = 0; i < total; i++) {
          pages.push(i)
        }
      } else {
        pages.push(0)

        let start = Math.max(1, current - Math.floor(maxVisible / 2))
        let end = Math.min(total - 2, current + Math.floor(maxVisible / 2))

        if (current <= Math.floor(maxVisible / 2)) {
          end = maxVisible - 1
        }
        if (current >= total - 1 - Math.floor(maxVisible / 2)) {
          start = total - maxVisible
        }

        if (start > 1) {
          pages.push('...')
        }

        for (let i = start; i <= end; i++) {
          pages.push(i)
        }

        if (end < total - 2) {
          pages.push('...')
        }

        pages.push(total - 1)
      }

      return pages
    }
  },
  methods: {
    goToPage(page) {
      if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
        this.$emit('page-change', page)
      }
    }
  }
}
</script>
