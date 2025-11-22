<template>
  <div class="flex flex-col h-[calc(100vh-2rem)] bg-slate-50 font-sans text-slate-900">
    
    <div class="flex-none mb-6">
      <div class="flex justify-between items-end mb-6 px-1">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Interacciones</h1>
          <p class="text-sm text-slate-500 mt-1">Gestión centralizada de comunicaciones.</p>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-row divide-x divide-slate-100 overflow-hidden">
        
        <div class="flex-1 py-4 px-6 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
          <div class="p-2 rounded-lg bg-blue-50 text-blue-600">
            <MessageSquare :size="20" stroke-width="2" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900 leading-none">{{ totalMessages }}</p>
            <p class="text-xs font-medium text-slate-500 mt-1">Totales</p>
          </div>
        </div>

        <div class="flex-1 py-4 px-6 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
          <div class="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 :size="20" stroke-width="2" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900 leading-none">{{ repliedMessages }}</p>
            <p class="text-xs font-medium text-slate-500 mt-1">Resueltos</p>
          </div>
        </div>

        <div class="flex-1 py-4 px-6 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
          <div class="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Clock :size="20" stroke-width="2" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900 leading-none">{{ pendingMessages }}</p>
            <p class="text-xs font-medium text-slate-500 mt-1">Pendientes</p>
          </div>
        </div>

        <div class="flex-1 py-4 px-6 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
          <div class="p-2 rounded-lg bg-purple-50 text-purple-600">
            <UserCheck :size="20" stroke-width="2" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900 leading-none">{{ assignedMessages }}</p>
            <p class="text-xs font-medium text-slate-500 mt-1">Asignados</p>
          </div>
        </div>

      </div>
    </div>

    <div class="flex-1 min-h-0 flex gap-6 pb-2">
      
      <div class="w-80 xl:w-96 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        <div class="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Buscar..." 
              class="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm font-medium text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto scrollbar-thin">
          <div 
            v-for="convo in filteredConversations" 
            :key="convo.id" 
            @click="selectConversation(convo)"
            :class="[
              'px-4 py-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 group relative',
              selectedConversation?.id === convo.id ? 'bg-blue-50/30' : ''
            ]"
          >
            <div v-if="selectedConversation?.id === convo.id" class="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
            
            <div class="flex gap-3">
              <div class="relative flex-shrink-0">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white', getStatusColor(convo.status)]">
                  {{ convo.leadInitials }}
                </div>
                <div class="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-slate-100">
                   <component :is="getNetworkIcon(convo.channel)" :size="10" :class="getNetworkColor(convo.channel)" />
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-baseline mb-1">
                  <h4 :class="['text-sm truncate', selectedConversation?.id === convo.id ? 'font-bold text-slate-900' : 'font-medium text-slate-700']">
                    {{ convo.leadName }}
                  </h4>
                  <span class="text-[10px] text-slate-400">{{ formatTimeShort(convo.lastActivity) }}</span>
                </div>
                <p :class="['text-xs truncate line-clamp-1', convo.status === 'pending' ? 'text-slate-800 font-medium' : 'text-slate-500']">
                  {{ convo.preview }}
                </p>
              </div>
            </div>
          </div>
          
          <div v-if="filteredConversations.length === 0" class="p-8 text-center text-slate-400 mt-10">
            <Inbox :size="24" class="mx-auto mb-2 opacity-50" />
            <p class="text-xs">Sin resultados</p>
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative">
        
        <template v-if="selectedConversation">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
            <div class="flex items-center gap-4">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white', getStatusColor(selectedConversation.status)]">
                {{ selectedConversation.leadInitials }}
              </div>
              <div>
                <h3 class="font-bold text-slate-900 text-sm">{{ selectedConversation.leadName }}</h3>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <component :is="getNetworkIcon(selectedConversation.channel)" :size="12" />
                  <span>{{ selectedConversation.channel }}</span>
                  <span class="text-slate-300">•</span>
                  <span>{{ selectedConversation.leadEmail }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <button 
                @click="toggleAssign"
                class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors flex items-center gap-2"
              >
                <UserPlus :size="14" /> {{ selectedConversation.assignedTo ? 'Reasignar' : 'Asignar' }}
              </button>
              <button 
                @click="toggleResolve"
                :class="['px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-2', selectedConversation.status === 'replied' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'text-slate-600 hover:bg-slate-50 border-slate-200']"
              >
                <Check :size="14" /> {{ selectedConversation.status === 'replied' ? 'Resuelto' : 'Resolver' }}
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-4" ref="chatContainer">
            <div v-for="(msg, idx) in selectedConversation.messages" :key="idx" :class="['flex w-full', msg.sender === 'me' || msg.sender === 'user' ? 'justify-end' : 'justify-start']">
              <div :class="['max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm', 
                msg.sender === 'me' || msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
              ]">
                <p>{{ msg.text }}</p>
                <span :class="['text-[10px] block mt-1 opacity-70', msg.sender === 'me' || msg.sender === 'user' ? 'text-blue-100 text-right' : 'text-slate-400']">
                  {{ formatTimeMessage(msg.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <div class="p-4 bg-white border-t border-slate-100">
            <div class="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
               <button @click="setTemplate('info')" class="template-pill text-blue-600 bg-blue-50 hover:bg-blue-100">Info</button>
               <button @click="setTemplate('promo')" class="template-pill text-purple-600 bg-purple-50 hover:bg-purple-100">Promo</button>
               <button @click="setTemplate('support')" class="template-pill text-amber-600 bg-amber-50 hover:bg-amber-100">Soporte</button>
            </div>

            <div class="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
              <textarea 
                v-model="replyMessage"
                rows="1"
                @input="autoResize"
                @keydown.enter.exact.prevent="sendMessage"
                placeholder="Escribe un mensaje..."
                class="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-800 px-2 py-1.5 resize-none max-h-32 placeholder:text-slate-400"
              ></textarea>
              <div class="flex gap-1 pb-1">
                <button class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"><Paperclip :size="16"/></button>
                <button 
                  @click="sendMessage"
                  :disabled="!replyMessage.trim()"
                  class="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Send :size="16" />
                </button>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <MessageSquare :size="48" class="mb-4 opacity-20" />
            <p class="text-sm font-medium text-slate-500">Selecciona una conversación</p>
          </div>
        </template>
      </div>
    </div>

    <div v-if="showAssignModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden">
        <div class="p-4 border-b border-slate-100">
          <h3 class="font-bold text-slate-900">Asignar Lead</h3>
        </div>
        <div class="p-2 max-h-64 overflow-y-auto">
          <button 
            v-for="advisor in advisors"
            :key="advisor"
            @click="confirmAssign(advisor)"
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 flex items-center gap-3 transition-colors group"
          >
            <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600">
              {{ advisor.charAt(0) }}
            </div>
            <span class="text-sm font-medium text-slate-700 group-hover:text-slate-900">{{ advisor }}</span>
            <CheckCircle2 v-if="selectedConversation?.assignedTo === advisor" :size="16" class="ml-auto text-blue-600" />
          </button>
        </div>
        <div class="p-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button @click="showAssignModal = false" class="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5">Cancelar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { 
  MessageSquare, CheckCircle2, Clock, UserCheck, Search, Inbox, 
  UserPlus, Check, Send, Facebook, Instagram, Linkedin, Twitter, Mail,
  Paperclip, Smile
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
.template-pill {
    @apply text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer;
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
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>