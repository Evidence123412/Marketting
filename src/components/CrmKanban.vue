<template>
  <div class="space-y-8">
    <!-- Filters and Actions -->
    <div class="flex flex-col md:flex-row gap-4 items-start md:items-end">
      <div class="flex-1 w-full md:w-auto">
        <label class="block text-sm font-medium text-gray-700 mb-2">Búsqueda</label>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por nombre, email..." 
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button 
        @click="showNewLeadModal = true"
        class="btn-primary w-full md:w-auto"
      >
        <i class="fas fa-plus"></i> Nuevo Lead
      </button>
    </div>

    <!-- Kanban Board -->
    <div class="flex gap-4 pb-4">
      <div 
        v-for="status in statusOptions" 
        :key="status.value" 
        class="kanban-column"
      >
        <div class="column-header">
          <i :class="['fas', status.icon, `text-${status.color}-600`]"></i>
          <h3 class="font-semibold text-sm text-gray-700">{{ status.label }}</h3>
          <span class="text-xs font-bold text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">
            {{ leadsByStatus[status.value] ? leadsByStatus[status.value].length : 0 }}
          </span>
        </div>
        
        <draggable
          class="kanban-cards"
          :list="leadsByStatus[status.value]"
          group="leads"
          @change="handleDragChange($event, status.value)"
          item-key="id"
          ghost-class="ghost"
          drag-class="dragging"
          animation="300"
        >
          <template #item="{element}">
            <LeadCard 
              :lead="element"
              @view="openDetailsModal(element)"
              @edit="openEditModal(element)"
              @delete="$emit('delete-lead', element.id)"
            />
          </template>
        </draggable>
      </div>
    </div>

    <!-- Modals -->
    <NewLeadModal 
      v-if="showNewLeadModal"
      :users="users"
      @close="showNewLeadModal = false"
      @save="handleSaveLead"
    />
    <EditLeadModal
      v-if="showEditLeadModal"
      :lead="selectedLead"
      :users="users"
      @close="showEditLeadModal = false"
      @save="handleSaveLead"
    />
    <DetailsLeadModal
      v-if="showDetailsLeadModal"
      :lead="selectedLead"
      @close="showDetailsLeadModal = false"
      @add-note="$emit('add-note', $event)"
      @add-opportunity="$emit('add-opportunity', $event)"
      @edit="openEditModal(selectedLead)"
      @view-conversations="$emit('view-conversations', selectedLead.id)"
    />
    <ChangeStatusModal
      v-if="showChangeStatusModal"
      :lead="selectedLead"
      :status-options="statusOptions"
      @close="showChangeStatusModal = false"
      @update-status="$emit('update-lead-status', $event)"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'

import LeadCard from './LeadCard.vue'
import NewLeadModal from './modals/NewLeadModal.vue'
import EditLeadModal from './modals/EditLeadModal.vue'
import DetailsLeadModal from './modals/DetailsLeadModal.vue'
import ChangeStatusModal from './modals/ChangeStatusModal.vue'

const props = defineProps({
  leads: Array,
  users: Array,
  statusOptions: Array,
});

const emit = defineEmits([
  'save-lead', 
  'delete-lead', 
  'update-lead-status', 
  'add-note', 
  'add-opportunity',
  'view-conversations'
]);

// Local state for UI
const searchQuery = ref('');
const selectedLead = ref(null);
const showNewLeadModal = ref(false);
const showEditLeadModal = ref(false);
const showDetailsLeadModal = ref(false);
const showChangeStatusModal = ref(false);

// Computed Properties for display
const filteredLeads = computed(() => {
  if (!searchQuery.value) {
    return props.leads;
  }
  return props.leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

const leadsByStatus = computed(() => {
  const grouped = {};
  if (props.statusOptions) {
    props.statusOptions.forEach(status => {
      grouped[status.value] = [];
    });
  }
  if (filteredLeads.value) {
    filteredLeads.value.forEach(lead => {
      if (grouped[lead.status]) {
        grouped[lead.status].push(lead);
      }
    });
  }
  return grouped;
});

// Modal Openers
function openEditModal(lead) {
  selectedLead.value = { ...lead };
  showDetailsLeadModal.value = false;
  showEditLeadModal.value = true;
}
function openDetailsModal(lead) {
  selectedLead.value = { ...lead };
  showDetailsLeadModal.value = true;
}

// Functions that emit events to the parent
function handleSaveLead(leadData) {
  emit('save-lead', leadData);
  showNewLeadModal.value = false;
  showEditLeadModal.value = false;
}

function handleDragChange(event, newStatus) {
  if (event.added) {
    const leadId = event.added.element.id;
    emit('update-lead-status', { leadId, newStatus });
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-6 py-3 bg-kapital-dark text-white font-medium rounded-md transition-all hover:bg-blue-700 active:scale-95 flex items-center justify-center gap-2;
}
.kanban-column {
  @apply flex-shrink-0 w-72 bg-gray-100 rounded-lg p-2 flex flex-col;
}
.column-header {
  @apply flex items-center justify-between px-2 py-2 mb-2;
}
.kanban-cards {
  @apply flex-grow min-h-[100px] space-y-3 p-1;
}

.ghost {
  @apply bg-gray-200 opacity-50 rounded-lg;
}

.dragging {
  @apply cursor-grabbing transform rotate-3 shadow-2xl;
}

.kanban-card-enter-active,
.kanban-card-leave-active {
  transition: all 0.3s ease;
}
.kanban-card-enter-from,
.kanban-card-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.kanban-card-move {
  transition: transform 0.3s ease;
}
</style>