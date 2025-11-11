<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>Configuración</h1>
      <p>Administra redes, horarios y usuarios</p>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex gap-0 border-b-2 border-gray-200 mb-6 overflow-x-auto">
      <button 
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-6 py-3 font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2',
          activeTab === tab.id 
            ? 'border-kapital-dark text-kapital-dark' 
            : 'border-transparent text-gray-600 hover:text-gray-900'
        ]"
      >
        <i :class="['fas', tab.icon]"></i>
        {{ tab.label }}
      </button>
    </div>

    <!-- Networks Tab -->
    <div v-if="activeTab === 'networks'" class="space-y-6">
      <div class="card">
        <h2 class="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <i class="fas fa-link text-kapital-dark"></i> Redes Sociales Conectadas
        </h2>
        <p class="text-sm text-gray-600 mb-6">Selecciona las redes donde deseas publicar</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div 
            v-for="network in networks" 
            :key="network.id"
            @click="toggleNetwork(network.id)"
            :class="[
              'p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center gap-3',
              network.connected
                ? 'border-kapital-dark bg-blue-50'
                : 'border-gray-300 bg-white hover:border-kapital-dark'
            ]"
          >
            <div :class="['w-12 h-12 rounded-lg flex items-center justify-center text-white', network.bgColor]">
              <i :class="['fas', network.icon, 'text-lg']"></i>
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ network.name }}</p>
              <p class="text-xs text-gray-600">
                {{ network.connected ? `${network.followers} seguidores` : 'No conectado' }}
              </p>
            </div>
            <div :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center', network.connected ? 'bg-kapital-dark border-kapital-dark' : 'border-gray-300']">
              <i v-if="network.connected" class="fas fa-check text-white text-xs"></i>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6 space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <i class="fas fa-circle-info text-kapital-dark"></i> Redes Activas
            </h3>
            <p class="text-sm text-gray-700">
              Tienes <span class="font-bold text-kapital-dark">{{ activeNetworksCount }}</span> red(es) conectada(s)
            </p>
          </div>
          <button @click="saveNetworks" class="btn-primary w-full">
            <i class="fas fa-save"></i> Guardar Cambios
          </button>
        </div>
      </div>
    </div>

    <!-- Schedule Tab -->
    <div v-if="activeTab === 'schedule'" class="space-y-6">
      <div class="card">
        <h2 class="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <i class="fas fa-clock text-kapital-dark"></i> Horarios de Publicación
        </h2>
        <p class="text-sm text-gray-600 mb-6">Define cuándo se pueden publicar tus contenidos</p>

        <div class="space-y-6">
          <!-- Time Range -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-hourglass-start text-kapital-dark"></i> Rango Horario Permitido
            </h3>
            <div class="flex items-center gap-4 flex-wrap">
              <div class="flex-1 min-w-48">
                <label class="block text-sm font-medium text-gray-700 mb-2">Desde</label>
                <input 
                  v-model="schedule.startTime"
                  type="time" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
                />
              </div>
              <span class="text-gray-600 font-medium mt-6">hasta</span>
              <div class="flex-1 min-w-48">
                <label class="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
                <input 
                  v-model="schedule.endTime"
                  type="time" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
                />
              </div>
            </div>
          </div>

          <!-- Max Publications -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-chart-line text-green-600"></i> Límite de Publicaciones
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Máximo por día</label>
                <div class="flex items-center gap-4">
                  <input 
                    v-model.number="schedule.maxPerDay"
                    type="number" 
                    min="1"
                    max="50"
                    class="w-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
                  />
                  <span class="text-sm text-gray-600">publicaciones</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Máximo por hora</label>
                <div class="flex items-center gap-4">
                  <input 
                    v-model.number="schedule.maxPerHour"
                    type="number" 
                    min="1"
                    max="10"
                    class="w-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
                  />
                  <span class="text-sm text-gray-600">publicaciones</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Auto-publish -->
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fas fa-robot text-purple-600"></i> Automatización
            </h3>
            <label class="flex items-center gap-3 cursor-pointer">
              <input 
                v-model="schedule.autoPublish"
                type="checkbox" 
                class="accent-kapital-dark w-5 h-5"
              />
              <div>
                <p class="font-medium text-gray-900">Publicación automática</p>
                <small class="text-gray-600">Publica automáticamente en el horario programado</small>
              </div>
            </label>
          </div>

          <button @click="saveSchedule" class="btn-primary w-full">
            <i class="fas fa-save"></i> Guardar Cambios
          </button>
        </div>
      </div>
    </div>

    <!-- Users Tab -->
    <div v-if="activeTab === 'users'" class="space-y-6">
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i class="fas fa-users text-kapital-dark"></i> Usuarios del Sistema
            </h2>
            <p class="text-sm text-gray-600 mt-1">Gestiona los miembros de tu equipo</p>
          </div>
          <button @click="showNewUserModal = true" class="btn-primary">
            <i class="fas fa-user-plus"></i> Nuevo Usuario
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left font-semibold text-gray-700">
                  <i class="fas fa-user mr-2 text-kapital-dark"></i>Usuario
                </th>
                <th class="px-6 py-4 text-left font-semibold text-gray-700">
                  <i class="fas fa-envelope mr-2 text-kapital-dark"></i>Email
                </th>
                <th class="px-6 py-4 text-left font-semibold text-gray-700">
                  <i class="fas fa-briefcase mr-2 text-kapital-dark"></i>Rol
                </th>
                <th class="px-6 py-4 text-left font-semibold text-gray-700">
                  <i class="fas fa-toggle-on mr-2 text-kapital-dark"></i>Estado
                </th>
                <th class="px-6 py-4 text-left font-semibold text-gray-700">
                  <i class="fas fa-cogs mr-2 text-kapital-dark"></i>Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-kapital-dark to-kapital-light-1 flex items-center justify-center text-white text-xs font-bold">
                      {{ user.initials }}
                    </div>
                    <span class="font-medium text-gray-900">{{ user.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-600">{{ user.email }}</td>
                <td class="px-6 py-4">
                  <span :class="['text-xs font-bold px-3 py-1 rounded-full', getRoleColor(user.role)]">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="['text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1', user.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700']">
                    <i :class="['fas', user.active ? 'fa-check-circle' : 'fa-circle']"></i>
                    {{ user.active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <button 
                      @click="editUser(user)"
                      class="px-3 py-2 text-kapital-dark hover:bg-blue-100 rounded transition-colors"
                      title="Editar"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="toggleUserStatus(user.id)"
                      :class="['px-3 py-2 rounded transition-colors', user.active ? 'text-yellow-600 hover:bg-yellow-100' : 'text-green-600 hover:bg-green-100']"
                      :title="user.active ? 'Desactivar' : 'Activar'"
                    >
                      <i :class="['fas', user.active ? 'fa-lock' : 'fa-unlock']"></i>
                    </button>
                    <button 
                      @click="deleteUser(user.id)"
                      class="px-3 py-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Eliminar"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- New User Modal -->
    <div v-if="showNewUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Nuevo Usuario</h3>
          <button @click="showNewUserModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="addUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
            <input 
              v-model="newUser.name"
              type="text"
              placeholder="Ej: Juan García"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              v-model="newUser.email"
              type="email"
              placeholder="Ej: juan@company.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rol</label>
            <select 
              v-model="newUser.role"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
              required
            >
              <option value="">Seleccionar rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Editor">Editor</option>
              <option value="Visualizador">Visualizador</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button"
              @click="showNewUserModal = false"
              class="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="btn-primary flex-1"
            >
              <i class="fas fa-user-plus"></i> Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['showToast'])

const activeTab = ref('networks')
const showNewUserModal = ref(false)

const tabs = [
  { id: 'networks', label: 'Redes Conectadas', icon: 'fa-link' },
  { id: 'schedule', label: 'Horarios', icon: 'fa-clock' },
  { id: 'users', label: 'Usuarios', icon: 'fa-users' }
]

const networks = ref([
  { id: 1, name: 'Facebook', icon: 'bi bi-facebook', bgColor: 'bg-blue-600', connected: true, followers: '3.2K' },
  { id: 2, name: 'Instagram', icon: 'bi bi-instagram', bgColor: 'bg-pink-600', connected: true, followers: '5.1K' },
  { id: 3, name: 'Twitter', icon: 'bi bi-twitter-x', bgColor: 'bg-cyan-600', connected: false, followers: '-' },
  { id: 4, name: 'LinkedIn', icon: 'bi bi-linkedin', bgColor: 'bg-indigo-600', connected: true, followers: '2.8K' },
  { id: 5, name: 'TikTok', icon: 'bi bi-tiktok', bgColor: 'bg-gray-900', connected: false, followers: '-' },
  { id: 6, name: 'YouTube', icon: 'bi bi-youtube', bgColor: 'bg-red-600', connected: false, followers: '-' }
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

function getRoleColor(role) {
  const colors = {
    'Administrador': 'bg-red-100 text-red-700',
    'Editor': 'bg-blue-100 text-blue-700',
    'Visualizador': 'bg-gray-100 text-gray-700'
  }
  return colors[role] || 'bg-gray-100 text-gray-700'
}
</script>

<style scoped>
.btn-primary {
  @apply px-6 py-3 bg-kapital-dark text-white font-medium rounded-md transition-all hover:bg-blue-700 active:scale-95 flex items-center gap-2 justify-center;
}

.btn-secondary {
  @apply px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200;
}
</style>