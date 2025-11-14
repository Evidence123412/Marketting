<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>Producción de Contenido</h1>
      <p>Crea, gestiona y programa tus publicacioness</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-file-alt text-kapital-dark text-xl"></i>
          <span class="text-sm text-gray-600">Total</span>
        </div>
        <p class="text-2xl font-bold text-kapital-dark">{{ publications.length }}</p>
      </div>
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-check-circle text-green-600 text-xl"></i>
          <span class="text-sm text-gray-600">Publicados</span>
        </div>
        <p class="text-2xl font-bold text-green-600">{{ publications.filter(p => p.status === 'published').length }}</p>
      </div>
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-hourglass-half text-yellow-600 text-xl"></i>
          <span class="text-sm text-gray-600">Programados</span>
        </div>
        <p class="text-2xl font-bold text-yellow-600">{{ publications.filter(p => p.status === 'scheduled').length }}</p>
      </div>
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-file-pen text-purple-600 text-xl"></i>
          <span class="text-sm text-gray-600">Borradores</span>
        </div>
        <p class="text-2xl font-bold text-purple-600">{{ publications.filter(p => p.status === 'draft').length }}</p>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form -->
      <div class="lg:col-span-2 card">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Nueva Publicación</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Título -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-heading mr-2 text-kapital-dark"></i>Título
            </label>
            <input 
              v-model="formData.title"
              type="text" 
              placeholder="Ej: Lanzamiento de nuevo producto"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-align-left mr-2 text-kapital-dark"></i>Descripción
            </label>
            <textarea 
              v-model="formData.description"
              placeholder="Contenido principal de tu publicación..."
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100 resize-none"
              required
            ></textarea>
            <small class="text-gray-500 mt-1 block">{{ formData.description.length }}/500 caracteres</small>
          </div>

          <!-- Hashtags -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-hashtag mr-2 text-kapital-dark"></i>Hashtags
            </label>
            <input 
              v-model="formData.hashtags"
              type="text" 
              placeholder="#marketing #contenido #socialmedia"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <!-- Canales -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="bi bi-layers me-2 text-kapital-dark"></i> Canales
            </label>

            <div class="grid grid-cols-2 gap-3">
              <label
                v-for="channel in channels"
                :key="channel.name"
                class="flex items-center gap-2 p-3 bg-gray-50 border-2 rounded-md cursor-pointer transition-all"
                :class="formData.channels.includes(channel.name)
                  ? 'border-kapital-dark bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'"
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


          <!-- Programación -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-calendar mr-2 text-kapital-dark"></i>Fecha
              </label>
              <input 
                v-model="formData.publishDate"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-clock mr-2 text-kapital-dark"></i>Hora
              </label>
              <input 
                v-model="formData.publishTime"
                type="time"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
              />
            </div>
          </div>

          <!-- Archivo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-image mr-2 text-kapital-dark"></i>Archivo
            </label>
            <div 
              @click="$refs.fileInput.click()"
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-kapital-dark hover:bg-blue-50 transition"
            >
              <i class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2 block"></i>
              <p class="text-sm font-medium text-gray-700">
                {{ formData.file ? formData.file.name : 'Selecciona una imagen o video' }}
              </p>
              <small class="text-gray-500">PNG, JPG, MP4, MOV (Máx. 50MB)</small>
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*,video/*"
                @change="handleFileUpload"
                class="hidden" 
              />
            </div>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              @click="saveDraft"
              class="btn-secondary flex-1"
            >
              <i class="fas fa-save"></i> Borrador
            </button>
            <button 
              type="button" 
              @click="sendForReview"
              class="btn-secondary flex-1"
            >
              <i class="fas fa-eye"></i> Revisión
            </button>
            <button 
              type="submit"
              class="btn-primary flex-1"
            >
              <i class="fas fa-paper-plane"></i> Publicar
            </button>
          </div>
        </form>
      </div>

      <!-- Publications List -->
      <div class="card flex flex-col h-full">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Publicaciones</h2>
        
        <div class="flex gap-2 mb-4">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar..." 
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark text-sm"
          />
          <select 
            v-model="filterStatus"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark text-sm"
          >
            <option value="">Todos</option>
            <option value="published">Publicados</option>
            <option value="scheduled">Programados</option>
            <option value="draft">Borradores</option>
          </select>
        </div>
        
        <div class="flex-1 overflow-y-auto space-y-2">
          <div 
            v-for="pub in filteredPublications" 
            :key="pub.id" 
            class="bg-gradient-to-r from-gray-50 to-transparent border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer"
            @click="selectPublication(pub)"
          >
            <div class="flex justify-between items-start gap-2 mb-2">
              <h4 class="text-sm font-semibold text-gray-900 truncate flex-1">{{ pub.title }}</h4>
              <span :class="['text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap text-center inline-flex items-center justify-center', getStatusClass(pub.status)]">
                {{ getStatusLabel(pub.status) }}
              </span>
            </div>
            <p class="text-xs text-gray-600 line-clamp-1 mb-1">{{ pub.description }}</p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span><i class="fas fa-calendar mr-1"></i>{{ pub.date }}</span>
              <div class="flex gap-1">
                <i 
                  v-for="channel in pub.channels.split(', ').slice(0, 2)"
                  :key="channel"
                  :class="['fas text-xs', getChannelIcon(channel)]"
                ></i>
              </div>
            </div>
          </div>

          <div v-if="filteredPublications.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-500">
            <i class="fas fa-inbox text-3xl mb-2 text-gray-300"></i>
            <p class="text-sm">No hay publicaciones</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Publication Detail Modal -->
    <div v-if="selectedPub" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ selectedPub.title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ selectedPub.date }}</p>
          </div>
          <button @click="selectedPub = null" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Descripción</h4>
            <p class="text-gray-700 text-sm">{{ selectedPub.description }}</p>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Canales</h4>
            <div class="flex gap-2 flex-wrap">
              <span 
                v-for="channel in selectedPub.channels.split(', ')"
                :key="channel"
                :class="['text-xs px-3 py-1 rounded-full font-medium', getChannelColor(channel)]"
              >
                <i :class="['fas', getChannelIcon(channel), 'mr-1']"></i>{{ channel }}
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
            <button 
              @click="editPublication(selectedPub)"
              class="btn-secondary flex-1"
            >
              <i class="fas fa-edit"></i> Editar
            </button>
            <button 
              v-if="selectedPub.status === 'draft'"
              @click="moveToScheduling(selectedPub)"
              class="btn-primary flex-1"
            >
              <i class="fas fa-calendar"></i> Programar
            </button>
            <button 
              @click="deletePublication(selectedPub.id)"
              class="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
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

const searchQuery = ref('')
const filterStatus = ref('')
const selectedPub = ref(null)
const fileInput = ref(null)

const channels = ref([
  { name: 'Facebook', icon: 'bi bi-facebook', color: '#1877F2' },
  { name: 'Instagram', icon: 'bi bi-instagram', color: '#E4405F' },
  { name: 'LinkedIn', icon: 'bi bi-linkedin', color: '#0A66C2' },
  { name: 'Twitter', icon: 'bi bi-twitter-x', color: '#000000' } // usa el nuevo logo "X"
])


const formData = ref({
  title: '',
  description: '',
  hashtags: '',
  channels: [],
  file: null,
  publishDate: '',
  publishTime: ''
})

const publications = ref([
  {
    id: 1,
    title: 'Campaña de Verano 2025',
    description: 'Anuncia nuestro nuevo catálogo de verano con diseños frescos y colores vibrantes',
    date: '15 Nov, 2025',
    time: '14:00',
    channels: 'Instagram, Facebook',
    status: 'published',
    hashtags: '#verano #nuevo #diseño'
  },
  {
    id: 2,
    title: 'Tips de Marketing Digital',
    description: '10 consejos prácticos para mejorar tu estrategia de marketing en redes sociales',
    date: '20 Nov, 2025',
    time: '09:30',
    channels: 'LinkedIn',
    status: 'scheduled',
    hashtags: '#marketing #tips #socialmedia'
  },
  {
    id: 3,
    title: 'Promoción Especial Black Friday',
    description: 'Descuentos exclusivos de hasta 50% en productos seleccionados',
    date: 'Sin fecha',
    channels: 'Instagram, Facebook, Twitter',
    status: 'draft',
    hashtags: '#blackfriday #descuento #oferta'
  },
  {
    id: 4,
    title: 'Agradecimiento a la comunidad',
    description: 'Expresamos nuestra gratitud a todos nuestros seguidores leales',
    date: '18 Nov, 2025',
    time: '18:00',
    channels: 'Instagram',
    status: 'published',
    hashtags: '#gracias #comunidad #apoyo'
  },
  {
    id: 5,
    title: 'Webinar en Vivo',
    description: 'Únete a nosotros para una sesión interactiva de preguntas y respuestas',
    date: '27 Nov, 2025',
    time: '15:30',
    channels: 'Facebook, LinkedIn',
    status: 'scheduled',
    hashtags: '#webinar #evento #aprende'
  }
])

const filteredPublications = computed(() => {
  return publications.value.filter(pub => {
    const matchSearch = !searchQuery.value || 
      pub.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      pub.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = !filterStatus.value || pub.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

function getChannelIcon(channel) {
  const icons = {
    'Facebook': 'fa-facebook',
    'Instagram': 'fa-instagram',
    'LinkedIn': 'fa-linkedin',
    'Twitter': 'fa-twitter'
  }
  return icons[channel] || 'fa-link'
}

function getChannelColor(channel) {
  const colors = {
    'Facebook': 'bg-blue-100 text-blue-700',
    'Instagram': 'bg-pink-100 text-pink-700',
    'LinkedIn': 'bg-indigo-100 text-indigo-700',
    'Twitter': 'bg-cyan-100 text-cyan-700'
  }
  return colors[channel] || 'bg-gray-100 text-gray-700'
}

function getStatusClass(status) {
  const classes = {
    'published': 'bg-green-100 text-green-700',
    'scheduled': 'bg-yellow-100 text-yellow-700',
    'draft': 'bg-gray-100 text-gray-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

function getStatusLabel(status) {
  const labels = {
    'published': 'Publicado',
    'scheduled': 'Programado',
    'draft': 'Borrador'
  }
  return labels[status] || 'Desconocido'
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    formData.value.file = file
  }
}

function saveDraft() {
  if (!formData.value.title || !formData.value.description) {
    emit('showToast', 'Por favor completa los campos obligatorios', 'error')
    return
  }

  const newPub = {
    id: Math.max(...publications.value.map(p => p.id)) + 1,
    title: formData.value.title,
    description: formData.value.description,
    date: 'Sin fecha',
    channels: formData.value.channels.join(', ') || 'Sin asignar',
    status: 'draft',
    hashtags: formData.value.hashtags
  }

  publications.value.unshift(newPub)
  resetForm()
  emit('showToast', 'Publicación guardada como borrador')
}

function sendForReview() {
  if (!formData.value.title || !formData.value.description) {
    emit('showToast', 'Por favor completa los campos obligatorios', 'error')
    return
  }

  const newPub = {
    id: Math.max(...publications.value.map(p => p.id)) + 1,
    title: formData.value.title,
    description: formData.value.description,
    date: 'En revisión',
    channels: formData.value.channels.join(', ') || 'Sin asignar',
    status: 'draft',
    hashtags: formData.value.hashtags
  }

  publications.value.unshift(newPub)
  resetForm()
  emit('showToast', 'Enviado a revisión')
}

function handleSubmit() {
  if (!formData.value.title || !formData.value.description || !formData.value.channels.length) {
    emit('showToast', 'Por favor completa todos los campos obligatorios', 'error')
    return
  }

  const newPub = {
    id: Math.max(...publications.value.map(p => p.id)) + 1,
    title: formData.value.title,
    description: formData.value.description,
    date: formData.value.publishDate || 'Hoy',
    time: formData.value.publishTime || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    channels: formData.value.channels.join(', '),
    status: 'published',
    hashtags: formData.value.hashtags
  }

  publications.value.unshift(newPub)
  resetForm()
  emit('showToast', `Publicación creada y publicada en ${newPub.channels}`)
}

function selectPublication(pub) {
  selectedPub.value = pub
}

function editPublication(pub) {
  formData.value = {
    title: pub.title,
    description: pub.description,
    hashtags: pub.hashtags,
    channels: pub.channels.split(', '),
    file: null,
    publishDate: '',
    publishTime: pub.time || ''
  }
  selectedPub.value = null
  emit('showToast', `Editando: ${pub.title}`)
}

function deletePublication(id) {
  if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
    publications.value = publications.value.filter(p => p.id !== id)
    selectedPub.value = null
    emit('showToast', 'Publicación eliminada')
  }
}

function moveToScheduling(pub) {
  selectedPub.value = null
  emit('showToast', 'Abriendo programación para: ' + pub.title)
  emit('navigate', 'scheduling')
}

function resetForm() {
  formData.value = {
    title: '',
    description: '',
    hashtags: '',
    channels: [],
    file: null,
    publishDate: '',
    publishTime: ''
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-6 py-3 bg-kapital-dark text-white font-medium rounded-md transition-all hover:bg-blue-700 active:scale-95 flex items-center gap-2 justify-center;
}

.btn-secondary {
  @apply px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200 flex items-center gap-2 justify-center;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>