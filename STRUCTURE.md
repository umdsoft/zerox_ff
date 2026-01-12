# ZeroX Project Structure

Loyiha tuzilishi va kod yozish qoidalari.

## Papkalar Strukturasi

```
zerox_fftoza/
├── assets/              # CSS, SCSS, rasmlar
│   ├── style/          # Global CSS
│   └── styles.scss     # SCSS stillar
├── components/          # Vue komponentlar
│   ├── ui/             # Bazaviy UI komponentlar (ZButton, ZCard, etc.)
│   ├── icons/          # Icon komponentlar
│   └── actModals/      # Akt modal komponentlari
├── layouts/             # Nuxt layout'lar
├── middleware/          # Route middleware'lar
├── mixins/              # Vue 2 mixins (qayta foydalaniladigan mantiq)
├── pages/               # Sahifalar (auto-routing)
├── plugins/             # Nuxt plugins
├── services/            # API services
├── static/              # Statik fayllar (favicon, etc.)
├── store/               # Vuex store
├── styles/              # Global stillar
└── utils/               # Helper funksiyalar va konstantalar
```

## Naming Conventions

### Fayllar
- Komponentlar: `PascalCase.vue` (masalan: `UserCard.vue`)
- Utils: `camelCase.js` (masalan: `helpers.js`)
- Mixins: `camelCase.js` (masalan: `loading.js`)

### Kod
- **Vue komponentlar**: PascalCase (`UserCard`, `ZButton`)
- **Props**: camelCase (`userName`, `isLoading`)
- **Events**: kebab-case (`@user-selected`, `@modal-close`)
- **Vuex Mutations**: SCREAMING_SNAKE_CASE (`SET_LOADING`, `START_LOADING`)
- **Vuex Actions**: camelCase (`startLoading`, `fetchUser`)
- **CSS klasslar**: BEM yoki kebab-case

## UI Komponentlar

Bazaviy UI komponentlar `components/ui/` papkasida:

```javascript
// Named import (tree-shaking uchun)
import { ZButton, ZCard, ZModal } from '@/components/ui'

// Komponentda ishlatish
export default {
  components: { ZButton, ZCard }
}
```

### Mavjud komponentlar:
- `ZButton` - Tugma (primary, secondary, outline, danger, success)
- `ZCard` - Karta container
- `ZModal` - Modal dialog
- `ZInput` - Input field
- `ZBadge` - Badge/label
- `ZStat` - Statistika karta
- `DaysDisplay` - Qolgan kunlarni ko'rsatish

## Mixins

Vue 2 uchun qayta foydalaniladigan mantiq:

```javascript
import { loadingMixin, paginationMixin, formMixin } from '@/mixins'

export default {
  mixins: [loadingMixin, paginationMixin],

  methods: {
    async fetchData() {
      await this.withLoading(async () => {
        // Async operation
      })
    }
  }
}
```

### Mavjud mixins:
- `loadingMixin` - Loading holatini boshqarish
- `paginationMixin` - Pagination mantiqini boshqarish
- `formMixin` - Forma yuborish va validatsiya

## Utils va Constants

```javascript
// Constants
import { API_ENDPOINTS, SOCKET_EVENTS, USER_TYPES } from '@/utils/constants'

// Helper funksiyalar
import { formatNumber, formatDate, debounce } from '@/utils/helpers'
```

## API Service

Markazlashtirilgan API chaqiruvlari:

```javascript
// Komponentda
export default {
  async mounted() {
    const data = await this.$api.getDashboard('creditor')
  }
}

// Yoki to'g'ridan-to'g'ri
const response = await this.$api.get('/endpoint', { param: value })
```

## Vuex Store

```javascript
// Action chaqirish
this.$store.dispatch('startLoading')

// Mutation chaqirish
this.$store.commit('SET_USER_INFO', userData)

// State olish
this.$store.getters.isLoading
this.$store.state.userInfo
```

## Stil Qo'llanmasi

### Tailwind CSS

```html
<!-- Yaxshi -->
<div class="bg-white rounded-xl shadow-card p-5">

<!-- Yomon - inline style ishlatmang -->
<div style="background: white; border-radius: 12px;">
```

### Tailwind Design Tokens

```css
/* Colors */
primary, secondary, success, error, warning, info

/* Shadows */
shadow-card, shadow-card-hover, shadow-modal

/* Border Radius */
rounded-card, rounded-button, rounded-input
```

## Best Practices

1. **Props Validation** - Har doim props type va required belgilang
2. **Loading States** - Async operatsiyalarda loading ko'rsating
3. **Error Handling** - try/catch ishlatib, foydalanuvchiga xabar bering
4. **i18n** - Matnlarni `$t()` orqali oling
5. **Lazy Loading** - Katta komponentlarni lazy load qiling

```javascript
// Props validation
props: {
  userId: {
    type: [String, Number],
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    validator: v => ['pending', 'active', 'completed'].includes(v)
  }
}
```
