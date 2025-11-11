<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>Interacciones</h1>
      <p>Gestiona tus mensajes y conversaciones</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-comments text-kapital-dark text-xl"></i>
          <span class="text-sm text-gray-600">Total Mensajes</span>
        </div>
        <p class="text-2xl font-bold text-kapital-dark">{{ messages.length }}</p>
      </div>
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-check-circle text-green-600 text-xl"></i>
          <span class="text-sm text-gray-600">Respondidos</span>
        </div>
        <p class="text-2xl font-bold text-green-600">{{ messages.filter(m => m.status === 'replied').length }}</p>
      </div>
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-hourglass-half text-yellow-600 text-xl"></i>
          <span class="text-sm text-gray-600">Pendientes</span>
        </div>
        <p class="text-2xl font-bold text-yellow-600">{{ messages.filter(m => m.status === 'pending').length }}</p>
      </div>
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-user-tie text-purple-600 text-xl"></i>
          <span class="text-sm text-gray-600">Asignados</span>
        </div>
        <p class="text-2xl font-bold text-purple-600">{{ messages.filter(m => m.assigned).length }}</p>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Messages List -->
      <div class="lg:col-span-1 card p-0 overflow-hidden flex flex-col h-96 lg:h-full">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent">
          <div class="flex justify-between items-center mb-3">
            <h2 class="font-semibold text-gray-900">Mensajes</h2>
            <span class="text-xs font-bold bg-kapital-dark text-white px-2 py-1 rounded-full">{{ messages.length }}</span>
          </div>
          <input 
            v-model="searchMessage"
            type="text" 
            placeholder="Buscar..." 
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-kapital-dark"
          />
        </div>

        <div class="flex-1 overflow-y-auto divide-y">
          <div 
            v-for="msg in filteredMessages" 
            :key="msg.id" 
            @click="selectMessage(msg)"
            :class="[
              'p-4 cursor-pointer transition-all duration-200',
              selectedMessage?.id === msg.id 
                ? 'bg-blue-100 border-l-4 border-kapital-dark' 
                : 'hover:bg-gray-50 border-l-4 border-transparent'
            ]"
          >
            <div class="flex gap-3 mb-2">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white', getStatusColor(msg.status)]">
                {{ msg.initials }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-sm text-gray-900 truncate">{{ msg.name }}</h4>
                <p class="text-xs text-gray-600 truncate">{{ msg.preview }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <small class="text-gray-500 flex items-center gap-1">
                <i class="fas fa-clock"></i> {{ msg.time }}
              </small>
              <span v-if="msg.status === 'pending'" class="w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          </div>

          <div v-if="filteredMessages.length === 0" class="p-6 text-center text-gray-500">
            <i class="fas fa-inbox text-2xl mb-2 block text-gray-400"></i>
            <p class="text-sm">No hay mensajes</p>
          </div>
        </div>
      </div>

      <!-- Chat Panel -->
      <div class="lg:col-span-3 card p-0 overflow-hidden flex flex-col h-96 lg:h-full">
        <!-- Chat Header -->
        <div v-if="selectedMessage" class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white', getStatusColor(selectedMessage.status)]">
              {{ selectedMessage.initials }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ selectedMessage.name }}</h3>
              <small class="text-gray-600">{{ selectedMessage.network }} • {{ selectedMessage.time }}</small>
            </div>
          </div>
          <div class="flex gap-2">
            <button 
              @click="toggleAssign"
              :class="['px-3 py-1 text-sm rounded transition-all', selectedMessage.assigned ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
            >
              <i class="fas fa-user-tie mr-1"></i> {{ selectedMessage.assigned ? 'Asignado' : 'Asignar' }}
            </button>
            <button 
              @click="markAsResolved"
              :class="['px-3 py-1 text-sm rounded transition-all', selectedMessage.status === 'replied' ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
            >
              <i class="fas fa-check mr-1"></i> Resuelto
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex-1 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <i class="fas fa-comments text-4xl text-gray-300 mb-4 block"></i>
            <p class="text-lg font-medium text-gray-600">Selecciona una conversación</p>
            <p class="text-sm text-gray-500 mt-2">Elige un mensaje para ver los detalles</p>
          </div>
        </div>

        <!-- Chat Messages -->
        <div v-if="selectedMessage" class="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-4">
          <div v-for="(chat, idx) in selectedMessage.conversation" :key="idx" :class="['flex', chat.sender === 'me' ? 'justify-end' : 'justify-start']">
            <div :class="[
              'max-w-xs px-4 py-2 rounded-lg',
              chat.sender === 'me' 
                ? 'bg-kapital-dark text-white rounded-br-none' 
                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
            ]">
              <p class="text-sm">{{ chat.text }}</p>
              <small :class="['text-xs mt-1 block', chat.sender === 'me' ? 'text-blue-100' : 'text-gray-500']">
                {{ chat.time }}
              </small>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div v-if="selectedMessage" class="px-6 py-4 border-t border-gray-200 bg-white">
          <div class="space-y-3">
            <select v-model="selectedTemplate" class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-kapital-dark">
              <option value="">Respuesta personalizada</option>
              <option value="info">Plantilla: Información general</option>
              <option value="promo">Plantilla: Promoción especial</option>
              <option value="support">Plantilla: Soporte técnico</option>
              <option value="follow">Plantilla: Seguimiento</option>
            </select>

            <div class="flex gap-3">
              <textarea 
                v-model="replyMessage"
                placeholder="Escribe tu respuesta..."
                rows="2"
                class="flex-1 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-kapital-dark resize-none"
              ></textarea>
              <button 
                @click="sendMessage"
                class="btn-primary px-4 h-fit"
              >
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Asignar a asesor</h3>
        
        <div class="space-y-3 mb-6">
          <div 
            v-for="advisor in advisors"
            :key="advisor.id"
            @click="selectedAdvisor = advisor.id"
            :class="['p-3 border rounded-lg cursor-pointer transition-all', selectedAdvisor === advisor.id ? 'bg-blue-50 border-kapital-dark' : 'border-gray-200 hover:border-gray-300']"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-kapital-dark to-kapital-light-1 text-white flex items-center justify-center font-bold text-sm">
                {{ advisor.initials }}
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ advisor.name }}</p>
                <small class="text-gray-600">{{ advisor.role }}</small>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="showAssignModal = false" class="btn-secondary flex-1">Cancelar</button>
          <button @click="confirmAssign" class="btn-primary flex-1">Asignar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
    'pending': 'bg-yellow-500',
    'replied': 'bg-green-500',
    'assigned': 'bg-purple-500'
  }
  return colors[status] || 'bg-kapital-dark'
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

<style scoped>
.btn-primary {
  @apply px-6 py-3 bg-kapital-dark text-white font-medium rounded-md transition-all hover:bg-blue-700 active:scale-95 flex items-center gap-2;
}

.btn-secondary {
  @apply px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200;
}
</style>