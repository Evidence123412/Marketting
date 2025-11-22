<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Cambiar estado de {{ lead.name }}</h3>
      
      <div class="space-y-2 mb-6">
        <button 
          v-for="status in statusOptions"
          :key="status.value"
          @click="updateStatus(status.value)"
          :class="['w-full p-3 rounded-lg border-2 transition-all text-left', 
            lead.status === status.value ? `border-${status.color}-500 bg-${status.color}-50` : 'border-gray-200 hover:border-gray-400']"
        >
          <div class="flex items-center gap-3">
            <i :class="['fas', status.icon, `text-${status.color}-600`]"></i>
            <div>
              <p class="font-medium text-gray-900">{{ status.label }}</p>
            </div>
          </div>
        </button>
      </div>

      <button 
        @click="$emit('close')"
        class="btn-secondary w-full"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  lead: Object,
  statusOptions: Array
})

const emit = defineEmits(['close', 'update-status'])

function updateStatus(newStatus) {
  emit('update-status', { leadId: props.lead.id, newStatus })
}
</script>

<style scoped>
.btn-secondary {
  @apply px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200;
}
</style>