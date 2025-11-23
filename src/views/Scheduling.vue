<template>
  <div class="space-y-6 h-full flex flex-col">
    
    <div 
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="flex flex-col md:flex-row justify-between items-end gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Calendario Editorial</h1>
        <p class="text-slate-500 mt-1 text-sm">Visualiza y orquesta tu estrategia de contenido global.</p>
      </div>
      
      <div class="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
        <button 
          v-for="view in viewOptions" 
          :key="view.id"
          @click="currentView = view.id"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2',
            currentView === view.id 
              ? 'bg-slate-900 text-white shadow-md' // Cambiado a bg-slate-900 para el color oscuro
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          ]"
        >
          <component :is="view.icon" :size="16" />
          {{ view.label }}
        </button>
      </div>

      <button @click="openModal" class="btn-primary shadow-lg shadow-slate-900/20">
        <Plus :size="20" /> Programar Post
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="(stat, index) in stats" :key="index" 
        class="bg-white/60 backdrop-blur-sm border border-slate-200/60 p-4 rounded-2xl flex items-center gap-4 hover:bg-white transition-all duration-300 group"
      >
        <div :class="['w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110', stat.bg, stat.color]">
          <component :is="stat.icon" :size="24" stroke-width="2" />
        </div>
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ stat.label }}</p>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold text-slate-900">{{ stat.value }}</span>
            <span v-if="stat.trend" :class="['text-xs font-bold px-1.5 py-0.5 rounded', stat.trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700']">
              {{ stat.trend > 0 ? '+' : ''}}{{ stat.trend }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
      
      <div class="flex-[3] card flex flex-col h-full overflow-hidden relative">
        
        <div v-if="currentView === 'calendar'" class="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
          <div class="flex justify-between items-center mb-6 px-2">
            <div class="flex items-center gap-4">
              <h2 class="text-2xl font-bold text-slate-900 capitalize">{{ monthName }} <span class="text-slate-300">{{ year }}</span></h2>
              <div class="flex bg-slate-100 rounded-lg p-1 gap-1">
                <button @click="changeMonth(-1)" class="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-500"><ChevronLeft :size="18" /></button>
                <button @click="goToToday" class="px-3 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition-all">Hoy</button>
                <button @click="changeMonth(1)" class="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-500"><ChevronRight :size="18" /></button>
              </div>
            </div>
            
            <div class="flex gap-2">
                <button 
                    v-for="filter in networkFilters" :key="filter.name"
                    @click="toggleFilter(filter.name)"
                    :class="['w-8 h-8 rounded-full flex items-center justify-center transition-all border-2', activeFilters.includes(filter.name) ? 'border-current bg-slate-50 grayscale-0' : 'border-transparent grayscale opacity-50 hover:opacity-100']"
                    :style="{ color: activeFilters.includes(filter.name) ? filter.color : '' }"
                    :title="filter.name"
                >
                    <component :is="filter.icon" :size="14" />
                </button>
            </div>
          </div>

          <div class="flex-1 flex flex-col">
            <div class="grid grid-cols-7 mb-2">
              <div v-for="day in weekDays" :key="day" class="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ day }}</div>
            </div>
            <div class="grid grid-cols-7 gap-2 flex-1 auto-rows-fr">
              <div 
                v-for="(day, idx) in calendarDays" 
                :key="idx"
                @click="day.date && openDayDetails(day)"
                :class="[
                  'relative rounded-xl border p-2 transition-all flex flex-col gap-1 group min-h-[100px]',
                  day.isCurrentMonth ? 'bg-white border-slate-100 hover:border-slate-400 hover:shadow-md cursor-pointer' : 'bg-slate-50/50 border-transparent text-slate-300 pointer-events-none',
                  day.isToday ? 'ring-2 ring-slate-900 ring-offset-2 z-10' : ''
                ]"
              >
                <span :class="['text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full', day.isToday ? 'bg-slate-900 text-white' : 'text-slate-700']">
                  {{ day.date }}
                </span>

                <div class="flex flex-col gap-1 mt-1 overflow-y-auto scrollbar-hide max-h-[80px]">
                  <div 
                    v-for="event in getEventsForDay(day)" 
                    :key="event.id"
                    class="text-[10px] font-semibold px-2 py-1 rounded-md border-l-2 bg-slate-50 truncate transition-colors hover:bg-white shadow-sm flex items-center justify-between"
                    :class="getNetworkBorderClass(event.network)"
                  >
                    <span class="truncate">{{ event.title }}</span>
                    <component :is="getNetworkIcon(event.network)" :size="10" class="text-slate-400 flex-shrink-0 ml-1" />
                  </div>
                </div>
                
                <button v-if="day.isCurrentMonth" class="absolute bottom-2 right-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110">
                    <Plus :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentView === 'list'" class="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div class="mb-4 flex gap-4">
                <div class="relative flex-1">
                    <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Buscar publicación..." class="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900">
                </div>
                </div>
            <div class="flex-1 overflow-y-auto scrollbar-thin">
                <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-xs sticky top-0 z-10">
                        <tr>
                            <th class="px-4 py-3 rounded-tl-xl">Estado</th>
                            <th class="px-4 py-3">Contenido</th>
                            <th class="px-4 py-3">Canales</th>
                            <th class="px-4 py-3">Fecha</th>
                            <th class="px-4 py-3 rounded-tr-xl">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="event in filteredEvents" :key="event.id" class="hover:bg-slate-50 group">
                            <td class="px-4 py-3">
                                <span :class="['px-2 py-1 rounded-full text-[10px] font-bold uppercase', getStatusBadge(event.status)]">{{ event.status }}</span>
                            </td>
                            <td class="px-4 py-3">
                                <p class="font-bold text-slate-900">{{ event.title }}</p>
                                <p class="text-xs text-slate-500 truncate w-48">{{ event.description || 'Sin descripción' }}</p>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex -space-x-2">
                                    <div v-for="net in event.networks" :key="net" class="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm z-0 relative hover:z-10 hover:scale-110 transition-transform">
                                        <component :is="getNetworkIcon(net)" :size="12" />
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-600">
                                {{ event.date }} <span class="text-slate-400 text-xs">{{ event.time }}</span>
                            </td>
                            <td class="px-4 py-3">
                                <button class="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-colors shadow-sm border border-transparent hover:border-slate-200">
                                    <Edit3 :size="14" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-else class="h-full flex items-center justify-center text-slate-400 animate-in zoom-in duration-300">
            <div class="text-center">
                <GanttChartSquare :size="48" class="mx-auto mb-3 opacity-50" />
                <p>Vista de Línea de Tiempo en desarrollo</p>
            </div>
        </div>

      </div>

      <div class="flex-1 min-w-[300px] flex flex-col gap-6">
        
        <div class="card p-0 overflow-hidden border-0 shadow-lg ring-1 ring-slate-900/5 relative group">
          <div class="h-24 bg-gradient-to-r from-slate-900 to-indigo-600 relative p-6"> <div class="absolute bottom-0 right-0 opacity-10 transform translate-y-4 translate-x-4"><Rocket :size="100" /></div>
             <span class="text-[10px] font-bold uppercase tracking-widest text-white/80 bg-white/10 px-2 py-1 rounded backdrop-blur-md">Siguiente en cola</span>
             <h3 class="text-white font-bold text-lg mt-2 truncate pr-8">{{ nextEvent?.title || 'Nada programado' }}</h3>
          </div>
          
          <div class="p-6 pt-2 relative bg-white">
             <div class="absolute -top-8 right-6 bg-white rounded-xl shadow-md p-2 text-center min-w-[60px]">
                <span class="block text-xs font-bold text-slate-400 uppercase">{{ getMonthShort(nextEvent?.date) }}</span>
                <span class="block text-xl font-black text-slate-900">{{ getDayNumber(nextEvent?.date) }}</span>
             </div>

             <div v-if="nextEvent" class="mt-4 space-y-4">
                <div class="flex items-center justify-between text-sm text-slate-600 border-b border-slate-100 pb-3">
                    <div class="flex items-center gap-2"><Clock :size="16" class="text-slate-900"/> {{ nextEvent.time }}</div> <div class="flex -space-x-2">
                        <div v-for="net in nextEvent.networks" :key="net" class="w-6 h-6 rounded-full bg-slate-50 border border-white shadow-sm flex items-center justify-center">
                            <component :is="getNetworkIcon(net)" :size="12" />
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                        <img src="https://ui-avatars.com/api/?name=Ana+G&background=random" alt="User">
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-900">Asignado a Ana</p>
                        <p class="text-[10px] text-slate-500">Copywriter</p>
                    </div>
                    <button class="ml-auto text-xs text-slate-900 font-bold hover:underline">Ver detalles</button> </div>
             </div>
             <div v-else class="mt-8 text-center text-sm text-slate-400">
                ¡Todo listo! No hay publicaciones pendientes próximas.
             </div>
          </div>
        </div>

        <div class="card flex-1 flex flex-col">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2"><Sparkles :size="16" class="text-amber-500"/> Borradores / Ideas</h3>
                <button class="p-1 hover:bg-slate-50 rounded"><Plus :size="16" class="text-slate-400" /></button>
            </div>
            <div class="flex-1 overflow-y-auto space-y-3 scrollbar-thin pr-1">
                <div v-for="draft in drafts" :key="draft.id" class="p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer group">
                    <div class="flex justify-between mb-1">
                        <span class="font-bold text-xs text-slate-700">{{ draft.title }}</span>
                        <MoreHorizontal :size="14" class="text-slate-300 group-hover:text-slate-500" />
                    </div>
                    <p class="text-[10px] text-slate-500 line-clamp-2">{{ draft.notes }}</p>
                </div>
            </div>
        </div>

      </div>
    </div>

    <div v-if="showEventModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 class="font-bold text-lg text-slate-900">Detalles del Evento</h3>
                <button @click="showEventModal = false"><X :size="20" class="text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div class="p-6">
                <p class="text-sm text-slate-600 mb-4">Editando evento del día {{ selectedDay?.date }}.</p>
                <div class="flex justify-end gap-2">
                    <button @click="showEventModal = false" class="btn-secondary py-2">Cancelar</button>
                    <button @click="showEventModal = false; emit('showToast', 'Guardado')" class="btn-primary py-2">Guardar</button>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Calendar as CalendarIcon, List, GanttChartSquare, Plus, ChevronLeft, ChevronRight, 
  Rocket, Clock, Search, Edit3, MoreHorizontal, X, Sparkles,
  Instagram, Facebook, Linkedin, Twitter, Youtube, CheckCircle2, AlertCircle, Timer
} from 'lucide-vue-next'

const emit = defineEmits(['showToast'])

// --- STATE ---
const currentView = ref('calendar')
const currentDate = ref(new Date(2025, 10, 21)) // Simulating Nov 21, 2025
const showEventModal = ref(false)
const selectedDay = ref(null)
const activeFilters = ref(['Instagram', 'Facebook', 'LinkedIn', 'Twitter']) // All active by default

// --- STATIC DATA (Would come from schedulingService) ---
const viewOptions = [
  { id: 'calendar', label: 'Mes', icon: CalendarIcon },
  { id: 'list', label: 'Lista', icon: List },
  { id: 'timeline', label: 'Timeline', icon: GanttChartSquare }
]

const networkFilters = [
    { name: 'Instagram', icon: Instagram, color: '#db2777' },
    { name: 'Facebook', icon: Facebook, color: '#2563eb' },
    { name: 'LinkedIn', icon: Linkedin, color: '#0077b5' },
    { name: 'Twitter', icon: Twitter, color: '#000000' }
]

const events = ref([
  { id: 1, title: 'Lanzamiento', date: '2025-11-22', day: 22, time: '14:00', networks: ['Instagram', 'Facebook'], status: 'scheduled' },
  { id: 2, title: 'Blog SEO', date: '2025-11-24', day: 24, time: '09:00', networks: ['LinkedIn'], status: 'draft' },
  { id: 3, title: 'Black Friday', date: '2025-11-28', day: 28, time: '10:00', networks: ['Instagram', 'Twitter'], status: 'scheduled' },
  { id: 4, title: 'Promo Flash', date: '2025-11-15', day: 15, time: '18:00', networks: ['Instagram'], status: 'published' },
  { id: 5, title: 'Webinar', date: '2025-11-27', day: 27, time: '16:00', networks: ['LinkedIn', 'Facebook'], status: 'scheduled' },
])

const drafts = ref([
    { id: 1, title: 'Idea para Navidad', notes: 'Usar colores rojos y dorados, enfocar en familia.' },
    { id: 2, title: 'Meme de oficina', notes: 'Plantilla del gato, relacionar con lunes.' },
    { id: 3, title: 'Quote motivacional', notes: 'Steve Jobs sobre diseño.' }
])

// --- COMPUTED ---
const filteredEvents = computed(() => {
    // Filter by active networks
    return events.value.filter(e => e.networks.some(n => activeFilters.value.includes(n)))
})

const nextEvent = computed(() => {
    const sorted = [...filteredEvents.value]
        .filter(e => e.status === 'scheduled')
        .sort((a, b) => a.day - b.day)
    return sorted.find(e => e.day >= 21) || null // Assuming today is 21
})

const stats = computed(() => [
    { label: 'Programados', value: events.value.filter(e => e.status === 'scheduled').length, icon: CalendarIcon, bg: 'bg-blue-50', color: 'text-blue-600', trend: 12 },
    { label: 'Publicados', value: events.value.filter(e => e.status === 'published').length, icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-600', trend: 5 },
    { label: 'Borradores', value: events.value.filter(e => e.status === 'draft').length, icon: Edit3, bg: 'bg-slate-50', color: 'text-slate-500' },
    { label: 'Pendientes', value: 1, icon: AlertCircle, bg: 'bg-amber-50', color: 'text-amber-500', trend: -2 }
])

const monthName = computed(() => currentDate.value.toLocaleString('es-ES', { month: 'long' }))
const year = computed(() => currentDate.value.getFullYear())
const weekDays = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

const calendarDays = computed(() => {
  const days = []
  const y = currentDate.value.getFullYear()
  const m = currentDate.value.getMonth()
  const firstDay = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  
  // Padding
  for (let i = 0; i < firstDay; i++) days.push({ date: '', isCurrentMonth: false })
  // Days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: i, isCurrentMonth: true, isToday: i === 21 }) // Hardcoded today for demo
  }
  // Fill rest
  while (days.length % 7 !== 0) days.push({ date: '', isCurrentMonth: false })
  
  return days
})

// --- METHODS ---
function changeMonth(delta) {
    currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + delta))
}
function goToToday() {
    currentDate.value = new Date(2025, 10, 21)
}
function getEventsForDay(day) {
    if (!day.isCurrentMonth) return []
    return filteredEvents.value.filter(e => e.day === day.date)
}
function openDayDetails(day) {
    selectedDay.value = day
    showEventModal.value = true
}
function openModal() {
    selectedDay.value = { date: 21 } // Default to today
    showEventModal.value = true
}
function toggleFilter(networkName) {
    if (activeFilters.value.includes(networkName)) {
        activeFilters.value = activeFilters.value.filter(n => n !== networkName)
    } else {
        activeFilters.value.push(networkName)
    }
}

// --- HELPERS ---
function getMonthShort(dateStr) {
    if(!dateStr) return 'NOV'
    return new Date(dateStr).toLocaleString('es-ES', { month: 'short' }).toUpperCase().replace('.','')
}
function getDayNumber(dateStr) {
    if(!dateStr) return '--'
    return dateStr.split('-')[2]
}
function getNetworkIcon(name) {
    const map = { Instagram, Facebook, LinkedIn: Linkedin, Twitter, Youtube }
    return map[name] || Rocket
}
function getNetworkBorderClass(networkArray) {
    // Logic to determine color based on primary network
    const primary = Array.isArray(networkArray) ? networkArray[0] : networkArray
    if (primary === 'Instagram') return 'border-pink-500'
    if (primary === 'LinkedIn') return 'border-blue-600'
    if (primary === 'Facebook') return 'border-blue-500'
    return 'border-slate-400'
}
function getStatusBadge(status) {
    if (status === 'published') return 'bg-emerald-100 text-emerald-700'
    if (status === 'scheduled') return 'bg-blue-100 text-blue-700'
    return 'bg-slate-100 text-slate-500'
}
</script>

<style scoped lang="postcss">
.card {
  @apply bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-soft;
}

/* ESTILOS ACTUALIZADOS PARA EL COLOR SOLICITADO (AZUL MUY OSCURO/NEGRO) */
.btn-primary {
  @apply px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl transition-all hover:bg-slate-700 hover:shadow-lg hover:shadow-slate-900/30 active:scale-95 flex items-center gap-2 justify-center;
}
/* FIN ESTILOS ACTUALIZADOS */

.btn-secondary {
  @apply px-4 py-2 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 justify-center;
}

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.scrollbar-thin::-webkit-scrollbar { width: 4px; }
.scrollbar-thin::-webkit-scrollbar-thumb { @apply bg-slate-300 rounded-full; }
.scrollbar-thin::-webkit-scrollbar-track { @apply bg-transparent; }
</style>