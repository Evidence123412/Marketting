<template>
  <div class="space-y-10">
    
    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Bienvenido a tu Dashboard</h1>
        <p class="text-gray-600">Resumen de tu actividad y desempeño.</p>
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
          class="card hover:shadow-lg cursor-pointer transition-all"
          :class="{ 'ring-2 ring-kapital-dark shadow-md': selectedMetricId === metric.id }"
          @click="handleMetricClick(metric.id)"
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
      <h2 class="text-xl font-bold text-gray-900 mb-4">Análisis de Rendimiento</h2>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 card">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-lg font-bold text-gray-900">{{ weeklyChartTitle }}</h2>
              <p class="text-sm text-gray-600">Rendimiento de la última semana</p>
            </div>
            <button
              v-if="selectedMetricId"
              @click="handleMetricClick(null)"
              class="text-sm text-kapital-dark font-medium hover:underline"
            >
              Ver todo
            </button>
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

    <div>
      <h2 class="text-xl font-bold text-gray-900 mb-4">Actividad y Canales</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div class="card">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Rendimiento por Red Social</h2>
          <div class="space-y-4">
            <div v-for="network in networkPerformance" :key="network.id" class="space-y-2">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <i :class="[network.icon, 'text-xl']" :style="{ color: network.color }"></i>
                  <span class="font-medium text-gray-900">{{ network.name }}</span>
                </div>
                <span class="font-bold text-gray-900">{{ network.percentage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  class="h-3 rounded-full transition-all duration-500" 
                  :style="{ width: network.percentage + '%', backgroundColor: network.color }"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-600">
                <span>{{ network.followers }} seguidores</span>
                <span>{{ network.engagement }}% engagement</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Actividad Reciente</h2>
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
                <small class="text-gray-500 flex items-center gap-1 mt-2">
                  <i class="fas fa-clock"></i> {{ activity.time }}
                </small>
              </div>
              <span 
                v-if="activity.status"
                :class="['w-24 px-2 py-0.5 text-xs font-bold rounded-full text-center inline-flex items-center justify-center', activity.statusClass]"
              >
                {{ activity.status }}
              </span>
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

const selectedMetricId = ref(null)

function handleMetricClick(metricId) {
  if (selectedMetricId.value === metricId) {
    selectedMetricId.value = null
  } else {
    selectedMetricId.value = metricId
  }
}

// ----- DATOS DEL COMPONENTE -----

// --- Métricas Principales (Paleta Profesional) ---
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

// --- Tarjetas de Estadísticas (ELIMINADAS) ---
// La variable 'statCards' fue removida ya que no se utiliza.

// --- Gráfico de Barras: Datos y Opciones (Doble Eje Y) ---
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

// --- Lógica de Gráfico Interactivo ---
const weeklyChartTitle = computed(() => {
  if (selectedMetricId.value === 'publications') return 'Rendimiento: Publicaciones'
  if (selectedMetricId.value === 'engagement') return 'Rendimiento: Engagement'
  return 'Rendimiento Semanal'
})

const filteredWeeklyChartData = computed(() => {
  if (!weeklyChartData.value) return null
  if (!selectedMetricId.value) return weeklyChartData.value

  let filteredDatasets = []
  if (selectedMetricId.value === 'publications') {
    filteredDatasets = [weeklyChartData.value.datasets[0]]
  } else if (selectedMetricId.value === 'engagement') {
    filteredDatasets = [weeklyChartData.value.datasets[1]]
  } else {
    return weeklyChartData.value
  }

  return {
    labels: weeklyChartData.value.labels,
    datasets: filteredDatasets
  }
})


// --- Gráfico de Dona: Datos y Opciones ---
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

// --- Datos de Listas (Iconos Font Awesome) ---
const networkPerformance = [
  { id: 1, name: 'Instagram', icon: 'fa-brands fa-instagram', color: '#E4405F', percentage: 42, followers: '5.2K', engagement: '5.2%'},
  { id: 2, name: 'Facebook', icon: 'fa-brands fa-facebook', color: '#1877F2', percentage: 28, followers: '3.8K', engagement: '3.1%'},
  { id: 3, name: 'LinkedIn', icon: 'fa-brands fa-linkedin', color: '#0A66C2', percentage: 20, followers: '2.1K', engagement: '4.5%'},
  { id: 4, name: 'Twitter X', icon: 'fa-brands fa-twitter', color: '#1DA1F2', percentage: 10, followers: '1.4K', engagement: '2.8%'}
]

const activities = [
  { 
    id: 1, icon: 'fa-check-circle', title: 'Imagen generada', description: 'Campaña de verano Instagram con IA',
    time: 'Hace 2 horas', bgColor: '#10B981', // Verde: Completado
    status: 'Completado', statusClass: 'bg-green-100 text-green-700'
  },
  { 
    id: 2, icon: 'fa-clock', title: 'Publicación programada', description: 'Post profesional en LinkedIn',
    time: 'Hace 1 hora', bgColor: '#F59E0B', // Naranja/Amarillo: Pendiente/Urgente
    status: 'Pendiente', statusClass: 'bg-yellow-100 text-yellow-700'
  },
  { 
    id: 3, icon: 'fa-edit', title: 'Contenido creado', description: 'Post de Facebook para promoción',
    time: 'Hace 30 minutos', bgColor: '#3B82F6', // Azul: Informativo
    status: 'Revisión', statusClass: 'bg-blue-100 text-blue-700'
  },
  { 
    id: 4, icon: 'fa-message', title: 'Mensaje recibido', description: 'Cliente pregunta sobre precios',
    time: 'Hace 15 minutos', bgColor: '#8B5CF6', // Púrpura: Notificación
  }
]
</script>

<style scoped>
.card {
  @apply bg-white border border-gray-200 rounded-lg p-6 shadow-sm;
}
/* Definición de colores de marca */
.text-kapital-dark { color: #2B66FF; }
.bg-kapital-dark { background-color: #2B66FF; }
.bg-kapital-light-2 { background-color: #61A3FF; }
.border-kapital-dark { border-color: #2B66FF; }
.ring-kapital-dark { --tw-ring-color: #2B66FF; }
</style>