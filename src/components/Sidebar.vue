<template>
  <aside class="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-5 gap-7 overflow-y-auto shadow-xl">
    
    <div class="w-10 h-10 bg-gradient-to-br from-kapital-dark to-kapital-light-1 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer shadow-lg hover:scale-110 transition-all duration-300"
      @click="$emit('navigate', 'dashboard')"
      title="Dashboard - K"
    >
      <span class="text-white font-extrabold text-base">K</span>
    </div>

    <nav class="flex flex-col gap-1 flex-1 w-full px-2">
      
      <SidebarItem
        id="dashboard"
        label="Inicio"
        icon="fa-chart-line"
        :active-view="activeView"
        @navigate="$emit('navigate', $event)"
        class="mb-3"
      />

      <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1 mt-2">Creación</h3>
      <SidebarItem
        v-for="item in navItems.filter(i => i.group === 'creation')"
        :key="item.id"
        :id="item.id"
        :label="item.label"
        :icon="item.icon"
        :active-view="activeView"
        @navigate="$emit('navigate', $event)"
      />

      <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1 mt-4">Recursos</h3>
      <SidebarItem
        v-for="item in navItems.filter(i => i.group === 'tools')"
        :key="item.id"
        :id="item.id"
        :label="item.label"
        :icon="item.icon"
        :active-view="activeView"
        @navigate="$emit('navigate', $event)"
      />
      
    </nav>

    <button
      @click="$emit('logout')"
      class="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 border border-gray-200 hover:border-red-300 shadow-md"
      title="Cerrar sesión"
    >
      <i class="fas fa-sign-out-alt text-lg"></i>
    </button>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
// Se asegura que la importación exista y la ruta sea correcta
import SidebarItem from './SidebarItem.vue' 

defineProps({
  activeView: String
})

defineEmits(['navigate', 'logout'])

const navItems = [
  // Dashboard se maneja por separado
  { id: 'generation', label: 'Generar', icon: 'fa-wand-magic-sparkles', group: 'creation' },
  { id: 'production', label: 'Producción', icon: 'fa-pen-fancy', group: 'creation' },
  { id: 'scheduling', label: 'Programación', icon: 'fa-calendar-alt', group: 'creation' },
  
  { id: 'reports', label: 'Reportes', icon: 'fa-bar-chart', group: 'tools' },
  { id: 'interactions', label: 'Interacciones', icon: 'fa-comments', group: 'tools' },
  { id: 'crm', label: 'CRM', icon: 'fa-address-card', group: 'tools' },
  { id: 'settings', label: 'Configuración', icon: 'fa-cog', group: 'tools' }
]
</script>

<style scoped>
/* Las clases de foco se mantienen aquí para un manejo de accesibilidad */
button {
  @apply outline-none;
}
button:focus-visible {
  @apply ring-2 ring-kapital-dark ring-offset-2;
}
</style>