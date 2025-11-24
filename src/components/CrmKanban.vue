<template>
  <div class="space-y-6 h-full flex flex-col">
    <!-- Filters and Actions -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
    >
      <div class="relative w-full md:w-96">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="16" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por nombre, empresa o email..." 
          class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-kapital-dark focus:ring-1 focus:ring-kapital-dark text-xs font-medium text-gray-700 placeholder-gray-400 transition-all"
        />
      </div>

      <button 
        @click="showNewLeadModal = true"
        class="btn-primary w-full md:w-auto shadow-lg shadow-slate-900/20"
      >
        <Plus :size="16" /> Nuevo Lead
      </button>
    </div>

    <!-- Kanban Board -->
    <div class="flex-1 overflow-x-auto overflow-y-hidden">
      <div class="flex gap-6 h-full pb-4 min-w-max px-2">
        <div 
          v-for="(status, index) in statusOptions" 
          :key="status.value" 
          v-motion
          :initial="{ opacity: 0, x: 20 }"
          :enter="{ opacity: 1, x: 0, transition: { delay: index * 100 } }"
          class="kanban-column group"
        >
          <!-- Column Header -->
          <div class="column-header">
            <div class="flex items-center gap-2">
              <div :class="['w-2 h-2 rounded-full', getStatusColorClass(status.value)]"></div>
              <h3 class="font-bold text-xs text-gray-500 uppercase tracking-wider">{{ status.label }}</h3>
            </div>
            <span class="text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5">
              {{ leadsByStatus[status.value] ? leadsByStatus[status.value].length : 0 }}
            </span>
          </div>
          
          <!-- Draggable Area -->
          <draggable
            class="kanban-cards scrollbar-thin"
            :list="leadsByStatus[status.value]"
            group="leads"
            @change="handleDragChange($event, status.value)"
            item-key="id"
            ghost-class="ghost"
            drag-class="dragging"
            animation="200"
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
import { Plus, Search } from 'lucide-vue-next'

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

// Helper for status colors
function getStatusColorClass(status) {
  const colors = {
    'new': 'bg-blue-500',
    'contacted': 'bg-amber-500',
    'qualified': 'bg-purple-500',
    'proposal': 'bg-indigo-500',
    'negotiation': 'bg-pink-500',
    'closed': 'bg-emerald-500',
    'lost': 'bg-slate-500'
  }
  return colors[status] || 'bg-slate-400'
}

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

<style scoped lang="postcss">
.btn-primary {
  @apply px-5 py-2.5 bg-kapital-dark text-white font-medium rounded-xl transition-all hover:bg-blue-700 active:scale-95 flex items-center justify-center gap-2;
}

.kanban-column {
  @apply flex-shrink-0 w-80 bg-gray-50 rounded-xl p-3 flex flex-col border border-gray-200 transition-colors hover:bg-gray-100;
}

.column-header {
  @apply flex items-center justify-between px-3 py-3 mb-2;
}

.kanban-cards {
  @apply flex-grow min-h-[100px] space-y-3 p-1 overflow-y-auto;
}

.ghost {
  @apply bg-slate-200/50 opacity-50 rounded-xl border-2 border-dashed border-slate-300;
}

.dragging {
  @apply cursor-grabbing rotate-2 scale-105 shadow-2xl ring-2 ring-kapital-dark ring-offset-2 ring-offset-slate-100;
}

/* Scrollbar fina para las columnas */
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