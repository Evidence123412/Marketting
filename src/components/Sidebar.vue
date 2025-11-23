<template>
  <aside
    v-motion
    :initial="{ opacity: 0, x: -50 }"
    :enter="{ opacity: 1, x: 0, transition: { duration: 500 } }"
    :class="[
      isExpanded ? 'w-64' : 'w-20',
      'bg-kapital-night/95 backdrop-blur-xl border-r border-white/10 text-slate-300 flex flex-col h-screen justify-between transition-all duration-300 ease-spring z-50 relative overflow-hidden'
    ]"
  >
    <div class="flex flex-col">
      <div 
        :class="[
          'flex items-center h-24 mb-2 transition-all duration-300',
          isExpanded ? 'px-6 justify-between flex-row' : 'justify-center flex-col gap-2'
        ]"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-10 h-10 bg-gradient-to-br from-kapital-dark to-kapital-light-1 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-kapital-dark/20">
            <span class="text-white font-bold text-xl">K</span>
          </div>
          
          <Transition name="fade">
            <div v-show="isExpanded" class="flex flex-col">
              <span class="text-white font-bold text-xl tracking-tight">Kapital</span>
              <span class="text-[10px] text-kapital-light-1 font-medium tracking-widest uppercase">CMS v2.0</span>
            </div>
          </Transition>
        </div>

        <button
          v-if="isExpanded"
          @click="toggleSidebar"
          class="text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
        >
          <ChevronLeft :size="20" />
        </button>

        <button
          v-if="!isExpanded"
          @click="toggleSidebar"
          class="text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
        >
          <ChevronRight :size="20" />
        </button>
      </div>

      <nav class="flex-1 flex flex-col gap-y-8 px-4 overflow-y-auto overflow-x-hidden scrollbar-hide pb-4">
        <div v-for="group in navGroups" :key="group.title">
          
          <Transition name="fade">
            <span 
              v-show="isExpanded" 
              class="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-3 block"
            >
              {{ group.title }}
            </span>
          </Transition>
          
          <div v-show="!isExpanded" class="h-px w-8 bg-white/10 mx-auto mb-3"></div>

          <div class="flex flex-col gap-1">
            <button
              v-for="item in group.items"
              :key="item.id"
              @click="navigateTo(item.id)"
              :class="[
                'flex items-center gap-3 py-3 rounded-xl w-full transition-all duration-200 group relative',
                isExpanded ? 'px-4' : 'px-0 justify-center',
                activeView === item.id
                  ? 'bg-kapital-dark text-white shadow-lg shadow-kapital-dark/25' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              ]"
            >
              <component :is="item.icon" :size="20" :stroke-width="activeView === item.id ? 2.5 : 2" />
              
              <Transition name="fade">
                <span v-show="isExpanded" class="text-sm font-medium">{{ item.label }}</span>
              </Transition>

              <div 
                v-if="!isExpanded"
                class="absolute left-14 px-3 py-2 bg-kapital-night border border-white/10 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
              >
                {{ item.label }}
              </div>
            </button>
          </div>
        </div>
      </nav>
    </div>

    <div class="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm"> 
      <div class="flex flex-col gap-2">
        
        <button
          @click="navigateTo('settings')"
          :class="[
            'flex items-center gap-3 py-3 rounded-xl w-full transition-all duration-200 group relative',
            isExpanded ? 'px-4' : 'px-0 justify-center',
            activeView === 'settings'
              ? 'bg-kapital-dark text-white shadow-lg' 
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          ]"
        >
          <Settings :size="20" />
          <Transition name="fade">
            <span v-show="isExpanded" class="text-sm font-medium">Configuración</span>
          </Transition>
        </button>

        <button
          @click="$emit('logout')"
          :class="[
            'flex items-center gap-3 py-3 rounded-xl w-full transition-all duration-200 text-slate-400 hover:bg-red-500/10 hover:text-red-400 group relative',
            isExpanded ? 'px-4' : 'px-0 justify-center'
          ]"
        >
          <LogOut :size="20" />
          <Transition name="fade">
            <span v-show="isExpanded" class="text-sm font-medium">Cerrar sesión</span>
          </Transition>
        </button>

        </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  LayoutDashboard, 
  BarChart3, 
  Wand2, 
  PenTool, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const isExpanded = ref(true);

const activeView = computed(() => route.name);

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

defineEmits(['logout']);

const navigateTo = (routeName) => {
  router.push({ name: routeName });
};

const navGroups = [
  {
    title: 'Análisis',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'reports', label: 'Reportes', icon: BarChart3 },
    ]
  },
  {
    title: 'Gestión',
    items: [
      { id: 'buyer-generator', label: 'Buyer Generator', icon: Wand2 },
      { id: 'production', label: 'Producción', icon: PenTool },
      { id: 'scheduling', label: 'Calendario', icon: Calendar },
    ]
  },
  {
    title: 'Clientes',
    items: [
      { id: 'interactions', label: 'Mensajes', icon: MessageSquare },
      { id: 'crm', label: 'CRM Leads', icon: Users },
    ]
  }
];
</script>

<style scoped lang="postcss">
button {
  @apply outline-none;
}

button:focus-visible {
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