<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>Reportes</h1>
      <p>Análisis de desempeño y métricas de tus redes sociales</p>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fas fa-calendar-alt mr-2 text-kapital-dark"></i>Desde
        </label>
        <input 
          v-model="dateRange.start"
          type="date" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fas fa-calendar-alt mr-2 text-kapital-dark"></i>Hasta
        </label>
        <input 
          v-model="dateRange.end"
          type="date" 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fas fa-layer-group mr-2 text-kapital-dark"></i>Canal
        </label>
        <select 
          v-model="selectedChannel"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Todos los canales</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="linkedin">LinkedIn</option>
          <option value="twitter">Twitter</option>
        </select>
      </div>
      <div class="flex items-end gap-2">
        <button @click="generateReport" class="btn-primary w-full">
          <i class="fas fa-chart-bar"></i> Generar Reporte
        </button>
        <button @click="exportReport" class="btn-secondary px-4 py-2">
          <i class="fas fa-download"></i>
        </button>
      </div>
    </div>

    <!-- KPI Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="kpi in kpis" 
        :key="kpi.id" 
        class="card hover:shadow-lg transition-all cursor-pointer group"
        @click="selectKPI(kpi)"
      >
        <div class="flex items-start justify-between mb-3">
          <div :class="['w-12 h-12 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform', kpi.bgColor]">
            <i :class="['fas', kpi.icon, 'text-lg']"></i>
          </div>
          <span :class="['text-xs font-bold px-2 py-1 rounded-full', kpi.trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
            <i :class="['fas', kpi.trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
            {{ Math.abs(kpi.trend) }}%
          </span>
        </div>
        <h4 class="text-sm font-medium text-gray-600 mb-1">{{ kpi.label }}</h4>
        <p class="text-2xl font-bold text-gray-900 mb-2">{{ kpi.value }}</p>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all duration-500" 
            :style="{ width: kpi.progress + '%', backgroundColor: kpi.accentColor }"
          ></div>
        </div>
        <small class="text-gray-600 mt-2 block">{{ kpi.detail }}</small>
      </div>
    </div>

    <!-- KPI Comparison Chart -->
    <div class="card">
      <h2 class="text-lg font-bold text-gray-900 mb-6">Comparativa KPIs - Período Anterior vs Actual</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Horizontal Bar Chart -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Rendimiento Comparativo</h3>
          <div class="space-y-6">
            <div v-for="kpi in kpis" :key="kpi.id" class="space-y-2">
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-2">
                  <div :class="['w-8 h-8 rounded-lg flex items-center justify-center text-white', kpi.bgColor]">
                    <i :class="['fas', kpi.icon, 'text-sm']"></i>
                  </div>
                  <span class="font-medium text-gray-900">{{ kpi.label }}</span>
                </div>
                <span class="font-bold text-gray-900">{{ kpi.value }}</span>
              </div>
              <div class="flex gap-2 h-6">
                <div class="flex-1 bg-gray-200 rounded-lg overflow-hidden">
                  <div 
                    class="h-full rounded-lg transition-all duration-500 opacity-70"
                    :style="{ width: '65%', backgroundColor: kpi.accentColor }"
                    title="Período anterior"
                  ></div>
                </div>
                <div class="flex-1 bg-gray-200 rounded-lg overflow-hidden">
                  <div 
                    class="h-full rounded-lg transition-all duration-500"
                    :style="{ width: '85%', backgroundColor: kpi.accentColor }"
                    title="Período actual"
                  ></div>
                </div>
              </div>
              <div class="flex justify-between text-xs text-gray-600">
                <span>Anterior</span>
                <span>Actual (+{{ kpi.trend }}%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Radial/Circular Progress -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Progreso hacia Metas</h3>
          <div class="grid grid-cols-2 gap-6">
            <div v-for="kpi in kpis" :key="'goal-' + kpi.id" class="flex flex-col items-center">
              <!-- SVG Circle Progress -->
              <svg class="w-20 h-20 mb-3" viewBox="0 0 100 100">
                <!-- Background circle -->
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" stroke-width="6" />
                <!-- Progress circle -->
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  :stroke="kpi.accentColor" 
                  stroke-width="6"
                  stroke-dasharray="282.74"
                  :stroke-dashoffset="282.74 - (282.74 * kpi.progress / 100)"
                  stroke-linecap="round"
                  style="transform: rotate(-90deg); transform-origin: 50% 50%;"
                  class="transition-all duration-500"
                />
                <!-- Center text -->
                <text 
                  x="50" 
                  y="55" 
                  text-anchor="middle" 
                  font-size="20" 
                  font-weight="bold"
                  :fill="kpi.accentColor"
                >
                  {{ kpi.progress }}%
                </text>
              </svg>
              <p class="text-xs font-medium text-gray-900 text-center">{{ kpi.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="border-t border-gray-200 mt-6 pt-6 flex justify-center gap-8">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-gray-300 rounded"></div>
          <span class="text-sm text-gray-600">Período Anterior</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #2B66FF;"></div>
          <span class="text-sm text-gray-600">Período Actual</span>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Bar Chart -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-lg font-bold text-gray-900">Rendimiento por Día</h2>
            <p class="text-sm text-gray-600 mt-1">Últimos 7 días - Alcance vs Interacciones</p>
          </div>
          <div class="flex gap-2">
            <button 
              @click="chartView = 'performance'"
              :class="['px-3 py-1 text-xs font-medium rounded transition-colors', chartView === 'performance' ? 'bg-kapital-dark text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
            >
              Comparativa
            </button>
            <button 
              @click="chartView = 'reach'"
              :class="['px-3 py-1 text-xs font-medium rounded transition-colors', chartView === 'reach' ? 'bg-kapital-dark text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
            >
              Alcance
            </button>
          </div>
        </div>

        <!-- Comparative Bar Chart -->
        <div v-if="chartView === 'performance'" class="flex items-end justify-around gap-2 h-80 mb-4 px-2 bg-gray-50 rounded-lg p-4">
          <div 
            v-for="(bar, idx) in chartData" 
            :key="'perf-' + idx" 
            class="flex-1 flex flex-col items-end justify-end gap-3 group"
            :title="`${bar.day}: Alcance ${bar.reach} | Interacciones ${bar.interactions}`"
          >
            <div class="flex gap-2 h-full w-full items-end justify-center">
              <!-- Alcance Bar -->
              <div 
                class="bg-gradient-to-t from-kapital-dark to-kapital-light-1 rounded-t transition-all group-hover:shadow-lg cursor-pointer"
                :style="{ height: bar.height + '%', width: '40%', minHeight: bar.height +'px' }"
              ></div>
              <!-- Interactions Bar -->
              <div 
                class="bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t transition-all group-hover:shadow-lg cursor-pointer"
                :style="{ height: bar.interactionHeight + '%', width: '40%', minHeight: bar.interactionHeight +'px' }"
              ></div>
            </div>
            <small class="text-gray-700 font-bold text-center w-full">{{ bar.day }}</small>
          </div>
        </div>

        <!-- Single Bar Chart - Alcance -->
        <div v-else class="flex items-end justify-around gap-3 h-64 mb-4">
          <div 
            v-for="(bar, idx) in chartData" 
            :key="'reach-' + idx" 
            class="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
            :title="`${bar.day}: ${bar.reach}`"
          >
            <div class="relative w-full h-full flex items-end justify-center">
              <div 
                class="w-full bg-gradient-to-t from-kapital-dark to-kapital-light-1 rounded-t transition-all group-hover:opacity-80"
                :style="{ height: bar.height + '%' , width: '40%', minHeight: bar.height +'px' }"
              ></div>
              <span class="absolute -top-6 text-xs font-bold text-gray-700">{{ bar.reach }}</span>
            </div>
            <small class="text-gray-600 font-medium mt-2">{{ bar.day }}</small>
          </div>
        </div>

        <!-- Legend -->
        <div class="border-t border-gray-200 pt-4 flex justify-center gap-6 text-sm text-gray-600">
          <div v-if="chartView === 'performance'" class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-gradient-to-t from-kapital-dark to-kapital-light-1"></div>
            <span>Alcance</span>
          </div>
          <div v-if="chartView === 'performance'" class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-gradient-to-t from-kapital-light-1 to-kapital-light-2"></div>
            <span>Interacciones</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-info-circle"></i>
            <span>Hovea para ver detalles</span>
          </div>
        </div>
      </div>

      <!-- Engagement Trend with Multiple Bars -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-lg font-bold text-gray-900">Tendencia de Engagement</h2>
            <p class="text-sm text-gray-600 mt-1">Comportamiento semanal - CTR vs Engagement</p>
          </div>
          <div class="flex gap-2">
            <button 
              @click="engagementView = 'comparative'"
              :class="['px-3 py-1 text-xs font-medium rounded transition-colors', engagementView === 'comparative' ? 'bg-kapital-dark text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
            >
              Comparativa
            </button>
            <button 
              @click="engagementView = 'engagement'"
              :class="['px-3 py-1 text-xs font-medium rounded transition-colors', engagementView === 'engagement' ? 'bg-kapital-dark text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
            >
              Engagement
            </button>
          </div>
        </div>

        <!-- Comparative View -->
        <div v-if="engagementView === 'comparative'" class="h-64 flex items-end justify-around gap-1 mb-4 relative px-2">
          <!-- Grid lines -->
          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div class="border-t border-gray-200"></div>
            <div class="border-t border-gray-200"></div>
            <div class="border-t border-gray-200"></div>
          </div>

          <!-- Bars -->
          <div 
            v-for="(point, idx) in engagementData" 
            :key="'comp-' + idx" 
            class="flex-1 flex flex-col items-center gap-2 group relative z-10"
            :title="`${point.day}: Engagement ${point.engagement}% | CTR ${point.ctr}%`"
          >
            <div class="relative w-full h-full flex items-end justify-center gap-0.5">
              <!-- Engagement Bar -->
              <div 
                class="flex-1 bg-gradient-to-t from-kapital-light-1 to-kapital-light-2 rounded-t transition-all group-hover:opacity-80"
                :style="{ height: point.height + '%', width: '40%', minHeight: point.height +'px' }"
              ></div>
              <!-- CTR Bar -->
              <div 
                class="flex-1 bg-gradient-to-t from-pink-500 to-pink-300 rounded-t transition-all group-hover:opacity-80"
                :style="{ height: point.ctrHeight + '%' , width: '40%', minHeight: point.ctrHeight +'px'}"
              ></div>
            </div>
            <small class="text-gray-600 font-medium mt-2">{{ point.day }}</small>
          </div>
        </div>

        <!-- Single Engagement View -->
        <div v-else class="h-64 flex items-end justify-around gap-2 mb-4 relative">
          <!-- Grid lines -->
          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div class="border-t border-gray-200"></div>
            <div class="border-t border-gray-200"></div>
            <div class="border-t border-gray-200"></div>
          </div>

          <!-- Engagement bars -->
          <div 
            v-for="(point, idx) in engagementData" 
            :key="'eng-' + idx" 
            class="flex-1 flex flex-col items-center gap-2 group relative z-10"
            :title="`${point.day}: ${point.engagement}%`"
          >
            <div class="relative w-full h-full flex items-end justify-center">
              <div 
                class="w-3/4 bg-gradient-to-t from-kapital-light-1 to-kapital-light-2 rounded-t transition-all group-hover:opacity-80"
                :style="{ height: point.height + '%', width: '40%', minHeight: point.height +'px' }"
              ></div>
              <span class="absolute -top-6 text-xs font-bold text-kapital-dark">{{ point.engagement }}%</span>
            </div>
            <small class="text-gray-600 font-medium mt-2">{{ point.day }}</small>
          </div>
        </div>

        <!-- Legend -->
        <div class="border-t border-gray-200 pt-4 flex justify-center gap-6 text-sm text-gray-600">
          <div v-if="engagementView === 'comparative'" class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-gradient-to-t from-kapital-light-1 to-kapital-light-2"></div>
            <span>Engagement</span>
          </div>
          <div v-if="engagementView === 'comparative'" class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-gradient-to-t from-pink-500 to-pink-300"></div>
            <span>CTR</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-info-circle"></i>
            <span>Promedio: {{ avgEngagement }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Network Performance -->
    <div class="card">
      <h2 class="text-lg font-bold text-gray-900 mb-6">Desempeño por Red Social</h2>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">
                <i class="fas fa-globe mr-2 text-kapital-dark"></i>Red Social
              </th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">
                <i class="fas fa-eye mr-2 text-kapital-dark"></i>Alcance
              </th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">
                <i class="fas fa-heart mr-2 text-kapital-dark"></i>Engagement
              </th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">
                <i class="fas fa-mouse mr-2 text-kapital-dark"></i>CTR
              </th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">
                <i class="fas fa-user-plus mr-2 text-kapital-dark"></i>Followers
              </th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">
                <i class="fas fa-chart-line mr-2 text-kapital-dark"></i>Crecimiento
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="network in networkPerformance" :key="network.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-3">
                <div class="flex items-center gap-2">
                  <i 
                :class="[network.icon, 'text-lg']" 
                :style="{ color: network.color }">
                </i>

                  <span class="font-medium text-gray-900">{{ network.name }}</span>
                </div>
              </td>
              <td class="px-6 py-3">
                <span class="font-bold text-gray-900">{{ network.reach }}</span>
                <small class="text-gray-600 block">+{{ network.reachChange }}%</small>
              </td>
              <td class="px-6 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full" 
                      :style="{ width: network.engagement + '%', backgroundColor: network.color }"
                    ></div>
                  </div>
                  <span class="font-bold text-gray-900">{{ network.engagement }}%</span>
                </div>
              </td>
              <td class="px-6 py-3">
                <span class="font-bold text-gray-900">{{ network.ctr }}%</span>
              </td>
              <td class="px-6 py-3">
                <span class="font-bold text-gray-900">{{ network.followers }}</span>
              </td>
              <td class="px-6 py-3">
                <span :class="['text-xs font-bold px-2 py-1 rounded-full', network.growth > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                  <i :class="['fas', network.growth > 0 ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                  {{ Math.abs(network.growth) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Export Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
        <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <i class="fas fa-file-csv text-green-600"></i> Exportar Datos
        </h3>
        <p class="text-sm text-gray-700 mb-4">Descarga el reporte en formato CSV para análisis avanzado</p>
        <button @click="exportCSV" class="btn-primary w-full">
          <i class="fas fa-download"></i> Descargar CSV
        </button>
      </div>

      <div class="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
        <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <i class="fas fa-envelope text-blue-600"></i> Enviar por Email
        </h3>
        <p class="text-sm text-gray-700 mb-4">Comparte el reporte automáticamente con tu equipo</p>
        <button @click="emailReport" class="btn-primary w-full">
          <i class="fas fa-envelope"></i> Enviar Reporte
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['showToast'])

const dateRange = ref({
  start: '2025-11-09',
  end: '2025-11-15'
})

const selectedChannel = ref('')
const selectedKPI = ref(null)
const chartView = ref('performance')
const engagementView = ref('comparative')

const kpis = ref([
  { 
    id: 1, 
    icon: 'fa-globe', 
    label: 'Alcance Total', 
    value: '45.2K', 
    trend: 12,
    bgColor: 'bg-blue-600',
    accentColor: '#2B66FF',
    progress: 75,
    detail: '+5.4K desde el período anterior'
  },
  { 
    id: 2, 
    icon: 'fa-heart', 
    label: 'Engagement', 
    value: '3.8%', 
    trend: 5,
    bgColor: 'bg-pink-600',
    accentColor: '#FF1493',
    progress: 65,
    detail: '+0.5% desde el período anterior'
  },
  { 
    id: 3, 
    icon: 'fa-mouse', 
    label: 'CTR', 
    value: '2.1%', 
    trend: 3,
    bgColor: 'bg-purple-600',
    accentColor: '#9333EA',
    progress: 55,
    detail: '+0.3% desde el período anterior'
  },
  { 
    id: 4, 
    icon: 'fa-user-plus', 
    label: 'Leads', 
    value: '87', 
    trend: 25,
    bgColor: 'bg-green-600',
    accentColor: '#16A34A',
    progress: 85,
    detail: '+25 desde el período anterior'
  }
])

const chartData = ref([
  { day: 'Lun', height: 60, reach: '6.2K', interactions: 320, interactionHeight: 55 },
  { day: 'Mar', height: 75, reach: '8.1K', interactions: 420, interactionHeight: 72 },
  { day: 'Mié', height: 55, reach: '5.8K', interactions: 280, interactionHeight: 48 },
  { day: 'Jue', height: 85, reach: '9.3K', interactions: 510, interactionHeight: 87 },
  { day: 'Vie', height: 70, reach: '7.6K', interactions: 380, interactionHeight: 65 },
  { day: 'Sáb', height: 40, reach: '4.2K', interactions: 180, interactionHeight: 39 },
  { day: 'Dom', height: 35, reach: '3.8K', interactions: 150, interactionHeight: 32 }
])

const engagementData = ref([
  { day: 'Lun', height: 65, engagement: '3.2', ctr: '1.8', ctrHeight: 48 },
  { day: 'Mar', height: 80, engagement: '4.1', ctr: '2.4', ctrHeight: 64 },
  { day: 'Mié', height: 55, engagement: '2.8', ctr: '1.5', ctrHeight: 40 },
  { day: 'Jue', height: 90, engagement: '4.8', ctr: '2.9', ctrHeight: 77 },
  { day: 'Vie', height: 75, engagement: '4.0', ctr: '2.3', ctrHeight: 61 },
  { day: 'Sáb', height: 45, engagement: '2.3', ctr: '1.2', ctrHeight: 32 },
  { day: 'Dom', height: 40, engagement: '2.1', ctr: '1.0', ctrHeight: 27 }
])

const networkPerformance = ref([
  { 
    id: 1, 
    name: 'Instagram', 
    icon: 'bi bi-instagram', 
    color: '#E4405F',
    reach: '18.5K',
    reachChange: 15,
    engagement: 5.2,
    ctr: 2.8,
    followers: '5.2K',
    growth: 8
  },
  { 
    id: 2, 
    name: 'Facebook', 
    icon: 'bi bi-facebook', 
    color: '#1877F2',
    reach: '14.2K',
    reachChange: 9,
    engagement: 3.1,
    ctr: 1.9,
    followers: '3.8K',
    growth: 5
  },
  { 
    id: 3, 
    name: 'LinkedIn', 
    icon: 'bi bi-linkedin', 
    color: '#0A66C2',
    reach: '8.6K',
    reachChange: 12,
    engagement: 4.5,
    ctr: 3.2,
    followers: '2.1K',
    growth: 12
  },
  { 
    id: 4, 
    name: 'X / Twitter', 
    icon: 'bi bi-twitter-x', 
    color: '#000000',
    reach: '3.9K',
    reachChange: 6,
    engagement: 2.1,
    ctr: 1.5,
    followers: '1.4K',
    growth: -2
  },
  { 
    id: 5, 
    name: 'TikTok', 
    icon: 'bi bi-tiktok', 
    color: '#010101',
    reach: '11.7K',
    reachChange: 18,
    engagement: 7.9,
    ctr: 3.8,
    followers: '4.6K',
    growth: 10
  },
  { 
    id: 6, 
    name: 'YouTube', 
    icon: 'bi bi-youtube', 
    color: '#FF0000',
    reach: '22.3K',
    reachChange: 21,
    engagement: 6.3,
    ctr: 4.2,
    followers: '7.4K',
    growth: 14
  },
  { 
    id: 7, 
    name: 'Pinterest', 
    icon: 'bi bi-pinterest', 
    color: '#E60023',
    reach: '4.2K',
    reachChange: 5,
    engagement: 2.7,
    ctr: 1.8,
    followers: '1.8K',
    growth: 3
  },
  { 
    id: 8, 
    name: 'WhatsApp', 
    icon: 'bi bi-whatsapp', 
    color: '#25D366',
    reach: '9.5K',
    reachChange: 11,
    engagement: 4.9,
    ctr: 2.6,
    followers: '3.1K',
    growth: 7
  }
])


const avgEngagement = computed(() => {
  const avg = engagementData.value.reduce((sum, item) => sum + parseFloat(item.engagement), 0) / engagementData.value.length
  return avg.toFixed(1)
})

function selectKPI(kpi) {
  selectedKPI.value = kpi
  emit('showToast', `Seleccionaste: ${kpi.label}`)
}

function generateReport() {
  if (!dateRange.value.start || !dateRange.value.end) {
    emit('showToast', 'Por favor selecciona un rango de fechas', 'error')
    return
  }
  emit('showToast', `Reporte generado para ${dateRange.value.start} - ${dateRange.value.end}`)
}

function exportReport() {
  emit('showToast', 'Iniciando descarga del reporte...')
}

function exportCSV() {
  emit('showToast', 'Exportando datos a CSV... Descarga iniciada')
}

function emailReport() {
  emit('showToast', 'Reporte enviado por email a tu equipo')
}
</script>

<style scoped>
.btn-primary {
  @apply px-6 py-3 bg-kapital-dark text-white font-medium rounded-md transition-all hover:bg-blue-700 active:scale-95 flex items-center gap-2 justify-center;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200;
}
</style>