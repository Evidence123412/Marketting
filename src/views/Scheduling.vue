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
      
      <div class="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
        <button 
          v-for="view in viewOptions" 
          :key="view.id"
          @click="currentView = view.id"
          :class="[
            'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2',
            currentView === view.id 
              ? 'bg-kapital-dark text-white shadow-md' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          ]"
        >
          <component :is="view.icon" :size="14" />
          {{ view.label }}
        </button>
      </div>

      <button @click="openModal" class="btn-primary shadow-lg shadow-slate-900/20">
        <Plus :size="20" /> Programar Post
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="(stat, index) in stats" :key="index" 
        class="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-all duration-300 group"
      >
        <div :class="['w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110', stat.bg, stat.color]">
          <component :is="stat.icon" :size="20" stroke-width="2" />
        </div>
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ stat.label }}</p>
          <div class="flex items-baseline gap-2">
            <span class="text-xl font-bold text-gray-900">{{ stat.value }}</span>
            <span v-if="stat.trend" :class="['text-[10px] font-bold px-1.5 py-0.5 rounded', stat.trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600']">
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
            
            <div class="flex gap-1">
                <button 
                    v-for="filter in networkFilters" :key="filter.name"
                    @click="toggleFilter(filter.name)"
                    :class="['w-7 h-7 rounded-full flex items-center justify-center transition-all border', activeFilters.includes(filter.name) ? 'border-gray-300 bg-white grayscale-0 shadow-sm' : 'border-transparent grayscale opacity-40 hover:opacity-100']"
                    :style="{ color: activeFilters.includes(filter.name) ? filter.color : '' }"
                    :title="filter.name"
                >
                    <component :is="filter.icon" :size="12" />
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
                  'relative rounded-lg border p-1.5 transition-all flex flex-col gap-1 group min-h-[100px]',
                  day.isCurrentMonth ? 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm cursor-pointer' : 'bg-gray-50/50 border-transparent text-gray-300 pointer-events-none',
                  day.isToday ? 'ring-1 ring-kapital-dark ring-offset-1 z-10' : ''
                ]"
              >
                <span :class="['text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full', day.isToday ? 'bg-kapital-dark text-white' : 'text-gray-700']">
                  {{ day.date }}
                </span>

                <div class="flex flex-col gap-1 mt-1 overflow-y-auto scrollbar-hide max-h-[80px]">
                  <div 
                    v-for="event in getEventsForDay(day)" 
                    :key="event.id"
                    class="text-[9px] font-medium px-1.5 py-0.5 rounded border bg-white truncate transition-colors hover:border-gray-300 shadow-sm flex items-center justify-between"
                    :class="getNetworkBorderClass(event.network)"
                  >
                    <span class="truncate text-gray-700">{{ event.title }}</span>
                    <component :is="getNetworkIcon(event.network)" :size="8" class="text-gray-400 flex-shrink-0 ml-1" />
                  </div>
                </div>
                
                <button v-if="day.isCurrentMonth" class="absolute bottom-1 right-1 w-5 h-5 bg-kapital-dark text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110">
                    <Plus :size="10" />
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
                    <thead class="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] sticky top-0 z-10 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 rounded-tl-lg">Estado</th>
                            <th class="px-4 py-3">Contenido</th>
                            <th class="px-4 py-3">Canales</th>
                            <th class="px-4 py-3">Fecha</th>
                            <th class="px-4 py-3 rounded-tr-lg">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="event in filteredEvents" :key="event.id" class="hover:bg-gray-50 group transition-colors">
                            <td class="px-4 py-3">
                                <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase border', getStatusBadge(event.status)]">{{ event.status }}</span>
                            </td>
                            <td class="px-4 py-3">
                                <p class="font-bold text-gray-900 text-xs">{{ event.title }}</p>
                                <p class="text-[10px] text-gray-500 truncate w-48">{{ event.description || 'Sin descripción' }}</p>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex -space-x-2">
                                    <div v-for="net in event.networks" :key="net" class="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm z-0 relative hover:z-10 hover:scale-110 transition-transform">
                                        <component :is="getNetworkIcon(net)" :size="12" />
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3 font-medium text-gray-600 text-xs">
                                {{ event.date }} <span class="text-gray-400 text-[10px] ml-1">{{ event.time }}</span>
                            </td>
                            <td class="px-4 py-3">
                                <button class="p-1.5 hover:bg-white rounded-md text-gray-400 hover:text-gray-900 transition-colors shadow-sm border border-transparent hover:border-gray-200">
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
        
        <div class="card p-0 overflow-hidden border border-gray-200 shadow-sm relative group">
          <div class="h-20 bg-gray-50 border-b border-gray-100 relative p-5 flex flex-col justify-center"> 
             <div class="absolute bottom-0 right-0 opacity-5 transform translate-y-2 translate-x-2 text-kapital-dark"><Rocket :size="80" /></div>
             <span class="text-[9px] font-bold uppercase tracking-widest text-kapital-dark/60 mb-1">Siguiente en cola</span>
             <h3 class="text-gray-900 font-bold text-base truncate pr-8">{{ nextEvent?.title || 'Nada programado' }}</h3>
          </div>
          
          <div class="p-5 pt-2 relative bg-white">
             <div class="absolute -top-6 right-5 bg-white rounded-lg border border-gray-200 shadow-sm p-2 text-center min-w-[50px]">
                <span class="block text-[10px] font-bold text-gray-400 uppercase">{{ getMonthShort(nextEvent?.date) }}</span>
                <span class="block text-lg font-black text-gray-900">{{ getDayNumber(nextEvent?.date) }}</span>
             </div>

             <div v-if="nextEvent" class="mt-4 space-y-4">
                <div class="flex items-center justify-between text-xs text-gray-600 border-b border-gray-50 pb-3">
                    <div class="flex items-center gap-2"><Clock :size="14" class="text-gray-900"/> {{ nextEvent.time }}</div> <div class="flex -space-x-2">
                        <div v-for="net in nextEvent.networks" :key="net" class="w-5 h-5 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                            <component :is="getNetworkIcon(net)" :size="10" />
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                        <img src="https://ui-avatars.com/api/?name=Ana+G&background=random" alt="User">
                    </div>
                    <div>
                        <p class="text-xs font-bold text-gray-900">Asignado a Ana</p>
                        <p class="text-[10px] text-gray-500">Copywriter</p>
                    </div>
                    <button class="ml-auto text-xs text-kapital-dark font-bold hover:underline">Ver detalles</button> </div>
             </div>
             <div v-else class="mt-8 text-center text-xs text-gray-400">
                ¡Todo listo! No hay publicaciones pendientes próximas.
             </div>
          </div>
        </div>

        <div class="card flex-1 flex flex-col border border-gray-200 shadow-sm">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-gray-800 text-sm flex items-center gap-2"><Sparkles :size="16" class="text-amber-500"/> Borradores / Ideas</h3>
                <button class="p-1 hover:bg-gray-50 rounded"><Plus :size="16" class="text-gray-400" /></button>
            </div>
            <div class="flex-1 overflow-y-auto space-y-3 scrollbar-thin pr-1">
                <div v-for="draft in drafts" :key="draft.id" class="p-3 rounded-lg border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer group bg-white">
                    <div class="flex justify-between mb-1">
                        <span class="font-bold text-xs text-gray-700">{{ draft.title }}</span>
                        <MoreHorizontal :size="14" class="text-gray-300 group-hover:text-gray-500" />
                    </div>
                    <p class="text-[10px] text-gray-500 line-clamp-2">{{ draft.notes }}</p>
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
    { label: 'Programados', value: events.value.filter(e => e.status === 'scheduled').length, icon: CalendarIcon, bg: 'bg-gray-50', color: 'text-gray-500', trend: 12 },
    { label: 'Publicados', value: events.value.filter(e => e.status === 'published').length, icon: CheckCircle2, bg: 'bg-gray-50', color: 'text-gray-500', trend: 5 },
    { label: 'Borradores', value: events.value.filter(e => e.status === 'draft').length, icon: Edit3, bg: 'bg-gray-50', color: 'text-gray-500' },
    { label: 'Pendientes', value: 1, icon: AlertCircle, bg: 'bg-gray-50', color: 'text-gray-500', trend: -2 }
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
    if (status === 'published') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    if (status === 'scheduled') return 'bg-blue-50 text-blue-700 border-blue-100'
    return 'bg-gray-50 text-gray-500 border-gray-200'
}
</script>

<style scoped lang="postcss">
.card {
  @apply bg-white border border-gray-200 rounded-xl p-6 shadow-sm;
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