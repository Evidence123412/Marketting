<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>Producción de Contenido</h1>
      <p>Gestiona el flujo de trabajo de tus publicaciones, desde el borrador hasta la publicación.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="stats-card bg-kapital-dark/5 border-kapital-dark/20">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-file-alt text-kapital-dark text-xl"></i>
          <span class="text-sm text-gray-600">Total</span>
        </div>
        <p class="text-2xl font-bold text-kapital-dark">{{ publications.length }}</p>
      </div>
      <div class="stats-card bg-purple-500/5 border-purple-500/20">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-file-pen text-purple-600 text-xl"></i>
          <span class="text-sm text-gray-600">Borradores</span>
        </div>
        <p class="text-2xl font-bold text-purple-600">{{ drafts.length }}</p>
      </div>
      <div class="stats-card bg-yellow-500/5 border-yellow-500/20">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-hourglass-half text-yellow-600 text-xl"></i>
          <span class="text-sm text-gray-600">Programados</span>
        </div>
        <p class="text-2xl font-bold text-yellow-600">{{ scheduled.length }}</p>
      </div>
      <div class="stats-card bg-green-500/5 border-green-500/20">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-check-circle text-green-600 text-xl"></i>
          <span class="text-sm text-gray-600">Publicados</span>
        </div>
        <p class="text-2xl font-bold text-green-600">{{ published.length }}</p>
      </div>
    </div>

    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold text-gray-900">Flujo de Producción</h2>
      <button 
        @click="openNewPostModal"
        class="btn-primary"
      >
        <i class="fas fa-plus"></i> Nueva Publicación
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="kanban-column">
        <h3 class="kanban-header bg-gray-200 text-gray-800">
          <i class="fas fa-file-pen"></i> Borradores ({{ drafts.length }})
        </h3>
        <div class="kanban-cards">
          <div v-for="pub in drafts" :key="pub.id" @click="selectPublication(pub)" class="kanban-card">
            <span :class="['status-badge', getStatusClass(pub.status)]">{{ getStatusLabel(pub.status) }}</span>
            <p class="font-medium text-gray-900">{{ pub.title }}</p>
            <small class="text-gray-500">{{ pub.date }}</small>
            <div class="flex gap-2 mt-2">
              <i v-for="channel in pub.channels.split(', ')" :key="channel" :class="['bi text-xs', getChannelIcon(channel)]" :style="{ color: getChannelIconColor(channel) }"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="kanban-column">
        <h3 class="kanban-header bg-kapital-light-1/20 text-kapital-dark">
          <i class="fas fa-eye"></i> En Revisión ({{ reviews.length }})
        </h3>
        <div class="kanban-cards">
          <div v-for="pub in reviews" :key="pub.id" @click="selectPublication(pub)" class="kanban-card">
            <span :class="['status-badge', getStatusClass(pub.status)]">{{ getStatusLabel(pub.status) }}</span>
            <p class="font-medium text-gray-900">{{ pub.title }}</p>
            <small class="text-gray-500">{{ pub.date }}</small>
            <div class="flex gap-2 mt-2">
              <i v-for="channel in pub.channels.split(', ')" :key="channel" :class="['bi text-xs', getChannelIcon(channel)]" :style="{ color: getChannelIconColor(channel) }"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="kanban-column">
        <h3 class="kanban-header bg-yellow-400/20 text-yellow-800">
          <i class="fas fa-calendar-alt"></i> Programados ({{ scheduled.length }})
        </h3>
        <div class="kanban-cards">
          <div v-for="pub in scheduled" :key="pub.id" @click="selectPublication(pub)" class="kanban-card">
            <span :class="['status-badge', getStatusClass(pub.status)]">{{ getStatusLabel(pub.status) }}</span>
            <p class="font-medium text-gray-900">{{ pub.title }}</p>
            <small class="text-gray-500">{{ pub.date }}</small>
            <div class="flex gap-2 mt-2">
              <i v-for="channel in pub.channels.split(', ')" :key="channel" :class="['bi text-xs', getChannelIcon(channel)]" :style="{ color: getChannelIconColor(channel) }"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="kanban-column">
        <h3 class="kanban-header bg-green-500/20 text-green-800">
          <i class="fas fa-check-circle"></i> Publicados ({{ published.length }})
        </h3>
        <div class="kanban-cards">
          <div v-for="pub in published" :key="pub.id" @click="selectPublication(pub)" class="kanban-card">
            <span :class="['status-badge', getStatusClass(pub.status)]">{{ getStatusLabel(pub.status) }}</span>
            <p class="font-medium text-gray-900">{{ pub.title }}</p>
            <small class="text-gray-500">{{ pub.date }}</small>
            <div class="flex gap-2 mt-2">
              <i v-for="channel in pub.channels.split(', ')" :key="channel" :class="['bi text-xs', getChannelIcon(channel)]" :style="{ color: getChannelIconColor(channel) }"></i>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="showNewPostModal" class="modal-overlay">
      <div class="modal-content max-w-2xl w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-gray-900">
            {{ formData.id ? 'Editar Publicación' : 'Nueva Publicación' }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="handleSave('draft')" class="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label class="form-label">
              <i class="fas fa-heading mr-2 text-kapital-dark"></i>Título
            </label>
            <input 
              v-model="formData.title"
              type="text" 
              placeholder="Ej: Lanzamiento de nuevo producto"
              class="form-input"
              required
            />
          </div>

          <div>
            <label class="form-label">
              <i class="fas fa-align-left mr-2 text-kapital-dark"></i>Descripción
            </label>
            <textarea 
              v-model="formData.description"
              placeholder="Contenido principal de tu publicación..."
              rows="4"
              class="form-input resize-none"
              required
            ></textarea>
          </div>

          <div>
            <label class="form-label">
              <i class="fas fa-hashtag mr-2 text-kapital-dark"></i>Hashtags
            </label>
            <input 
              v-model="formData.hashtags"
              type="text" 
              placeholder="#marketing #contenido #socialmedia"
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">
              <i class="bi bi-layers me-2 text-kapital-dark"></i> Canales
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label
                v-for="channel in channels"
                :key="channel.name"
                :class="['form-checkbox-label', formData.channels.includes(channel.name) ? 'border-kapital-dark bg-kapital-dark/10' : 'border-gray-300 hover:border-gray-400']"
              >
                <input
                  type="checkbox"
                  :value="channel.name"
                  v-model="formData.channels"
                  class="accent-kapital-dark"
                />
                <i :class="channel.icon" class="text-lg" :style="{ color: channel.color }"></i>
                <span class="text-sm font-medium">{{ channel.name }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="form-label">
              <i class="fas fa-image mr-2 text-kapital-dark"></i>Archivo
            </label>
            <div class="flex gap-2">
              <div 
                @click="$refs.fileInput.click()"
                class="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-kapital-dark hover:bg-blue-50 transition"
              >
                <i class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2 block"></i>
                <p class="text-sm font-medium text-gray-700">
                  {{ formData.file ? formData.file.name : 'Selecciona una imagen o video' }}
                </p>
                <input ref="fileInput" type="file" accept="image/*,video/*" @change="handleFileUpload" class="hidden" />
              </div>
              <button 
                type="button" 
                @click="goToGenerator" 
                class="btn-secondary px-4 py-2 h-full flex flex-col justify-center items-center text-center"
              >
                <i class="fas fa-wand-magic-sparkles text-kapital-dark text-2xl"></i>
                <span class="mt-1 text-sm leading-tight">Generar<br>con IA</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
            <button 
              type="submit" 
              class="btn-secondary flex-1"
            >
              <i class="fas fa-save"></i> Guardar Borrador
            </button>
            <button 
              type="button" 
              @click="handleSave('review')"
              class="btn-secondary flex-1"
            >
              <i class="fas fa-eye"></i> Enviar a Revisión
            </button>
            <button 
              type="button" 
              @click="goToScheduling(true)"
              class="btn-primary flex-1"
            >
              <i class="fas fa-calendar-alt"></i> Programar...
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="selectedPub" class="modal-overlay">
      <div class="modal-content max-w-lg w-full">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ selectedPub.title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ selectedPub.date }}</p>
          </div>
          <button @click="selectedPub = null" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Descripción</h4>
            <p class="text-gray-700 text-sm">{{ selectedPub.description }}</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Hashtags</h4>
            <p class="text-gray-700 text-sm">{{ selectedPub.hashtags }}</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Canales</h4>
            <div class="flex gap-2 flex-wrap">
              <span 
                v-for="channel in selectedPub.channels.split(', ')"
                :key="channel"
                :class="['text-xs px-3 py-1 rounded-full font-medium', getChannelColor(channel)]"
              >
                <i :class="['bi', getChannelIcon(channel), 'mr-1']"></i>{{ channel }}
              </span>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Estado</h4>
            <span :class="['text-sm px-3 py-1 rounded-full font-medium inline-block', getStatusClass(selectedPub.status)]">
              {{ getStatusLabel(selectedPub.status) }}
            </span>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button @click="editPublication(selectedPub)" class="btn-secondary flex-1">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button @click="deletePublication(selectedPub.id)" class="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['showToast', 'navigate'])

const activeView = ref('kanban') // 'kanban' o 'calendar'
const showNewPostModal = ref(false)
const selectedPub = ref(null)
const fileInput = ref(null)

const channels = ref([
  { name: 'Facebook', icon: 'bi bi-facebook', color: '#1877F2' },
  { name: 'Instagram', icon: 'bi bi-instagram', color: '#E4405F' },
  { name: 'LinkedIn', icon: 'bi bi-linkedin', color: '#0A66C2' },
  { name: 'Twitter', icon: 'bi bi-twitter-x', color: '#000000' }
])

// Plantilla para un post vacío
const getEmptyForm = () => ({
  id: null,
  title: '',
  description: '',
  hashtags: '',
  channels: [],
  file: null,
  date: 'Sin fecha',
  time: '',
  status: 'draft'
})

const formData = ref(getEmptyForm())

// --- FUENTE DE DATOS UNIFICADA ---
const publications = ref([
  { id: 1, title: 'Campaña de Verano 2025', description: 'Anuncio oficial del nuevo producto Q4', date: '2025-11-22', time: '14:00', channels: 'Instagram, Facebook', status: 'published', hashtags: '#verano' },
  { id: 2, title: 'Tips de Marketing Digital', description: '10 consejos prácticos', date: '2025-11-25', time: '09:30', channels: 'LinkedIn', status: 'scheduled', hashtags: '#marketing' },
  { id: 3, title: 'Promoción Black Friday', description: 'Descuentos especiales', date: 'Sin fecha', channels: 'Instagram, Facebook, Twitter', status: 'draft', hashtags: '#blackfriday' },
  { id: 4, title: 'Agradecimiento a la comunidad', description: 'Gracias a nuestros seguidores', date: '2025-11-20', time: '18:00', channels: 'Instagram', status: 'published', hashtags: '#gracias' },
  { id: 5, title: 'Webinar en Vivo', description: 'Sesión de Q&A', date: '2025-11-27', time: '15:30', channels: 'Facebook, LinkedIn', status: 'scheduled', hashtags: '#webinar' },
  { id: 6, title: 'Concepto de Nuevo Anuncio', description: 'Idea para Q1 2026', date: 'Sin fecha', channels: 'Instagram', status: 'review', hashtags: '#anuncio' }
])

// --- Propiedades Computadas para el Kanban ---
const drafts = computed(() => publications.value.filter(p => p.status === 'draft'))
const reviews = computed(() => publications.value.filter(p => p.status === 'review'))
const scheduled = computed(() => publications.value.filter(p => p.status === 'scheduled'))
const published = computed(() => publications.value.filter(p => p.status === 'published'))

// --- LÓGICA DE CALENDARIO (Solo para `publications`) ---
const currentDate = ref(new Date(2025, 10, 1)) // Nov 2025
const filterNetwork = ref('')
const filterStatus = ref('')

const statusOptions = [
  { value: 'draft', label: 'Borrador', description: 'Guardado para editar más tarde', icon: 'fa-file-pen' },
  { value: 'review', label: 'En Revisión', description: 'Esperando aprobación', icon: 'fa-eye' },
  { value: 'scheduled', label: 'Programado', description: 'Pendiente de publicación', icon: 'fa-calendar' },
  { value: 'published', label: 'Publicado', description: 'Ya publicado en redes', icon: 'fa-check-circle' },
  { value: 'failed', label: 'Fallido', description: 'Error en publicación', icon: 'fa-exclamation-circle' }
]

const monthYear = computed(() => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${months[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

const dayCountInfo = computed(() => `${getDaysInMonth(currentDate.value)} días`)

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = getDaysInMonth(currentDate.value)
  const daysInPrevMonth = getDaysInMonth(new Date(year, month, 0))
  
  const days = []
  
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, isCurrentMonth: false, key: `prev-${i}`, hasPublications: false })
  }
  
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const pubCount = publications.value.filter(p => {
      if (!p.date || p.date === 'Sin fecha') return false
      const pubDate = new Date(p.date)
      return pubDate.getDate() === i && pubDate.getMonth() === month && pubDate.getFullYear() === year
    }).length
    
    const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year
    
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday: isToday,
      key: `current-${i}`,
      hasPublications: pubCount > 0
    })
  }
  
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ day: i, isCurrentMonth: false, key: `next-${i}`, hasPublications: false })
  }
  
  return days
})

const filteredScheduled = computed(() => {
  const month = currentDate.value.getMonth()
  const year = currentDate.value.getFullYear()
  
  return publications.value.filter(item => {
    const matchNetwork = !filterNetwork.value || item.channels.includes(filterNetwork.value)
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    
    if (item.date === 'Sin fecha' || !item.date) return false // Guarda contra undefined/null
    
    try {
      const pubDate = new Date(item.date)
      if (isNaN(pubDate.getTime())) return false // Fecha inválida
      const matchMonth = pubDate.getMonth() === month && pubDate.getFullYear() === year
      return matchNetwork && matchStatus && matchMonth
    } catch (e) {
      return false
    }
    
  }).sort((a, b) => new Date(a.date) - new Date(b.date))
})

const nextPublication = computed(() => {
  const sorted = [...publications.value]
    .filter(p => p.status === 'scheduled' && p.date && p.date !== 'Sin fecha')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
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
  const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day)
  emit('showToast', `Viendo publicaciones para ${date.toLocaleDateString()}`)
}

// --- Funciones de Utilidad (Colores y Nombres) ---
function getChannelIcon(channel) {
  const icons = { 'Facebook': 'bi-facebook', 'Instagram': 'bi-instagram', 'LinkedIn': 'bi-linkedin', 'Twitter': 'bi-twitter-x' }
  return icons[channel.trim()] || 'bi-link-45deg'
}

function getChannelIconColor(channel) {
  const colors = { 'Facebook': '#1877F2', 'Instagram': '#E4405F', 'LinkedIn': '#0A66C2', 'Twitter': '#000000' }
  return colors[channel.trim()] || '#6B7280'
}

function getChannelColor(channel) {
  const colors = {
    'Facebook': 'bg-blue-100 text-blue-700',
    'Instagram': 'bg-pink-100 text-pink-700',
    'LinkedIn': 'bg-indigo-100 text-indigo-700',
    'Twitter': 'bg-gray-800 text-white'
  }
  return colors[channel.trim()] || 'bg-gray-100 text-gray-700'
}

function getStatusClass(status) {
  const classes = {
    'published': 'bg-green-100 text-green-700',
    'scheduled': 'bg-yellow-100 text-yellow-700',
    'draft': 'bg-gray-100 text-gray-700',
    'review': 'bg-kapital-light-1/20 text-kapital-dark',
    'failed': 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

function getStatusLabel(status) {
  const labels = { 'published': 'Publicado', 'scheduled': 'Programado', 'draft': 'Borrador', 'review': 'En Revisión', 'failed': 'Fallido' }
  return labels[status] || 'Desconocido'
}

// --- Lógica de Modales ---
function openNewPostModal() {
  formData.value = getEmptyForm()
  showNewPostModal.value = true
}

function closeModal() {
  showNewPostModal.value = false
  formData.value = getEmptyForm() // Limpia el formulario
}

function selectPublication(pub) {
  selectedPub.value = { ...pub } // Clona el objeto
}

// --- Lógica del Formulario ---
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    formData.value.file = file
  }
}

function handleSave(status = 'draft') {
  if (!formData.value.title || !formData.value.description) {
    emit('showToast', 'Por favor completa el título y la descripción', 'error')
    return
  }
  
  const newPub = {
    ...formData.value,
    id: formData.value.id || Math.max(...publications.value.map(p => p.id)) + 1,
    status: status,
    channels: formData.value.channels.join(', ') || 'Sin asignar'
  }
  
  if (formData.value.id) {
    const index = publications.value.findIndex(p => p.id === formData.value.id)
    if (index !== -1) {
      publications.value[index] = newPub
    }
  } else {
    publications.value.unshift(newPub)
  }

  closeModal()
  emit('showToast', `Publicación guardada como: ${getStatusLabel(status)}`)
}

function editPublication(pub) {
  selectedPub.value = null // Cierra el modal de detalles
  formData.value = {
    ...pub,
    channels: pub.channels.split(', ').map(c => c.trim()).filter(c => c),
    file: null 
  }
  showNewPostModal.value = true // Abre el modal de edición
}

function deletePublication(id) {
  if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
    publications.value = publications.value.filter(p => p.id !== id)
    selectedPub.value = null
    emit('showToast', 'Publicación eliminada')
  }
}

// --- Lógica de Cambio de Estado ---
const showStatusModal = ref(false)
const statusEditPub = ref(null)

function changeStatus(item) {
  statusEditPub.value = item
  showStatusModal.value = true
}

function updateStatus(newStatus) {
  if (!statusEditPub.value) return
  
  const index = publications.value.findIndex(p => p.id === statusEditPub.value.id)
  if (index !== -1) {
    publications.value[index].status = newStatus
    // No necesitamos statusLabel, podemos usar getStatusLabel()
  }
  
  showStatusModal.value = false
  emit('showToast', `Estado cambiado a: ${getStatusLabel(newStatus)}`)
  statusEditPub.value = null
}

// --- Navegación ---
function goToGenerator() {
  emit('showToast', 'Abriendo el Asistente de IA...')
  emit('navigate', 'generation')
}

function goToScheduling(save = true) {
  if (save) {
    // Si no tiene fecha, la pide
    if (!formData.value.publishDate || !formData.value.publishTime) {
      // Guarda como programado pero sin fecha
      handleSave('scheduled')
    } else {
      // Si tiene fecha, la guarda
      formData.value.date = formData.value.publishDate
      formData.value.time = formData.value.publishTime
      handleSave('scheduled')
    }
  }
  closeModal()
  emit('showToast', 'Navegando a Programación...')
  emit('navigate', 'scheduling')
}
</script>

<style scoped>
/*
  Botones actualizados para usar kapital-night, alineado con
  ImageGenerator.vue y tu tailwind.config.js
*/
.btn-primary {
  @apply px-6 py-3 bg-kapital-night text-white font-medium rounded-md transition-all hover:bg-kapital-night-hover active:scale-95 flex items-center gap-2 justify-center;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200 flex items-center gap-2 justify-center;
}

/* Estilos para el Modal (overlay y contenido) */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}
.modal-content {
  @apply bg-white rounded-lg p-6 shadow-2xl;
}

/* Estilos para el Formulario en el Modal */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}
.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20;
}
.form-checkbox-label {
  @apply flex items-center gap-2 p-3 bg-gray-50 border-2 rounded-md cursor-pointer transition-all;
}

/* Estilos para las tarjetas de estadísticas */
.stats-card {
  @apply rounded-lg p-4 border;
}

/* Estilos para el Kanban */
.kanban-column {
  @apply bg-gray-50 rounded-lg h-full;
}
.kanban-header {
  @apply font-bold text-sm p-3 rounded-t-lg flex items-center gap-2;
}
.kanban-cards {
  @apply p-3 space-y-3 h-96 overflow-y-auto;
}
.kanban-card {
  @apply bg-white p-3 rounded-md border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all;
}
.status-badge {
  @apply text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block;
}

/* Scrollbar */
.kanban-cards::-webkit-scrollbar,
.max-h-\[70vh\]::-webkit-scrollbar,
.max-h-96::-webkit-scrollbar {
  width: 6px;
}
.kanban-cards::-webkit-scrollbar-track,
.max-h-\[70vh\]::-webkit-scrollbar-track,
.max-h-96::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}
.kanban-cards::-webkit-scrollbar-thumb,
.max-h-\[70vh\]::-webkit-scrollbar-thumb,
.max-h-96::-webkit-scrollbar-thumb {
  background: #C9C9C9; /* kapital-gray */
  border-radius: 6px;
}
</style>