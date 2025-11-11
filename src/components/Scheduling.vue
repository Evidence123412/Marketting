<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>Programación</h1>
      <p>Administra tus publicaciones programadas</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-calendar text-kapital-dark text-xl"></i>
          <span class="text-sm text-gray-600">Total Programadas</span>
        </div>
        <p class="text-2xl font-bold text-kapital-dark">{{ totalScheduled }}</p>
      </div>
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-clock text-green-600 text-xl"></i>
          <span class="text-sm text-gray-600">Hoy</span>
        </div>
        <p class="text-2xl font-bold text-green-600">{{ todayCount }}</p>
      </div>
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
          <span class="text-sm text-gray-600">Esta Semana</span>
        </div>
        <p class="text-2xl font-bold text-yellow-600">{{ weekCount }}</p>
      </div>
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-check-circle text-purple-600 text-xl"></i>
          <span class="text-sm text-gray-600">Publicadas</span>
        </div>
        <p class="text-2xl font-bold text-purple-600">{{ publishedCount }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-2">Campaña</label>
        <select 
          v-model="filterCampaign"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Todas las campañas</option>
          <option value="Verano">Verano</option>
          <option value="Promociones">Promociones</option>
          <option value="Educativo">Educativo</option>
          <option value="Eventos">Eventos</option>
        </select>
      </div>
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-2">Red Social</label>
        <select 
          v-model="filterNetwork"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Todas las redes</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Twitter">Twitter</option>
        </select>
      </div>
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
        <select 
          v-model="filterStatus"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Todos los estados</option>
          <option value="scheduled">Programado</option>
          <option value="published">Publicado</option>
          <option value="failed">Fallido</option>
        </select>
      </div>
    </div>

    <!-- Calendar -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 card">
        <div class="flex justify-between items-center mb-6">
          <button 
            @click="previousMonth"
            class="text-kapital-dark hover:bg-blue-50 p-2 rounded transition-colors"
            title="Mes anterior"
          >
            <i class="fas fa-chevron-left text-lg"></i>
          </button>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-900">{{ monthYear }}</h3>
            <small class="text-gray-600">{{ dayCountInfo }}</small>
          </div>
          <button 
            @click="nextMonth"
            class="text-kapital-dark hover:bg-blue-50 p-2 rounded transition-colors"
            title="Próximo mes"
          >
            <i class="fas fa-chevron-right text-lg"></i>
          </button>
        </div>

        <!-- Days of week header -->
        <div class="grid grid-cols-7 gap-2 mb-4">
          <div v-for="day in ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']" :key="day" class="text-center font-semibold text-gray-700 text-sm py-2">
            {{ day }}
          </div>
        </div>

        <!-- Calendar days -->
        <div class="grid grid-cols-7 gap-2">
          <div 
            v-for="item in calendarDays" 
            :key="item.key"
            @click="item.day && selectDate(item.day)"
            :class="[
              'aspect-square border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all relative',
              item.isCurrentMonth ? 'border-gray-300 hover:border-kapital-dark bg-white' : 'border-gray-100 bg-gray-50 text-gray-400',
              item.isToday ? 'border-kapital-dark bg-blue-50' : '',
              item.hasPublications ? 'border-kapital-dark' : ''
            ]"
          >
            <span v-if="item.day" class="text-sm font-medium">{{ item.day }}</span>
            <span v-if="item.count" class="text-xs font-bold text-kapital-dark mt-1">{{ item.count }}</span>
            <i v-if="item.hasPublications" class="fas fa-circle text-kapital-dark text-xs mt-1"></i>
          </div>
        </div>
      </div>

      <!-- Sidebar Info -->
      <div class="space-y-4">
        <div class="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <i class="fas fa-info-circle text-kapital-dark"></i> Próxima
          </h3>
          <div v-if="nextPublication" class="space-y-2">
            <p class="font-medium text-gray-900">{{ nextPublication.title }}</p>
            <p class="text-sm text-gray-700 flex items-center gap-2">
              <i class="fas fa-calendar"></i> {{ nextPublication.date }}
            </p>
            <div class="flex gap-1 flex-wrap">
              <span v-for="net in nextPublication.networks.split(', ')" :key="net" class="text-xs px-2 py-1 bg-kapital-dark text-white rounded">
                {{ net }}
              </span>
            </div>
          </div>
          <p v-else class="text-gray-600 text-sm">No hay publicaciones próximas</p>
        </div>

        <div class="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <i class="fas fa-chart-pie text-green-600"></i> Distribución
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-700">Programadas:</span>
              <span class="font-bold text-gray-900">{{ scheduled.filter(p => p.status === 'scheduled').length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700">Publicadas:</span>
              <span class="font-bold text-gray-900">{{ scheduled.filter(p => p.status === 'published').length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700">Fallidas:</span>
              <span class="font-bold text-gray-900">{{ scheduled.filter(p => p.status === 'failed').length }}</span>
            </div>
          </div>
        </div>

        <div class="card bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <i class="fas fa-bell text-orange-600"></i> Recordatorios
          </h3>
          <p class="text-sm text-gray-700">
            {{ upcomingCount }} publicación(es) en próximas 48 horas
          </p>
        </div>
      </div>
    </div>

    <!-- Scheduled Publications List -->
    <div class="card">
      <h2 class="text-lg font-bold text-gray-900 mb-6">Publicaciones Programadas</h2>
      
      <div class="space-y-3">
        <div 
          v-for="item in filteredScheduled" 
          :key="item.id"
          class="bg-gradient-to-r from-gray-50 to-transparent border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
        >
          <div class="flex justify-between items-start gap-4 mb-3">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900 text-base">{{ item.title }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ item.description }}</p>
            </div>
            <span :class="['px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap', getStatusBadge(item.status)]">
              {{ item.statusLabel }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-sm">
            <div class="flex items-center gap-2 text-gray-600">
              <i class="fas fa-calendar-alt text-kapital-dark"></i>
              <input 
                type="date" 
                :value="item.date"
                @change="(e) => updatePublicationDate(item.id, e.target.value)"
                class="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-kapital-dark"
              />
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <i class="fas fa-clock text-kapital-dark"></i>
              <input 
                type="time" 
                :value="item.time || ''"
                @change="(e) => updatePublicationTime(item.id, e.target.value)"
                class="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-kapital-dark"
              />
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <i class="fas fa-tag text-kapital-dark"></i>
              <span>{{ item.campaign || 'Sin campaña' }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex gap-1 flex-wrap">
              <span 
                v-for="net in item.networks.split(', ')" 
                :key="net"
                :class="['text-xs px-2 py-1 rounded font-medium', getNetworkColor(net)]"
              >
                <i :class="['fas', getNetworkIcon(net), 'mr-1']"></i>{{ net }}
              </span>
            </div>
            <div class="flex gap-2">
              <button 
                @click="editPublication(item)"
                class="px-3 py-2 text-kapital-dark hover:bg-blue-100 rounded transition-colors text-sm font-medium"
                title="Editar"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                @click="changeStatus(item)"
                class="px-3 py-2 text-purple-600 hover:bg-purple-100 rounded transition-colors text-sm font-medium"
                title="Cambiar estado"
              >
                <i class="fas fa-sync"></i>
              </button>
              <button 
                @click="deletePublication(item.id)"
                class="px-3 py-2 text-red-600 hover:bg-red-100 rounded transition-colors text-sm font-medium"
                title="Eliminar"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredScheduled.length === 0" class="text-center py-12">
          <i class="fas fa-calendar-check text-4xl text-gray-300 mb-3 block"></i>
          <p class="text-gray-500 font-medium">No hay publicaciones con estos filtros</p>
        </div>
      </div>
    </div>

    <!-- Edit Publication Modal -->
    <div v-if="showEditModal && editingPub" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900">Editar Publicación</h3>
          <button @click="showEditModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="saveChanges" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input 
              v-model="editingPub.title"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea 
              v-model="editingPub.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <input 
                v-model="editingPub.date"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Hora</label>
              <input 
                v-model="editingPub.time"
                type="time"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Canales</label>
            <input 
              v-model="editingPub.networks"
              type="text"
              placeholder="Ej: Instagram, Facebook"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
            />
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button"
              @click="showEditModal = false"
              class="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="btn-primary flex-1"
            >
              <i class="fas fa-save"></i> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Change Status Modal -->
    <div v-if="showStatusModal && statusEditPub" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Cambiar Estado</h3>
        
        <div class="space-y-2 mb-6">
          <button 
            v-for="status in statusOptions"
            :key="status.value"
            @click="updateStatus(status.value)"
            :class="['w-full p-3 rounded-lg border-2 transition-all text-left', 
              statusEditPub.status === status.value ? 'border-kapital-dark bg-blue-50' : 'border-gray-200 hover:border-kapital-dark']"
          >
            <div class="flex items-center gap-2">
              <i :class="['fas', status.icon]"></i>
              <div>
                <p class="font-medium text-gray-900">{{ status.label }}</p>
                <small class="text-gray-600">{{ status.description }}</small>
              </div>
            </div>
          </button>
        </div>

        <button 
          @click="showStatusModal = false"
          class="btn-secondary w-full"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['showToast'])

const currentDate = ref(new Date(2025, 10, 1))
const filterCampaign = ref('')
const filterNetwork = ref('')
const filterStatus = ref('')
const showEditModal = ref(false)
const showStatusModal = ref(false)
const editingPub = ref(null)
const statusEditPub = ref(null)

const statusOptions = [
  { value: 'scheduled', label: 'Programado', description: 'Pendiente de publicación', icon: 'fa-calendar' },
  { value: 'published', label: 'Publicado', description: 'Ya publicado en redes', icon: 'fa-check-circle' },
  { value: 'failed', label: 'Fallido', description: 'Error en publicación', icon: 'fa-exclamation-circle' }
]

const scheduled = ref([
  {
    id: 1,
    title: 'Lanzamiento de producto',
    description: 'Anuncio oficial del nuevo producto Q4',
    date: '2025-11-22',
    time: '14:00',
    networks: 'Instagram, Facebook',
    campaign: 'Verano',
    status: 'scheduled',
    statusLabel: 'Programado'
  },
  {
    id: 2,
    title: 'Contenido educativo',
    description: 'Tips de marketing digital para profesionales',
    date: '2025-11-25',
    time: '09:30',
    networks: 'LinkedIn',
    campaign: 'Educativo',
    status: 'scheduled',
    statusLabel: 'Programado'
  },
  {
    id: 3,
    title: 'Promoción Black Friday',
    description: 'Descuentos especiales hasta fin de existencias',
    date: '2025-11-28',
    time: '10:00',
    networks: 'Instagram, Facebook, Twitter',
    campaign: 'Promociones',
    status: 'scheduled',
    statusLabel: 'Programado'
  },
  {
    id: 4,
    title: 'Post de gratitud',
    description: 'Agradecimiento a nuestra comunidad',
    date: '2025-11-20',
    time: '18:00',
    networks: 'Instagram',
    campaign: 'Eventos',
    status: 'published',
    statusLabel: 'Publicado'
  },
  {
    id: 5,
    title: 'Webinar en vivo',
    description: 'Sesión de preguntas y respuestas con expertos',
    date: '2025-11-27',
    time: '15:30',
    networks: 'Facebook, LinkedIn',
    campaign: 'Eventos',
    status: 'scheduled',
    statusLabel: 'Programado'
  },
  {
    id: 6,
    title: 'Newsletter semanal',
    description: 'Resumen de contenido de la semana',
    date: '2025-11-23',
    time: '12:00',
    networks: 'Email',
    campaign: 'Educativo',
    status: 'failed',
    statusLabel: 'Fallido'
  }
])

const monthYear = computed(() => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${months[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

const dayCountInfo = computed(() => {
  return `${getDaysInMonth(currentDate.value)} días`
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = getDaysInMonth(currentDate.value)
  const daysInPrevMonth = getDaysInMonth(new Date(year, month, 0))
  
  const days = []
  
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      key: `prev-${i}`,
      hasPublications: false,
      count: 0
    })
  }
  
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const pubCount = scheduled.value.filter(p => {
      const pubDate = new Date(p.date)
      return pubDate.getDate() === i && pubDate.getMonth() === month
    }).length
    
    const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year
    
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday: isToday,
      key: `current-${i}`,
      hasPublications: pubCount > 0,
      count: pubCount > 0 ? pubCount : 0
    })
  }
  
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      key: `next-${i}`,
      hasPublications: false,
      count: 0
    })
  }
  
  return days
})

const filteredScheduled = computed(() => {
  return scheduled.value.filter(item => {
    const matchCampaign = !filterCampaign.value || item.campaign === filterCampaign.value
    const matchNetwork = !filterNetwork.value || item.networks.includes(filterNetwork.value)
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    return matchCampaign && matchNetwork && matchStatus
  })
})

const totalScheduled = computed(() => scheduled.value.length)
const todayCount = computed(() => scheduled.value.filter(p => isToday(p.date)).length)
const weekCount = computed(() => scheduled.value.filter(p => isThisWeek(p.date)).length)
const publishedCount = computed(() => scheduled.value.filter(p => p.status === 'published').length)
const upcomingCount = computed(() => scheduled.value.filter(p => isNext48Hours(p.date)).length)
const nextPublication = computed(() => {
  const sorted = [...scheduled.value].sort((a, b) => new Date(a.date) - new Date(b.date))
  return sorted.find(p => new Date(p.date) >= new Date())
})

function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

function selectDate(day) {
  emit('showToast', `Seleccionaste el día ${day}`)
}

function getStatusBadge(status) {
  const classes = {
    'scheduled': 'bg-blue-100 text-blue-700',
    'published': 'bg-green-100 text-green-700',
    'failed': 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

function getNetworkColor(network) {
  const colors = {
    'Instagram': 'bg-pink-100 text-pink-700',
    'Facebook': 'bg-blue-100 text-blue-700',
    'LinkedIn': 'bg-indigo-100 text-indigo-700',
    'Twitter': 'bg-cyan-100 text-cyan-700',
    'Email': 'bg-orange-100 text-orange-700'
  }
  return colors[network] || 'bg-gray-100 text-gray-700'
}

function getNetworkIcon(network) {
  const icons = {
    'Instagram': 'bi bi-instagram',
    'Facebook': 'bi bi-facebook',
    'LinkedIn': 'bi bi-linkedin',
    'Twitter': 'bi bi-twitter-x',
    'Email': 'fa-envelope'
  }
  return icons[network] || 'fa-link'
}

function isToday(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function isThisWeek(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000)
  return date >= startOfWeek && date <= endOfWeek
}

function isNext48Hours(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const next48 = new Date(now.getTime() + 48 * 60 * 60 * 1000)
  return date >= now && date <= next48
}

function editPublication(item) {
  editingPub.value = { ...item }
  showEditModal.value = true
}

function saveChanges() {
  if (!editingPub.value) return
  
  const index = scheduled.value.findIndex(p => p.id === editingPub.value.id)
  if (index !== -1) {
    scheduled.value[index] = editingPub.value
    showEditModal.value = false
    emit('showToast', `Publicación "${editingPub.value.title}" actualizada`)
    editingPub.value = null
  }
}

function changeStatus(item) {
  statusEditPub.value = item
  showStatusModal.value = true
}

function updateStatus(newStatus) {
  if (!statusEditPub.value) return
  
  const labels = {
    'scheduled': 'Programado',
    'published': 'Publicado',
    'failed': 'Fallido'
  }
  
  const index = scheduled.value.findIndex(p => p.id === statusEditPub.value.id)
  if (index !== -1) {
    scheduled.value[index].status = newStatus
    scheduled.value[index].statusLabel = labels[newStatus]
    showStatusModal.value = false
    emit('showToast', `Estado cambiado a: ${labels[newStatus]}`)
    statusEditPub.value = null
  }
}

function updatePublicationDate(id, newDate) {
  const pub = scheduled.value.find(p => p.id === id)
  if (pub) {
    pub.date = newDate
    emit('showToast', 'Fecha actualizada')
  }
}

function updatePublicationTime(id, newTime) {
  const pub = scheduled.value.find(p => p.id === id)
  if (pub) {
    pub.time = newTime
    emit('showToast', 'Hora actualizada')
  }
}

function deletePublication(id) {
  if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
    scheduled.value = scheduled.value.filter(p => p.id !== id)
    emit('showToast', 'Publicación eliminada')
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-6 py-3 bg-kapital-dark text-white font-medium rounded-md transition-all hover:bg-blue-700 active:scale-95 flex items-center gap-2 justify-center;
}

.btn-secondary {
  @apply px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200;
}
</style>