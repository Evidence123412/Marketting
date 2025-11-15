<template>
  <div class="space-y-10">
    
    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Bienvenido a tu Dashboard</h1>
        <p class="text-gray-600">Centro de comando de actividad y clientes.</p>
      </div>
      <select class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-kapital-night">
        <option>Últimos 7 días</option>
        <option>Últimos 30 días</option>
        <option>Último mes</option>
      </select>
    </div>

    <div>
      <h2 class="text-xl font-bold text-gray-900 mb-4">Resumen Ejecutivo</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="metric in executiveMetrics" 
          :key="metric.id"
          class="card"
        >
          <div class="flex items-start gap-4">
            <div :class="['w-12 h-12 rounded-lg flex items-center justify-center text-lg', metric.bgColor]">
              <i :class="['fas', metric.icon, metric.color]"></i>
            </div>
            <div class="flex-1">
              <p class="text-xs text-gray-600 font-medium mb-1">{{ metric.label }}</p>
              <p class="text-2xl font-bold text-gray-900 mb-1">{{ metric.value }}</p>
              <small :class="['flex items-center gap-1', metric.trend > 0 ? 'text-green-600' : 'text-red-600']">
                <i :class="['fas', metric.trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                {{ Math.abs(metric.trend) }}% vs mes anterior
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-xl font-bold text-gray-900 mb-4">Foco Principal: Clientes</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div class="card flex flex-col">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold text-gray-900">Interacciones Pendientes</h2>
            <span class="text-sm font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">
              {{ pendingInteractions.length }} Pendientes
            </span>
          </div>
          <div class="space-y-3 h-72 overflow-y-auto pr-2">
            <div v-for="msg in pendingInteractions" :key="msg.id" class="flex gap-3 p-3 rounded-lg hover:bg-gray-50">
              <div class="w-10 h-10 rounded-full bg-kapital-light-1 text-white flex-shrink-0 flex items-center justify-center font-bold">
                {{ msg.initials }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ msg.name }}</p>
                <p class="text-xs text-gray-600 truncate">{{ msg.preview }}</p>
              </div>
              <small class="text-gray-500 text-xs whitespace-nowrap">{{ msg.time }}</small>
            </div>
          </div>
          <button @click="goTo('interactions')" class="btn-primary w-full mt-6 text-sm">
            <i class="fas fa-comments"></i> Gestionar Todos los Mensajes
          </button>
        </div>

        <div class="card flex flex-col">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold text-gray-900">Nuevos Leads</h2>
            <span class="text-sm font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {{ newLeads.length }} Nuevos
            </span>
          </div>
          <div class="space-y-3 h-72 overflow-y-auto pr-2">
            <div v-for="lead in newLeads" :key="lead.id" class="flex gap-3 p-3 rounded-lg hover:bg-gray-50">
              <div class="w-10 h-10 rounded-full bg-kapital-night text-white flex-shrink-0 flex items-center justify-center font-bold">
                {{ lead.initials }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ lead.name }}</p>
                <p class="text-xs text-gray-600">{{ lead.origin }}</p>
              </div>
              <small class="text-gray-500 text-xs whitespace-nowrap">{{ lead.date }}</small>
            </div>
          </div>
          <button @click="goTo('crm')" class="btn-primary w-full mt-6 text-sm">
            <i class="fas fa-address-card"></i> Ver CRM
          </button>
        </div>
      </div>
    </div>

    <div>
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <h2 class="text-xl font-bold text-gray-900">Gestión de Contenido</h2>
        <div class="flex gap-3">
          <button @click="goTo('generation')" class="btn-secondary text-sm">
            <i class="fas fa-wand-magic-sparkles"></i> Generar con IA
          </button>
          <button @click="goTo('production')" class="btn-primary text-sm">
            <i class="fas fa-plus"></i> Crear Publicación
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold text-gray-900">Actividad Reciente</h2>
            <button @click="goTo('production')" class="text-sm text-kapital-night font-medium hover:underline">
              Ver todo
            </button>
          </div>
          <div class="space-y-4">
            <div 
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
            >
              <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: getStatusColor(activity.status) }">
                <i :class="['fas', getStatusIcon(activity.status), 'text-white']"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-sm text-gray-600 mt-1 line-clamp-1">{{ activity.description }}</p>
              </div>
              <span :class="['text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap text-center inline-flex items-center justify-center', getStatusClass(activity.status)]">
                {{ getStatusLabel(activity.status) }}
              </span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold text-gray-900">Próximas Publicaciones</h2>
            <button @click="goTo('scheduling')" class="text-sm text-kapital-night font-medium hover:underline">
              Ver calendario
            </button>
          </div>
          <div class="space-y-4">
            <div 
              v-for="item in upcomingPublications"
              :key="item.id"
              class="flex gap-4"
            >
              <div class="flex flex-col items-center">
                <span class="text-xs font-bold text-kapital-night">{{ item.date.split('-')[2] }}</span>
                <span class="text-sm font-semibold text-gray-900">{{ getMonthAbbr(item.date) }}</span>
              </div>
              <div class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-900">{{ item.title }}</p>
                <div class="flex gap-2 mt-2">
                  <i v-for="channel in item.channels.split(', ')" :key="channel" :class="['fa-brands', getChannelIcon(channel), 'text-kapital-light-1']"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div>
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <h2 class="text-xl font-bold text-gray-900">Análisis de Rendimiento</h2>
        <button @click="goTo('reports')" class="btn-secondary text-sm">
          <i class="fas fa-bar-chart"></i> Ver Reportes Completos
        </button>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 card">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold text-gray-900">Rendimiento Semanal</h2>
          </div>
          <div class="h-64">
            <Bar v-if="weeklyChartData" :data="weeklyChartData" :options="weeklyChartOptions" />
          </div>
          <div class="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded bg-kapital-night"></div>
              <span class="text-sm text-gray-700">Publicaciones</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded bg-kapital-light-1"></div>
              <span class="text-sm text-gray-700">Engagement %</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 card">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Distribución de Contenido</h2>
          <div class="flex items-center justify-center h-48">
             <Doughnut v-if="contentChartData" :data="contentChartData" :options="contentChartOptions" />
          </div>
          <div class="flex flex-col items-center gap-4 mt-6 pt-6 border-t border-gray-200">
            <div v-for="item in contentChartLegend" :key="item.label" class="flex items-center gap-2">
              <div class="w-3 h-3 rounded" :style="{ backgroundColor: item.color }"></div>
              <span class="text-sm text-gray-700">{{ item.label }}</span>
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
    id: 'publications', icon: 'fa-share-alt', label: 'Publicaciones Totales', 
    value: allPublications.value.length, 
    // CAMBIO: color: 'text-kapital-night'
    bgColor: 'bg-gray-100', color: 'text-kapital-night', trend: 8
  },
  { 
    id: 'engagement', icon: 'fa-fire', label: 'Engagement (Reportes)', 
    value: '3.8%', // Dato estático de ejemplo, similar a Reports.vue
    // CAMBIO: color: 'text-kapital-night'
    bgColor: 'bg-gray-100', color: 'text-kapital-night', trend: -5
  },
  { 
    id: 'leads', icon: 'fa-users', label: 'Nuevos Leads (CRM)', 
    value: allLeads.value.filter(l => l.status === 'new').length, 
    // CAMBIO: color: 'text-kapital-night'
    bgColor: 'bg-gray-100', color: 'text-kapital-night', trend: 15
  },
  { 
    id: 'interactions', icon: 'fa-comments', label: 'Interacciones Pendientes', 
    value: allInteractions.value.filter(m => m.status === 'pending').length, 
    // CAMBIO: color: 'text-kapital-night'
    bgColor: 'bg-gray-100', color: 'text-kapital-night', trend: 12
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
      // Color: kapital-night (negro)
      label: 'Publicaciones', backgroundColor: '#111827', borderRadius: 4,
      data: [6, 8, 5, 9, 7, 4, 3], yAxisID: 'y'
    },
    {
      // Color: kapital-light-1 (azul más suave)
      label: 'Engagement %', backgroundColor: '#61A3FF', borderRadius: 4,
      data: [3.2, 4.1, 2.8, 5.2, 4.5, 2.1, 1.8], yAxisID: 'y1'
    }
  ]
})

const weeklyChartOptions = ref({
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: {
      type: 'linear', display: true, position: 'left', beginAtZero: true,
      grid: { color: '#f3f4f6' }, title: { display: true, text: 'Publicaciones' }
    },
    y1: {
      type: 'linear', display: true, position: 'right', beginAtZero: true,
      grid: { drawOnChartArea: false }, title: { display: true, text: 'Engagement %' }
    }
  }
})

const contentChartData = ref({
  labels: ['Productos', 'Promociones', 'Educativo'],
  datasets: [
    { 
      // Colores ajustados para menos fatiga visual
      backgroundColor: ['#111827', '#61A3FF', '#4BC0C0'], // kapital-night, kapital-light-1, kapital-accent-medium (ejemplo)
      data: [65, 20, 15] 
    }
  ]
})

const contentChartLegend = [
  { label: 'Productos (65%)', color: '#111827' },       // kapital-night
  { label: 'Promociones (20%)', color: '#61A3FF' },     // kapital-light-1
  { label: 'Educativo (15%)', color: '#4BC0C0' }        // kapital-accent-medium
]

const contentChartOptions = ref({
  responsive: true, maintainAspectRatio: false,
  cutout: '75%', plugins: { legend: { display: false } }
})

// --- Funciones de Utilidad (para consistencia visual) ---

// Se usan clases de la paleta de tailwind.config.js
function getStatusClass(status) {
  const classes = {
    'published': 'bg-kapital-light-2 text-kapital-night', // Cyan bg, texto oscuro
    'scheduled': 'bg-kapital-light-1 text-white',     // Azul claro bg, texto blanco
    'draft': 'bg-kapital-gray text-kapital-night'      // Gris bg, texto oscuro
  }
  return classes[status] || 'bg-kapital-gray text-kapital-night'
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
    'published': 'fa-check-circle',
    'scheduled': 'fa-calendar-alt',
    'draft': 'fa-edit'
  }
  return icons[status] || 'fa-file-alt'
}

// Se usan los valores HEX de la paleta de tailwind.config.js
function getStatusColor(status) {
  const colors = {
    'published': '#00FFFF', // kapital-light-2
    'scheduled': '#61A3FF', // kapital-light-1
    'draft': '#C9C9C9'     // kapital-gray
  }
  return colors[status] || '#C9C9C9'
}

function getChannelIcon(channel) {
  const icons = {
    'Facebook': 'fa-facebook',
    'Instagram': 'fa-instagram',
    'LinkedIn': 'fa-linkedin',
    'Twitter': 'fa-twitter'
  }
  return icons[channel] || 'fa-link'
}

function getMonthAbbr(dateString) {
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  const date = new Date(dateString + 'T00:00:00'); // Asegurar que se interprete como local
  return months[date.getMonth()];
}

</script>

<style scoped>
.btn-primary {
  @apply px-6 py-3 bg-kapital-night text-white font-medium rounded-md transition-all hover:bg-kapital-light-1 active:scale-95 flex items-center gap-2 justify-center;
}

.btn-secondary {
  @apply px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200 flex items-center gap-2 justify-center;
}

.card {
  @apply bg-white border border-gray-200 rounded-lg p-6 shadow-sm;
}

/* Estilo para el scroll de las tarjetas */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #C9C9C9; /* Usando kapital-gray */
  border-radius: 6px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a9a9a9;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>