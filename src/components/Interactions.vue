<template>
  <div class="flex flex-col h-[calc(100vh-2rem)] bg-slate-50/50">
    
    <div 
      v-motion
      :initial="{ opacity: 0, y: -10 }"
      :enter="{ opacity: 1, y: 0 }"
      class="flex-none mb-6"
    >
      <div class="flex justify-between items-end mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Interacciones</h1>
          <p class="text-slate-500 text-sm mt-1">Gestiona tus conversaciones y tickets de soporte.</p>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="stat-card bg-white border-l-4 border-blue-500">
          <div class="p-2 bg-blue-50 text-blue-600 rounded-lg"><MessageSquare :size="20" /></div>
          <div>
            <p class="text-2xl font-bold text-slate-900 leading-none">{{ messages.length }}</p>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Totales</span>
          </div>
        </div>
        
        <div class="stat-card bg-white border-l-4 border-emerald-500">
          <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 :size="20" /></div>
          <div>
            <p class="text-2xl font-bold text-slate-900 leading-none">{{ messages.filter(m => m.status === 'replied').length }}</p>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resueltos</span>
          </div>
        </div>

        <div class="stat-card bg-white border-l-4 border-amber-500">
          <div class="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock :size="20" /></div>
          <div>
            <p class="text-2xl font-bold text-slate-900 leading-none">{{ messages.filter(m => m.status === 'pending').length }}</p>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pendientes</span>
          </div>
        </div>

        <div class="stat-card bg-white border-l-4 border-purple-500">
          <div class="p-2 bg-purple-50 text-purple-600 rounded-lg"><UserCheck :size="20" /></div>
          <div>
            <p class="text-2xl font-bold text-slate-900 leading-none">{{ messages.filter(m => m.assigned).length }}</p>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asignados</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 min-h-0 flex gap-6">
      
      <div class="w-full lg:w-80 xl:w-96 flex flex-col bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div class="p-4 border-b border-slate-100 bg-white z-10">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
            <input 
              v-model="searchMessage"
              type="text" 
              placeholder="Buscar chat..." 
              class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kapital-dark/10 focus:border-kapital-dark transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          <div 
            v-for="msg in filteredMessages" 
            :key="msg.id" 
            @click="selectMessage(msg)"
            :class="[
              'group relative p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent',
              selectedMessage?.id === msg.id 
                ? 'bg-slate-50 border-slate-200 shadow-sm' 
                : 'hover:bg-slate-50/80 hover:border-slate-100'
            ]"
          >
            <div v-if="selectedMessage?.id === msg.id" class="absolute left-0 top-3 bottom-3 w-1 bg-kapital-night rounded-r-full"></div>

            <div class="flex gap-3 pl-2">
              <div class="relative">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white', getStatusColor(msg.status)]">
                  {{ msg.initials }}
                </div>
                <div class="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                   <component :is="getNetworkIcon(msg.network)" :size="10" class="text-slate-500" />
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <h4 :class="['text-sm truncate pr-2', selectedMessage?.id === msg.id ? 'font-bold text-slate-900' : 'font-medium text-slate-700']">
                    {{ msg.name }}
                  </h4>
                  <span class="text-[10px] text-slate-400 whitespace-nowrap">{{ msg.time }}</span>
                </div>
                
                <p class="text-xs text-slate-500 truncate mt-0.5 group-hover:text-slate-600 transition-colors">
                  {{ msg.preview }}
                </p>

                <div class="flex items-center gap-2 mt-2">
                   <span v-if="msg.status === 'pending'" class="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded border border-rose-100 uppercase tracking-wide">Pendiente</span>
                   <span v-if="msg.assigned" class="px-1.5 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded border border-purple-100 uppercase tracking-wide">Asignado</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredMessages.length === 0" class="py-12 text-center px-4">
            <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Inbox :size="20" class="text-slate-300" />
            </div>
            <p class="text-sm text-slate-500 font-medium">Sin resultados</p>
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden relative">
        
        <template v-if="selectedMessage">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div class="flex items-center gap-4">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm', getStatusColor(selectedMessage.status)]">
                {{ selectedMessage.initials }}
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-base">{{ selectedMessage.name }}</h3>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <span class="flex items-center gap-1 font-medium text-slate-700">
                    <component :is="getNetworkIcon(selectedMessage.network)" :size="12" />
                    {{ selectedMessage.network }}
                  </span>
                  <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>Última actividad {{ selectedMessage.time }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <div class="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
              <button 
                @click="toggleAssign"
                :class="['btn-action', selectedMessage.assigned ? 'bg-purple-50 text-purple-700 border-purple-200' : 'text-slate-600 hover:bg-slate-50']"
                title="Asignar Agente"
              >
                <UserPlus :size="16" />
                <span class="hidden sm:inline">{{ selectedMessage.assigned ? 'Reasignar' : 'Asignar' }}</span>
              </button>
              <button 
                @click="markAsResolved"
                :class="['btn-action', selectedMessage.status === 'replied' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'text-slate-600 hover:bg-slate-50']"
                title="Marcar Estado"
              >
                <Check :size="16" />
                <span class="hidden sm:inline">{{ selectedMessage.status === 'replied' ? 'Resuelto' : 'Resolver' }}</span>
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto bg-slate-50/30 p-6 space-y-6 custom-pattern">
            <div v-for="(chat, idx) in selectedMessage.conversation" :key="idx" :class="['flex group', chat.sender === 'me' ? 'justify-end' : 'justify-start']">
              <div v-if="chat.sender !== 'me'" class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 mr-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                {{ selectedMessage.initials }}
              </div>

              <div class="flex flex-col max-w-[75%]">
                <div :class="[
                  'px-5 py-3 shadow-sm text-sm relative leading-relaxed',
                  chat.sender === 'me' 
                    ? 'bg-kapital-night text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm'
                ]">
                  <p>{{ chat.text }}</p>
                </div>
                <span :class="['text-[10px] mt-1 font-medium opacity-60 px-1', chat.sender === 'me' ? 'text-right text-slate-500' : 'text-left text-slate-400']">
                  {{ chat.time }}
                </span>
              </div>
            </div>
          </div>

          <div class="p-4 bg-white border-t border-slate-100">
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-kapital-dark/10 focus-within:border-kapital-dark transition-all shadow-sm">
              
              <div v-if="!replyMessage" class="flex gap-2 px-2 py-1 overflow-x-auto scrollbar-hide mb-1 border-b border-slate-100/50">
                 <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center mr-2">Plantillas:</span>
                 <button @click="setTemplate('info')" class="chip-template text-blue-600 bg-blue-50 hover:bg-blue-100">Info General</button>
                 <button @click="setTemplate('promo')" class="chip-template text-purple-600 bg-purple-50 hover:bg-purple-100">Promoción</button>
                 <button @click="setTemplate('support')" class="chip-template text-amber-600 bg-amber-50 hover:bg-amber-100">Soporte</button>
              </div>

              <div class="flex items-end gap-2">
                <textarea 
                  v-model="replyMessage"
                  placeholder="Escribe tu respuesta..."
                  rows="1"
                  @input="autoResize"
                  class="flex-1 bg-transparent border-none text-sm text-slate-700 focus:ring-0 px-3 py-2 resize-none max-h-32 placeholder:text-slate-400"
                ></textarea>
                <button 
                  @click="sendMessage"
                  :disabled="!replyMessage.trim()"
                  class="p-2 rounded-lg bg-kapital-night text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-1 shadow-md shadow-slate-900/10" 
                >
                  <Send :size="18" />
                </button>
              </div>
            </div>
            <div class="flex justify-between mt-2 px-1">
                <p class="text-[10px] text-slate-400">Presiona Enter para enviar</p>
                <div class="flex gap-3">
                    <button class="text-slate-400 hover:text-slate-600 transition-colors"><Paperclip :size="14"/></button>
                    <button class="text-slate-400 hover:text-slate-600 transition-colors"><Smile :size="14"/></button>
                </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex-1 flex flex-col items-center justify-center bg-slate-50/30">
            <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-soft mb-6">
              <MessageSquare :size="40" class="text-slate-300" />
            </div>
            <h3 class="text-xl font-bold text-slate-800">Tus Conversaciones</h3>
            <p class="text-sm text-slate-500 mt-2 max-w-xs text-center">Selecciona un chat de la lista para ver el historial, responder mensajes o asignar tareas.</p>
          </div>
        </template>
      </div>
    </div>

    <div v-if="showAssignModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div 
        v-motion
        :initial="{ opacity: 0, scale: 0.95, y: 10 }"
        :enter="{ opacity: 1, scale: 1, y: 0 }"
        class="bg-white rounded-2xl p-0 max-w-md w-full shadow-2xl border border-white/20 overflow-hidden"
      >
        <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 class="text-lg font-bold text-slate-900">Asignar conversación</h3>
            <p class="text-sm text-slate-500 mt-1">Selecciona un miembro del equipo para este ticket.</p>
        </div>
        
        <div class="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          <div 
            v-for="advisor in advisors"
            :key="advisor.id"
            @click="selectedAdvisor = advisor.id"
            :class="['p-3 border rounded-xl cursor-pointer transition-all flex items-center gap-3 group', selectedAdvisor === advisor.id ? 'bg-kapital-night/5 border-kapital-night ring-1 ring-kapital-night' : 'border-slate-200 hover:border-kapital-dark/30 hover:bg-slate-50']"
          >
            <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200 group-hover:scale-105 transition-transform">
              {{ advisor.initials }}
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center">
                  <p class="font-bold text-slate-900 text-sm">{{ advisor.name }}</p>
                  <span v-if="selectedAdvisor === advisor.id" class="text-kapital-dark"><CheckCircle2 :size="16" /></span>
              </div>
              <p class="text-xs text-slate-500">{{ advisor.role }}</p>
            </div>
          </div>
        </div>

        <div class="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button @click="showAssignModal = false" class="btn-secondary flex-1">Cancelar</button>
          <button @click="confirmAssign" class="btn-primary flex-1">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  MessageSquare, CheckCircle2, Clock, UserCheck, Search, Inbox, 
  UserPlus, Check, Send, ChevronDown, Facebook, Instagram, Linkedin, Twitter, Mail,
  Paperclip, Smile
} from 'lucide-vue-next'

const emit = defineEmits(['showToast'])

const selectedMessage = ref(null)
const searchMessage = ref('')
const replyMessage = ref('')
const showAssignModal = ref(false)
const selectedAdvisor = ref(null)

// Función para auto-ajustar el textarea
const autoResize = (e) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
}

// Setear plantilla rápida
const setTemplate = (type) => {
    const templates = {
        info: "¡Hola! Gracias por contactarnos. Nuestro horario de atención es de 9am a 6pm.",
        promo: "Tenemos un descuento especial del 20% esta semana. ¿Te gustaría saber más?",
        support: "Lamentamos el inconveniente. Por favor descríbenos el error para ayudarte."
    };
    replyMessage.value = templates[type] || "";
}

const messages = ref([
  { 
    id: 1, 
    initials: 'CA', 
    name: 'Carlos Alarcón', 
    preview: '¿Cuál es el precio?',
    time: '09:30',
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
    time: '10:15',
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
    time: 'Ayer',
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
    time: 'Ayer',
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
    time: '19 Nov',
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
    time: '18 Nov',
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
  return colors[status] || 'bg-kapital-night'
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
.stat-card {
  @apply rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow;
}

.btn-action {
  @apply px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all flex items-center gap-2 border border-transparent;
}

/* Botón Primario (Kapital Night) */
.btn-primary {
  @apply px-5 py-2.5 bg-kapital-night text-white font-medium rounded-xl transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-kapital-night/30 active:scale-95 flex items-center gap-2 justify-center;
}

/* Botón Secundario */
.btn-secondary {
  @apply px-5 py-2.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 justify-center;
}

/* Chip de plantilla */
.chip-template {
    @apply text-[10px] font-bold px-2 py-1 rounded-md transition-colors whitespace-nowrap border border-transparent hover:border-current;
}

/* Pattern sutil para el fondo del chat */
.custom-pattern {
    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
    background-size: 20px 20px;
}

/* Scrollbar */
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

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>