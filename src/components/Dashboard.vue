<template>
  <div class="space-y-8 p-2">
    
    <!-- Header -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="flex flex-col md:flex-row justify-between md:items-center gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p class="text-slate-500 mt-1">Bienvenido al centro de comando de Kapital.</p>
      </div>
      <div class="relative">
        <select class="appearance-none pl-4 pr-10 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kapital-dark/20 focus:border-kapital-dark shadow-sm text-slate-700 cursor-pointer">
          <option>Últimos 7 días</option>
          <option>Últimos 30 días</option>
          <option>Último mes</option>
        </select>
        <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="16" />
      </div>
    </div>

    <!-- Executive Summary -->
    <div>
      <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Activity :size="20" class="text-kapital-dark" /> Resumen Ejecutivo
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(metric, index) in executiveMetrics" 
          :key="metric.id"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
          class="card group hover:border-kapital-dark/30 transition-colors"
        >
          <div class="flex items-start gap-4">
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110', metric.bgColor]">
              <component :is="metric.icon" :class="[metric.color]" :size="24" />
            </div>
            <div class="flex-1">
              <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{{ metric.label }}</p>
              <p class="text-2xl font-bold text-slate-900 mb-1">{{ metric.value }}</p>
              <div :class="['flex items-center gap-1 text-xs font-medium', metric.trend > 0 ? 'text-emerald-600' : 'text-rose-600']">
                <component :is="metric.trend > 0 ? ArrowUp : ArrowDown" :size="12" />
                {{ Math.abs(metric.trend) }}% vs mes anterior
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Focus: Clients -->
    <div>
      <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Users :size="20" class="text-kapital-dark" /> Foco Principal: Clientes
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Pending Interactions -->
        <div 
          v-motion-slide-visible-once-bottom
          class="card flex flex-col"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-slate-800">Interacciones Pendientes</h3>
            <span class="text-xs font-bold bg-rose-100 text-rose-600 px-2.5 py-1 rounded-full border border-rose-200">
              {{ pendingInteractions.length }} Pendientes
            </span>
          </div>
          <div class="space-y-3 h-72 overflow-y-auto pr-2 scrollbar-thin">
            <div v-for="msg in pendingInteractions" :key="msg.id" class="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer group">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-kapital-light-1 to-kapital-dark text-white flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-md group-hover:shadow-lg transition-all">
                {{ msg.initials }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <p class="text-sm font-semibold text-slate-900">{{ msg.name }}</p>
                  <small class="text-slate-400 text-xs whitespace-nowrap">{{ msg.time }}</small>
                </div>
                <p class="text-xs text-slate-600 truncate mt-0.5">{{ msg.preview }}</p>
              </div>
            </div>
          </div>
          <button @click="goTo('interactions')" class="btn-primary w-full mt-6 text-sm">
            <MessageSquare :size="18" /> Gestionar Todos los Mensajes
          </button>
        </div>

        <!-- New Leads -->
        <div 
          v-motion-slide-visible-once-bottom
          class="card flex flex-col"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-slate-800">Nuevos Leads</h3>
            <span class="text-xs font-bold bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-200">
              {{ newLeads.length }} Nuevos
            </span>
          </div>
          <div class="space-y-3 h-72 overflow-y-auto pr-2 scrollbar-thin">
            <div v-for="lead in newLeads" :key="lead.id" class="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer group">
              <div class="w-10 h-10 rounded-full bg-slate-900 text-white flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-md group-hover:shadow-lg transition-all">
                {{ lead.initials }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <p class="text-sm font-semibold text-slate-900">{{ lead.name }}</p>
                  <small class="text-slate-400 text-xs whitespace-nowrap">{{ lead.date }}</small>
                </div>
                <div class="flex items-center gap-1 mt-0.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-kapital-dark"></span>
                  <p class="text-xs text-slate-600">{{ lead.origin }}</p>
                </div>
              </div>
            </div>
          </div>
          <button @click="goTo('crm')" class="btn-primary w-full mt-6 text-sm">
            <Users :size="18" /> Ver CRM
          </button>
        </div>
      </div>
    </div>

    <!-- Content Management -->
    <div>
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Layers :size="20" class="text-kapital-dark" /> Gestión de Contenido
        </h2>
        <div class="flex gap-3">
          <button @click="goTo('generation')" class="btn-secondary text-sm">
            <Wand2 :size="16" /> Generar con IA
          </button>
          <button @click="goTo('production')" class="btn-primary text-sm">
            <Plus :size="16" /> Crear Publicación
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div 
          v-motion-slide-visible-once-bottom
          class="card"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-slate-800">Actividad Reciente</h3>
            <button @click="goTo('production')" class="text-xs text-kapital-dark font-bold hover:underline uppercase tracking-wide">
              Ver todo
            </button>
          </div>
          <div class="space-y-4">
            <div 
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex gap-4 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
            >
              <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm" :style="{ backgroundColor: getStatusColor(activity.status) }">
                <component :is="getStatusIcon(activity.status)" class="text-white" :size="16" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-900">{{ activity.title }}</p>
                <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">{{ activity.description }}</p>
              </div>
              <span :class="['text-[10px] font-bold px-2 py-1 rounded-full h-fit whitespace-nowrap', getStatusClass(activity.status)]">
                {{ getStatusLabel(activity.status) }}
              </span>
            </div>
          </div>
        </div>

        <div 
          v-motion-slide-visible-once-bottom
          class="card"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-slate-800">Próximas Publicaciones</h3>
            <button @click="goTo('scheduling')" class="text-xs text-kapital-dark font-bold hover:underline uppercase tracking-wide">
              Ver calendario
            </button>
          </div>
          <div class="space-y-4">
            <div 
              v-for="item in upcomingPublications"
              :key="item.id"
              class="flex gap-4 group"
            >
              <div class="flex flex-col items-center min-w-[3rem] bg-slate-50 rounded-lg p-2 border border-slate-100">
                <span class="text-lg font-bold text-slate-900 leading-none">{{ item.date.split('-')[2] }}</span>
                <span class="text-[10px] font-bold text-slate-500 uppercase mt-1">{{ getMonthAbbr(item.date) }}</span>
              </div>
              <div class="flex-1 bg-white border border-slate-200 rounded-xl p-3 shadow-sm group-hover:border-kapital-dark/30 transition-colors">
                <p class="text-sm font-semibold text-slate-900">{{ item.title }}</p>
                <div class="flex gap-2 mt-2">
                  <component 
                    v-for="channel in item.channels.split(', ')" 
                    :key="channel" 
                    :is="getChannelIcon(channel)" 
                    class="text-slate-400" 
                    :size="14" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics -->
    <div>
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 :size="20" class="text-kapital-dark" /> Análisis de Rendimiento
        </h2>
        <button @click="goTo('reports')" class="btn-secondary text-sm">
          <PieChart :size="16" /> Ver Reportes Completos
        </button>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div 
          v-motion-slide-visible-once-bottom
          class="lg:col-span-2 card"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-slate-800">Rendimiento Semanal</h3>
          </div>
          <div class="h-64">
            <Bar v-if="weeklyChartData" :data="weeklyChartData" :options="weeklyChartOptions" />
          </div>
        </div>

        <div 
          v-motion-slide-visible-once-bottom
          class="lg:col-span-1 card"
        >
          <h3 class="font-bold text-slate-800 mb-6">Distribución de Contenido</h3>
          <div class="flex items-center justify-center h-48 relative">
             <Doughnut v-if="contentChartData" :data="contentChartData" :options="contentChartOptions" />
             <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div class="text-center">
                 <span class="block text-2xl font-bold text-slate-900">100%</span>
                 <span class="text-[10px] text-slate-500 uppercase font-bold">Total</span>
               </div>
             </div>
          </div>
          <div class="flex flex-col gap-3 mt-6">
            <div v-for="item in contentChartLegend" :key="item.label" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: item.color }"></div>
                <span class="text-xs font-medium text-slate-600">{{ item.label.split(' (')[0] }}</span>
              </div>
              <span class="text-xs font-bold text-slate-900">{{ item.label.split(' (')[1].replace(')', '') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement
} from 'chart.js'
import { 
  Share2, Flame, Users, MessageSquare, ArrowUp, ArrowDown, 
  Wand2, Plus, BarChart3, CheckCircle2, Calendar, Edit3, FileText,
  ChevronDown, Activity, Layers, PieChart, Facebook, Instagram, Linkedin, Twitter, Link
} from 'lucide-vue-next'

ChartJS.register(
  Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement
)

// Emitir evento de navegación para App.vue
const emit = defineEmits(['navigate', 'showToast'])

function goTo(view) {
  emit('navigate', view)
}

// ----- DATOS MAESTROS (Simulados con la ESTRUCTURA REAL de tus componentes) -----

// Simulación de datos de 'Interactions.vue'
const allInteractions = ref([
  { id: 1, initials: 'CA', name: 'Carlos Alarcón', preview: '¿Cuál es el precio?', time: 'Hace 5 min', status: 'pending' },
  { id: 2, initials: 'MR', name: 'María Rodríguez', preview: 'Información sobre servicios', time: 'Hace 20 min', status: 'pending' },
  { id: 3, initials: 'JP', name: 'Juan Pérez', preview: 'Quiero contratar el plan pro', time: 'Hace 45 min', status: 'replied' },
  { id: 4, initials: 'LG', name: 'Laura García', preview: '¿Tienen descuentos para empresas?', time: 'Hace 1h', status: 'pending' },
])

// Simulación de datos de 'CRM.vue'
const allLeads = ref([
  { id: 1, initials: 'AM', name: 'Ana Martínez', origin: 'Instagram', date: '15 Nov 2025', status: 'new' },
  { id: 2, initials: 'RL', name: 'Roberto López', origin: 'LinkedIn', date: '14 Nov 2025', status: 'following' },
  { id: 3, initials: 'LG', name: 'Laura Gómez', origin: 'Facebook', date: '12 Nov 2025', status: 'closed' },
  { id: 4, initials: 'CJ', name: 'Carlos Jiménez', origin: 'Web', date: '13 Nov 2025', status: 'new' },
])

// Simulación de datos de 'Production.vue' y 'Scheduling.vue'
const allPublications = ref([
  {
    id: 1,
    title: 'Campaña de Verano 2025',
    description: 'Anuncia nuestro nuevo catálogo de verano...',
    date: '2025-11-15',
    channels: 'Instagram, Facebook',
    status: 'published',
  },
  {
    id: 2,
    title: 'Tips de Marketing Digital',
    description: '10 consejos prácticos para mejorar tu estrategia...',
    date: '2025-11-20',
    channels: 'LinkedIn',
    status: 'scheduled',
  },
  {
    id: 3,
    title: 'Promoción Especial Black Friday',
    description: 'Descuentos exclusivos de hasta 50%...',
    date: '2025-11-18',
    channels: 'Instagram, Facebook, Twitter',
    status: 'draft',
  },
  {
    id: 5,
    title: 'Webinar en Vivo',
    description: 'Únete a nosotros para una sesión interactiva...',
    date: '2025-11-27',
    channels: 'Facebook, LinkedIn',
    status: 'scheduled',
  }
])

// --- PROPIEDADES COMPUTADAS (El "corazón" del dashboard inteligente) ---

// 1. KPIs para el Resumen Ejecutivo
const executiveMetrics = computed(() => [
  { 
    id: 'publications', icon: Share2, label: 'Publicaciones', 
    value: allPublications.value.length, 
    bgColor: 'bg-blue-50', color: 'text-blue-600', trend: 8
  },
  { 
    id: 'engagement', icon: Flame, label: 'Engagement', 
    value: '3.8%', 
    bgColor: 'bg-amber-50', color: 'text-amber-600', trend: -5
  },
  { 
    id: 'leads', icon: Users, label: 'Nuevos Leads', 
    value: allLeads.value.filter(l => l.status === 'new').length, 
    bgColor: 'bg-emerald-50', color: 'text-emerald-600', trend: 15
  },
  { 
    id: 'interactions', icon: MessageSquare, label: 'Mensajes', 
    value: allInteractions.value.filter(m => m.status === 'pending').length, 
    bgColor: 'bg-rose-50', color: 'text-rose-600', trend: 12
  }
])

// 2. Listas de Clientes
const pendingInteractions = computed(() => {
  return allInteractions.value
    .filter(m => m.status === 'pending')
    .slice(0, 4) // Mostrar solo los primeros 4
})

const newLeads = computed(() => {
  return allLeads.value
    .filter(l => l.status === 'new')
    .slice(0, 4) // Mostrar solo los primeros 4
})

// 3. Listas de Contenido
const recentActivity = computed(() => {
  return [...allPublications.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Ordenar por fecha descendente
    .slice(0, 3) // Mostrar solo las 3 más recientes
})

const upcomingPublications = computed(() => {
  const now = new Date();
  return allPublications.value
    .filter(p => p.status === 'scheduled' && new Date(p.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Ordenar por fecha ascendente
    .slice(0, 2) // Mostrar solo las 2 próximas
})


// --- DATOS DE GRÁFICOS (Ahora con paleta más suave) ---
const weeklyChartData = ref({
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    {
      // Color: kapital-dark (Blue-600)
      label: 'Publicaciones', backgroundColor: '#2563EB', borderRadius: 6,
      data: [6, 8, 5, 9, 7, 4, 3], yAxisID: 'y', barThickness: 12
    },
    {
      // Color: kapital-light-1 (Blue-400)
      label: 'Engagement %', backgroundColor: '#60A5FA', borderRadius: 6,
      data: [3.2, 4.1, 2.8, 5.2, 4.5, 2.1, 1.8], yAxisID: 'y1', barThickness: 12
    }
  ]
})

const weeklyChartOptions = ref({
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: {
      type: 'linear', display: true, position: 'left', beginAtZero: true,
      grid: { color: '#f1f5f9', borderDash: [4, 4] }, title: { display: false }
    },
    y1: {
      type: 'linear', display: true, position: 'right', beginAtZero: true,
      grid: { drawOnChartArea: false }, title: { display: false }
    }
  }
})

const contentChartData = ref({
  labels: ['Productos', 'Promociones', 'Educativo'],
  datasets: [
    { 
      // Blue-600, Blue-400, Amber-500
      backgroundColor: ['#2563EB', '#60A5FA', '#F59E0B'], 
      borderWidth: 0,
      data: [65, 20, 15] 
    }
  ]
})

const contentChartLegend = [
  { label: 'Productos (65%)', color: '#2563EB' },       
  { label: 'Promociones (20%)', color: '#60A5FA' },     
  { label: 'Educativo (15%)', color: '#F59E0B' }        
]

const contentChartOptions = ref({
  responsive: true, maintainAspectRatio: false,
  cutout: '80%', plugins: { legend: { display: false } }
})

// --- Funciones de Utilidad (para consistencia visual) ---

function getStatusClass(status) {
  const classes = {
    'published': 'bg-emerald-100 text-emerald-700', 
    'scheduled': 'bg-blue-100 text-blue-700',     
    'draft': 'bg-slate-100 text-slate-700'      
  }
  return classes[status] || 'bg-slate-100 text-slate-700'
}

function getStatusLabel(status) {
  const labels = {
    'published': 'Publicado',
    'scheduled': 'Programado',
    'draft': 'Borrador'
  }
  return labels[status] || 'Desconocido'
}

function getStatusIcon(status) {
  const icons = {
    'published': CheckCircle2,
    'scheduled': Calendar,
    'draft': Edit3
  }
  return icons[status] || FileText
}

// Se usan los valores HEX de la paleta de tailwind.config.js
function getStatusColor(status) {
  const colors = {
    'published': '#10B981', // Emerald-500
    'scheduled': '#3B82F6', // Blue-500
    'draft': '#94A3B8'     // Slate-400
  }
  return colors[status] || '#94A3B8'
}

function getChannelIcon(channel) {
  const icons = {
    'Facebook': Facebook,
    'Instagram': Instagram,
    'LinkedIn': Linkedin,
    'Twitter': Twitter
  }
  return icons[channel] || Link
}

function getMonthAbbr(dateString) {
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  const date = new Date(dateString + 'T00:00:00'); // Asegurar que se interprete como local
  return months[date.getMonth()];
}

</script>

<style scoped lang="postcss">
.btn-primary {
  @apply px-5 py-2.5 bg-kapital-dark text-white font-medium rounded-xl transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 flex items-center gap-2 justify-center;
}

.btn-secondary {
  @apply px-5 py-2.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 justify-center;
}

.card {
  @apply bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-soft;
}

/* Scrollbar fina para las columnas */
.scrollbar-thin::-webkit-scrollbar {
  width: 5px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>