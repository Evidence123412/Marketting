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
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Mensajes</h1>
        <p class="text-slate-500 mt-1">Gestiona todas tus conversaciones en un solo lugar.</p>
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
          <MessageSquare :size="24" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ messages.length }}</p>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Mensajes</span>
        </div>
      </div>
      
      <div 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
        class="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-4"
      >
        <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 :size="24" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ messages.filter(m => m.status === 'replied').length }}</p>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Respondidos</span>
        </div>
      </div>

      <div 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
        class="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4"
      >
        <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
          <Clock :size="24" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ messages.filter(m => m.status === 'pending').length }}</p>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pendientes</span>
        </div>
      </div>

      <div 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }"
        class="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 flex items-center gap-4"
      >
        <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
          <UserCheck :size="24" />
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-900">{{ messages.filter(m => m.assigned).length }}</p>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Asignados</span>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
      <!-- Messages List -->
      <div class="lg:col-span-1 bg-white/80 backdrop-blur-sm border border-white/20 shadow-soft rounded-2xl overflow-hidden flex flex-col">
        <div class="p-4 border-b border-slate-100">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
            <input 
              v-model="searchMessage"
              type="text" 
              placeholder="Buscar mensajes..." 
              class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kapital-dark/20 focus:border-kapital-dark transition-all"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto scrollbar-thin">
          <div 
            v-for="msg in filteredMessages" 
            :key="msg.id" 
            @click="selectMessage(msg)"
            :class="[
              'p-4 cursor-pointer transition-all border-l-4 hover:bg-slate-50',
              selectedMessage?.id === msg.id 
                ? 'bg-blue-50/50 border-kapital-dark' 
                : 'border-transparent'
            ]"
          >
            <div class="flex gap-3 mb-1">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm', getStatusColor(msg.status)]">
                {{ msg.initials }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <h4 class="font-semibold text-sm text-slate-900 truncate">{{ msg.name }}</h4>
                  <span v-if="msg.status === 'pending'" class="w-2 h-2 bg-rose-500 rounded-full mt-1.5"></span>
                </div>
                <p class="text-xs text-slate-500 truncate">{{ msg.preview }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between pl-13 mt-1">
              <div class="flex items-center gap-1 text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                <component :is="getNetworkIcon(msg.network)" :size="12" />
                {{ msg.network }}
              </div>
              <small class="text-slate-400 text-[10px]">{{ msg.time }}</small>
            </div>
          </div>

          <div v-if="filteredMessages.length === 0" class="p-8 text-center text-slate-400 flex flex-col items-center">
            <Inbox :size="32" class="mb-2 opacity-50" />
            <p class="text-sm">No se encontraron mensajes</p>
          </div>
        </div>
      </div>

      <!-- Chat Panel -->
      <div class="lg:col-span-3 bg-white/80 backdrop-blur-sm border border-white/20 shadow-soft rounded-2xl overflow-hidden flex flex-col">
        <!-- Chat Header -->
        <div v-if="selectedMessage" class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <div class="flex items-center gap-4">
            <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm', getStatusColor(selectedMessage.status)]">
              {{ selectedMessage.initials }}
            </div>
            <div>
              <h3 class="font-bold text-slate-900">{{ selectedMessage.name }}</h3>
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <span class="flex items-center gap-1">
                  <component :is="getNetworkIcon(selectedMessage.network)" :size="12" />
                  {{ selectedMessage.network }}
                </span>
                <span>•</span>
                <span>{{ selectedMessage.time }}</span>
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button 
              @click="toggleAssign"
              :class="['px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all flex items-center gap-2', selectedMessage.assigned ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
            >
              <UserPlus :size="14" /> {{ selectedMessage.assigned ? 'Asignado' : 'Asignar' }}
            </button>
            <button 
              @click="markAsResolved"
              :class="['px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all flex items-center gap-2', selectedMessage.status === 'replied' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
            >
              <Check :size="14" /> {{ selectedMessage.status === 'replied' ? 'Resuelto' : 'Resolver' }}
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
          <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <MessageSquare :size="40" class="text-slate-300" />
          </div>
          <p class="text-lg font-semibold text-slate-600">Selecciona una conversación</p>
          <p class="text-sm text-slate-400 mt-1">Elige un mensaje de la lista para ver los detalles</p>
        </div>

        <!-- Chat Messages -->
        <div v-if="selectedMessage" class="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-6">
          <div v-for="(chat, idx) in selectedMessage.conversation" :key="idx" :class="['flex', chat.sender === 'me' ? 'justify-end' : 'justify-start']">
            <div :class="[
              'max-w-md px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed',
              chat.sender === 'me' 
                ? 'bg-kapital-dark text-white rounded-br-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
            ]">
              <p>{{ chat.text }}</p>
              <small :class="['text-[10px] mt-1 block font-medium opacity-70', chat.sender === 'me' ? 'text-blue-100' : 'text-slate-400']">
                {{ chat.time }}
              </small>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div v-if="selectedMessage" class="p-4 bg-white border-t border-slate-100">
          <div class="space-y-3">
            <div class="relative">
              <select v-model="selectedTemplate" class="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:border-kapital-dark appearance-none cursor-pointer">
                <option value="">✨ Respuesta personalizada</option>
                <option value="info">📋 Plantilla: Información general</option>
                <option value="promo">🏷️ Plantilla: Promoción especial</option>
                <option value="support">🛠️ Plantilla: Soporte técnico</option>
                <option value="follow">👋 Plantilla: Seguimiento</option>
              </select>
              <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="16" />
            </div>

            <div class="flex gap-3">
              <textarea 
                v-model="replyMessage"
                placeholder="Escribe tu respuesta..."
                rows="1"
                class="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kapital-dark/20 focus:border-kapital-dark resize-none transition-all"
              ></textarea>
              <button 
                @click="sendMessage"
                class="btn-primary px-4 h-auto rounded-xl shadow-lg shadow-kapital-dark/20"
              >
                <Send :size="18" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :enter="{ opacity: 1, scale: 1 }"
        class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20"
      >
        <h3 class="text-lg font-bold text-slate-900 mb-4">Asignar a asesor</h3>
        
        <div class="space-y-3 mb-6">
          <div 
            v-for="advisor in advisors"
            :key="advisor.id"
            @click="selectedAdvisor = advisor.id"
            :class="['p-3 border rounded-xl cursor-pointer transition-all flex items-center gap-3', selectedAdvisor === advisor.id ? 'bg-blue-50 border-kapital-dark ring-1 ring-kapital-dark' : 'border-slate-200 hover:border-kapital-dark/50 hover:bg-slate-50']"
          >
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-kapital-dark to-kapital-light-1 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {{ advisor.initials }}
            </div>
            <div>
              <p class="font-semibold text-slate-900 text-sm">{{ advisor.name }}</p>
              <p class="text-xs text-slate-500">{{ advisor.role }}</p>
            </div>
            <div v-if="selectedAdvisor === advisor.id" class="ml-auto text-kapital-dark">
              <CheckCircle2 :size="18" />
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="showAssignModal = false" class="btn-secondary flex-1">Cancelar</button>
          <button @click="confirmAssign" class="btn-primary flex-1">Confirmar Asignación</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  MessageSquare, CheckCircle2, Clock, UserCheck, Search, Inbox, 
  UserPlus, Check, Send, ChevronDown, Facebook, Instagram, Linkedin, Twitter, Mail 
} from 'lucide-vue-next'

const emit = defineEmits(['showToast'])

const selectedMessage = ref(null)
const searchMessage = ref('')
const replyMessage = ref('')
const selectedTemplate = ref('')
const showAssignModal = ref(false)
const selectedAdvisor = ref(null)

const messages = ref([
  { 
    id: 1, 
    initials: 'CA', 
    name: 'Carlos Alarcón', 
    preview: '¿Cuál es el precio?',
    time: 'Hace 5 min',
    network: 'Instagram',
    status: 'pending',
    assigned: false,
    conversation: [
      { sender: 'other', text: '¿Cuál es el precio del producto?', time: '10:30' },
      { sender: 'me', text: 'El precio es $99 USD + envío', time: '10:32' },
      { sender: 'other', text: '¿Cuánto cuesta el envío?', time: '10:35' }
    ]
  },
  { 
    id: 2, 
    initials: 'MR', 
    name: 'María Rodríguez', 
    preview: 'Información sobre servicios',
    time: 'Hace 20 min',
    network: 'Facebook',
    status: 'pending',
    assigned: false,
    conversation: [
      { sender: 'other', text: '¿Qué servicios ofrecen?', time: '09:45' },
      { sender: 'me', text: 'Ofrecemos marketing digital, consultoría y contenido', time: '09:47' }
    ]
  },
  { 
    id: 3, 
    initials: 'JP', 
    name: 'Juan Pérez', 
    preview: 'Quiero contratar el plan pro',
    time: 'Hace 45 min',
    network: 'WhatsApp',
    status: 'replied',
    assigned: true,
    conversation: [
      { sender: 'other', text: 'Quiero contratar el plan pro', time: '08:30' },
      { sender: 'me', text: 'Excelente, te envío los detalles', time: '08:32' },
      { sender: 'other', text: 'Perfecto, gracias!', time: '08:35' },
      { sender: 'me', text: 'De nada, quedas registrado. Bienvenido!', time: '08:36' }
    ]
  },
  { 
    id: 4, 
    initials: 'LG', 
    name: 'Laura García', 
    preview: '¿Tienen descuentos para empresas?',
    time: 'Hace 1h',
    network: 'LinkedIn',
    status: 'pending',
    assigned: false,
    conversation: [
      { sender: 'other', text: '¿Tienen descuentos para empresas?', time: '07:15' }
    ]
  },
  { 
    id: 5, 
    initials: 'RL', 
    name: 'Roberto López', 
    preview: 'Problema con mi suscripción',
    time: 'Hace 2h',
    network: 'Email',
    status: 'pending',
    assigned: true,
    conversation: [
      { sender: 'other', text: 'Hola, tengo un problema con mi suscripción', time: '06:00' },
      { sender: 'me', text: '¿Cuál es el problema? Te ayudaremos', time: '06:05' }
    ]
  },
  { 
    id: 6, 
    initials: 'AC', 
    name: 'Andrea Castillo', 
    preview: 'Felicidades por el contenido',
    time: 'Hace 3h',
    network: 'Twitter',
    status: 'replied',
    assigned: false,
    conversation: [
      { sender: 'other', text: 'Felicidades por el contenido, muy bueno!', time: '05:00' },
      { sender: 'me', text: '¡Gracias Andrea! Nos alegra te haya gustado', time: '05:03' }
    ]
  }
])

const advisors = ref([
  { id: 1, initials: 'JC', name: 'Juan Carlos', role: 'Asesor Senior' },
  { id: 2, initials: 'MG', name: 'María García', role: 'Asesor Junior' },
  { id: 3, initials: 'LP', name: 'Luis Peña', role: 'Especialista' },
  { id: 4, initials: 'SC', name: 'Sofia Chen', role: 'Community Manager' }
])

const filteredMessages = computed(() => {
  return messages.value.filter(msg => 
    msg.name.toLowerCase().includes(searchMessage.value.toLowerCase()) ||
    msg.preview.toLowerCase().includes(searchMessage.value.toLowerCase())
  )
})

function getStatusColor(status) {
  const colors = {
    'pending': 'bg-amber-500',
    'replied': 'bg-emerald-500',
    'assigned': 'bg-purple-500'
  }
  return colors[status] || 'bg-kapital-dark'
}

function getNetworkIcon(network) {
  const icons = {
    'Facebook': Facebook,
    'Instagram': Instagram,
    'LinkedIn': Linkedin,
    'Twitter': Twitter,
    'Email': Mail,
    'WhatsApp': MessageSquare
  }
  return icons[network] || MessageSquare
}

function selectMessage(msg) {
  selectedMessage.value = msg
  selectedAdvisor.value = null
}

function sendMessage() {
  if (!replyMessage.value.trim()) {
    emit('showToast', 'Por favor escribe un mensaje', 'error')
    return
  }

  selectedMessage.value.conversation.push({
    sender: 'me',
    text: replyMessage.value,
    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  })

  replyMessage.value = ''
  selectedTemplate.value = ''
  emit('showToast', 'Mensaje enviado correctamente')
}

function toggleAssign() {
  showAssignModal.value = true
}

function confirmAssign() {
  if (!selectedAdvisor.value) {
    emit('showToast', 'Por favor selecciona un asesor', 'error')
    return
  }

  const advisor = advisors.value.find(a => a.id === selectedAdvisor.value)
  selectedMessage.value.assigned = true
  showAssignModal.value = false
  emit('showToast', `Asignado a ${advisor.name}`)
}

function markAsResolved() {
  if (selectedMessage.value.status === 'replied') {
    selectedMessage.value.status = 'pending'
    emit('showToast', 'Marcado como pendiente')
  } else {
    selectedMessage.value.status = 'replied'
    emit('showToast', 'Marcado como resuelto')
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
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>