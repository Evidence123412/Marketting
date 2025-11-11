<template>
  <div class="min-h-screen bg-white">
    <!-- Toast Notification -->
    <Transition name="toast">
      <div 
        v-if="toast.show"
        :class="[
          'fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-white font-medium shadow-lg z-50',
          toast.type === 'success' ? 'bg-kapital-dark' : 'bg-red-500'
        ]"
      >
        {{ toast.message }}
      </div>
    </Transition>

    <!-- Login View -->
    <div v-if="!isLoggedIn" class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <LoginView @login="handleLogin" />
    </div>

    <!-- Main App Layout -->
    <div v-else class="flex h-screen bg-white">
      <!-- Sidebar -->
      <Sidebar 
        @navigate="currentView = $event" 
        :activeView="currentView"
        @logout="handleLogout"
      />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto bg-white">
        <div class="p-10">
          <!-- Dashboard View -->
          <Dashboard 
            v-show="currentView === 'dashboard'" 
            @showToast="showToast" 
          />
          
          <!-- Image Generation View -->
          <ImageGenerator 
            v-show="currentView === 'generation'" 
            @showToast="showToast"
            @navigate="currentView = $event"
          />
          
          <!-- Production View -->
          <Production 
            v-show="currentView === 'production'" 
            @showToast="showToast" 
          />
          
          <!-- Scheduling View -->
          <Scheduling 
            v-show="currentView === 'scheduling'" 
            @showToast="showToast" 
          />
          
          <!-- Interactions View -->
          <Interactions 
            v-show="currentView === 'interactions'" 
            @showToast="showToast" 
          />
          
          <!-- CRM View -->
          <CRM 
            v-show="currentView === 'crm'" 
            @showToast="showToast" 
          />
          
          <!-- Reports View -->
          <Reports 
            v-show="currentView === 'reports'" 
            @showToast="showToast" 
          />
          
          <!-- Settings View -->
          <Settings 
            v-show="currentView === 'settings'" 
            @showToast="showToast" 
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Componentes
import LoginView from './components/LoginView.vue'
import Sidebar from './components/Sidebar.vue'
import Dashboard from './components/Dashboard.vue'
import ImageGenerator from './components/ImageGenerator.vue'
import Production from './components/Production.vue'
import Scheduling from './components/Scheduling.vue'
import Interactions from './components/Interactions.vue'
import CRM from './components/CRM.vue'
import Reports from './components/Reports.vue'
import Settings from './components/Settings.vue'

// Estado reactivo
const isLoggedIn = ref(false)
const currentView = ref('dashboard')
const toast = ref({ 
  show: false, 
  message: '', 
  type: 'success' 
})

// Verificar si hay usuario recordado al montar
onMounted(() => {
  const remembered = localStorage.getItem('rememberedUser')
  if (remembered) {
    isLoggedIn.value = true
  }
})

// Manejar login
function handleLogin(username) {
  isLoggedIn.value = true
  localStorage.setItem('rememberedUser', username)
  currentView.value = 'dashboard'
  showToast(`Bienvenido, ${username}`)
}

// Manejar logout
function handleLogout() {
  if (confirm('¿Deseas cerrar sesión?')) {
    isLoggedIn.value = false
    localStorage.removeItem('rememberedUser')
    currentView.value = 'dashboard'
    showToast('Sesión cerrada')
  }
}

// Mostrar notificaciones toast
function showToast(message, type = 'success') {
  toast.value = { 
    show: true, 
    message, 
    type 
  }
  
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>

<style scoped>
/* Transiciones del Toast */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(-50%) translateY(100px);
  opacity: 0;
}

.toast-enter-to,
.toast-leave-from {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* Scroll personalizado */
main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-track {
  background: #f1f1f1;
}

main::-webkit-scrollbar-thumb {
  background: #2B66FF;
  border-radius: 4px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #1E4FDB;
}
</style>