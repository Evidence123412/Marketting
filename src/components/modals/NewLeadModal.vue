<template>
  <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div 
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :enter="{ opacity: 1, scale: 1 }"
      class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20"
    >
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <UserPlus :size="20" class="text-kapital-dark" /> Nuevo Lead
        </h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <X :size="24" />
        </button>
      </div>
      
      <form @submit.prevent="submitLead" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Nombre completo</label>
          <div class="relative">
            <input 
              v-model="leadData.name" 
              type="text" 
              placeholder="Ej: Juan García" 
              class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm" 
              required 
            />
            <User :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Empresa</label>
          <div class="relative">
            <input 
              v-model="leadData.company" 
              type="text" 
              placeholder="Ej: Acme Inc." 
              class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm" 
            />
            <Building2 :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
            <div class="relative">
              <input 
                v-model="leadData.email" 
                type="email" 
                placeholder="Ej: juan@email.com" 
                class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm" 
                required 
              />
              <Mail :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Teléfono</label>
            <div class="relative">
              <input 
                v-model="leadData.phone" 
                type="tel" 
                placeholder="Ej: +34 123..." 
                class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm" 
              />
              <Phone :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Origen</label>
            <div class="relative">
              <select 
                v-model="leadData.origin" 
                class="w-full pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm appearance-none bg-white" 
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
              <Globe :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <ChevronDown :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Asignar a</label>
            <div class="relative">
              <select 
                v-model="leadData.assignedTo" 
                class="w-full pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm appearance-none bg-white" 
                required
              >
                <option value="">Seleccionar...</option>
                <option v-for="user in users" :key="user" :value="user">{{ user }}</option>
              </select>
              <UserCheck :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <ChevronDown :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-6 border-t border-slate-100">
          <button type="button" @click="$emit('close')" class="btn-secondary flex-1">
            Cancelar
          </button>
          <button type="submit" class="btn-primary flex-1 shadow-lg shadow-kapital-dark/20">
            <UserPlus :size="18" /> Crear Lead
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UserPlus, X, User, Building2, Mail, Phone, Globe, UserCheck, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  users: Array
})

const emit = defineEmits(['close', 'save', 'showToast'])

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

<style scoped lang="postcss">
.btn-primary {
  @apply px-5 py-2.5 bg-kapital-dark text-white font-medium rounded-xl transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-2 text-sm;
}

.btn-secondary {
  @apply px-5 py-2.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center gap-2 text-sm;
}
</style>