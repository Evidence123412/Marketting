<template>
  <div class="space-y-6 h-full flex flex-col">
    <!-- Header -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    >
      <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Configuración</h1>
      <p class="text-slate-500 mt-1">Personaliza tu experiencia, gestiona tu marca y configura el sistema.</p>
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
              ? 'border-kapital-night text-kapital-night' 
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
      
      <!-- General Tab (Branding) -->
      <div v-if="activeTab === 'general'" class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase :size="20" class="text-kapital-night" /> Identidad de Marca
            </h2>
            <p class="text-sm text-slate-500 mt-1">Define cómo se presenta tu marca en el contenido generado.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="form-label">Nombre de la Empresa</label>
              <div class="relative">
                <input v-model="branding.companyName" type="text" class="form-input" placeholder="Ej: Kapital CMS" />
                <Building2 :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div>
              <label class="form-label">Sitio Web</label>
              <div class="relative">
                <input v-model="branding.website" type="url" class="form-input" placeholder="Ej: https://kapital.com" />
                <Globe :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Tono de Voz</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                  v-for="tone in tones" 
                  :key="tone.id"
                  @click="branding.tone = tone.id"
                  :class="['p-3 border rounded-xl text-sm font-medium transition-all text-center', branding.tone === tone.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300']"
                >
                  {{ tone.label }}
                </button>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Colores de Marca</label>
              <div class="flex gap-4">
                <div v-for="(color, index) in branding.colors" :key="index" class="flex flex-col gap-2">
                  <input type="color" v-model="branding.colors[index]" class="w-12 h-12 rounded-lg cursor-pointer border-0 p-0" />
                  <span class="text-xs font-mono text-slate-500 uppercase">{{ branding.colors[index] }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-6 mt-6 border-t border-slate-100">
            <button @click="saveGeneral" class="btn-primary shadow-lg shadow-slate-900/20">
              <Save :size="18" /> Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      <!-- Integrations Tab (Networks) -->
      <div v-if="activeTab === 'integrations'" class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <LinkIcon :size="20" class="text-kapital-night" /> Redes Sociales
              </h2>
              <p class="text-sm text-slate-500 mt-1">Conecta tus cuentas para publicar automáticamente.</p>
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
                  ? 'border-kapital-night bg-slate-50 ring-1 ring-kapital-night/10'
                  : 'border-slate-200 bg-white hover:border-kapital-night/50 hover:shadow-md'
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
              <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors relative z-10', network.connected ? 'bg-kapital-night border-kapital-night' : 'border-slate-300 bg-slate-50']">
                <Check v-if="network.connected" :size="14" class="text-white" />
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-6 border-t border-slate-100">
            <button @click="saveNetworks" class="btn-primary shadow-lg shadow-slate-900/20">
              <Save :size="18" /> Guardar Integraciones
            </button>
          </div>
        </div>
      </div>

      <!-- Variables Tab (New) -->
      <div v-if="activeTab === 'variables'" class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database :size="20" class="text-kapital-night" /> Variables del Sistema
            </h2>
            <p class="text-sm text-slate-500 mt-1">Configura las opciones disponibles para la generación de Buyer Persona.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Sidebar Selection -->
            <div class="lg:col-span-1 space-y-2">
              <button 
                v-for="list in variableLists" 
                :key="list.id"
                @click="activeVariableList = list.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex justify-between items-center',
                  activeVariableList === list.id 
                    ? 'bg-kapital-night text-white shadow-md shadow-slate-900/20' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                ]"
              >
                {{ list.label }}
                <span class="bg-white/20 px-2 py-0.5 rounded-full text-xs">{{ list.data.value.length }}</span>
              </button>
            </div>

            <!-- Content Editor -->
            <div class="lg:col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div class="flex gap-2 mb-4">
                <input 
                  v-model="newVariable" 
                  @keyup.enter="addVariable"
                  type="text" 
                  class="form-input" 
                  :placeholder="`Agregar nueva opción a ${variableLists.find(l => l.id === activeVariableList).label}...`" 
                />
                <button @click="addVariable" class="btn-primary whitespace-nowrap">
                  <Plus :size="18" /> Agregar
                </button>
              </div>

              <div class="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin pr-2">
                <div 
                  v-for="(item, index) in variableLists.find(l => l.id === activeVariableList).data.value" 
                  :key="index"
                  class="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 group hover:border-kapital-night/30 transition-colors"
                >
                  <span class="text-sm font-medium text-slate-700">{{ item }}</span>
                  <button 
                    @click="removeVariable(activeVariableList, item)"
                    class="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
                <div v-if="variableLists.find(l => l.id === activeVariableList).data.value.length === 0" class="text-center py-8 text-slate-400">
                  <p>No hay opciones configuradas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI & Automation Tab -->
      <div v-if="activeTab === 'ai'" class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Wand2 :size="20" class="text-kapital-night" /> IA y Automatización
            </h2>
            <p class="text-sm text-slate-500 mt-1">Configura el comportamiento del generador de contenido y la programación.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- AI Settings -->
            <div class="space-y-6">
              <h3 class="font-bold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">Preferencias de IA</h3>
              
              <div>
                <label class="form-label flex justify-between">
                  <span>Nivel de Creatividad</span>
                  <span class="text-kapital-night">{{ aiSettings.creativity }}%</span>
                </label>
                <input v-model="aiSettings.creativity" type="range" min="0" max="100" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-kapital-night" />
                <div class="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Conservador</span>
                  <span>Balanceado</span>
                  <span>Creativo</span>
                </div>
              </div>

              <div>
                <label class="form-label">Hashtags por Defecto</label>
                <textarea v-model="aiSettings.defaultHashtags" rows="3" class="form-input" placeholder="#Marca #Industria #Tendencia"></textarea>
              </div>
            </div>

            <!-- Schedule Settings -->
            <div class="space-y-6">
              <h3 class="font-bold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">Programación Automática</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Inicio Jornada</label>
                  <input v-model="schedule.startTime" type="time" class="form-input" />
                </div>
                <div>
                  <label class="form-label">Fin Jornada</label>
                  <input v-model="schedule.endTime" type="time" class="form-input" />
                </div>
              </div>

              <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input v-model="schedule.autoPublish" type="checkbox" class="w-5 h-5 text-kapital-night rounded border-slate-300 focus:ring-kapital-night" />
                  <div>
                    <span class="block font-bold text-slate-900 text-sm">Publicación Automática</span>
                    <span class="block text-xs text-slate-500">Publicar sin revisión manual si la confianza de la IA es alta.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-6 mt-6 border-t border-slate-100">
            <button @click="saveAI" class="btn-primary shadow-lg shadow-slate-900/20">
              <Save :size="18" /> Guardar Preferencias
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications Tab -->
      <div v-if="activeTab === 'notifications'" class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bell :size="20" class="text-kapital-night" /> Notificaciones
            </h2>
            <p class="text-sm text-slate-500 mt-1">Elige qué alertas deseas recibir.</p>
          </div>

          <div class="space-y-4">
            <div v-for="notif in notifications" :key="notif.id" class="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div class="flex items-center gap-3">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center', notif.bgClass]">
                  <component :is="notif.icon" :size="20" :class="notif.textClass" />
                </div>
                <div>
                  <p class="font-bold text-slate-900 text-sm">{{ notif.label }}</p>
                  <p class="text-xs text-slate-500">{{ notif.description }}</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notif.enabled" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-kapital-night"></div>
              </label>
            </div>
          </div>

          <div class="flex justify-end pt-6 mt-6 border-t border-slate-100">
            <button @click="saveNotifications" class="btn-primary shadow-lg shadow-slate-900/20">
              <Save :size="18" /> Guardar Notificaciones
            </button>
          </div>
        </div>
      </div>

      <!-- Team Tab (Users) -->
      <div v-if="activeTab === 'team'" class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users :size="20" class="text-kapital-night" /> Equipo
              </h2>
              <p class="text-sm text-slate-500 mt-1">Gestiona los miembros de tu equipo y sus permisos.</p>
            </div>
            <button @click="showNewUserModal = true" class="btn-primary shadow-lg shadow-slate-900/20">
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
                      <div class="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold shadow-sm">
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
                        class="p-2 text-slate-400 hover:text-kapital-night hover:bg-slate-100 rounded-lg transition-colors"
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
            <UserPlus :size="20" class="text-kapital-night" /> Nuevo Usuario
          </h3>
          <button @click="showNewUserModal = false" class="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X :size="24" />
          </button>
        </div>

        <form @submit.prevent="addUser" class="space-y-5">
          <div>
            <label class="form-label">Nombre completo</label>
            <div class="relative">
              <input 
                v-model="newUser.name"
                type="text"
                placeholder="Ej: Juan García"
                class="form-input pl-10"
                required
              />
              <User :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label class="form-label">Email</label>
            <div class="relative">
              <input 
                v-model="newUser.email"
                type="email"
                placeholder="Ej: juan@company.com"
                class="form-input pl-10"
                required
              />
              <Mail :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label class="form-label">Rol</label>
            <div class="relative">
              <select 
                v-model="newUser.role"
                class="form-input pl-10 appearance-none"
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
              class="btn-primary flex-1 shadow-lg shadow-slate-900/20"
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
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'
import { 
  Link as LinkIcon, Clock, Users, Save, Check, Hourglass, Sun, Moon, 
  BarChart2, Zap, UserPlus, Edit2, Trash2, Lock, Unlock, X, User, Mail, Shield, ChevronDown,
  Facebook, Instagram, Linkedin, Twitter, Youtube, Briefcase, Building2, Globe, Wand2, Bell, MessageSquare, FileText,
  Database, Plus, Minus
} from 'lucide-vue-next'

const emit = defineEmits(['showToast'])
const settingsStore = useSettingsStore()
const { branding, aiSettings, zones, professions, occupations, educationLevels, lifestyles, interests, values } = storeToRefs(settingsStore)

const activeTab = ref('general')
const showNewUserModal = ref(false)

const tabs = [
  { id: 'general', label: 'General', iconComponent: Briefcase },
  { id: 'integrations', label: 'Integraciones', iconComponent: LinkIcon },
  { id: 'variables', label: 'Variables', iconComponent: Database },
  { id: 'ai', label: 'IA & Auto', iconComponent: Wand2 },
  { id: 'notifications', label: 'Notificaciones', iconComponent: Bell },
  { id: 'team', label: 'Equipo', iconComponent: Users }
]

// --- VARIABLES MANAGEMENT ---
const newVariable = ref('')
const activeVariableList = ref('zones')

const variableLists = [
  { id: 'zones', label: 'Zonas Geográficas', data: zones },
  { id: 'professions', label: 'Profesiones', data: professions },
  { id: 'occupations', label: 'Ocupaciones', data: occupations },
  { id: 'educationLevels', label: 'Niveles de Estudio', data: educationLevels },
  { id: 'lifestyles', label: 'Estilos de Vida', data: lifestyles },
  { id: 'interests', label: 'Intereses', data: interests },
  { id: 'values', label: 'Valores', data: values }
]

function addVariable() {
  if (newVariable.value.trim()) {
    settingsStore.addOption(activeVariableList.value, newVariable.value.trim())
    newVariable.value = ''
    emit('showToast', 'Variable agregada')
  }
}

function removeVariable(listId, value) {
  settingsStore.removeOption(listId, value)
  emit('showToast', 'Variable eliminada')
}

// --- GENERAL / BRANDING ---
// (Managed by Store)
const tones = [
  { id: 'professional', label: 'Profesional' },
  { id: 'friendly', label: 'Amigable' },
  { id: 'witty', label: 'Ingenioso' },
  { id: 'urgent', label: 'Urgente' }
]

// --- INTEGRATIONS ---
const networks = ref([
  { id: 1, name: 'Facebook', iconComponent: Facebook, bgClass: 'bg-blue-600', connected: true, followers: '3.2K' },
  { id: 2, name: 'Instagram', iconComponent: Instagram, bgClass: 'bg-pink-600', connected: true, followers: '5.1K' },
  { id: 3, name: 'Twitter', iconComponent: Twitter, bgClass: 'bg-slate-900', connected: false, followers: '-' },
  { id: 4, name: 'LinkedIn', iconComponent: Linkedin, bgClass: 'bg-blue-700', connected: true, followers: '2.8K' },
  { id: 5, name: 'YouTube', iconComponent: Youtube, bgClass: 'bg-red-600', connected: false, followers: '-' }
])

const activeNetworksCount = computed(() => networks.value.filter(n => n.connected).length)

// --- AI & AUTOMATION ---
// (Managed by Store)

const schedule = ref({
  startTime: '08:00',
  endTime: '22:00',
  autoPublish: true
})

// --- NOTIFICATIONS ---
const notifications = ref([
  { id: 1, label: 'Nuevos Leads', description: 'Recibir alerta cuando entra un nuevo lead al CRM.', icon: Users, bgClass: 'bg-blue-50', textClass: 'text-blue-600', enabled: true },
  { id: 2, label: 'Publicaciones Programadas', description: 'Recordatorio antes de publicar contenido.', icon: Clock, bgClass: 'bg-amber-50', textClass: 'text-amber-600', enabled: true },
  { id: 3, label: 'Mensajes Entrantes', description: 'Notificar nuevos mensajes en redes.', icon: MessageSquare, bgClass: 'bg-purple-50', textClass: 'text-purple-600', enabled: false },
  { id: 4, label: 'Resumen Semanal', description: 'Reporte de rendimiento cada lunes.', icon: FileText, bgClass: 'bg-emerald-50', textClass: 'text-emerald-600', enabled: true }
])

// --- TEAM ---
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

// --- ACTIONS ---
function saveGeneral() {
  emit('showToast', 'Configuración general guardada')
}

function toggleNetwork(id) {
  const network = networks.value.find(n => n.id === id)
  if (network) {
    network.connected = !network.connected
  }
}

function saveNetworks() {
  emit('showToast', 'Integraciones actualizadas')
}

function saveAI() {
  emit('showToast', 'Preferencias de IA guardadas')
}

function saveNotifications() {
  emit('showToast', 'Preferencias de notificaciones guardadas')
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
.form-label {
  @apply block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5;
}
.form-input {
  @apply w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-kapital-night focus:ring-2 focus:ring-kapital-night/20 transition-all bg-white text-sm text-slate-700;
}

.btn-primary {
  @apply px-5 py-2.5 bg-kapital-night text-white font-medium rounded-xl transition-all hover:bg-kapital-night-hover hover:shadow-lg hover:shadow-slate-900/30 active:scale-95 flex items-center gap-2 justify-center text-sm;
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