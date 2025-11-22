<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="bg-white rounded-lg p-6 max-w-3xl w-full my-8" v-if="lead">
      <!-- Header -->
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-kapital-dark to-kapital-light-1 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {{ lead.initials }}
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900">{{ lead.name }}</h3>
            <p class="text-sm text-gray-600 font-medium">{{ lead.company || 'Sin empresa' }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="$emit('edit')" class="btn-secondary py-2 px-4 text-sm">
            <i class="fas fa-edit mr-2"></i>Editar
          </button>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 h-10 w-10 rounded-full hover:bg-gray-100">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>
      
      <!-- Lead Details -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
        <div class="bg-gray-50 p-3 rounded-lg">
          <label class="block text-xs font-medium text-gray-500 mb-1">Email</label>
          <p class="font-semibold text-gray-800 truncate">{{ lead.email }}</p>
        </div>
        <div class="bg-gray-50 p-3 rounded-lg">
          <label class="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
          <p class="font-semibold text-gray-800">{{ lead.phone || 'N/A' }}</p>
        </div>
        <div class="bg-gray-50 p-3 rounded-lg">
          <label class="block text-xs font-medium text-gray-500 mb-1">Origen</label>
          <p class="font-semibold text-gray-800">{{ lead.origin }}</p>
        </div>
        <div class="bg-gray-50 p-3 rounded-lg">
          <label class="block text-xs font-medium text-gray-500 mb-1">Responsable</label>
          <p class="font-semibold text-gray-800">{{ lead.assignedTo }}</p>
        </div>
      </div>

      <!-- Tabbed Content -->
      <div>
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex gap-6" aria-label="Tabs">
            <button @click="activeTab = 'opps'" :class="['tab-button', activeTab === 'opps' ? 'tab-active' : 'tab-inactive']">Oportunidades</button>
            <button @click="activeTab = 'notes'" :class="['tab-button', activeTab === 'notes' ? 'tab-active' : 'tab-inactive']">Notas</button>
            <button @click="activeTab = 'convos'" :class="['tab-button', activeTab === 'convos' ? 'tab-active' : 'tab-inactive']">Conversaciones</button>
          </nav>
        </div>

        <div class="py-6">
          <!-- Opportunities Tab -->
          <div v-if="activeTab === 'opps'">
            <!-- Add Form -->
            <form @submit.prevent="addOpportunity" class="flex gap-2 mb-4">
              <input v-model="newOpportunity.title" type="text" placeholder="Título de la oportunidad" class="form-input flex-grow"/>
              <input v-model.number="newOpportunity.value" type="number" placeholder="Valor (€)" class="form-input w-28"/>
              <button type="submit" class="btn-primary py-2 px-4 text-sm">Añadir</button>
            </form>
            <!-- List -->
            <ul class="space-y-2">
              <li v-for="opp in lead.opportunities" :key="opp.id" class="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                <div>
                  <p class="font-semibold text-sm">{{ opp.title }}</p>
                  <span class="text-xs text-green-600 font-bold">{{ new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(opp.value) }}</span>
                </div>
                <span class="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">{{ opp.status }}</span>
              </li>
              <li v-if="!lead.opportunities || lead.opportunities.length === 0" class="text-center text-sm text-gray-500 py-4">No hay oportunidades.</li>
            </ul>
          </div>

          <!-- Notes Tab -->
          <div v-if="activeTab === 'notes'">
            <!-- Add Form -->
            <form @submit.prevent="addNote" class="flex gap-2 mb-4">
              <input v-model="newNoteText" type="text" placeholder="Escribe una nota interna..." class="form-input flex-grow"/>
              <button type="submit" class="btn-primary py-2 px-4 text-sm">Añadir</button>
            </form>
            <!-- List -->
            <ul class="space-y-3">
              <li v-for="note in lead.notes" :key="note.id" class="bg-yellow-50 border-l-4 border-yellow-300 p-3">
                <p class="text-sm text-gray-800">{{ note.text }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ note.author }} - {{ formatTime(note.date) }}</p>
              </li>
              <li v-if="!lead.notes || lead.notes.length === 0" class="text-center text-sm text-gray-500 py-4">No hay notas internas.</li>
            </ul>
          </div>

          <!-- Conversations Tab -->
          <div v-if="activeTab === 'convos'">
            <button @click="$emit('view-conversations')" class="w-full btn-primary">
              <i class="fas fa-comments mr-2"></i> Ir a Interacciones del Cliente
            </button>
            <ul class="space-y-2 mt-4">
              <li v-for="convo in lead.conversations.reverse()" :key="convo.id" class="bg-gray-50 p-3 rounded-md">
                <p class="font-semibold text-sm">{{ convo.channel }}</p>
                <p class="text-xs text-gray-600 truncate">"{{ convo.preview }}"</p>
                <p class="text-xs text-gray-500 mt-1 text-right">{{ formatTime(convo.lastActivity) }}</p>
              </li>
               <li v-if="!lead.conversations || lead.conversations.length === 0" class="text-center text-sm text-gray-500 py-4">No hay conversaciones.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
</script>

<style scoped>
.form-input { @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-1 focus:ring-kapital-dark; }
.btn-primary { @apply px-6 py-3 bg-kapital-dark text-white font-medium rounded-md transition-all hover:bg-blue-700 active:scale-95 flex items-center justify-center gap-2; }
.btn-secondary { @apply px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200; }
.tab-button { @apply flex items-center gap-2 whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm transition-all; }
.tab-active { @apply border-kapital-dark text-kapital-dark; }
.tab-inactive { @apply border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300; }
</style>