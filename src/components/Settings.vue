<template>
  <div class="space-y-6 h-full flex flex-col">
    <!-- Header -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    >
      <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Configuración</h1>
      <p class="text-slate-500 mt-1">Administra tus redes sociales, horarios de publicación y equipo.</p>
    </div>

    <!-- Tabs Navigation -->
    <div class="border-b border-slate-200/60">
      <nav class="-mb-px flex gap-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
        <button 
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-4 px-1 border-b-2 font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap',
            activeTab === tab.id 
              ? 'border-kapital-dark text-kapital-dark' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          ]"
        >
          <component :is="tab.iconComponent" :size="18" />
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-y-auto scrollbar-thin pr-2 pb-4">
      
      <!-- Networks Tab -->
      <div v-if="activeTab === 'networks'" class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <LinkIcon :size="20" class="text-kapital-dark" /> Redes Sociales Conectadas
              </h2>
              <p class="text-sm text-slate-500 mt-1">Selecciona las redes donde deseas publicar y gestionar contenido.</p>
            </div>
            <div class="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
              {{ activeNetworksCount }} Activas
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div 
              v-for="network in networks" 
              :key="network.id"
              @click="toggleNetwork(network.id)"
              :class="[
                'p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-4 group relative overflow-hidden',
                network.connected
                  ? 'border-kapital-dark bg-blue-50/30 ring-1 ring-kapital-dark/20'
                  : 'border-slate-200 bg-white hover:border-kapital-dark/50 hover:shadow-md'
              ]"
            >
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110', network.bgClass]">
                <component :is="network.iconComponent" :size="24" />
              </div>
              <div class="flex-1 relative z-10">
                <p class="font-bold text-slate-900">{{ network.name }}</p>
                <p class="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Users :size="12" />
                  {{ network.connected ? `${network.followers} seguidores` : 'No conectado' }}
                </p>
              </div>
              <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors relative z-10', network.connected ? 'bg-kapital-dark border-kapital-dark' : 'border-slate-300 bg-slate-50']">
                <Check v-if="network.connected" :size="14" class="text-white" />
              </div>
              
              <!-- Decorative background -->
              <div v-if="network.connected" class="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>
            </div>
          </div>

          <div class="flex justify-end pt-6 border-t border-slate-100">
            <button @click="saveNetworks" class="btn-primary shadow-lg shadow-kapital-dark/20">
              <Save :size="18" /> Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      <!-- Schedule Tab -->
      <div v-if="activeTab === 'schedule'" class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock :size="20" class="text-kapital-dark" /> Horarios de Publicación
            </h2>
            <p class="text-sm text-slate-500 mt-1">Define las ventanas de tiempo permitidas para tus publicaciones automáticas.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Time Range -->
            <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
              <h3 class="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Hourglass :size="16" class="text-blue-600" /> Rango Horario
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Inicio</label>
                  <div class="relative">
                    <input 
                      v-model="schedule.startTime"
                      type="time" 
                      class="w-full pl-10 pr-4 py-2.5 bg-white border border-blue-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <Sun :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Fin</label>
                  <div class="relative">
                    <input 
                      v-model="schedule.endTime"
                      type="time" 
                      class="w-full pl-10 pr-4 py-2.5 bg-white border border-blue-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <Moon :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Max Publications -->
            <div class="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
              <h3 class="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                <BarChart2 :size="16" class="text-emerald-600" /> Límites
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Máximo por día</label>
                  <div class="flex items-center gap-3">
                    <input 
                      v-model.number="schedule.maxPerDay"
                      type="number" 
                      min="1"
                      max="50"
                      class="w-24 px-4 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    />
                    <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">posts/día</span>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Máximo por hora</label>
                  <div class="flex items-center gap-3">
                    <input 
                      v-model.number="schedule.maxPerHour"
                      type="number" 
                      min="1"
                      max="10"
                      class="w-24 px-4 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    />
                    <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">posts/hora</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Auto-publish -->
            <div class="bg-purple-50/50 border border-purple-100 rounded-xl p-5 flex flex-col">
              <h3 class="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Zap :size="16" class="text-purple-600" /> Automatización
              </h3>
              <div class="flex-1 flex items-center">
                <label class="flex items-start gap-4 cursor-pointer group p-3 rounded-xl hover:bg-purple-50 transition-colors w-full">
                  <div class="relative flex items-center">
                    <input 
                      v-model="schedule.autoPublish"
                      type="checkbox" 
                      class="peer sr-only"
                    />
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                  <div class="flex-1">
                    <p class="font-bold text-slate-900 text-sm group-hover:text-purple-700 transition-colors">Publicación Automática</p>
                    <p class="text-xs text-slate-500 mt-1">Si se activa, el sistema publicará automáticamente el contenido programado cuando llegue su hora.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-6 mt-6 border-t border-slate-100">
            <button @click="saveSchedule" class="btn-primary shadow-lg shadow-kapital-dark/20">
              <Save :size="18" /> Guardar Configuración
            </button>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users :size="20" class="text-kapital-dark" /> Usuarios del Sistema
              </h2>
              <p class="text-sm text-slate-500 mt-1">Gestiona los miembros de tu equipo y sus permisos.</p>
            </div>
            <button @click="showNewUserModal = true" class="btn-primary shadow-lg shadow-kapital-dark/20">
              <UserPlus :size="18" /> Nuevo Usuario
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider">
                <tr>
                  <th class="px-6 py-4">Usuario</th>
                  <th class="px-6 py-4">Email</th>
                  <th class="px-6 py-4">Rol</th>
                  <th class="px-6 py-4">Estado</th>
                  <th class="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/50 transition-colors group">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-kapital-dark to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {{ user.initials }}
                      </div>
                      <span class="font-bold text-slate-900">{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-slate-600 font-medium">{{ user.email }}</td>
                  <td class="px-6 py-4">
                    <span :class="['text-xs font-bold px-3 py-1 rounded-full border', getRoleBadge(user.role)]">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="['text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5', user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500']">
                      <div :class="['w-1.5 h-1.5 rounded-full', user.active ? 'bg-emerald-500' : 'bg-slate-400']"></div>
                      {{ user.active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        @click="editUser(user)"
                        class="p-2 text-slate-400 hover:text-kapital-dark hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 :size="16" />
                      </button>
                      <button 
                        @click="toggleUserStatus(user.id)"
                        :class="['p-2 rounded-lg transition-colors', user.active ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50']"
                        :title="user.active ? 'Desactivar' : 'Activar'"
                      >
                        <component :is="user.active ? Lock : Unlock" :size="16" />
                      </button>
                      <button 
                        @click="deleteUser(user.id)"
                        class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 :size="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- New User Modal -->
    <div v-if="showNewUserModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :enter="{ opacity: 1, scale: 1 }"
        class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserPlus :size="20" class="text-kapital-dark" /> Nuevo Usuario
          </h3>
          <button @click="showNewUserModal = false" class="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X :size="24" />
          </button>
        </div>

        <form @submit.prevent="addUser" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Nombre completo</label>
            <div class="relative">
              <input 
                v-model="newUser.name"
                type="text"
                placeholder="Ej: Juan García"
                class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm"
                required
              />
              <User :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
            <div class="relative">
              <input 
                v-model="newUser.email"
                type="email"
                placeholder="Ej: juan@company.com"
                class="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm"
                required
              />
              <Mail :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Rol</label>
            <div class="relative">
              <select 
                v-model="newUser.role"
                class="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-sm appearance-none bg-white"
                required
              >
                <option value="">Seleccionar rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Editor">Editor</option>
                <option value="Visualizador">Visualizador</option>
              </select>
              <Shield :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <ChevronDown :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div class="flex gap-3 pt-6 border-t border-slate-100">
            <button 
              type="button"
              @click="showNewUserModal = false"
              class="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="btn-primary flex-1 shadow-lg shadow-kapital-dark/20"
            >
              <UserPlus :size="18" /> Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Link as LinkIcon, Clock, Users, Save, Check, Hourglass, Sun, Moon, 
  BarChart2, Zap, UserPlus, Edit2, Trash2, Lock, Unlock, X, User, Mail, Shield, ChevronDown,
  Facebook, Instagram, Linkedin, Twitter, Youtube
} from 'lucide-vue-next'

const emit = defineEmits(['showToast'])

const activeTab = ref('networks')
const showNewUserModal = ref(false)

const tabs = [
  { id: 'networks', label: 'Redes Conectadas', iconComponent: LinkIcon },
  { id: 'schedule', label: 'Horarios', iconComponent: Clock },
  { id: 'users', label: 'Usuarios', iconComponent: Users }
]

const networks = ref([
  { id: 1, name: 'Facebook', iconComponent: Facebook, bgClass: 'bg-blue-600', connected: true, followers: '3.2K' },
  { id: 2, name: 'Instagram', iconComponent: Instagram, bgClass: 'bg-pink-600', connected: true, followers: '5.1K' },
  { id: 3, name: 'Twitter', iconComponent: Twitter, bgClass: 'bg-slate-900', connected: false, followers: '-' },
  { id: 4, name: 'LinkedIn', iconComponent: Linkedin, bgClass: 'bg-blue-700', connected: true, followers: '2.8K' },
  { id: 5, name: 'YouTube', iconComponent: Youtube, bgClass: 'bg-red-600', connected: false, followers: '-' }
])

const schedule = ref({
  startTime: '08:00',
  endTime: '22:00',
  maxPerDay: 10,
  maxPerHour: 3,
  autoPublish: true
})

const users = ref([
  { id: 1, initials: 'CL', name: 'Carlos López', email: 'carlos@company.com', role: 'Administrador', active: true },
  { id: 2, initials: 'MG', name: 'María García', email: 'maria@company.com', role: 'Editor', active: true },
  { id: 3, initials: 'JP', name: 'Juan Pérez', email: 'juan@company.com', role: 'Visualizador', active: false },
  { id: 4, initials: 'LR', name: 'Laura Rodríguez', email: 'laura@company.com', role: 'Editor', active: true }
])

const newUser = ref({
  name: '',
  email: '',
  role: ''
})

const activeNetworksCount = computed(() => networks.value.filter(n => n.connected).length)

function toggleNetwork(id) {
  const network = networks.value.find(n => n.id === id)
  if (network) {
    network.connected = !network.connected
  }
}

function saveNetworks() {
  const connected = networks.value.filter(n => n.connected).map(n => n.name).join(', ')
  emit('showToast', `Redes guardadas: ${connected || 'Ninguna'}`)
}

function saveSchedule() {
  emit('showToast', `Horarios guardados: ${schedule.value.startTime} - ${schedule.value.endTime}`)
}

function editUser(user) {
  emit('showToast', `Editando usuario: ${user.name}`)
}

function toggleUserStatus(id) {
  const user = users.value.find(u => u.id === id)
  if (user) {
    user.active = !user.active
    emit('showToast', `Usuario ${user.active ? 'activado' : 'desactivado'}`)
  }
}

function deleteUser(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    users.value = users.value.filter(u => u.id !== id)
    emit('showToast', 'Usuario eliminado')
  }
}

function addUser() {
  if (!newUser.value.name || !newUser.value.email || !newUser.value.role) {
    emit('showToast', 'Por favor completa todos los campos', 'error')
    return
  }

  const initials = newUser.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
  
  const user = {
    id: Math.max(...users.value.map(u => u.id)) + 1,
    initials: initials,
    name: newUser.value.name,
    email: newUser.value.email,
    role: newUser.value.role,
    active: true
  }

  users.value.unshift(user)
  showNewUserModal.value = false
  newUser.value = { name: '', email: '', role: '' }
  emit('showToast', `Usuario "${user.name}" creado exitosamente`)
}

function getRoleBadge(role) {
  const classes = {
    'Administrador': 'bg-purple-50 text-purple-700 border-purple-100',
    'Editor': 'bg-blue-50 text-blue-700 border-blue-100',
    'Visualizador': 'bg-slate-50 text-slate-700 border-slate-200'
  }
  return classes[role] || 'bg-slate-50 text-slate-700 border-slate-200'
}
</script>

<style scoped lang="postcss">
.btn-primary {
  @apply px-5 py-2.5 bg-kapital-dark text-white font-medium rounded-xl transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 flex items-center gap-2 justify-center text-sm;
}

.btn-secondary {
  @apply px-5 py-2.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 transition-all hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 justify-center text-sm;
}

/* Scrollbar fina */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.scrollbar-thin:hover::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>