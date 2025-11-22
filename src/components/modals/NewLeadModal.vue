<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-900">Nuevo Lead</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      
      <form @submit.prevent="submitLead" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input v-model="leadData.name" type="text" placeholder="Ej: Juan García" class="form-input" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
          <input v-model="leadData.company" type="text" placeholder="Ej: Acme Inc." class="form-input" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="leadData.email" type="email" placeholder="Ej: juan@email.com" class="form-input" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input v-model="leadData.phone" type="tel" placeholder="Ej: +34 123 456 789" class="form-input" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Origen</label>
            <select v-model="leadData.origin" class="form-input" required>
              <option value="">Seleccionar...</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Web">Web</option>
              <option value="Email">Email</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Asignar a</label>
            <select v-model="leadData.assignedTo" class="form-input" required>
              <option value="">Seleccionar...</option>
              <option v-for="user in users" :key="user" :value="user">{{ user }}</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button type="button" @click="$emit('close')" class="btn-secondary flex-1">
            Cancelar
          </button>
          <button type="submit" class="btn-primary flex-1">
            <i class="fas fa-plus"></i> Crear Lead
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  users: Array
})

const emit = defineEmits(['close', 'save'])

const leadData = ref({
  name: '',
  company: '',
  email: '',
  phone: '',
  origin: '',
  assignedTo: ''
})

function submitLead() {
  if (!leadData.value.name || !leadData.value.email || !leadData.value.origin || !leadData.value.assignedTo) {
    emit('showToast', { message: 'Por favor completa los campos requeridos', type: 'error' })
    return
  }
  emit('save', leadData.value)
}
</script>

<style scoped>
.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-1 focus:ring-kapital-dark;
}
.btn-primary {
  @apply px-6 py-3 bg-kapital-dark text-white font-medium rounded-md transition-all hover:bg-blue-700 active:scale-95 flex items-center justify-center gap-2;
}
.btn-secondary {
  @apply px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200;
}
</style>