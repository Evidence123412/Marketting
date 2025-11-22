<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>Analíticas y Reportes</h1>
      <p>Visualiza el rendimiento de tus campañas y genera reportes detallados.</p>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex gap-6" aria-label="Tabs">
        <button 
          @click="activeTab = 'dashboard'"
          :class="['tab-button', activeTab === 'dashboard' ? 'tab-active' : 'tab-inactive']"
        >
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </button>
        <button 
          @click="activeTab = 'reports'"
          :class="['tab-button', activeTab === 'reports' ? 'tab-active' : 'tab-inactive']"
        >
          <i class="fas fa-chart-pie"></i>
          <span>Reportes</span>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div>
      <!-- Dashboard Content -->
      <div v-show="activeTab === 'dashboard'" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="metric in metrics" :key="metric.id" class="card">
            <div class="flex items-start gap-4">
              <div :class="['w-12 h-12 rounded-lg flex items-center justify-center text-lg', metric.bgColor]">
                <i :class="['fas', metric.icon]"></i>
              </div>
              <div>
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
            <div class="card lg:col-span-2">
                <h2 class="text-lg font-bold text-gray-900 mb-4"><i class="fas fa-users mr-2"></i>Demografía de la Audiencia</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h3 class="font-semibold mb-2 text-center"><i class="fas fa-birthday-cake mr-2"></i>Edad</h3>
                        <div v-for="age in audienceDemographics.age" :key="age.name" class="flex justify-between items-center text-sm py-1 border-b">
                            <span>{{ age.name }}</span>
                            <span class="font-bold text-kapital-dark">{{ age.value }}%</span>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2 text-center"><i class="fas fa-venus-mars mr-2"></i>Género</h3>
                        <div v-for="gender in audienceDemographics.gender" :key="gender.name" class="flex justify-between items-center text-sm py-1 border-b">
                            <span>{{ gender.name }}</span>
                            <span class="font-bold text-kapital-dark">{{ gender.value }}%</span>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-2 text-center"><i class="fas fa-map-marker-alt mr-2"></i>Ubicación</h3>
                        <div v-for="location in audienceDemographics.location" :key="location.name" class="flex justify-between items-center text-sm py-1 border-b">
                            <span>{{ location.name }}</span>
                            <span class="font-bold text-kapital-dark">{{ location.value }}%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <h2 class="text-lg font-bold text-gray-900 mb-4"><i class="fas fa-history mr-2"></i>Actividad Reciente</h2>
                <div class="space-y-4">
                    <div v-for="activity in activities" :key="activity.id" class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: activity.bgColor }">
                            <i :class="['fas', activity.icon, 'text-white']"></i>
                        </div>
                        <div>
                            <p class="text-sm font-medium">{{ activity.title }}</p>
                            <p class="text-xs text-gray-500">{{ activity.time }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card">
                <h2 class="text-lg font-bold text-gray-900 mb-4"><i class="fas fa-fire-alt mr-2"></i>Top Posts de la Semana</h2>
                <div class="space-y-4">
                    <div v-for="post in topPerformingPosts" :key="post.id" class="flex items-start gap-4 border-b pb-3 last:border-b-0">
                        <i :class="['fab', `fa-${post.platform.toLowerCase().replace(' / twitter', '')}`, 'text-2xl mt-1']" :style="{ color: getPlatformColor(post.platform) }"></i>
                        <div class="flex-1">
                            <p class="text-sm text-gray-800 mb-2">{{ post.postContent }}</p>
                            <div class="flex justify-around text-xs text-gray-600">
                                <span title="Alcance"><i class="fas fa-eye mr-1"></i>{{ post.reach }}</span>
                                <span title="Likes"><i class="fas fa-thumbs-up mr-1"></i>{{ post.likes }}</span>
                                <span title="Comentarios"><i class="fas fa-comment mr-1"></i>{{ post.comments }}</span>
                                <span title="Compartidos"><i class="fas fa-share mr-1"></i>{{ post.shares }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <h2 class="text-lg font-bold text-gray-900 mb-4"><i class="fas fa-chart-line mr-2"></i>Crecimiento de la Audiencia</h2>
                <div class="h-64 flex items-end justify-around gap-2">
                    <div v-for="(growth, idx) in audienceGrowth" :key="idx" class="flex-1 flex flex-col items-center gap-2 group cursor-pointer" :title="`${growth.month}: ${growth.followers.toLocaleString()} seguidores`">
                        <div class="relative w-full h-44 flex items-end justify-center">
                            <div 
                                class="w-3/4 bg-gradient-to-t from-kapital-dark to-kapital-light-1 rounded-t transition-all group-hover:opacity-80" 
                                :style="{ height: maxFollowers > 0 ? (growth.followers / maxFollowers * 100) + '%' : '0%', width: '50%' }">
                            </div>
                            <span class="absolute -top-6 text-xs font-bold text-gray-700">{{ (growth.followers / 1000).toFixed(1) }}k</span>
                        </div>
                        <small class="text-gray-600 font-medium mt-2">{{ growth.month }}</small>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <!-- Reports Content -->
      <div v-show="activeTab === 'reports'" class="space-y-8">
        <!-- Filters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
          <input v-model="dateRange.start" type="date" class="form-input" />
          <input v-model="dateRange.end" type="date" class="form-input" />
          <select v-model="selectedChannel" class="form-input">
            <option value="">Todos los canales</option>
            <option v-for="channel in channelOptions" :key="channel.id" :value="channel.id">{{ channel.name }}</option>
          </select>
          <button @click="generateReport" class="btn-primary">Generar Reporte</button>
        </div>

        <!-- Export Buttons -->
        <div class="flex gap-2">
            <button @click="exportCSV" class="btn-secondary"><i class="fas fa-file-csv mr-2"></i>Exportar a CSV</button>
            <button @click="exportXLSX" class="btn-secondary"><i class="fas fa-file-excel mr-2"></i>Exportar a Excel</button>
            <button @click="exportPDF" class="btn-secondary"><i class="fas fa-file-pdf mr-2"></i>Exportar a PDF</button>
        </div>

        <!-- Report Tables and Charts -->
        <div class="card">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Rendimiento por Red Social</h2>
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left font-semibold text-gray-700"><i class="fab fa-windows mr-2"></i>Red Social</th>
                <th class="px-6 py-3 text-left font-semibold text-gray-700"><i class="fas fa-eye mr-2"></i>Alcance</th>
                <th class="px-6 py-3 text-left font-semibold text-gray-700"><i class="fas fa-heart mr-2"></i>Engagement</th>
                <th class="px-6 py-3 text-left font-semibold text-gray-700"><i class="fas fa-mouse-pointer mr-2"></i>CTR</th>
                <th class="px-6 py-3 text-left font-semibold text-gray-700"><i class="fas fa-users mr-2"></i>Followers</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="network in filteredReportData" :key="network.id" class="border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium">{{ network.name }}</td>
                <td class="px-6 py-4">{{ network.reach }}</td>
                <td class="px-6 py-4">{{ network.engagement }}%</td>
                <td class="px-6 py-4">{{ network.ctr }}%</td>
                <td class="px-6 py-4">{{ network.followers }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { analyticsService } from '../services/crmService.js';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const emit = defineEmits(['showToast']);

const activeTab = ref('dashboard');
const metrics = ref([]);
const audienceDemographics = ref({ age: [], gender: [], location: [], devices: [] });
const contentPerformance = ref([]);
const campaignResults = ref([]);
const activities = ref([]);
const reportNetworkPerformance = ref([]);
const topPerformingPosts = ref([]);
const audienceGrowth = ref([]);

const dateRange = ref({ start: '2025-11-01', end: '2025-11-30' });
const selectedChannel = ref('');
const channelOptions = ref([]);

const filteredReportData = computed(() => {
  let data = reportNetworkPerformance.value;
  if (selectedChannel.value) {
    data = data.filter(item => item.name.toLowerCase() === selectedChannel.value);
  }
  return data;
});

const maxFollowers = computed(() => {
  if (!audienceGrowth.value || audienceGrowth.value.length === 0) {
    console.log('No audience growth data available');
    return 0;
  }

  const maxValue = Math.max(...audienceGrowth.value.map(g => g.followers));
  console.log('Máximo detectado:', maxValue);

  return maxValue;
});

onMounted(async () => {
  metrics.value = await analyticsService.getDashboardMetrics();
  audienceDemographics.value = await analyticsService.getAudienceDemographics();
  contentPerformance.value = await analyticsService.getContentPerformance();
  campaignResults.value = await analyticsService.getCampaignResults();
  topPerformingPosts.value = await analyticsService.getTopPerformingPosts();
  audienceGrowth.value = await analyticsService.getAudienceGrowth();
  activities.value = await analyticsService.getRecentActivities();
  
  const serviceData = await analyticsService.getReportNetworkPerformance();
  reportNetworkPerformance.value = serviceData;
  channelOptions.value = serviceData.map(item => ({ id: item.name.toLowerCase(), name: item.name }));
});

function getPlatformColor(platform) {
    const colors = {
        Instagram: '#E4405F',
        Facebook: '#1877F2',
        LinkedIn: '#0A66C2',
        'X / Twitter': '#000000',
        YouTube: '#FF0000',
    };
    return colors[platform] || '#000000';
}

function generateReport() {
  emit('showToast', { message: 'Reporte actualizado con los filtros seleccionados.' });
}

function exportCSV() {
  const dataToExport = filteredReportData.value.length ? filteredReportData.value : reportNetworkPerformance.value;
  const csv = Papa.unparse(dataToExport);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'reporte_rendimiento.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  emit('showToast', { message: 'Exportando a CSV...' });
}

function exportXLSX() {
    const dataToExport = filteredReportData.value.length ? filteredReportData.value : reportNetworkPerformance.value;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rendimiento');
    XLSX.writeFile(workbook, 'reporte_rendimiento.xlsx');
    emit('showToast', { message: 'Exportando a Excel...' });
}

function exportPDF() {
    const doc = new jsPDF();
    const dataToExport = filteredReportData.value.length ? filteredReportData.value : reportNetworkPerformance.value;
    doc.text('Reporte de Rendimiento por Red Social', 14, 16);
    doc.autoTable({
        head: [['Red Social', 'Alcance', 'Engagement', 'CTR', 'Followers', 'Crecimiento']],
        body: dataToExport.map(item => [item.name, item.reach, `${item.engagement}%`, `${item.ctr}%`, item.followers, `${item.growth}%`]),
    });
    doc.save('reporte_rendimiento.pdf');
    emit('showToast', { message: 'Exportando a PDF...' });
}
</script>
<style scoped>
.card { @apply bg-white border border-gray-200 rounded-lg p-6 shadow-sm; }
.tab-button { @apply flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all; }
.tab-active { @apply border-kapital-dark text-kapital-dark; }
.tab-inactive { @apply border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300; }
.btn-primary { @apply px-6 py-3 bg-kapital-dark text-white font-medium rounded-md transition-all hover:bg-blue-700 active:scale-95 flex items-center gap-2 justify-center; }
.btn-secondary { @apply px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200; }
.form-input { @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-1 focus:ring-kapital-dark; }
</style>

