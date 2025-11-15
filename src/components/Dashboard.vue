<template>
  <div class="space-y-10">
    
    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Bienvenido a tu Dashboard</h1>
        <p class="text-gray-600">Centro de comando de actividad y clientes.</p>
      </div>
      <select class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark">
        <option>Últimos 7 días</option>
        <option>Últimos 30 días</option>
        <option>Último mes</option>
      </select>
    </div>

    <div>
      <h2 class="text-xl font-bold text-gray-900 mb-4">Resumen Ejecutivo</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="metric in metrics" 
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
              {{ pendingMessages.length }} Pendientes
            </span>
          </div>
          <div class="space-y-3 h-72 overflow-y-auto pr-2">
            <div v-for="msg in pendingMessages" :key="msg.id" class="flex gap-3 p-3 rounded-lg hover:bg-gray-50">
              <div class="w-10 h-10 rounded-full bg-yellow-500 text-white flex-shrink-0 flex items-center justify-center font-bold">
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
              <div class="w-10 h-10 rounded-full bg-green-600 text-white flex-shrink-0 flex items-center justify-center font-bold">
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
            <button @click="goTo('production')" class="text-sm text-kapital-dark font-medium hover:underline">
              Ver todo
            </button>
          </div>
          <div class="space-y-4">
            <div 
              v-for="activity in activities"
              :key="activity.id"
              class="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
            >
              <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: activity.bgColor }">
                <i :class="['fas', activity.icon, 'text-white']"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
              </div>
              <span :class="['text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap text-center inline-flex items-center justify-center', activity.statusClass]">
                {{ activity.status }}
              </span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold text-gray-900">Próximas Publicaciones</h2>
            <button @click="goTo('scheduling')" class="text-sm text-kapital-dark font-medium hover:underline">
              Ver calendario
            </button>
          </div>
          <div class="space-y-4">
            <div 
              v-for="item in scheduled"
              :key="item.id"
              class="flex gap-4"
            >
              <div class="flex flex-col items-center">
                <span class="text-xs font-bold text-kapital-dark">{{ item.date.split(' ')[0] }}</span>
                <span class="text-sm font-semibold text-gray-900">{{ item.date.split(' ')[1] }}</span>
              </div>
              <div class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p class="text-sm font-medium text-gray-900">{{ item.title }}</p>
                <div class="flex gap-2 mt-2">
                  <i v-for="channel in item.channels" :key="channel" :class="[channel, 'text-gray-500']"></i>
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
            <Bar v-if="filteredWeeklyChartData" :data="filteredWeeklyChartData" :options="weeklyChartOptions" />
          </div>
          <div class="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded bg-kapital-dark"></div>
              <span class="text-sm text-gray-700">Publicaciones</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded bg-kapital-light-2"></div>
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

const selectedMetricId = ref(null)

function handleMetricClick(metricId) {
  if (selectedMetricId.value === metricId) {
    selectedMetricId.value = null
  } else {
    selectedMetricId.value = metricId
  }
}

// ----- DATOS DEL COMPONENTE -----
// (Datos simulados para resumir las otras vistas)

// --- 1. Resumen Ejecutivo (KPIs) ---
const metrics = [
  { 
    id: 'publications', icon: 'fa-share-alt', label: 'Publicaciones', value: '18', 
    bgColor: 'bg-gray-100', color: 'text-kapital-dark', trend: 8
  },
  { 
    id: 'engagement', icon: 'fa-fire', label: 'Engagement', value: '4.8%', 
    bgColor: 'bg-gray-100', color: 'text-kapital-dark', trend: -5
  },
  { 
    id: 'audience', icon: 'fa-users', label: 'Audiencia', value: '12.5K', 
    bgColor: 'bg-gray-100', color: 'text-kapital-dark', trend: 15
  },
  { 
    id: 'generated', icon: 'fa-image', label: 'Imágenes Generadas', value: '24', 
    bgColor: 'bg-gray-100', color: 'text-kapital-dark', trend: 12
  }
]

// --- 2. Foco Principal: Clientes (Resumen de Interactions y CRM) ---
const pendingMessages = [
  { id: 1, initials: 'CA', name: 'Carlos Alarcón', preview: '¿Cuál es el precio?', time: 'Hace 5 min' },
  { id: 2, initials: 'MR', name: 'María Rodríguez', preview: 'Información sobre servicios', time: 'Hace 20 min' },
  { id: 4, initials: 'LG', name: 'Laura García', preview: '¿Tienen descuentos para empresas?', time: 'Hace 1h' },
  { id: 5, initials: 'RL', name: 'Roberto López', preview: 'Problema con mi suscripción', time: 'Hace 2h' },
]

const newLeads = [
  { id: 1, initials: 'AM', name: 'Ana Martínez', origin: 'Instagram', date: '15 Nov 2025' },
  { id: 4, initials: 'CJ', name: 'Carlos Jiménez', origin: 'Web', date: '13 Nov 2025' },
]

// --- 3. Gestión de Contenido (Resumen de Production y Scheduling) ---
const activities = [
  { 
    id: 1, icon: 'fa-check-circle', title: 'Imagen generada', description: 'Campaña de verano Instagram con IA',
    bgColor: '#10B981', status: 'Completado', statusClass: 'bg-green-100 text-green-700'
  },
  { 
    id: 3, icon: 'fa-edit', title: 'Contenido creado', description: 'Post de Facebook para promoción',
    bgColor: '#3B82F6', status: 'Revisión', statusClass: 'bg-blue-100 text-blue-700'
  },
  { 
    id: 4, icon: 'fa-message', title: 'Mensaje recibido', description: 'Cliente pregunta sobre precios',
    bgColor: '#8B5CF6', status: 'Respondido', statusClass: 'bg-purple-100 text-purple-700'
  }
]

const scheduled = [
  { 
    id: 2, 
    date: 'NOV 20', 
    title: 'Tips de Marketing Digital', 
    channels: ['fa-brands fa-linkedin']
  },
  { 
    id: 5, 
    date: 'NOV 27', 
    title: 'Webinar en Vivo', 
    channels: ['fa-brands fa-facebook', 'fa-brands fa-linkedin']
  },
]


// --- 4. Análisis de Rendimiento (Reportes) ---
const weeklyChartData = ref({
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Publicaciones', backgroundColor: '#2B66FF', borderRadius: 4,
      data: [6, 8, 5, 9, 7, 4, 3], yAxisID: 'y'
    },
    {
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

const weeklyChartTitle = computed(() => 'Rendimiento Semanal')

// ***** LÍNEA CORREGIDA AQUÍ *****
const filteredWeeklyChartData = computed(() => {
  return weeklyChartData.value
})

const contentChartData = ref({
  labels: ['Productos', 'Promociones', 'Educativo'],
  datasets: [
    { backgroundColor: ['#2B66FF', '#61A3FF', '#00FFFF'], data: [65, 20, 15] }
  ]
})

const contentChartLegend = [
  { label: 'Productos (65%)', color: '#2B66FF' },
  { label: 'Promociones (20%)', color: '#61A3FF' },
  { label: 'Educativo (15%)', color: '#00FFFF' }
]

const contentChartOptions = ref({
  responsive: true, maintainAspectRatio: false,
  cutout: '75%', plugins: { legend: { display: false } }
})
</script>

<style scoped>
.btn-primary {
  @apply px-6 py-3 bg-kapital-dark text-white font-medium rounded-md transition-all hover:bg-blue-700 active:scale-95 flex items-center gap-2 justify-center;
}

.btn-secondary {
  @apply px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200 flex items-center gap-2 justify-center;
}

.card {
  @apply bg-white border border-gray-200 rounded-lg p-6 shadow-sm;
}

/* Definición de colores de marca */
.text-kapital-dark { color: #2B66FF; }
.bg-kapital-dark { background-color: #2B66FF; }
.bg-kapital-light-2 { background-color: #61A3FF; }
.border-kapital-dark { border-color: #2B66FF; }
.ring-kapital-dark { --tw-ring-color: #2B66FF; }

/* Estilo para el scroll de las tarjetas */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #C9C9C9; /* Usando tu color 'kapital-gray' */
  border-radius: 6px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a9a9a9;
}
</style>