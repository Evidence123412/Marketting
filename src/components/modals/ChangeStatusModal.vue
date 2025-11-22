<template>
  <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div 
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :enter="{ opacity: 1, scale: 1 }"
      class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20"
    >
      <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <RefreshCw :size="20" class="text-kapital-dark" /> Cambiar estado de {{ lead.name }}
      </h3>
      
      <div class="space-y-3 mb-6">
        <button 
          v-for="status in statusOptions"
          :key="status.value"
          @click="updateStatus(status.value)"
          :class="['w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 group', 
            lead.status === status.value ? `border-${status.color}-500 bg-${status.color}-50 ring-1 ring-${status.color}-500` : 'border-slate-200 hover:border-kapital-dark/50 hover:bg-slate-50']"
        >
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center transition-colors', lead.status === status.value ? `bg-${status.color}-500 text-white` : `bg-slate-100 text-slate-400 group-hover:text-${status.color}-600`]">
            <component :is="getIcon(status.icon)" :size="18" />
          </div>
          <div>
            <p class="font-bold text-slate-900 text-sm">{{ status.label }}</p>
          </div>
          <CheckCircle2 v-if="lead.status === status.value" :size="18" :class="`ml-auto text-${status.color}-600`" />
        </button>
      </div>

      <button 
        @click="$emit('close')"
        class="btn-secondary w-full"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { RefreshCw, CheckCircle2, Circle, Clock, CheckCircle, XCircle, HelpCircle } from 'lucide-vue-next'

const props = defineProps({
  lead: Object,
  statusOptions: Array
})

const emit = defineEmits(['close', 'update-status'])

function updateStatus(newStatus) {
  emit('update-status', { leadId: props.lead.id, newStatus })
}

function getIcon(iconName) {
  // Map FontAwesome icon names to Lucide components if needed, or just return a default
  // Assuming statusOptions might still have FA names, we map them here
  const map = {
    'fa-circle': Circle,
    'fa-clock': Clock,
    'fa-check-circle': CheckCircle,
    'fa-times-circle': XCircle
  }
  return map[iconName] || HelpCircle
}
</script>

<style scoped lang="postcss">
.btn-secondary {
  @apply px-5 py-2.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center gap-2 text-sm;
}
</style>