<template>
  <div class="w-full max-w-md mx-auto p-4 sm:p-0">
    <div class="bg-white rounded-xl border border-gray-100 shadow-2xl p-8 sm:p-10 text-center">
      
      <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-kapital-dark to-kapital-light-1 rounded-lg flex items-center justify-center shadow-lg">
        <span class="text-white font-bold text-2xl">K</span>
      </div>

      <h1 class="text-3xl font-extrabold text-kapital-dark mb-2">Kapital</h1>
      <p class="text-gray-600 text-sm mb-8">
        Tu centro de comando para redes sociales
      </p>

      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <div class="text-left">
          <label for="username" class="block text-sm font-bold text-gray-900 mb-2">Usuario</label>
          <input 
            v-model="username" 
            id="username"
            type="text" 
            placeholder="Ingresa tu usuario"
            aria-label="Campo de usuario"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-light-1 transition duration-150 ease-in-out"
            required
          />
        </div>

        <div class="text-left">
          <label for="password" class="block text-sm font-bold text-gray-900 mb-2">Contraseña</label>
          <input 
            v-model="password" 
            id="password"
            type="password" 
            placeholder="Ingresa tu contraseña"
            aria-label="Campo de contraseña"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-light-1 transition duration-150 ease-in-out"
            required
          />
        </div>

        <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                v-model="remember" 
                type="checkbox" 
                id="remember"
                class="accent-kapital-dark cursor-pointer w-4 h-4"
              />
              <label for="remember" class="ml-2 text-sm text-gray-700 select-none">Recordarme</label>
            </div>
            
            <a href="#" class="text-sm font-semibold text-kapital-dark hover:text-kapital-light-1 transition duration-150 ease-in-out">
                ¿Olvidaste tu contraseña?
            </a>
        </div>

        <button 
          type="submit" 
          class="w-full 
                 bg-kapital-dark text-white 
                 font-extrabold text-lg 
                 py-3 rounded-lg 
                 shadow-lg 
                 hover:bg-kapital-light-1 
                 hover:shadow-xl 
                 transform hover:-translate-y-0.5 
                 transition duration-150 ease-in-out"
        >
          <i class="fas fa-sign-in-alt mr-2"></i> Acceder ahora
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const username = ref('')
const password = ref('')
const remember = ref(false)

const emit = defineEmits(['login'])

function handleLogin() {
  if (!username.value || !password.value) {
    alert('Por favor completa todos los campos')
    return
  }

  if (remember.value) {
    localStorage.setItem('rememberedUser', username.value)
  }

  emit('login', username.value)
}

onMounted(() => {
  const remembered = localStorage.getItem('rememberedUser')
  if (remembered) {
    username.value = remembered
    remember.value = true
  }
})
</script>

<style scoped>
/*
  El estilo del botón se define usando las clases de Tailwind de tu configuración.
*/
</style>