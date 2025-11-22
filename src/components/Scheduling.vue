<template>
  <div class="space-y-6 h-full flex flex-col">
    <!-- Header -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="flex justify-between items-end"
    >
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Programación</h1>
        <p class="text-slate-500 mt-1">Administra y visualiza tus publicaciones programadas.</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
        class="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4"
      >
        <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <Calendar :size="24" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ totalScheduled }}</p>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Programadas</span>
        </div>
      </div>
      
      <div 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
        class="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-4"
      >
        <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Clock :size="24" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ todayCount }}</p>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Para Hoy</span>
        </div>
      </div>

      <div 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
        class="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4"
      >
        <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
          <AlertTriangle :size="24" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ weekCount }}</p>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Esta Semana</span>
        </div>
      </div>

      <div 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }"
        class="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 flex items-center gap-4"
      >
        <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
          <CheckCircle2 :size="24" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ publishedCount }}</p>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Publicadas</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 500 } }"
      class="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-soft flex flex-col md:flex-row gap-4"
    >
      <div class="flex-1">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Campaña</label>
        <div class="relative">
          <select 
            v-model="filterCampaign"
            class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-kapital-dark appearance-none cursor-pointer"
          >
            <option value="">Todas las campañas</option>
            <option value="Verano">Verano</option>
            <option value="Promociones">Promociones</option>
            <option value="Educativo">Educativo</option>
            <option value="Eventos">Eventos</option>
          </select>
          <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="16" />
        </div>
      </div>
      <div class="flex-1">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Red Social</label>
        <div class="relative">
          <select 
            v-model="filterNetwork"
            class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-kapital-dark appearance-none cursor-pointer"
          >
            <option value="">Todas las redes</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter">Twitter</option>
          </select>
          <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="16" />
        </div>
      </div>
      <div class="flex-1">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Estado</label>
        <div class="relative">
          <select 
            v-model="filterStatus"
            class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-kapital-dark appearance-none cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option value="scheduled">Programado</option>
            <option value="published">Publicado</option>
            <option value="failed">Fallido</option>
          </select>
          <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="16" />
        </div>
      </div>
    </div>

    <!-- Calendar & Info -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
      <!-- Calendar -->
      <div class="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-white/20 shadow-soft rounded-2xl p-6 flex flex-col">
        <div class="flex justify-between items-center mb-6">
          <button 
            @click="previousMonth"
            class="text-slate-400 hover:text-kapital-dark hover:bg-slate-100 p-2 rounded-lg transition-colors"
            title="Mes anterior"
          >
            <ChevronLeft :size="24" />
          </button>
          <div class="text-center">
            <h3 class="text-xl font-bold text-slate-900">{{ monthYear }}</h3>
            <small class="text-slate-500 font-medium">{{ dayCountInfo }}</small>
          </div>
          <button 
            @click="nextMonth"
            class="text-slate-400 hover:text-kapital-dark hover:bg-slate-100 p-2 rounded-lg transition-colors"
            title="Próximo mes"
          >
            <ChevronRight :size="24" />
          </button>
        </div>

        <!-- Days of week header -->
        <div class="grid grid-cols-7 gap-2 mb-4">
          <div v-for="day in ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']" :key="day" class="text-center font-bold text-slate-400 text-xs uppercase tracking-wider py-2">
            {{ day }}
          </div>
        </div>

        <!-- Calendar days -->
        <div class="grid grid-cols-7 gap-2 flex-1">
          <div 
            v-for="item in calendarDays" 
            :key="item.key"
            @click="item.day && selectDate(item.day)"
            :class="[
              'aspect-square border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all relative p-1',
              item.isCurrentMonth ? 'border-slate-200 hover:border-kapital-dark bg-white hover:shadow-md' : 'border-slate-100 bg-slate-50/50 text-slate-300',
              item.isToday ? 'border-kapital-dark bg-blue-50 ring-1 ring-kapital-dark' : '',
              item.hasPublications ? 'border-kapital-dark/50' : ''
            ]"
          >
            <span v-if="item.day" :class="['text-sm font-medium', item.isToday ? 'text-kapital-dark font-bold' : '']">{{ item.day }}</span>
            <span v-if="item.count" class="text-[10px] font-bold text-white bg-kapital-dark px-1.5 py-0.5 rounded-full mt-1 shadow-sm">{{ item.count }}</span>
            <div v-if="item.hasPublications && !item.count" class="w-1.5 h-1.5 rounded-full bg-kapital-dark mt-1"></div>
          </div>
        </div>
      </div>

      <!-- Sidebar Info -->
      <div class="space-y-4 flex flex-col overflow-y-auto scrollbar-hide">
        <div class="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
          <h3 class="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Info :size="16" class="text-kapital-dark" /> Próxima
          </h3>
          <div v-if="nextPublication" class="space-y-3">
            <p class="font-bold text-slate-900 text-lg leading-tight">{{ nextPublication.title }}</p>
            <p class="text-sm text-slate-600 flex items-center gap-2 bg-white/50 p-2 rounded-lg w-fit">
              <Calendar :size="14" /> {{ nextPublication.date }}
            </p>
            <div class="flex gap-1.5 flex-wrap">
              <span v-for="net in nextPublication.networks.split(', ')" :key="net" class="text-[10px] font-bold px-2 py-1 bg-kapital-dark text-white rounded-md uppercase tracking-wide shadow-sm">
                {{ net }}
              </span>
            </div>
          </div>
          <p v-else class="text-slate-500 text-sm italic">No hay publicaciones próximas</p>
        </div>

        <div class="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5">
          <h3 class="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
            <PieChart :size="16" class="text-emerald-600" /> Distribución
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center p-2 bg-white/50 rounded-lg">
              <span class="text-slate-600 font-medium">Programadas</span>
              <span class="font-bold text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm">{{ scheduled.filter(p => p.status === 'scheduled').length }}</span>
            </div>
            <div class="flex justify-between items-center p-2 bg-white/50 rounded-lg">
              <span class="text-slate-600 font-medium">Publicadas</span>
              <span class="font-bold text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm">{{ scheduled.filter(p => p.status === 'published').length }}</span>
            </div>
            <div class="flex justify-between items-center p-2 bg-white/50 rounded-lg">
              <span class="text-slate-600 font-medium">Fallidas</span>
              <span class="font-bold text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm">{{ scheduled.filter(p => p.status === 'failed').length }}</span>
            </div>
          </div>
        </div>

        <div class="bg-amber-50/50 border border-amber-100 rounded-2xl p-5">
          <h3 class="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Bell :size="16" class="text-amber-600" /> Recordatorios
          </h3>
          <p class="text-sm text-slate-700 font-medium">
            <span class="font-bold text-amber-600 text-lg">{{ upcomingCount }}</span> publicación(es) en próximas 48 horas
          </p>
        </div>
      </div>
    </div>

    <!-- Scheduled Publications List -->
    <div class="bg-white/80 backdrop-blur-sm border border-white/20 shadow-soft rounded-2xl p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <List :size="20" class="text-kapital-dark" /> Publicaciones Programadas
      </h2>
      
      <div class="space-y-3">
        <div 
          v-for="item in filteredScheduled" 
          :key="item.id"
          class="bg-slate-50/50 border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-kapital-dark/30 transition-all group"
        >
          <div class="flex justify-between items-start gap-4 mb-3">
            <div class="flex-1">
              <h4 class="font-bold text-slate-900 text-base">{{ item.title }}</h4>
              <p class="text-sm text-slate-600 mt-1 line-clamp-1">{{ item.description }}</p>
            </div>
            <span :class="['px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg whitespace-nowrap shadow-sm', getStatusBadge(item.status)]">
              {{ item.statusLabel }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm">
            <div class="flex items-center gap-2 text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100">
              <Calendar :size="14" class="text-kapital-dark" />
              <input 
                type="date" 
                :value="item.date"
                @change="(e) => updatePublicationDate(item.id, e.target.value)"
                class="bg-transparent border-none p-0 text-xs focus:ring-0 w-full text-slate-700 font-medium"
              />
            </div>
            <div class="flex items-center gap-2 text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100">
              <Clock :size="14" class="text-kapital-dark" />
              <input 
                type="time" 
                :value="item.time || ''"
                @change="(e) => updatePublicationTime(item.id, e.target.value)"
                class="bg-transparent border-none p-0 text-xs focus:ring-0 w-full text-slate-700 font-medium"
              />
            </div>
            <div class="flex items-center gap-2 text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100">
              <Tag :size="14" class="text-kapital-dark" />
              <span class="text-xs font-medium">{{ item.campaign || 'Sin campaña' }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-slate-200/60">
            <div class="flex gap-2 flex-wrap">
              <span 
                v-for="net in item.networks.split(', ')" 
                :key="net"
                :class="['text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wide flex items-center gap-1', getNetworkColor(net)]"
              >
                <component :is="getNetworkIcon(net)" :size="10" /> {{ net }}
              </span>
            </div>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                @click="editPublication(item)"
                class="p-2 text-slate-400 hover:text-kapital-dark hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit2 :size="16" />
              </button>
              <button 
                @click="changeStatus(item)"
                class="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Cambiar estado"
              >
                <RefreshCw :size="16" />
              </button>
              <button 
                @click="deletePublication(item.id)"
                class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredScheduled.length === 0" class="text-center py-12 flex flex-col items-center">
          <CalendarCheck :size="48" class="text-slate-200 mb-3" />
          <p class="text-slate-400 font-medium">No hay publicaciones con estos filtros</p>
        </div>
      </div>
    </div>

    <!-- Edit Publication Modal -->
    <div v-if="showEditModal && editingPub" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :enter="{ opacity: 1, scale: 1 }"
        class="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Edit3 :size="20" class="text-kapital-dark" /> Editar Publicación
          </h3>
          <button @click="showEditModal = false" class="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X :size="24" />
          </button>
        </div>

        <form @submit.prevent="saveChanges" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Título</label>
            <input 
              v-model="editingPub.title"
              type="text"
              class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Descripción</label>
            <textarea 
              v-model="editingPub.description"
              rows="3"
              class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Fecha</label>
              <input 
                v-model="editingPub.date"
                type="date"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Hora</label>
              <input 
                v-model="editingPub.time"
                type="time"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Canales</label>
            <input 
              v-model="editingPub.networks"
              type="text"
              placeholder="Ej: Instagram, Facebook"
              class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm"
            />
          </div>

          <div class="flex gap-3 pt-6 border-t border-slate-100">
            <button 
              type="button"
              @click="showEditModal = false"
              class="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="btn-primary flex-1 shadow-lg shadow-kapital-dark/20"
            >
              <Save :size="18" /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Change Status Modal -->
    <div v-if="showStatusModal && statusEditPub" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :enter="{ opacity: 1, scale: 1 }"
        class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20"
      >
        <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <RefreshCw :size="20" class="text-kapital-dark" /> Cambiar Estado
        </h3>
        
        <div class="space-y-3 mb-6">
          <button 
            v-for="status in statusOptions"
            :key="status.value"
            @click="updateStatus(status.value)"
            :class="['w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 group', 
              statusEditPub.status === status.value ? 'border-kapital-dark bg-blue-50 ring-1 ring-kapital-dark' : 'border-slate-200 hover:border-kapital-dark/50 hover:bg-slate-50']"
          >
            <div :class="['w-10 h-10 rounded-full flex items-center justify-center transition-colors', statusEditPub.status === status.value ? 'bg-kapital-dark text-white' : 'bg-slate-100 text-slate-400 group-hover:text-kapital-dark']">
              <component :is="status.icon" :size="18" />
            </div>
            <div>
              <p class="font-bold text-slate-900 text-sm">{{ status.label }}</p>
              <small class="text-slate-500">{{ status.description }}</small>
            </div>
            <CheckCircle2 v-if="statusEditPub.status === status.value" :size="18" class="ml-auto text-kapital-dark" />
          </button>
        </div>

        <button 
          @click="showStatusModal = false"
          class="btn-secondary w-full"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Calendar, Clock, AlertTriangle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, 
  Info, PieChart, Bell, List, Tag, Edit2, RefreshCw, Trash2, CalendarCheck, Edit3, X, Save,
  Facebook, Instagram, Linkedin, Twitter, Mail, Link as LinkIcon
} from 'lucide-vue-next'

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
  { value: 'scheduled', label: 'Programado', description: 'Pendiente de publicación', icon: Calendar },
  { value: 'published', label: 'Publicado', description: 'Ya publicado en redes', icon: CheckCircle2 },
  { value: 'failed', label: 'Fallido', description: 'Error en publicación', icon: AlertTriangle }
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
    'published': 'bg-emerald-100 text-emerald-700',
    'failed': 'bg-rose-100 text-rose-700'
  }
  return classes[status] || 'bg-slate-100 text-slate-700'
}

function getNetworkColor(network) {
  const colors = {
    'Instagram': 'bg-pink-50 text-pink-600',
    'Facebook': 'bg-blue-50 text-blue-600',
    'LinkedIn': 'bg-indigo-50 text-indigo-600',
    'Twitter': 'bg-slate-100 text-slate-900',
    'Email': 'bg-amber-50 text-amber-600'
  }
  return colors[network] || 'bg-slate-50 text-slate-600'
}

function getNetworkIcon(network) {
  const icons = {
    'Instagram': Instagram,
    'Facebook': Facebook,
    'LinkedIn': Linkedin,
    'Twitter': Twitter,
    'Email': Mail
  }
  return icons[network] || LinkIcon
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

<style scoped lang="postcss">
.btn-primary {
  @apply px-5 py-2.5 bg-kapital-dark text-white font-medium rounded-xl transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 flex items-center gap-2 justify-center;
}

.btn-secondary {
  @apply px-5 py-2.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 justify-center;
}

/* Scrollbar fina */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>