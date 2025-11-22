<template>
  <div class="space-y-6 h-full flex flex-col">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Producción de Contenido</h1>
        <p class="text-sm text-gray-600">Gestiona el ciclo de vida de tus publicaciones.</p>
      </div>
      <button @click="openNewPostModal" class="btn-primary shadow-lg shadow-kapital-dark/20">
        <i class="fas fa-plus"></i> Nueva Publicación
      </button>
    </div>

    <div class="bg-white p-3 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-3 items-center shadow-sm">
      <div class="relative flex-1 w-full">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar por título o contenido..." 
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-kapital-dark transition-colors"
        >
      </div>
      
      <div class="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <button 
          @click="filterChannel = ''"
          :class="['px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap', !filterChannel ? 'bg-kapital-night text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
        >
          Todos
        </button>
        <button 
          v-for="ch in channels" 
          :key="ch.name"
          @click="filterChannel = ch.name"
          :class="['px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap border', filterChannel === ch.name ? 'bg-white border-kapital-dark text-kapital-dark ring-1 ring-kapital-dark' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300']"
        >
          <i :class="ch.icon" :style="{ color: ch.color }"></i>
          {{ ch.name }}
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-x-auto overflow-y-hidden">
      <div class="flex gap-6 h-full min-w-[1000px]">
        
        <div 
          v-for="col in columns" 
          :key="col.id"
          class="flex-1 flex flex-col min-w-[280px] bg-gray-50 rounded-xl border border-gray-200 h-full max-h-[calc(100vh-240px)]"
          @dragover.prevent
          @drop="onDrop($event, col.id)"
        >
          <div :class="['p-3 border-b flex justify-between items-center sticky top-0 bg-gray-50 rounded-t-xl z-10', col.headerBorder]">
            <div class="flex items-center gap-2">
              <span :class="['w-2 h-2 rounded-full', col.dotColor]"></span>
              <h3 class="font-bold text-gray-700 text-sm">{{ col.title }}</h3>
            </div>
            <span class="bg-white border border-gray-200 px-2 py-0.5 rounded text-xs font-bold text-gray-500">
              {{ getColumnItems(col.id).length }}
            </span>
          </div>

          <div class="p-3 flex-1 overflow-y-auto space-y-3 scrollbar-thin">
            <div 
              v-for="pub in getColumnItems(col.id)" 
              :key="pub.id"
              draggable="true"
              @dragstart="startDrag($event, pub)"
              @click="editPublication(pub)"
              class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-kapital-dark/30 transition-all group relative"
            >
              <div v-if="pub.hasImage" class="h-24 w-full bg-gray-100 rounded-md mb-3 overflow-hidden relative">
                 <div class="absolute inset-0 flex items-center justify-center text-gray-300">
                    <i class="fas fa-image text-2xl"></i>
                 </div>
                 <div class="absolute bottom-1 left-1 flex gap-1">
                    <div v-for="net in pub.channels.split(', ')" :key="net" class="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center">
                       <i :class="['bi text-[10px]', getChannelIcon(net)]" :style="{ color: getChannelIconColor(net) }"></i>
                    </div>
                 </div>
              </div>

              <div class="mb-2">
                <h4 class="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">{{ pub.title }}</h4>
                <p class="text-xs text-gray-500 line-clamp-2">{{ pub.description }}</p>
              </div>

              <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                <small class="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                  <i class="far fa-calendar"></i> {{ pub.date || 'Sin fecha' }}
                </small>
                
                <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                   <button @click.stop="deletePublication(pub.id)" class="w-6 h-6 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors">
                     <i class="fas fa-trash-alt text-xs"></i>
                   </button>
                </div>
              </div>
            </div>
            
            <div v-if="getColumnItems(col.id).length === 0" class="h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
               <i class="fas fa-ghost text-2xl mb-2 opacity-50"></i>
               <span class="text-xs">Sin items</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <div>
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i :class="['fas', formData.id ? 'fa-edit' : 'fa-pen-nib', 'text-kapital-dark']"></i>
              {{ formData.id ? 'Editar Publicación' : 'Crear Nueva Publicación' }}
            </h2>
            <p class="text-xs text-gray-500">Completa los detalles y visualiza el resultado en tiempo real.</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          <div class="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-gray-200 bg-gray-50">
            <form @submit.prevent="savePost" class="space-y-5">
              
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="form-label">Título Interno</label>
                  <input v-model="formData.title" type="text" class="form-input" placeholder="Ej: Promo Verano 2025" required />
                </div>
              </div>

              <div>
                <label class="form-label flex justify-between">
                  <span>Copy / Descripción</span>
                  <span :class="['text-xs', formData.description.length > 2200 ? 'text-red-500' : 'text-gray-400']">{{ formData.description.length }} / 2200</span>
                </label>
                <textarea 
                  v-model="formData.description" 
                  rows="5" 
                  class="form-input font-mono text-sm leading-relaxed resize-none"
                  placeholder="Escribe aquí el texto de tu publicación..."
                  required
                ></textarea>
                <div class="flex gap-2 mt-2">
                  <button type="button" @click="addHashtag('#Kapital')" class="text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:border-kapital-dark transition-colors">#Kapital</button>
                  <button type="button" @click="addHashtag('#Marketing')" class="text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:border-kapital-dark transition-colors">#Marketing</button>
                  <button type="button" @click="goToGenerator" class="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-1 rounded hover:bg-purple-100 transition-colors ml-auto flex items-center gap-1">
                    <i class="fas fa-wand-magic-sparkles"></i> Usar IA
                  </button>
                </div>
              </div>

              <div>
                <label class="form-label">Canales de Publicación</label>
                <div class="grid grid-cols-2 gap-3">
                  <label 
                    v-for="ch in channels" 
                    :key="ch.name"
                    :class="['flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all', formData.channels.includes(ch.name) ? 'bg-white border-kapital-dark ring-1 ring-kapital-dark shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300']"
                  >
                    <input type="checkbox" :value="ch.name" v-model="formData.channels" class="hidden">
                    <i :class="[ch.icon, 'text-lg']" :style="{ color: ch.color }"></i>
                    <span class="text-sm font-medium text-gray-700">{{ ch.name }}</span>
                    <i v-if="formData.channels.includes(ch.name)" class="fas fa-check-circle text-kapital-dark ml-auto"></i>
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Fecha de Publicación</label>
                  <input v-model="formData.date" type="date" class="form-input" />
                </div>
                <div>
                  <label class="form-label">Hora</label>
                  <input v-model="formData.time" type="time" class="form-input" />
                </div>
              </div>

              <div>
                <label class="form-label">Estado</label>
                <select v-model="formData.status" class="form-input">
                  <option value="draft">Borrador</option>
                  <option value="review">En Revisión</option>
                  <option value="scheduled">Programado</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

            </form>
          </div>

          <div class="w-full lg:w-1/2 bg-gray-100 p-6 flex flex-col items-center justify-center relative border-l border-gray-200">
            <div class="absolute top-4 right-4 flex gap-2 bg-white rounded-lg p-1 shadow-sm">
              <button 
                v-for="ch in channels"
                :key="ch.name"
                @click="previewChannel = ch.name"
                :class="['w-8 h-8 rounded flex items-center justify-center transition-all', previewChannel === ch.name ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600']"
                :title="ch.name"
              >
                <i :class="ch.icon"></i>
              </button>
            </div>

            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Vista Previa: {{ previewChannel }}</p>

            <div class="bg-white w-[320px] rounded-[2rem] shadow-2xl border-[8px] border-gray-800 overflow-hidden relative h-[580px] flex flex-col">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-gray-800 rounded-b-xl z-20"></div>
              
              <div class="pt-8 pb-2 px-4 flex justify-between items-center border-b border-gray-100 bg-white z-10">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600"></div>
                  <span class="text-xs font-bold">kapital_cms</span>
                </div>
                <i class="fas fa-ellipsis-h text-xs text-gray-400"></i>
              </div>

              <div class="flex-1 overflow-y-auto bg-white scrollbar-hide">
                <div class="aspect-square bg-gray-100 flex items-center justify-center relative group">
                  <div class="text-center p-6">
                    <i class="fas fa-image text-4xl text-gray-300 mb-2"></i>
                    <p class="text-xs text-gray-400">Imagen del Post (1:1)</p>
                  </div>
                  <div v-if="previewChannel === 'TikTok' || previewChannel === 'Instagram Reels'" class="absolute inset-0 border-[40px] border-transparent border-y-[60px] bg-red-500/10 pointer-events-none"></div>
                </div>

                <div class="px-4 py-3 flex justify-between text-xl">
                  <div class="flex gap-4">
                    <i :class="['bi', previewChannel === 'LinkedIn' ? 'bi-hand-thumbs-up' : 'bi-heart']"></i>
                    <i class="bi bi-chat"></i>
                    <i class="bi bi-send"></i>
                  </div>
                  <i class="bi bi-bookmark"></i>
                </div>

                <div class="px-4 pb-6 text-sm">
                  <p class="font-bold mb-1">1,024 Me gusta</p>
                  <p>
                    <span class="font-bold mr-1">kapital_cms</span>
                    <span class="text-gray-800 whitespace-pre-wrap">{{ formData.description || 'Escribe una descripción...' }}</span>
                  </p>
                  <p class="text-blue-600 mt-1 text-xs">{{ formData.hashtags }}</p>
                  <p class="text-[10px] text-gray-400 mt-2 uppercase">Hace 2 horas</p>
                </div>
              </div>

              <div class="h-12 border-t border-gray-100 flex justify-around items-center text-xl text-gray-400 bg-white">
                <i class="bi bi-house-door-fill text-black"></i>
                <i class="bi bi-search"></i>
                <i class="bi bi-plus-square"></i>
                <i class="bi bi-heart"></i>
                <div class="w-6 h-6 rounded-full bg-gray-300"></div>
              </div>
            </div>

          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
          <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
          <button type="button" @click="savePost" class="btn-primary w-40">
            <i class="fas fa-save"></i> Guardar
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['showToast', 'navigate'])

// --- ESTADO Y DATOS ---
const showModal = ref(false)
const searchQuery = ref('')
const filterChannel = ref('')
const previewChannel = ref('Instagram')
const draggingItem = ref(null)

const channels = [
  { name: 'Instagram', icon: 'bi bi-instagram', color: '#E4405F' },
  { name: 'Facebook', icon: 'bi bi-facebook', color: '#1877F2' },
  { name: 'LinkedIn', icon: 'bi bi-linkedin', color: '#0A66C2' },
  { name: 'Twitter', icon: 'bi bi-twitter-x', color: '#000000' },
  { name: 'TikTok', icon: 'bi bi-tiktok', color: '#000000' }
]

const columns = [
  { id: 'draft', title: 'Borradores', dotColor: 'bg-gray-400', headerBorder: 'border-gray-200' },
  { id: 'review', title: 'En Revisión', dotColor: 'bg-blue-400', headerBorder: 'border-blue-200' },
  { id: 'scheduled', title: 'Programados', dotColor: 'bg-yellow-400', headerBorder: 'border-yellow-200' },
  { id: 'published', title: 'Publicados', dotColor: 'bg-green-400', headerBorder: 'border-green-200' }
]

// Datos iniciales (Simulados)
const publications = ref([
  { id: 1, title: 'Lanzamiento Verano', description: '¡Llegó la nueva colección! ☀️ #Verano2025', channels: 'Instagram, Facebook', status: 'published', date: '2025-11-10', time: '10:00', hashtags: '#fashion #summer', hasImage: true },
  { id: 2, title: 'Tips de Marketing', description: '5 consejos para mejorar tu SEO hoy mismo.', channels: 'LinkedIn', status: 'scheduled', date: '2025-11-25', time: '09:00', hashtags: '#seo #marketing', hasImage: true },
  { id: 3, title: 'Black Friday Teaser', description: 'Prepárate... algo grande viene.', channels: 'Instagram, TikTok', status: 'draft', date: '', time: '', hashtags: '#blackfriday', hasImage: false },
  { id: 4, title: 'Webinar Invitation', description: 'Únete a nuestro webinar gratuito sobre IA.', channels: 'LinkedIn, Twitter', status: 'review', date: '2025-11-28', time: '15:00', hashtags: '#webinar #ai', hasImage: true },
  { id: 5, title: 'Meme de Oficina', description: 'Cuando es viernes y el cliente pide cambios...', channels: 'Instagram, Twitter', status: 'draft', date: '', time: '', hashtags: '#humor #agencylife', hasImage: true },
])

const emptyForm = {
  id: null,
  title: '',
  description: '',
  hashtags: '',
  channels: [],
  date: '',
  time: '',
  status: 'draft'
}

const formData = ref({ ...emptyForm })

// --- COMPUTED ---
const filteredPublications = computed(() => {
  return publications.value.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          pub.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesChannel = !filterChannel.value || pub.channels.includes(filterChannel.value)
    return matchesSearch && matchesChannel
  })
})

// Helper para obtener items por columna
function getColumnItems(columnId) {
  return filteredPublications.value.filter(p => p.status === columnId)
}

// --- DRAG AND DROP LOGIC ---
function startDrag(evt, item) {
  draggingItem.value = item
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  // Pequeño hack para que la imagen fantasma no sea la tarjeta completa si es muy grande
  // evt.dataTransfer.setDragImage(evt.target, 0, 0) 
}

function onDrop(evt, statusId) {
  if (draggingItem.value) {
    // Actualizar estado
    const item = publications.value.find(p => p.id === draggingItem.value.id)
    if (item && item.status !== statusId) {
      item.status = statusId
      emit('showToast', `Publicación movida a: ${getColumnTitle(statusId)}`)
    }
    draggingItem.value = null
  }
}

function getColumnTitle(id) {
  const col = columns.find(c => c.id === id)
  return col ? col.title : id
}

// --- ACCIONES ---
function openNewPostModal() {
  formData.value = JSON.parse(JSON.stringify(emptyForm)) // Deep copy
  formData.value.channels = ['Instagram'] // Default
  previewChannel.value = 'Instagram'
  showModal.value = true
}

function editPublication(pub) {
  formData.value = JSON.parse(JSON.stringify(pub))
  // Asegurar que channels sea un array si viene como string
  if (typeof formData.value.channels === 'string') {
    formData.value.channels = formData.value.channels.split(', ')
  }
  // Establecer canal de preview al primero disponible
  previewChannel.value = formData.value.channels[0] || 'Instagram'
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function savePost() {
  if (!formData.value.title) {
    emit('showToast', 'El título es obligatorio', 'error')
    return
  }

  // Convertir array de canales a string para guardar (simulando backend)
  const postToSave = {
    ...formData.value,
    channels: Array.isArray(formData.value.channels) ? formData.value.channels.join(', ') : formData.value.channels,
    hasImage: true // Simulamos que siempre tiene imagen por ahora
  }

  if (postToSave.id) {
    // Editar
    const index = publications.value.findIndex(p => p.id === postToSave.id)
    if (index !== -1) publications.value[index] = postToSave
    emit('showToast', 'Publicación actualizada correctamente')
  } else {
    // Crear
    postToSave.id = Date.now()
    publications.value.unshift(postToSave)
    emit('showToast', 'Nueva publicación creada')
  }
  
  closeModal()
}

function deletePublication(id) {
  if (confirm('¿Estás seguro de eliminar esta publicación?')) {
    publications.value = publications.value.filter(p => p.id !== id)
    emit('showToast', 'Publicación eliminada')
  }
}

function addHashtag(tag) {
  formData.value.description += ` ${tag} `
}

function goToGenerator() {
  emit('navigate', 'generation')
}

// --- UTILIDADES VISUALES ---
function getChannelIcon(channelName) {
  const ch = channels.find(c => c.name === channelName.trim())
  return ch ? ch.icon : 'bi-share'
}

function getChannelIconColor(channelName) {
  const ch = channels.find(c => c.name === channelName.trim())
  return ch ? ch.color : '#666'
}

</script>

<style scoped>
/* Scrollbar fina para las columnas */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}
.scrollbar-thin:hover::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Estilos de Formulario */
.form-label {
  @apply block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1;
}
.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all bg-white text-sm;
}

.btn-primary {
  @apply px-6 py-2.5 bg-kapital-night text-white font-medium rounded-lg hover:bg-kapital-night-hover active:scale-95 transition-all flex items-center gap-2 justify-center text-sm;
}
.btn-secondary {
  @apply px-6 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all text-sm;
}
</style>