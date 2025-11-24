<template>
  <div class="space-y-6 h-full flex flex-col">
    <!-- Header -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Producción</h1>
        <p class="text-slate-500 mt-1">Gestiona el ciclo de vida de tus publicaciones.</p>
      </div>
      <button @click="openNewPostModal" class="btn-primary shadow-lg shadow-kapital-dark/20">
        <Plus :size="18" /> Nueva Publicación
      </button>
    </div>

    <!-- Filters -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
      class="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-soft flex flex-col md:flex-row gap-4 items-center"
    >
      <div class="relative flex-1 w-full">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar por título o contenido..." 
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kapital-dark/20 focus:border-kapital-dark transition-all"
        >
      </div>
      
      <div class="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <button 
          @click="filterChannel = ''"
          :class="['px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap shadow-sm', !filterChannel ? 'bg-kapital-dark text-white shadow-kapital-dark/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200']"
        >
          Todos
        </button>
        <button 
          v-for="ch in channels" 
          :key="ch.name"
          @click="filterChannel = ch.name"
          :class="['px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap border shadow-sm', filterChannel === ch.name ? 'bg-white border-kapital-dark text-kapital-dark ring-1 ring-kapital-dark' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50']"
        >
          <component :is="ch.icon" :size="16" :class="ch.colorClass" />
          {{ ch.name }}
        </button>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="flex-1 overflow-x-auto overflow-y-hidden">
      <div class="flex gap-6 h-full min-w-[1000px] pb-4 px-2">
        
        <div 
          v-for="(col, index) in columns" 
          :key="col.id"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 200 + (index * 100) } }"
          class="flex-1 flex flex-col min-w-[280px] bg-slate-100/50 rounded-2xl border border-slate-200/60 backdrop-blur-sm h-full max-h-[calc(100vh-240px)]"
          @dragover.prevent
          @drop="onDrop($event, col.id)"
        >
          <div class="p-4 flex justify-between items-center sticky top-0 bg-slate-100/90 backdrop-blur-md rounded-t-2xl z-10 border-b border-slate-200/60">
            <div class="flex items-center gap-2">
              <div :class="['w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm', col.dotColor]"></div>
              <h3 class="font-bold text-slate-700 text-sm uppercase tracking-wide">{{ col.title }}</h3>
            </div>
            <span class="bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-500 shadow-sm">
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
              class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-kapital-dark/30 transition-all group relative"
            >
              <div v-if="pub.hasImage" class="h-32 w-full bg-slate-100 rounded-lg mb-3 overflow-hidden relative group-hover:opacity-90 transition-opacity">
                 <div class="absolute inset-0 flex items-center justify-center text-slate-300">
                    <ImageIcon :size="32" />
                 </div>
                 <div class="absolute bottom-2 left-2 flex gap-1">
                    <div v-for="net in pub.channels.split(', ')" :key="net" class="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                       <component :is="getChannelIcon(net)" :size="12" :class="getChannelColorClass(net)" />
                    </div>
                 </div>
              </div>

              <div class="mb-3">
                <h4 class="font-bold text-slate-900 text-sm leading-tight mb-1 line-clamp-2">{{ pub.title }}</h4>
                <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">{{ pub.description }}</p>
              </div>

              <div class="flex justify-between items-center pt-3 border-t border-slate-50">
                <div class="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                  <Calendar :size="12" />
                  {{ pub.date || 'Sin fecha' }}
                </div>
                
                <button 
                  @click.stop="deletePublication(pub.id)" 
                  class="w-7 h-7 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>
            
            <div v-if="getColumnItems(col.id).length === 0" class="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
               <Ghost :size="24" class="mb-2 opacity-50" />
               <span class="text-xs font-medium">Sin publicaciones</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :enter="{ opacity: 1, scale: 1 }"
        class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border border-white/20"
      >
        
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <component :is="formData.id ? Edit3 : PenTool" class="text-kapital-dark" :size="20" />
              {{ formData.id ? 'Editar Publicación' : 'Crear Nueva Publicación' }}
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">Completa los detalles y visualiza el resultado en tiempo real.</p>
          </div>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg">
            <X :size="24" />
          </button>
        </div>

        <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          <!-- Form -->
          <div class="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-slate-100 bg-slate-50/30">
            <form @submit.prevent="savePost" class="space-y-6">
              
              <!-- Strategy Context (Read Only) -->
              <div v-if="formData.strategy" class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
                <h3 class="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Wand2 :size="14" /> Contexto Estratégico
                </h3>
                <div class="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span class="block text-indigo-400 font-medium mb-0.5">Buyer Persona</span>
                    <span class="text-indigo-900 font-semibold">{{ formData.strategy.segment?.demo?.profession || 'N/A' }}</span>
                  </div>
                  <div>
                    <span class="block text-indigo-400 font-medium mb-0.5">Arquetipo</span>
                    <span class="text-indigo-900 font-semibold">{{ formData.strategy.concept?.brandArchetype || 'N/A' }}</span>
                  </div>
                  <div class="col-span-2">
                    <span class="block text-indigo-400 font-medium mb-0.5">Objetivo</span>
                    <span class="text-indigo-900">{{ formData.strategy.objective?.description || 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <div>
                <label class="form-label">Título Interno</label>
                <input v-model="formData.title" type="text" class="form-input" placeholder="Ej: Promo Verano 2025" required />
              </div>

              <div>
                <label class="form-label flex justify-between">
                  <span>Copy / Descripción</span>
                  <span :class="['text-xs', formData.description.length > 2200 ? 'text-rose-500' : 'text-slate-400']">{{ formData.description.length }} / 2200</span>
                </label>
                <div class="relative">
                  <textarea 
                    v-model="formData.description" 
                    rows="6" 
                    class="form-input font-mono text-sm leading-relaxed resize-none pr-10"
                    placeholder="Escribe aquí el texto de tu publicación..."
                    required
                  ></textarea>
                  <button type="button" @click="goToGenerator" class="absolute top-2 right-2 p-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors" title="Generar con IA">
                    <Wand2 :size="16" />
                  </button>
                </div>
                <div class="flex gap-2 mt-2 flex-wrap">
                  <button type="button" @click="addHashtag('#Kapital')" class="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:border-kapital-dark hover:text-kapital-dark transition-colors font-medium text-slate-600">#Kapital</button>
                  <button type="button" @click="addHashtag('#Marketing')" class="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:border-kapital-dark hover:text-kapital-dark transition-colors font-medium text-slate-600">#Marketing</button>
                </div>
              </div>

              <div>
                <label class="form-label">Canales de Publicación</label>
                <div class="grid grid-cols-2 gap-3">
                  <label 
                    v-for="ch in channels" 
                    :key="ch.name"
                    :class="['flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all', formData.channels.includes(ch.name) ? 'bg-white border-kapital-dark ring-1 ring-kapital-dark shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300']"
                  >
                    <input type="checkbox" :value="ch.name" v-model="formData.channels" class="hidden">
                    <component :is="ch.icon" :size="18" :class="ch.colorClass" />
                    <span class="text-sm font-medium text-slate-700">{{ ch.name }}</span>
                    <CheckCircle2 v-if="formData.channels.includes(ch.name)" :size="16" class="text-kapital-dark ml-auto" />
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Fecha</label>
                  <input v-model="formData.date" type="date" class="form-input" />
                </div>
                <div>
                  <label class="form-label">Hora</label>
                  <input v-model="formData.time" type="time" class="form-input" />
                </div>
              </div>

              <div>
                <label class="form-label">Estado</label>
                <div class="relative">
                  <select v-model="formData.status" class="form-input appearance-none cursor-pointer">
                    <option value="created">✨ Creado por IA</option>
                    <option value="draft">📝 Borrador</option>
                    <option value="review">👀 En Revisión</option>
                    <option value="scheduled">📅 Programado</option>
                    <option value="published">✅ Publicado</option>
                  </select>
                  <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="16" />
                </div>
              </div>

            </form>
          </div>

          <!-- Preview -->
          <div class="w-full lg:w-1/2 bg-slate-100 p-8 flex flex-col items-center justify-center relative border-l border-slate-200">
            <div class="absolute top-6 right-6 flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-slate-200">
              <button 
                v-for="ch in channels"
                :key="ch.name"
                @click="previewChannel = ch.name"
                :class="['w-9 h-9 rounded-lg flex items-center justify-center transition-all', previewChannel === ch.name ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600']"
                :title="ch.name"
              >
                <component :is="ch.icon" :size="18" />
              </button>
            </div>

            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Vista Previa: {{ previewChannel }}</p>

            <div class="bg-white w-[340px] rounded-[2.5rem] shadow-2xl border-[8px] border-slate-800 overflow-hidden relative h-[620px] flex flex-col">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
              
              <div class="pt-10 pb-3 px-5 flex justify-between items-center border-b border-slate-50 bg-white z-10">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 ring-2 ring-white"></div>
                  <span class="text-xs font-bold text-slate-900">kapital_cms</span>
                </div>
                <MoreHorizontal :size="16" class="text-slate-400" />
              </div>

              <div class="flex-1 overflow-y-auto bg-white scrollbar-hide">
                <div class="aspect-square bg-slate-100 flex items-center justify-center relative group">
                  <div class="text-center p-8">
                    <ImageIcon :size="48" class="text-slate-300 mb-3 mx-auto" />
                    <p class="text-xs text-slate-400 font-medium">Imagen del Post (1:1)</p>
                  </div>
                  <div v-if="previewChannel === 'TikTok' || previewChannel === 'Instagram Reels'" class="absolute inset-0 border-[40px] border-transparent border-y-[60px] bg-slate-900/5 pointer-events-none"></div>
                </div>

                <div class="px-4 py-3 flex justify-between text-slate-800">
                  <div class="flex gap-4">
                    <component :is="previewChannel === 'LinkedIn' ? ThumbsUp : Heart" :size="22" />
                    <MessageCircle :size="22" />
                    <Send :size="22" />
                  </div>
                  <Bookmark :size="22" />
                </div>

                <div class="px-4 pb-8 text-sm">
                  <p class="font-bold mb-1.5 text-slate-900">1,024 Me gusta</p>
                  <p class="text-slate-800 leading-relaxed">
                    <span class="font-bold mr-1">kapital_cms</span>
                    <span class="whitespace-pre-wrap">{{ formData.description || 'Escribe una descripción...' }}</span>
                  </p>
                  <p class="text-blue-600 mt-1.5 text-xs font-medium">{{ formData.hashtags }}</p>
                  <p class="text-[10px] text-slate-400 mt-2 uppercase font-medium">Hace 2 horas</p>
                </div>
              </div>

              <div class="h-14 border-t border-slate-50 flex justify-around items-center text-slate-400 bg-white px-2">
                <Home :size="22" class="text-slate-900" />
                <Search :size="22" />
                <PlusSquare :size="22" />
                <Heart :size="22" />
                <div class="w-6 h-6 rounded-full bg-slate-200"></div>
              </div>
            </div>

          </div>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
          <button type="button" @click="savePost" class="btn-primary w-40 shadow-lg shadow-kapital-dark/20">
            <Save :size="18" /> Guardar
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../stores/content'
import { 
  Plus, Search, Calendar, Trash2, Image as ImageIcon, Ghost, Edit3, PenTool, X, 
  Wand2, CheckCircle2, ChevronDown, MoreHorizontal, Heart, ThumbsUp, MessageCircle, 
  Send, Bookmark, Home, PlusSquare, Save, Facebook, Instagram, Linkedin, Twitter, Share2 
} from 'lucide-vue-next'

const emit = defineEmits(['showToast', 'navigate'])
const contentStore = useContentStore()
const { publications } = storeToRefs(contentStore)

// --- ESTADO Y DATOS ---
const showModal = ref(false)
const searchQuery = ref('')
const filterChannel = ref('')
const previewChannel = ref('Instagram')
const draggingItem = ref(null)

const channels = [
  { name: 'Instagram', icon: Instagram, colorClass: 'text-pink-600' },
  { name: 'Facebook', icon: Facebook, colorClass: 'text-blue-600' },
  { name: 'LinkedIn', icon: Linkedin, colorClass: 'text-blue-700' },
  { name: 'Twitter', icon: Twitter, colorClass: 'text-slate-900' },
  { name: 'TikTok', icon: Share2, colorClass: 'text-slate-900' }
]

const columns = [
  { id: 'created', title: 'Creado por IA', dotColor: 'bg-indigo-400' },
  { id: 'draft', title: 'Borradores', dotColor: 'bg-slate-400' },
  { id: 'review', title: 'En Revisión', dotColor: 'bg-blue-400' },
  { id: 'scheduled', title: 'Programados', dotColor: 'bg-amber-400' },
  { id: 'published', title: 'Publicados', dotColor: 'bg-emerald-400' }
]

// --- AUTO-DELETE EXPIRED DRAFTS ---
onMounted(() => {
  const deletedCount = contentStore.checkExpiredDrafts(2)
  if (deletedCount > 0) {
    setTimeout(() => {
      emit('showToast', `${deletedCount} borradores expirados fueron eliminados automáticamente.`, 'info')
    }, 1000)
  }
})

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
}

function onDrop(evt, statusId) {
  if (draggingItem.value) {
    const item = { ...draggingItem.value, status: statusId }
    contentStore.updatePublication(item)
    emit('showToast', `Publicación movida a: ${getColumnTitle(statusId)}`)
    draggingItem.value = null
  }
}

function getColumnTitle(id) {
  const col = columns.find(c => c.id === id)
  return col ? col.title : id
}

// --- ACCIONES ---
function openNewPostModal() {
  formData.value = JSON.parse(JSON.stringify(emptyForm))
  formData.value.channels = ['Instagram']
  previewChannel.value = 'Instagram'
  showModal.value = true
}

function editPublication(pub) {
  formData.value = JSON.parse(JSON.stringify(pub))
  if (typeof formData.value.channels === 'string') {
    formData.value.channels = formData.value.channels.split(', ')
  }
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

  const postToSave = {
    ...formData.value,
    channels: Array.isArray(formData.value.channels) ? formData.value.channels.join(', ') : formData.value.channels,
  }

  if (postToSave.id) {
    contentStore.updatePublication(postToSave)
    emit('showToast', 'Publicación actualizada correctamente')
  } else {
    contentStore.addPublication(postToSave)
    emit('showToast', 'Nueva publicación creada')
  }
  
  closeModal()
}

function deletePublication(id) {
  if (confirm('¿Estás seguro de eliminar esta publicación?')) {
    contentStore.deletePublication(id)
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
  return ch ? ch.icon : Share2
}

function getChannelColorClass(channelName) {
  const ch = channels.find(c => c.name === channelName.trim())
  return ch ? ch.colorClass : 'text-slate-500'
}

</script>

<style scoped lang="postcss">
/* Scrollbar fina para las columnas */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.scrollbar-thin:hover::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
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
  @apply block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5;
}
.form-input {
  @apply w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all bg-white text-sm text-slate-700;
}

.btn-primary {
  @apply px-5 py-2.5 bg-kapital-dark text-white font-medium rounded-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 justify-center text-sm;
}
.btn-secondary {
  @apply px-5 py-2.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-sm;
}
</style>