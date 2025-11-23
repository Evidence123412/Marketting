<template>
  <div class="flex flex-col h-[calc(100vh-2rem)] p-2 space-y-6">
    
    <!-- Header & Stats -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="flex-none"
    >
      <div class="flex justify-between items-end mb-6 px-2">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">Interacciones</h1>
          <p class="text-slate-500 mt-1 font-medium">Centro de comunicaciones unificado</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Stat Card 1 -->
        <div class="card group hover:border-kapital-dark/30 transition-colors">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <MessageSquare :size="24" stroke-width="2" />
            </div>
            <div>
              <p class="text-3xl font-bold text-slate-900 leading-none">{{ totalMessages }}</p>
              <p class="text-sm font-medium text-slate-500 mt-1">Mensajes Totales</p>
            </div>
          </div>
        </div>

        <!-- Stat Card 2 -->
        <div class="card group hover:border-kapital-dark/30 transition-colors">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 :size="24" stroke-width="2" />
            </div>
            <div>
              <p class="text-3xl font-bold text-slate-900 leading-none">{{ repliedMessages }}</p>
              <p class="text-sm font-medium text-slate-500 mt-1">Resueltos</p>
            </div>
          </div>
        </div>

        <!-- Stat Card 3 -->
        <div class="card group hover:border-kapital-dark/30 transition-colors">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Clock :size="24" stroke-width="2" />
            </div>
            <div>
              <p class="text-3xl font-bold text-slate-900 leading-none">{{ pendingMessages }}</p>
              <p class="text-sm font-medium text-slate-500 mt-1">Pendientes</p>
            </div>
          </div>
        </div>

        <!-- Stat Card 4 -->
        <div class="card group hover:border-kapital-dark/30 transition-colors">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <UserCheck :size="24" stroke-width="2" />
            </div>
            <div>
              <p class="text-3xl font-bold text-slate-900 leading-none">{{ assignedMessages }}</p>
              <p class="text-sm font-medium text-slate-500 mt-1">Asignados</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 500 } }"
      class="flex-1 min-h-0 flex gap-6 pb-2"
    >
      
      <!-- Sidebar List -->
      <div class="w-80 xl:w-96 flex flex-col card p-0 overflow-hidden">
        
        <div class="p-4 border-b border-slate-100/50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div class="relative group">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" :size="18" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Buscar conversación..." 
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border-none rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          <div 
            v-for="convo in filteredConversations" 
            :key="convo.id" 
            @click="selectConversation(convo)"
            :class="[
              'px-4 py-3 rounded-xl cursor-pointer transition-all border border-transparent',
              selectedConversation?.id === convo.id 
                ? 'bg-blue-50 border-blue-100 shadow-sm' 
                : 'hover:bg-slate-50 hover:border-slate-100/50'
            ]"
          >
            <div class="flex gap-3 items-start">
              <div class="relative flex-shrink-0">
                <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm', getStatusColor(convo.status)]">
                  {{ convo.leadInitials }}
                </div>
                <div class="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-slate-100">
                   <component :is="getNetworkIcon(convo.channel)" :size="12" :class="getNetworkColor(convo.channel)" />
                </div>
              </div>

              <div class="flex-1 min-w-0 pt-0.5">
                <div class="flex justify-between items-baseline mb-0.5">
                  <h4 :class="['text-sm truncate', selectedConversation?.id === convo.id ? 'font-bold text-slate-900' : 'font-semibold text-slate-700']">
                    {{ convo.leadName }}
                  </h4>
                  <span class="text-[10px] font-medium text-slate-400">{{ formatTimeShort(convo.lastActivity) }}</span>
                </div>
                <p :class="['text-xs truncate leading-relaxed', convo.status === 'pending' ? 'text-slate-900 font-medium' : 'text-slate-500']">
                  {{ convo.preview }}
                </p>
              </div>
            </div>
          </div>
          
          <div v-if="filteredConversations.length === 0" class="flex flex-col items-center justify-center h-64 text-slate-400">
            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <Inbox :size="24" class="opacity-50" />
            </div>
            <p class="text-sm font-medium">No se encontraron mensajes</p>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="flex-1 flex flex-col card p-0 overflow-hidden relative">
        
        <template v-if="selectedConversation">
          <!-- Chat Header -->
          <div class="px-6 py-4 border-b border-slate-100/50 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-20">
            <div class="flex items-center gap-4">
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-sm', getStatusColor(selectedConversation.status)]">
                {{ selectedConversation.leadInitials }}
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-base">{{ selectedConversation.leadName }}</h3>
                <div class="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
                  <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100">
                    <component :is="getNetworkIcon(selectedConversation.channel)" :size="12" />
                    <span>{{ selectedConversation.channel }}</span>
                  </div>
                  <span class="text-slate-300">•</span>
                  <span>{{ selectedConversation.leadEmail }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <button 
                @click="toggleAssign"
                class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg border border-slate-200 transition-all flex items-center gap-2 shadow-sm"
              >
                <UserPlus :size="16" /> 
                {{ selectedConversation.assignedTo ? 'Reasignar' : 'Asignar' }}
              </button>
              <button 
                @click="toggleResolve"
                :class="[
                  'px-4 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2 shadow-sm', 
                  selectedConversation.status === 'replied' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                ]"
              >
                <Check :size="16" /> 
                {{ selectedConversation.status === 'replied' ? 'Resuelto' : 'Marcar Resuelto' }}
              </button>
              <button class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <MoreVertical :size="20" />
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto bg-slate-50/30 p-6 space-y-6" ref="chatContainer">
            <div v-for="(msg, idx) in selectedConversation.messages" :key="idx" :class="['flex w-full group', msg.sender === 'me' || msg.sender === 'user' ? 'justify-end' : 'justify-start']">
              <div :class="['max-w-[70%] flex flex-col', msg.sender === 'me' || msg.sender === 'user' ? 'items-end' : 'items-start']">
                <div :class="['px-5 py-3.5 text-sm leading-relaxed shadow-sm relative', 
                  msg.sender === 'me' || msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm'
                ]">
                  <p>{{ msg.text }}</p>
                </div>
                <span class="text-[10px] font-medium text-slate-400 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ formatTimeMessage(msg.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="p-5 bg-white/50 backdrop-blur-sm border-t border-slate-100/50">
            <div class="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
               <button @click="setTemplate('info')" class="template-pill ring-1 ring-blue-100 text-blue-600 bg-blue-50 hover:bg-blue-100">👋 Info General</button>
               <button @click="setTemplate('promo')" class="template-pill ring-1 ring-purple-100 text-purple-600 bg-purple-50 hover:bg-purple-100">🏷️ Promoción</button>
               <button @click="setTemplate('support')" class="template-pill ring-1 ring-amber-100 text-amber-600 bg-amber-50 hover:bg-amber-100">🛠️ Soporte</button>
            </div>

            <div class="flex items-end gap-3 bg-white border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all shadow-sm">
              <button class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <Smile :size="20"/>
              </button>
              <button class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <Paperclip :size="20"/>
              </button>
              
              <textarea 
                v-model="replyMessage"
                rows="1"
                @input="autoResize"
                @keydown.enter.exact.prevent="sendMessage"
                placeholder="Escribe tu respuesta..."
                class="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-800 px-2 py-2.5 resize-none max-h-32 placeholder:text-slate-400"
              ></textarea>
              
              <button 
                @click="sendMessage"
                :disabled="!replyMessage.trim()"
                class="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Send :size="18" />
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 bg-slate-50/30">
            <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <MessageSquare :size="40" class="text-slate-300" />
            </div>
            <h3 class="text-lg font-bold text-slate-700 mb-2">Selecciona una conversación</h3>
            <p class="text-sm text-slate-500 max-w-xs text-center">Elige un chat de la lista para ver el historial y responder mensajes.</p>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal Asignación -->
    <Transition name="fade">
      <div v-if="showAssignModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all scale-100">
          <div class="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 class="font-bold text-lg text-slate-900">Asignar Lead</h3>
            <button @click="showAssignModal = false" class="text-slate-400 hover:text-slate-600"><X :size="20"/></button>
          </div>
          <div class="p-3 max-h-72 overflow-y-auto">
            <button 
              v-for="advisor in advisors"
              :key="advisor"
              @click="confirmAssign(advisor)"
              class="w-full text-left px-4 py-3.5 rounded-xl hover:bg-slate-50 flex items-center gap-4 transition-all group border border-transparent hover:border-slate-100"
            >
              <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                {{ advisor.charAt(0) }}
              </div>
              <span class="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{{ advisor }}</span>
              <CheckCircle2 v-if="selectedConversation?.assignedTo === advisor" :size="20" class="ml-auto text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { 
  MessageSquare, CheckCircle2, Clock, UserCheck, Search, Inbox, 
  UserPlus, Check, Send, Facebook, Instagram, Linkedin, Twitter, Mail,
  Paperclip, Smile, MoreVertical, X
} from 'lucide-vue-next'
import { crmService } from '../services/crmService'

const emit = defineEmits(['showToast'])

// State
const rawConversations = ref([])
const advisors = ref([])
const selectedConversation = ref(null)
const searchQuery = ref('')
const replyMessage = ref('')
const showAssignModal = ref(false)
const chatContainer = ref(null)

// --- Carga de Datos ---
onMounted(async () => {
  await loadData()
})

async function loadData() {
  const leads = await crmService.getLeads()
  const users = await crmService.getUsers()
  advisors.value = users

  const allConvos = []
  leads.forEach(lead => {
    if (lead.conversations && lead.conversations.length > 0) {
      lead.conversations.forEach(conv => {
        allConvos.push({
          ...conv,
          leadId: lead.id,
          leadName: lead.name,
          leadInitials: lead.initials,
          leadEmail: lead.email,
          assignedTo: lead.assignedTo 
        })
      })
    }
  })

  rawConversations.value = allConvos.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
}

// --- Computeds ---
const filteredConversations = computed(() => {
  if (!searchQuery.value) return rawConversations.value
  const query = searchQuery.value.toLowerCase()
  return rawConversations.value.filter(c => 
    c.leadName.toLowerCase().includes(query) ||
    c.preview.toLowerCase().includes(query)
  )
})

const totalMessages = computed(() => rawConversations.value.length)
const repliedMessages = computed(() => rawConversations.value.filter(c => c.status === 'replied').length)
const pendingMessages = computed(() => rawConversations.value.filter(c => c.status === 'pending').length)
const assignedMessages = computed(() => rawConversations.value.filter(c => c.assignedTo).length)

// --- Actions ---
function selectConversation(convo) {
  selectedConversation.value = convo
  scrollToBottom()
}

async function sendMessage() {
  if (!replyMessage.value.trim() || !selectedConversation.value) return

  try {
    const leadId = selectedConversation.value.leadId
    const text = replyMessage.value
    
    await crmService.addMessageToConversation(leadId, text, 'me')
    
    const now = new Date().toISOString()
    selectedConversation.value.messages.push({
      text: text,
      sender: 'me',
      createdAt: now
    })
    selectedConversation.value.preview = text
    selectedConversation.value.lastActivity = now
    selectedConversation.value.status = 'replied'

    replyMessage.value = ''
    scrollToBottom()
    emit('showToast', 'Mensaje enviado')
    
  } catch (error) {
    console.error(error)
    emit('showToast', 'Error al enviar mensaje', 'error')
  }
}

function setTemplate(type) {
  const templates = {
    info: "¡Hola! Gracias por escribirnos. Nuestro horario de atención es de 9am a 6pm.",
    promo: "Tenemos un descuento especial del 20% disponible solo por hoy.",
    support: "Lamentamos el inconveniente. Por favor descríbenos el error para ayudarte."
  }
  replyMessage.value = templates[type] || ""
}

function toggleAssign() {
  showAssignModal.value = true
}

async function confirmAssign(advisorName) {
  if (selectedConversation.value) {
    selectedConversation.value.assignedTo = advisorName
    showAssignModal.value = false
    emit('showToast', `Asignado a ${advisorName}`)
  }
}

function toggleResolve() {
  if (!selectedConversation.value) return
  const newStatus = selectedConversation.value.status === 'replied' ? 'pending' : 'replied'
  selectedConversation.value.status = newStatus
  emit('showToast', newStatus === 'replied' ? 'Ticket resuelto' : 'Reabierto como pendiente')
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const autoResize = (e) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
}

// --- UI Helpers ---
function formatTimeShort(isoDate) {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function formatTimeMessage(isoDate) {
  if (!isoDate) return ''
  return new Date(isoDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function getStatusColor(status) {
  const colors = {
    'pending': 'bg-amber-500',
    'replied': 'bg-emerald-500',
    'new': 'bg-blue-500'
  }
  return colors[status] || 'bg-slate-400'
}

function getNetworkIcon(network) {
  const icons = {
    'Facebook': Facebook, 'Instagram': Instagram, 'LinkedIn': Linkedin, 'Twitter': Twitter, 'Email': Mail, 'WhatsApp': MessageSquare
  }
  return icons[network] || MessageSquare
}

function getNetworkColor(network) {
  const colors = {
    'Facebook': 'text-blue-600', 'Instagram': 'text-pink-600', 'LinkedIn': 'text-blue-700', 'Twitter': 'text-slate-900', 'Email': 'text-amber-600'
  }
  return colors[network] || 'text-slate-500'
}
</script>

<style scoped lang="postcss">
.card {
  @apply bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-soft;
}

.template-pill {
    @apply text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap;
}

/* Scrollbar fina */
.scrollbar-thin::-webkit-scrollbar {
  width: 5px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>