<template>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-lg border border-gray-200 shadow-lg p-10 text-center">
      <!-- Logo -->
      <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-kapital-dark to-kapital-light-1 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-2xl">K</span>
      </div>

      <h1 class="text-3xl font-bold text-kapital-dark mb-2">Kapital</h1>
      <p class="text-gray-600 text-sm mb-8">Gestor de Contenidos para Redes Sociales</p>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div class="text-left">
          <label class="block text-sm font-semibold text-gray-900 mb-2">Usuario</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="Ingresa tu usuario"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        <div class="text-left">
          <label class="block text-sm font-semibold text-gray-900 mb-2">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Ingresa tu contraseña"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        <div class="flex items-center">
          <input 
            v-model="remember" 
            type="checkbox" 
            id="remember"
            class="accent-kapital-dark cursor-pointer"
          />
          <label for="remember" class="ml-2 text-sm text-gray-700">Recordarme en este dispositivo</label>
        </div>

        <button type="submit" class="btn-primary w-full">
          <i class="fas fa-sign-in-alt"></i> Iniciar sesión
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

import { onMounted } from 'vue'
</script>