<template>
  <div class="min-h-screen bg-white">
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

    <!-- Layout para Login -->
    <div v-if="$route.name === 'login'" class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <router-view @login="handleLogin" />
    </div>

    <!-- Layout Principal -->
    <div v-else class="flex h-screen bg-gray-900">
      <Sidebar 
        @logout="handleLogout"
      />

      <main class="flex-1 overflow-y-auto bg-white rounded-tl-2xl">
        <div class="p-10">
          <router-view v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" @showToast="showToast" />
            </Transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const router = useRouter()
const route = useRoute()

// Estado reactivo
const toast = ref({ 
  show: false, 
  message: '', 
  type: 'success' 
})

// Manejar login
function handleLogin(username) {
  localStorage.setItem('rememberedUser', username)
  showToast(`Bienvenido, ${username}`)
  router.push('/')
}

// Manejar logout
function handleLogout() {
  if (confirm('¿Deseas cerrar sesión?')) {
    localStorage.removeItem('rememberedUser')
    showToast('Sesión cerrada')
    router.push('/login')
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

/* Transiciones de Router */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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