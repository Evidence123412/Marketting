<template>
  <aside class="w-45 bg-white border-r border-gray-200 flex flex-col items-center py-5 gap-6 overflow-y-auto shadow-sm">
    <!-- Logo -->
    <div class="w-12 h-12 bg-gradient-to-br from-kapital-dark to-kapital-light-1 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer hover:shadow-lg transition-all"
      @click="$emit('navigate', 'dashboard')"
    >
      <span class="text-white font-bold text-lg">K</span>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-2 flex-1 w-full px-2">
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="$emit('navigate', item.id)"
        :class="[
          'flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-lg transition-all duration-200',
          activeView === item.id
            ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-kapital-dark border border-blue-200 shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        ]"
        :title="item.label"
      >
        <i :class="['fas', item.icon, 'text-lg']"></i>
        <span class="text-xs text-center leading-tight font-medium">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Logout Button -->
    <button
      @click="$emit('logout')"
      class="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
      title="Cerrar sesión"
    >
      <i class="fas fa-sign-out-alt text-lg"></i>
    </button>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  activeView: String
})

defineEmits(['navigate', 'logout'])

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
  { id: 'generation', label: 'Generar', icon: 'fa-wand-magic-sparkles' },
  { id: 'production', label: 'Producción', icon: 'fa-pen-fancy' },
  { id: 'scheduling', label: 'Programación', icon: 'fa-calendar-alt' },
  { id: 'interactions', label: 'Interacciones', icon: 'fa-comments' },
  { id: 'crm', label: 'CRM', icon: 'fa-address-card' },
  { id: 'reports', label: 'Reportes', icon: 'fa-bar-chart' },
  { id: 'settings', label: 'Configuración', icon: 'fa-cog' }
]
</script>

<style scoped>
/* Animación suave para cambio de vista */
button {
  @apply outline-none;
}

button:focus-visible {
  @apply ring-2 ring-kapital-dark ring-offset-2;
}
</style>