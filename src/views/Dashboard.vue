<template>
  <div class="space-y-10 p-4 max-w-[1600px] mx-auto">
    
    <!-- Header -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -10 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-slate-200 pb-6"
    >
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p class="text-slate-500 mt-1">Visión general del rendimiento y actividad reciente.</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right hidden md:block">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Periodo</p>
          <p class="text-sm font-medium text-slate-900">Últimos 30 días</p>
        </div>
        <div class="h-8 w-px bg-slate-200 hidden md:block"></div>
        <button class="btn-secondary text-sm">
          <Calendar :size="16" /> Filtrar
        </button>
        <button class="btn-primary text-sm shadow-lg shadow-slate-900/20">
          <Download :size="16" /> Exportar
        </button>
      </div>
    </div>

    <!-- KPIs (Executive Summary) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
      <div 
        v-for="(metric, index) in executiveMetrics" 
        :key="metric.id"
        v-motion
        :initial="{ opacity: 0, y: 10 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: index * 50 } }"
        class="flex flex-col"
      >
        <div class="flex items-center gap-3 mb-3">
          <component :is="metric.icon" class="text-slate-400" :size="20" />
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ metric.label }}</span>
        </div>
        <div class="flex items-baseline gap-3">
          <span class="text-4xl font-bold text-slate-900 tracking-tight">{{ metric.value }}</span>
          <span :class="['text-sm font-medium flex items-center', metric.trend > 0 ? 'text-emerald-600' : 'text-rose-600']">
            <component :is="metric.trend > 0 ? ArrowUp : ArrowDown" :size="14" />
            {{ Math.abs(metric.trend) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px bg-slate-200"></div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-12">
      
      <!-- Left Column (Charts & Activity) -->
      <div class="xl:col-span-2 space-y-12">
        
        <!-- Weekly Performance Chart -->
        <div>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-slate-900">Rendimiento Semanal</h2>
            <div class="flex gap-2">
              <span class="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span class="w-2 h-2 rounded-full bg-kapital-night"></span> Publicaciones
              </span>
              <span class="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span class="w-2 h-2 rounded-full bg-blue-400"></span> Engagement
              </span>
            </div>
          </div>
          <div class="h-80 w-full">
            <Bar v-if="weeklyChartData" :data="weeklyChartData" :options="weeklyChartOptions" />
          </div>
        </div>

        <!-- Recent Activity List -->
        <div>
          <div class="flex justify-between items-center mb-6 border-b border-slate-100 pb-2">
            <h2 class="text-lg font-bold text-slate-900">Actividad Reciente</h2>
            <button @click="goTo('production')" class="text-sm text-kapital-night font-medium hover:underline">Ver todo</button>
          </div>
          <div class="space-y-0">
            <div 
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-2 -mx-2 rounded-lg group"
            >
              <div :class="['w-2 h-2 rounded-full', getStatusColorClass(activity.status)]"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-slate-900 group-hover:text-kapital-night transition-colors">{{ activity.title }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ activity.description }}</p>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-xs text-slate-400 font-medium">{{ activity.date }}</span>
                <span :class="['text-xs font-bold px-2.5 py-1 rounded-full border', getStatusBadgeClass(activity.status)]">
                  {{ getStatusLabel(activity.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column (Lists & Secondary Info) -->
      <div class="space-y-12">
        
        <!-- Pending Interactions -->
        <div>
          <div class="flex justify-between items-center mb-6 border-b border-slate-100 pb-2">
            <h2 class="text-lg font-bold text-slate-900">Mensajes Pendientes</h2>
            <span class="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">{{ pendingInteractions.length }}</span>
          </div>
          <div class="space-y-4">
            <div v-for="msg in pendingInteractions" :key="msg.id" class="group cursor-pointer" @click="goTo('interactions')">
              <div class="flex justify-between items-start mb-1">
                <span class="text-sm font-bold text-slate-900 group-hover:text-kapital-night transition-colors">{{ msg.name }}</span>
                <span class="text-[10px] text-slate-400 font-medium uppercase">{{ msg.time }}</span>
              </div>
              <p class="text-sm text-slate-600 line-clamp-2 leading-relaxed">{{ msg.preview }}</p>
            </div>
          </div>
          <button @click="goTo('interactions')" class="w-full mt-6 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
            Responder Mensajes
          </button>
        </div>

        <!-- Content Distribution -->
        <div>
          <h2 class="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Distribución</h2>
          <div class="flex items-center gap-6">
            <div class="w-32 h-32 relative">
              <Doughnut v-if="contentChartData" :data="contentChartData" :options="contentChartOptions" />
            </div>
            <div class="flex-1 space-y-3">
              <div v-for="item in contentChartLegend" :key="item.label" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: item.color }"></div>
                  <span class="text-xs font-medium text-slate-600">{{ item.label.split(' (')[0] }}</span>
                </div>
                <span class="text-xs font-bold text-slate-900">{{ item.label.split(' (')[1].replace(')', '') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Accesos Rápidos</h3>
          <div class="space-y-3">
            <button @click="goTo('production')" class="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-kapital-night hover:shadow-md transition-all group text-left">
              <div class="w-8 h-8 rounded-lg bg-kapital-night text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus :size="16" />
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900">Crear Publicación</p>
                <p class="text-xs text-slate-500">Programar nuevo contenido</p>
              </div>
            </button>
            <button @click="goTo('generation')" class="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all group text-left">
              <div class="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wand2 :size="16" />
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900">Generar con IA</p>
                <p class="text-xs text-slate-500">Crear ideas y textos</p>
              </div>
            </button>
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
  Wand2, Plus, Calendar, Download, CheckCircle2, Edit3, FileText
} from 'lucide-vue-next'

ChartJS.register(
  Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement
)

const emit = defineEmits(['navigate', 'showToast'])

function goTo(view) {
  emit('navigate', view)
}

// ----- DATOS SIMULADOS -----

const allInteractions = ref([
  { id: 1, initials: 'CA', name: 'Carlos Alarcón', preview: '¿Cuál es el precio del plan anual?', time: '5m', status: 'pending' },
  { id: 2, initials: 'MR', name: 'María Rodríguez', preview: 'Necesito información sobre la integración con Shopify', time: '20m', status: 'pending' },
  { id: 3, initials: 'JP', name: 'Juan Pérez', preview: 'Quiero contratar el plan pro', time: '45m', status: 'replied' },
  { id: 4, initials: 'LG', name: 'Laura García', preview: '¿Tienen descuentos para empresas?', time: '1h', status: 'pending' },
])

const allLeads = ref([
  { id: 1, initials: 'AM', name: 'Ana Martínez', origin: 'Instagram', date: '15 Nov', status: 'new' },
  { id: 2, initials: 'RL', name: 'Roberto López', origin: 'LinkedIn', date: '14 Nov', status: 'following' },
  { id: 3, initials: 'LG', name: 'Laura Gómez', origin: 'Facebook', date: '12 Nov', status: 'closed' },
])

const allPublications = ref([
  { id: 1, title: 'Campaña de Verano 2025', description: 'Anuncia nuestro nuevo catálogo de verano...', date: '15 Nov', channels: 'Instagram, Facebook', status: 'published' },
  { id: 2, title: 'Tips de Marketing Digital', description: '10 consejos prácticos para mejorar tu estrategia...', date: '20 Nov', channels: 'LinkedIn', status: 'scheduled' },
  { id: 3, title: 'Promoción Especial Black Friday', description: 'Descuentos exclusivos de hasta 50%...', date: '18 Nov', channels: 'Instagram, Facebook', status: 'draft' },
  { id: 5, title: 'Webinar en Vivo', description: 'Únete a nosotros para una sesión interactiva...', date: '27 Nov', channels: 'Facebook', status: 'scheduled' }
])

// --- COMPUTED ---

const executiveMetrics = computed(() => [
  { id: 'publications', icon: Share2, label: 'Publicaciones', value: allPublications.value.length, trend: 8 },
  { id: 'engagement', icon: Flame, label: 'Engagement', value: '3.8%', trend: -5 },
  { id: 'leads', icon: Users, label: 'Nuevos Leads', value: allLeads.value.filter(l => l.status === 'new').length, trend: 15 },
  { id: 'interactions', icon: MessageSquare, label: 'Mensajes', value: allInteractions.value.filter(m => m.status === 'pending').length, trend: 12 }
])

const pendingInteractions = computed(() => allInteractions.value.filter(m => m.status === 'pending').slice(0, 3))
const recentActivity = computed(() => [...allPublications.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5))

// --- CHARTS ---

const weeklyChartData = ref({
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    { label: 'Publicaciones', backgroundColor: '#0F172A', borderRadius: 4, data: [6, 8, 5, 9, 7, 4, 3], barThickness: 20 },
    { label: 'Engagement %', backgroundColor: '#60A5FA', borderRadius: 4, data: [3.2, 4.1, 2.8, 5.2, 4.5, 2.1, 1.8], barThickness: 20 }
  ]
})

const weeklyChartOptions = ref({
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Inter' } } },
    y: { display: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } }
  }
})

const contentChartData = ref({
  labels: ['Productos', 'Promociones', 'Educativo'],
  datasets: [{ backgroundColor: ['#0F172A', '#3B82F6', '#F59E0B'], borderWidth: 0, data: [65, 20, 15] }]
})

const contentChartLegend = [
  { label: 'Productos (65%)', color: '#0F172A' },       
  { label: 'Promociones (20%)', color: '#3B82F6' },     
  { label: 'Educativo (15%)', color: '#F59E0B' }        
]

const contentChartOptions = ref({
  responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } }
})

// --- UTILS ---

function getStatusColorClass(status) {
  const classes = { 'published': 'bg-emerald-500', 'scheduled': 'bg-blue-500', 'draft': 'bg-slate-400' }
  return classes[status] || 'bg-slate-400'
}

function getStatusBadgeClass(status) {
  const classes = {
    'published': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'scheduled': 'bg-blue-50 text-blue-700 border-blue-100',
    'draft': 'bg-slate-50 text-slate-600 border-slate-200'
  }
  return classes[status] || 'bg-slate-50 text-slate-600'
}

function getStatusLabel(status) {
  const labels = { 'published': 'Publicado', 'scheduled': 'Programado', 'draft': 'Borrador' }
  return labels[status] || status
}

</script>

<style scoped lang="postcss">
.btn-primary {
  @apply px-4 py-2 bg-kapital-night text-white font-medium rounded-lg transition-all hover:bg-kapital-night-hover active:scale-95 flex items-center gap-2 justify-center;
}

.btn-secondary {
  @apply px-4 py-2 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 justify-center;
}
</style>