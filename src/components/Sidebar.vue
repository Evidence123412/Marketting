<template>
  <aside
    :class="[
      isExpanded ? 'w-56' : 'w-20',
      'bg-kapital-night text-gray-300 flex flex-col h-screen justify-between shadow-lg transition-all duration-300 ease-in-out'
    ]"
  >
    
    <div class="flex flex-col overflow-y-auto">
      <div 
        :class="[
          'flex items-center py-5 mb-2',
          isExpanded ? 'justify-between px-4' : 'justify-center px-3'
        ]"
      >
        <div class="w-8 h-8 bg-kapital-dark rounded-lg flex items-center justify-center flex-shrink-0">
          <span class="text-white font-bold text-lg">K</span>
        </div>
        
        <Transition name="fade">
          <span v-show="isExpanded" class="text-white font-bold text-2xl tracking-wider ml-2 whitespace-nowrap">Kapital</span>
        </Transition>

        <button
          @click="toggleSidebar"
          :title="isExpanded ? 'Colapsar' : 'Expandir'"
          :class="[
            'text-gray-500 hover:text-white transition-colors',
            isExpanded ? 'ml-auto' : 'ml-auto'
          ]"
        >
          <i :class="['fas', isExpanded ? 'fa-chevron-left' : 'fa-chevron-right', 'w-5 text-center text-lg']"></i>
        </button>
      </div>

      <nav class="flex-1 flex flex-col gap-y-6 px-3">
        <div v-for="group in navGroups" :key="group.title">
          
          <Transition name="fade">
            <span 
              v-show="isExpanded" 
              class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2 block"
            >
              {{ group.title }}
            </span>
          </Transition>

          <div class="flex flex-col gap-2">
            <button
              v-for="item in group.items"
              :key="item.id"
              @click="$emit('navigate', item.id)"
              :title="item.label"
              :class="[
                'flex items-center gap-3 py-2.5 rounded-lg w-full transition-all duration-200 group relative',
                isExpanded ? 'px-4' : 'px-3 justify-center',
                activeView === item.id
                  ? 'bg-kapital-dark text-white font-semibold shadow-md' // <-- Color de marca
                  : 'text-gray-400 hover:bg-kapital-night-hover hover:text-white' // <-- Color de marca
              ]"
            >
              <i :class="['fas', item.icon, 'w-5 text-center text-lg flex-shrink-0']"></i>
              
              <Transition name="fade">
                <span v-show="isExpanded" class="text-sm font-medium whitespace-nowrap">{{ item.label }}</span>
              </Transition>

              <span 
                :class="[
                  'absolute left-16 p-2 px-3 text-sm font-medium bg-kapital-night-hover text-white rounded-md shadow-lg', // <-- Color de marca
                  'transition-all duration-200 scale-0 origin-left z-10',
                  'group-hover:scale-100',
                  isExpanded ? 'hidden' : 'block'
                ]"
              >
                {{ item.label }}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </div>

    <div class="p-3 border-t border-gray-700"> <div class="flex flex-col gap-2">
        
        <button
          @click="$emit('navigate', 'settings')"
          title="Configuración"
          :class="[
            'flex items-center gap-3 py-2.5 rounded-lg w-full transition-all duration-200 group relative',
            isExpanded ? 'px-4' : 'px-3 justify-center',
            activeView === 'settings'
              ? 'bg-kapital-dark text-white font-semibold shadow-md' // <-- Color de marca
              : 'text-gray-400 hover:bg-kapital-night-hover hover:text-white' // <-- Color de marca
          ]"
        >
          <i class="fas fa-cog w-5 text-center text-lg flex-shrink-0"></i>
          <Transition name="fade">
            <span v-show="isExpanded" class="text-sm font-medium whitespace-nowrap">Configuración</span>
          </Transition>
          <span 
            :class="[
              'absolute left-16 p-2 px-3 text-sm font-medium bg-kapital-night-hover text-white rounded-md shadow-lg', // <-- Color de marca
              'transition-all duration-200 scale-0 origin-left z-10',
              'group-hover:scale-100',
              isExpanded ? 'hidden' : 'block'
            ]"
          >
            Configuración
          </span>
        </button>

        <button
          @click="$emit('logout')"
          title="Cerrar sesión"
          :class="[
            'flex items-center gap-3 py-2.5 rounded-lg w-full transition-all duration-200 text-gray-400 hover:bg-red-800 hover:text-red-100 group relative',
            isExpanded ? 'px-4' : 'px-3 justify-center'
          ]"
        >
          <i class="fas fa-sign-out-alt w-5 text-center text-lg flex-shrink-0"></i>
          <Transition name="fade">
            <span v-show="isExpanded" class="text-sm font-medium whitespace-nowrap">Cerrar sesión</span>
          </Transition>
          <span 
            :class="[
              'absolute left-16 p-2 px-3 text-sm font-medium bg-kapital-night-hover text-white rounded-md shadow-lg', // <-- Color de marca
              'transition-all duration-200 scale-0 origin-left z-10',
              'group-hover:scale-100',
              isExpanded ? 'hidden' : 'block'
            ]"
          >
            Cerrar sesión
          </span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';

const isExpanded = ref(true);

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

defineProps({
  activeView: String,
});

defineEmits(['navigate', 'logout']);

const navGroups = [
  {
    title: 'Análisis',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
      { id: 'reports', label: 'Reportes', icon: 'fa-bar-chart' },
    ]
  },
  {
    title: 'Gestión',
    items: [
      { id: 'generation', label: 'Generar', icon: 'fa-wand-magic-sparkles' },
      { id: 'production', label: 'Producción', icon: 'fa-pen-fancy' },
      { id: 'scheduling', label: 'Programación', icon: 'fa-calendar-alt' },
    ]
  },
  {
    title: 'Clientes',
    items: [
      { id: 'interactions', label: 'Interacciones', icon: 'fa-comments' },
      { id: 'crm', label: 'CRM', icon: 'fa-address-card' },
    ]
  }
];
</script>

<style scoped lang="postcss">
button {
  @apply outline-none;
}

button:focus-visible {
  /* ¡CORREGIDO! Se usa ring-offset-gray-900 que es el color #111827 */
  @apply ring-2 ring-kapital-dark ring-offset-2 ring-offset-gray-900;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>