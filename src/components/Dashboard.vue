<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>Dashboard</h1>
      <p>Resumen de tu actividad y desempeño</p>
    </div>

    <!-- Top Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="metric in metrics" 
        :key="metric.id"
        class="card hover:shadow-lg cursor-pointer transition-all"
        @click="selectedMetric = metric.id"
      >
        <div class="flex items-start gap-4">
          <div :class="['w-12 h-12 rounded-lg flex items-center justify-center text-lg', metric.bgColor]">
            <i :class="['fas', metric.icon]"></i>
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Line Chart - Rendimiento -->
      <div class="lg:col-span-2 card">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-lg font-bold text-gray-900">Rendimiento Semanal</h2>
            <p class="text-sm text-gray-600">Publicaciones y engagement</p>
          </div>
          <select class="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark">
            <option>Última semana</option>
            <option>Últimas 2 semanas</option>
            <option>Último mes</option>
          </select>
        </div>

        <!-- Line Chart -->
        <div class="h-64 flex items-end justify-around gap-2">
          <div v-for="(point, idx) in chartData" :key="idx" class="flex-1 flex flex-col items-center gap-2 h-full">
            <!-- Bar Chart -->
            <div class="relative w-full h-full flex items-end justify-center">
              <div class="absolute bottom-0 flex gap-1 items-end h-full w-full">
                <div 
                  class="flex-1 bg-gradient-to-t from-kapital-dark to-kapital-light-1 rounded-t transition-all hover:from-blue-700 cursor-pointer"
                  :style="{ height: point.publications + '%' }"
                  :title="'Publicaciones: ' + point.pubCount"
                ></div>
                <div 
                  class="flex-1 bg-gradient-to-t from-kapital-light-1 to-kapital-light-2 rounded-t transition-all hover:from-blue-400 cursor-pointer"
                  :style="{ height: point.engagement + '%' }"
                  :title="'Engagement: ' + point.engValue + '%'"
                ></div>
              </div>
            </div>
            <small class="text-gray-600 font-medium mt-8">{{ point.day }}</small>
          </div>
        </div>

        <!-- Legend -->
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

      <!-- KPI Cards -->
      <div class="space-y-4">
        <div class="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-gray-900">Alcance Total</h3>
            <i class="fas fa-globe text-kapital-dark text-xl"></i>
          </div>
          <p class="text-3xl font-bold text-kapital-dark mb-2">125.4K</p>
          <div class="w-full bg-gray-300 rounded-full h-2">
            <div class="bg-kapital-dark h-2 rounded-full" style="width: 75%"></div>
          </div>
          <small class="text-gray-600 mt-2 block">+15% respecto a último mes</small>
        </div>

        <div class="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-gray-900">Tasa de Conversión</h3>
            <i class="fas fa-chart-pie text-green-600 text-xl"></i>
          </div>
          <p class="text-3xl font-bold text-green-600 mb-2">3.8%</p>
          <div class="w-full bg-gray-300 rounded-full h-2">
            <div class="bg-green-600 h-2 rounded-full" style="width: 65%"></div>
          </div>
          <small class="text-gray-600 mt-2 block">+0.5% respecto a último mes</small>
        </div>

        <div class="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-semibold text-gray-900">CTR Promedio</h3>
            <i class="fas fa-mouse text-purple-600 text-xl"></i>
          </div>
          <p class="text-3xl font-bold text-purple-600 mb-2">2.1%</p>
          <div class="w-full bg-gray-300 rounded-full h-2">
            <div class="bg-purple-600 h-2 rounded-full" style="width: 55%"></div>
          </div>
          <small class="text-gray-600 mt-2 block">+0.3% respecto a último mes</small>
        </div>
      </div>
    </div>

    <!-- Networks Performance -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Social Networks Breakdown -->
      <div class="card">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Rendimiento por Red Social</h2>
        
        <div class="space-y-4">
          <div v-for="network in networkPerformance" :key="network.id" class="space-y-2">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <i :class="['fas', network.icon, 'text-xl']" :style="{ color: network.color }"></i>
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

      <!-- Pie Chart - Content Distribution -->
      <div class="card">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Distribución de Contenido</h2>
        
        <div class="flex items-center justify-between">
          <!-- SVG Pie Chart -->
          <svg viewBox="0 0 120 120" class="w-40 h-40">
            <!-- Product 65% -->
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#2B66FF"
              stroke-width="8"
              stroke-dasharray="204.2 314"
              stroke-dashoffset="0"
              transform="rotate(-90 60 60)"
            />
            <!-- Promotional 20% -->
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#61A3FF"
              stroke-width="8"
              stroke-dasharray="62.8 314"
              stroke-dashoffset="-204.2"
              transform="rotate(-90 60 60)"
            />
            <!-- Educational 15% -->
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#00FFFF"
              stroke-width="8"
              stroke-dasharray="47.1 314"
              stroke-dashoffset="-267"
              transform="rotate(-90 60 60)"
            />
          </svg>

          <!-- Legend -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded-full" style="background-color: #2B66FF"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">Productos</p>
                <small class="text-gray-600">65%</small>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded-full" style="background-color: #61A3FF"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">Promociones</p>
                <small class="text-gray-600">20%</small>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded-full" style="background-color: #00FFFF"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">Educativo</p>
                <small class="text-gray-600">15%</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 card">
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
              <p class="text-sm font-medium text-gray-900">
                {{ activity.title }}
              </p>
              <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
              <small class="text-gray-500 flex items-center gap-1 mt-2">
                <i class="fas fa-clock"></i> {{ activity.time }}
              </small>
            </div>
            <span 
            :class="['w-24 px-2 py-0.5 text-xs font-bold rounded-full text-center inline-flex items-center justify-center', activity.statusClass]"
            >
            {{ activity.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="space-y-4">
        <div class="card bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-900">Mejores Horas</h3>
            <i class="fas fa-clock text-orange-600 text-xl"></i>
          </div>
          <p class="text-2xl font-bold text-orange-600 mb-2">10:00 - 14:00</p>
          <small class="text-gray-600">Mayor actividad de audiencia</small>
        </div>

        <div class="card bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-900">Mejor Red</h3>
            <i class="fas fa-crown text-pink-600 text-xl"></i>
          </div>
          <p class="text-2xl font-bold text-pink-600 mb-2">Instagram</p>
          <small class="text-gray-600">42% del engagement total</small>
        </div>

        <div class="card bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-900">Próxima Meta</h3>
            <i class="fas fa-target text-indigo-600 text-xl"></i>
          </div>
          <p class="text-2xl font-bold text-indigo-600 mb-2">15K Seguidores</p>
          <small class="text-gray-600">Falta: 2,500 seguidores</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedMetric = ref(null)

const metrics = [
  { 
    id: 1, 
    icon: 'fa-image', 
    label: 'Imágenes Generadas', 
    value: '24', 
    subtitle: 'Este mes',
    bgColor: 'bg-blue-100 text-kapital-dark',
    trend: 12
  },
  { 
    id: 2, 
    icon: 'fa-share-alt', 
    label: 'Publicaciones', 
    value: '18', 
    subtitle: 'Activas',
    bgColor: 'bg-green-100 text-green-600',
    trend: 8
  },
  { 
    id: 3, 
    icon: 'fa-users', 
    label: 'Audiencia', 
    value: '12.5K', 
    subtitle: 'Seguidores',
    bgColor: 'bg-purple-100 text-purple-600',
    trend: 15
  },
  { 
    id: 4, 
    icon: 'fa-fire', 
    label: 'Engagement', 
    value: '4.8%', 
    subtitle: 'Promedio',
    bgColor: 'bg-orange-100 text-orange-600',
    trend: 5
  }
]

const chartData = [
  { day: 'Lun', publications: 60, pubCount: 6, engagement: 75, engValue: '3.2%' },
  { day: 'Mar', publications: 75, pubCount: 8, engagement: 85, engValue: '4.1%' },
  { day: 'Mié', publications: 55, pubCount: 5, engagement: 65, engValue: '2.8%' },
  { day: 'Jue', publications: 85, pubCount: 9, engagement: 95, engValue: '5.2%' },
  { day: 'Vie', publications: 70, pubCount: 7, engagement: 80, engValue: '4.5%' },
  { day: 'Sáb', publications: 40, pubCount: 4, engagement: 50, engValue: '2.1%' },
  { day: 'Dom', publications: 35, pubCount: 3, engagement: 45, engValue: '1.8%' }
]

const networkPerformance = [
  { 
    id: 1, 
    name: 'Instagram', 
    icon: 'bi bi-instagram', 
    color: '#E4405F',
    percentage: 42,
    followers: '5.2K',
    engagement: '5.2%'
  },
  { 
    id: 2, 
    name: 'Facebook', 
    icon: 'bi bi-facebook', 
    color: '#1877F2',
    percentage: 28,
    followers: '3.8K',
    engagement: '3.1%'
  },
  { 
    id: 3, 
    name: 'LinkedIn', 
    icon: 'bi bi-linkedin', 
    color: '#0A66C2',
    percentage: 20,
    followers: '2.1K',
    engagement: '4.5%'
  },
  { 
    id: 4, 
    name: 'Twitter', 
    icon: 'bi bi-twitter-x', 
    color: '#1DA1F2',
    percentage: 10,
    followers: '1.4K',
    engagement: '2.8%'
  }
]

const activities = [
  { 
    id: 1, 
    icon: 'fa-check-circle', 
    title: 'Imagen generada', 
    description: 'Campaña de verano Instagram con IA',
    time: 'Hace 2 horas',
    bgColor: '#10B981',
    status: 'Completado',
    statusClass: 'bg-green-100 text-green-700'
  },
  { 
    id: 2, 
    icon: 'fa-clock', 
    title: 'Publicación programada', 
    description: 'Post profesional en LinkedIn',
    time: 'Hace 1 hora',
    bgColor: '#F59E0B',
    status: 'Pendiente',
    statusClass: 'bg-yellow-100 text-yellow-700'
  },
  { 
    id: 3, 
    icon: 'fa-edit', 
    title: 'Contenido creado', 
    description: 'Post de Facebook para promoción',
    time: 'Hace 30 minutos',
    bgColor: '#3B82F6',
    status: 'Revisión',
    statusClass: 'bg-blue-100 text-blue-700'
  },
  { 
    id: 4, 
    icon: 'fa-message', 
    title: 'Mensaje recibido', 
    description: 'Cliente pregunta sobre precios',
    time: 'Hace 15 minutos',
    bgColor: '#8B5CF6',
  }
]
</script>

<style scoped>
.card {
  @apply bg-white border border-gray-200 rounded-lg p-6 shadow-sm;
}

/* Progress bar animation */
@keyframes slideIn {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.progress-bar {
  animation: slideIn 1s ease-out;
}
</style>