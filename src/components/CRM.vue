<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>CRM - Gestión de Leads</h1>
      <p>Administra tus contactos y oportunidades</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-users text-kapital-dark text-xl"></i>
          <span class="text-sm text-gray-600">Total Leads</span>
        </div>
        <p class="text-2xl font-bold text-kapital-dark">{{ leads.length }}</p>
      </div>
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-star text-green-600 text-xl"></i>
          <span class="text-sm text-gray-600">Nuevos</span>
        </div>
        <p class="text-2xl font-bold text-green-600">{{ leads.filter(l => l.status === 'new').length }}</p>
      </div>
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-hourglass-half text-yellow-600 text-xl"></i>
          <span class="text-sm text-gray-600">En Seguimiento</span>
        </div>
        <p class="text-2xl font-bold text-yellow-600">{{ leads.filter(l => l.status === 'following').length }}</p>
      </div>
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-check-circle text-purple-600 text-xl"></i>
          <span class="text-sm text-gray-600">Cerrados</span>
        </div>
        <p class="text-2xl font-bold text-purple-600">{{ leads.filter(l => l.status === 'closed').length }}</p>
      </div>
    </div>

    <!-- Filters and Actions -->
    <div class="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-end">
      <div class="flex-1 w-full md:w-auto">
        <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por estado</label>
        <select 
          v-model="filterStatus"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Todos los estados</option>
          <option value="new">Nuevo</option>
          <option value="following">En seguimiento</option>
          <option value="closed">Cerrado</option>
        </select>
      </div>

      <div class="flex-1 w-full md:w-auto">
        <label class="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por nombre, email..." 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div class="flex bg-gray-100 p-1 rounded-lg">
        <button 
          @click="viewMode = 'list'"
          :class="['px-3 py-2 rounded-md text-sm font-medium transition-all', viewMode === 'list' ? 'bg-white text-kapital-dark shadow-sm' : 'text-gray-500 hover:text-gray-700']"
        >
          <i class="fas fa-list mr-2"></i>Lista
        </button>
        <button 
          @click="viewMode = 'kanban'"
          :class="['px-3 py-2 rounded-md text-sm font-medium transition-all', viewMode === 'kanban' ? 'bg-white text-kapital-dark shadow-sm' : 'text-gray-500 hover:text-gray-700']"
        >
          <i class="fas fa-columns mr-2"></i>Kanban
        </button>
      </div>

      <button 
        @click="showNewLeadModal = true"
        class="btn-primary w-full md:w-auto"
      >
        <i class="fas fa-plus"></i> Nuevo Lead
      </button>
    </div>

    <!-- Kanban View -->
    <div v-if="viewMode === 'kanban'">
      <CrmKanban 
        :leads="filteredLeads"
        :users="users"
        :status-options="statusOptions"
        @save-lead="addNewLead"
        @delete-lead="deleteLead"
        @update-lead-status="handleUpdateStatus"
        @add-note="handleAddNote"
        @add-opportunity="handleAddOpportunity"
        @view-conversations="handleViewConversations"
      />
    </div>

    <!-- Table View -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left font-semibold text-gray-700">
                <i class="fas fa-user mr-2 text-kapital-dark"></i>Nombre
              </th>
              <th class="px-6 py-4 text-left font-semibold text-gray-700">
                <i class="fas fa-envelope mr-2 text-kapital-dark"></i>Contacto
              </th>
              <th class="px-6 py-4 text-left font-semibold text-gray-700">
                <i class="fas fa-link mr-2 text-kapital-dark"></i>Origen
              </th>
              <th class="px-6 py-4 text-left font-semibold text-gray-700">
                <i class="fas fa-calendar mr-2 text-kapital-dark"></i>Fecha
              </th>
              <th class="px-6 py-4 text-left font-semibold text-gray-700">
                <i class="fas fa-flag mr-2 text-kapital-dark"></i>Estado
              </th>
              <th class="px-6 py-4 text-left font-semibold text-gray-700">
                <i class="fas fa-cogs mr-2 text-kapital-dark"></i>Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr 
              v-for="lead in filteredLeads" 
              :key="lead.id" 
              class="hover:bg-blue-50 transition-colors duration-200"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-kapital-dark to-kapital-light-1 flex items-center justify-center text-white text-xs font-bold">
                    {{ lead.initials }}
                  </div>
                  <span class="font-medium text-gray-900">{{ lead.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-gray-600">
                  <i class="fas fa-envelope text-kapital-light-1 text-xs"></i>
                  <a :href="`mailto:${lead.email}`" class="hover:text-kapital-dark transition-colors">
                    {{ lead.email }}
                  </a>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1', getOriginColor(lead.origin)]">
                  <i :class="['fas', getOriginIcon(lead.origin)]"></i>
                  {{ lead.origin }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-600 text-xs">
                <i class="fas fa-calendar-alt mr-2 text-gray-400"></i>
                {{ lead.date }}
              </td>
              <td class="px-6 py-4">
                <span :class="['w-28 px-3 py-1 text-xs font-bold rounded-full text-center inline-flex items-center justify-center gap-1', getStatusClass(lead.status)]">
                  <i :class="['fas', getStatusIcon(lead.status)]"></i>
                  {{ lead.statusLabel }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button 
                    @click="editLead(lead)"
                    class="px-3 py-2 text-kapital-dark hover:bg-blue-100 rounded transition-colors"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="changeLead(lead)"
                    class="px-3 py-2 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                    title="Cambiar estado"
                  >
                    <i class="fas fa-arrow-right"></i>
                  </button>
                  <button 
                    @click="deleteLead(lead.id)"
                    class="px-3 py-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Eliminar"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredLeads.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <i class="fas fa-inbox text-4xl text-gray-300 mb-3 block"></i>
                <p class="text-gray-500 font-medium">No hay leads que coincidan con tu búsqueda</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- New Lead Modal -->
    <div v-if="showNewLeadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Nuevo Lead</h3>
          <button @click="showNewLeadModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form @submit.prevent="addNewLead" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input 
              v-model="newLead.name"
              type="text" 
              placeholder="Ej: Juan García"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              v-model="newLead.email"
              type="email" 
              placeholder="Ej: juan@email.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              v-model="newLead.phone"
              type="tel" 
              placeholder="Ej: +34 123 456 789"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Origen</label>
            <select 
              v-model="newLead.origin"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
              required
            >
              <option value="">Seleccionar...</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Web">Web</option>
              <option value="Email">Email</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="showNewLeadModal = false" class="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" class="btn-primary flex-1">
              <i class="fas fa-plus"></i> Crear Lead
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Change Status Modal -->
    <div v-if="showChangeStatusModal && selectedLead" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Cambiar estado de {{ selectedLead.name }}</h3>
        
        <div class="space-y-2 mb-6">
          <button 
            v-for="status in statusOptions"
            :key="status.value"
            @click="updateLeadStatus(status.value)"
            :class="['w-full p-3 rounded-lg border-2 transition-all text-left', 
              selectedLead.status === status.value ? 'border-kapital-dark bg-blue-50' : 'border-gray-200 hover:border-kapital-dark']"
          >
            <div class="flex items-center gap-2">
              <i :class="['fas', status.icon]"></i>
              <div>
                <p class="font-medium text-gray-900">{{ status.label }}</p>
                <small class="text-gray-600">{{ status.description }}</small>
              </div>
            </div>
          </button>
        </div>

        <button 
          @click="showChangeStatusModal = false"
          class="btn-secondary w-full"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { crmService } from '../services/crmService'
import CrmKanban from './CrmKanban.vue'

const emit = defineEmits(['showToast'])

const filterStatus = ref('')
const searchQuery = ref('')
const showNewLeadModal = ref(false)
const showChangeStatusModal = ref(false)
const selectedLead = ref(null)

const newLead = ref({
  name: '',
  email: '',
  phone: '',
  origin: ''
})

const statusOptions = [
  { value: 'new', label: 'Nuevo', description: 'Lead recién capturado', icon: 'fa-star' },
  { value: 'following', label: 'En Seguimiento', description: 'Contactado, pendiente respuesta', icon: 'fa-hourglass-half' },
  { value: 'closed', label: 'Cerrado', description: 'Conversión completada o descartado', icon: 'fa-check-circle' }
]

const viewMode = ref('list') // 'list' or 'kanban'
const users = ref([]) // Populated from service
const leads = ref([])

onMounted(async () => {
  await loadData()
})

async function loadData() {
  leads.value = await crmService.getLeads()
  users.value = await crmService.getUsers()
  // statusOptions is static, but could be fetched if needed
}

const filteredLeads = computed(() => {
  return leads.value.filter(lead => {
    const matchStatus = !filterStatus.value || lead.status === filterStatus.value
    const matchSearch = !searchQuery.value || 
      lead.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchSearch
  })
})

function getStatusClass(status) {
  const classes = {
    'new': 'bg-green-100 text-green-700',
    'following': 'bg-yellow-100 text-yellow-700',
    'closed': 'bg-purple-100 text-purple-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

function getStatusIcon(status) {
  const icons = {
    'new': 'fa-star',
    'following': 'fa-hourglass-half',
    'closed': 'fa-check-circle'
  }
  return icons[status] || 'fa-circle'
}

function getOriginColor(origin) {
  const colors = {
    'Instagram': 'bg-pink-100 text-pink-700',
    'Facebook': 'bg-blue-100 text-blue-700',
    'LinkedIn': 'bg-indigo-100 text-indigo-700',
    'Web': 'bg-green-100 text-green-700',
    'Email': 'bg-orange-100 text-orange-700',
    'Otro': 'bg-gray-100 text-gray-700'
  }
  return colors[origin] || 'bg-gray-100 text-gray-700'
}

function getOriginIcon(origin) {
  const icons = {
    'Instagram': 'bi bi-instagram',
    'Facebook': 'bi bi-facebook',
    'LinkedIn': 'bi bi-linkedin',
    'Web': 'bi bi-globe',
    'Email': 'fa-envelope',
    'Otro': 'fa-link'
  }
  return icons[origin] || 'fa-link'
}

function editLead(lead) {
  emit('showToast', `Editando: ${lead.name}`)
}

function changeLead(lead) {
  selectedLead.value = lead
  showChangeStatusModal.value = true
}

async function updateLeadStatus(newStatus, leadId = null) {
  const id = leadId || selectedLead.value?.id
  if (!id) return

  const statusLabels = {
    'new': 'Nuevo',
    'following': 'En seguimiento',
    'closed': 'Cerrado'
  }
  
  await crmService.updateLeadStatus(id, newStatus)
  await loadData() // Refresh data
  
  showChangeStatusModal.value = false
  emit('showToast', `Estado actualizado a: ${statusLabels[newStatus]}`)
}

// Handler for Kanban update
async function handleUpdateStatus({ leadId, newStatus }) {
  await updateLeadStatus(newStatus, leadId)
}

async function deleteLead(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este lead?')) {
    await crmService.deleteLead(id)
    await loadData()
    emit('showToast', 'Lead eliminado correctamente')
  }
}

async function addNewLead(leadData = null) {
  // Support both direct call (modal in list) and event from Kanban
  const data = leadData || newLead.value
  
  if (!data.name || !data.email || !data.origin) {
    emit('showToast', 'Por favor completa los campos requeridos', 'error')
    return
  }

  const initials = data.name.split(' ').map(n => n[0]).join('').toUpperCase()
  
  const lead = {
    initials: initials,
    name: data.name,
    email: data.email,
    phone: data.phone,
    origin: data.origin,
    status: 'new',
    statusLabel: 'Nuevo',
    date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  await crmService.saveLead(lead)
  await loadData()

  showNewLeadModal.value = false
  
  if (!leadData) {
    newLead.value = { name: '', email: '', phone: '', origin: '' }
  }
  emit('showToast', `Lead "${lead.name}" creado exitosamente`)
}

// Kanban specific handlers
async function handleAddNote({ leadId, note }) {
  await crmService.addNoteToLead(leadId, note.text, 'Me') // Hardcoded author for now
  await loadData()
  emit('showToast', 'Nota agregada')
}

async function handleAddOpportunity({ leadId, opportunity }) {
  await crmService.addOpportunityToLead(leadId, opportunity)
  await loadData()
  emit('showToast', 'Oportunidad agregada')
}

function handleViewConversations(leadId) {
  emit('showToast', `Ver conversaciones del lead ${leadId} (Próximamente)`)
}
</script>

<style scoped lang="postcss">
.btn-primary {
  @apply px-6 py-3 bg-kapital-dark text-white font-medium rounded-md transition-all hover:bg-blue-700 active:scale-95 flex items-center gap-2;
}

.btn-secondary {
  @apply px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200;
}
</style>