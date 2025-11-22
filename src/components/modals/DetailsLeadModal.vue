<template>
  <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div 
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :enter="{ opacity: 1, scale: 1 }"
      class="bg-white rounded-2xl p-6 max-w-3xl w-full my-8 shadow-2xl border border-white/20 relative" 
      v-if="lead"
    >
      <!-- Header -->
      <div class="flex justify-between items-start mb-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-gradient-to-br from-kapital-dark to-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
            {{ lead.initials }}
          </div>
          <div>
            <h3 class="text-2xl font-bold text-slate-900">{{ lead.name }}</h3>
            <p class="text-sm text-slate-500 font-medium flex items-center gap-1">
              <Building2 :size="14" />
              {{ lead.company || 'Sin empresa' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="$emit('edit')" class="btn-secondary py-2 px-4 text-sm shadow-sm">
            <Edit2 :size="16" /> Editar
          </button>
          <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X :size="24" />
          </button>
        </div>
      </div>
      
      <!-- Lead Details -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-8">
        <div class="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email</label>
          <p class="font-bold text-slate-900 truncate flex items-center gap-2">
            <Mail :size="14" class="text-slate-400" /> {{ lead.email }}
          </p>
        </div>
        <div class="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Teléfono</label>
          <p class="font-bold text-slate-900 flex items-center gap-2">
            <Phone :size="14" class="text-slate-400" /> {{ lead.phone || 'N/A' }}
          </p>
        </div>
        <div class="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Origen</label>
          <p class="font-bold text-slate-900 flex items-center gap-2">
            <Globe :size="14" class="text-slate-400" /> {{ lead.origin }}
          </p>
        </div>
        <div class="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Responsable</label>
          <p class="font-bold text-slate-900 flex items-center gap-2">
            <User :size="14" class="text-slate-400" /> {{ lead.assignedTo }}
          </p>
        </div>
      </div>

      <!-- Tabbed Content -->
      <div>
        <div class="border-b border-slate-200/60 mb-6">
          <nav class="-mb-px flex gap-6" aria-label="Tabs">
            <button 
              @click="activeTab = 'opps'" 
              :class="['tab-button', activeTab === 'opps' ? 'tab-active' : 'tab-inactive']"
            >
              <Briefcase :size="16" /> Oportunidades
            </button>
            <button 
              @click="activeTab = 'notes'" 
              :class="['tab-button', activeTab === 'notes' ? 'tab-active' : 'tab-inactive']"
            >
              <FileText :size="16" /> Notas
            </button>
            <button 
              @click="activeTab = 'convos'" 
              :class="['tab-button', activeTab === 'convos' ? 'tab-active' : 'tab-inactive']"
            >
              <MessageSquare :size="16" /> Conversaciones
            </button>
          </nav>
        </div>

        <div class="min-h-[200px]">
          <!-- Opportunities Tab -->
          <div v-if="activeTab === 'opps'" v-motion :initial="{ opacity: 0, x: -10 }" :enter="{ opacity: 1, x: 0 }">
            <!-- Add Form -->
            <form @submit.prevent="addOpportunity" class="flex gap-3 mb-6">
              <div class="relative flex-grow">
                <input 
                  v-model="newOpportunity.title" 
                  type="text" 
                  placeholder="Título de la oportunidad" 
                  class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm"
                />
                <Tag :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <div class="relative w-32">
                <input 
                  v-model.number="newOpportunity.value" 
                  type="number" 
                  placeholder="Valor (€)" 
                  class="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm"
                />
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
              </div>
              <button type="submit" class="btn-primary py-2 px-4 text-sm shadow-md shadow-kapital-dark/20">
                <Plus :size="18" /> Añadir
              </button>
            </form>
            
            <!-- List -->
            <ul class="space-y-3">
              <li v-for="opp in lead.opportunities" :key="opp.id" class="bg-slate-50 border border-slate-100 p-4 rounded-xl flex justify-between items-center hover:shadow-sm transition-shadow">
                <div>
                  <p class="font-bold text-slate-900 text-sm">{{ opp.title }}</p>
                  <span class="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                    {{ new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(opp.value) }}
                  </span>
                </div>
                <span class="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-wide">{{ opp.status }}</span>
              </li>
              <li v-if="!lead.opportunities || lead.opportunities.length === 0" class="text-center text-sm text-slate-400 py-8 flex flex-col items-center">
                <Briefcase :size="32" class="mb-2 opacity-50" />
                No hay oportunidades registradas.
              </li>
            </ul>
          </div>

          <!-- Notes Tab -->
          <div v-if="activeTab === 'notes'" v-motion :initial="{ opacity: 0, x: -10 }" :enter="{ opacity: 1, x: 0 }">
            <!-- Add Form -->
            <form @submit.prevent="addNote" class="flex gap-3 mb-6">
              <div class="relative flex-grow">
                <input 
                  v-model="newNoteText" 
                  type="text" 
                  placeholder="Escribe una nota interna..." 
                  class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm"
                />
                <PenTool :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button type="submit" class="btn-primary py-2 px-4 text-sm shadow-md shadow-kapital-dark/20">
                <Plus :size="18" /> Añadir
              </button>
            </form>
            
            <!-- List -->
            <ul class="space-y-3">
              <li v-for="note in lead.notes" :key="note.id" class="bg-amber-50/50 border-l-4 border-amber-300 p-4 rounded-r-xl">
                <p class="text-sm text-slate-800 font-medium">{{ note.text }}</p>
                <p class="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <User :size="10" /> {{ note.author }} • <Clock :size="10" /> {{ formatTime(note.date) }}
                </p>
              </li>
              <li v-if="!lead.notes || lead.notes.length === 0" class="text-center text-sm text-slate-400 py-8 flex flex-col items-center">
                <FileText :size="32" class="mb-2 opacity-50" />
                No hay notas internas.
              </li>
            </ul>
          </div>

          <!-- Conversations Tab -->
          <div v-if="activeTab === 'convos'" v-motion :initial="{ opacity: 0, x: -10 }" :enter="{ opacity: 1, x: 0 }">
            <button @click="$emit('view-conversations')" class="w-full btn-primary mb-6 shadow-lg shadow-kapital-dark/20">
              <MessageSquare :size="18" /> Ir a Interacciones del Cliente
            </button>
            
            <ul class="space-y-3">
              <li v-for="convo in lead.conversations.reverse()" :key="convo.id" class="bg-slate-50 border border-slate-100 p-4 rounded-xl hover:shadow-sm transition-shadow">
                <div class="flex justify-between items-start mb-1">
                  <p class="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <component :is="getChannelIcon(convo.channel)" :size="14" :class="getChannelColor(convo.channel)" />
                    {{ convo.channel }}
                  </p>
                  <span class="text-[10px] font-bold text-slate-400">{{ formatTime(convo.lastActivity) }}</span>
                </div>
                <p class="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">"{{ convo.preview }}"</p>
              </li>
               <li v-if="!lead.conversations || lead.conversations.length === 0" class="text-center text-sm text-slate-400 py-8 flex flex-col items-center">
                <MessageSquare :size="32" class="mb-2 opacity-50" />
                No hay conversaciones recientes.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  X, Edit2, Building2, Mail, Phone, Globe, User, Briefcase, FileText, MessageSquare, 
  Plus, Tag, PenTool, Clock, Facebook, Instagram, Linkedin, Link as LinkIcon 
} from 'lucide-vue-next'

const props = defineProps({
  lead: Object
})

const emit = defineEmits(['close', 'edit', 'add-note', 'add-opportunity', 'view-conversations'])

const activeTab = ref('opps')
const newNoteText = ref('')
const newOpportunity = ref({ title: '', value: null })

function addNote() {
  if (!newNoteText.value.trim()) return
  emit('add-note', { leadId: props.lead.id, noteText: newNoteText.value })
  newNoteText.value = ''
}

function addOpportunity() {
  if (!newOpportunity.value.title.trim() || !newOpportunity.value.value) return
  emit('add-opportunity', { leadId: props.lead.id, oppData: { ...newOpportunity.value } })
  newOpportunity.value = { title: '', value: null }
}

function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
}

function getChannelIcon(channel) {
  const icons = {
    'Instagram': Instagram,
    'Facebook': Facebook,
    'LinkedIn': Linkedin
  }
  return icons[channel] || LinkIcon
}

function getChannelColor(channel) {
  const colors = {
    'Instagram': 'text-pink-600',
    'Facebook': 'text-blue-600',
    'LinkedIn': 'text-blue-700'
  }
  return colors[channel] || 'text-slate-500'
}
</script>

<style scoped lang="postcss">
.btn-primary {
  @apply px-5 py-2.5 bg-kapital-dark text-white font-medium rounded-xl transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-2 text-sm;
}

.btn-secondary {
  @apply px-4 py-2 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center gap-2 text-sm;
}

.tab-button {
  @apply flex items-center gap-2 whitespace-nowrap py-3 px-2 border-b-2 font-bold text-sm transition-all;
}

.tab-active {
  @apply border-kapital-dark text-kapital-dark;
}

.tab-inactive {
  @apply border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300;
}
</style>