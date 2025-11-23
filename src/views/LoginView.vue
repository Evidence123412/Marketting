<template>
  <div class="w-full max-w-md mx-auto p-4 sm:p-0">
    <div 
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-soft p-8 sm:p-10 text-center relative overflow-hidden"
    >
      <!-- Decorative background elements -->
      <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-kapital-dark to-kapital-light-1"></div>
      
      <div 
        v-motion
        :initial="{ scale: 0.8, opacity: 0 }"
        :enter="{ scale: 1, opacity: 1, transition: { delay: 200 } }"
        class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-kapital-dark to-kapital-light-1 rounded-2xl flex items-center justify-center shadow-lg shadow-kapital-dark/30"
      >
        <span class="text-white font-bold text-3xl tracking-tighter">K</span>
      </div>

      <h1 class="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Bienvenido</h1>
      <p class="text-slate-500 text-sm mb-8">
        Ingresa a tu centro de comando Kapital
      </p>

      <form @submit.prevent="handleLogin" class="space-y-5 text-left">
        
        <div class="space-y-1.5">
          <label for="username" class="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Usuario</label>
          <div class="relative group">
            <User class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-kapital-dark transition-colors" :size="18" />
            <input 
              v-model="username" 
              id="username"
              type="text" 
              placeholder="ej. admin@kapital.com"
              class="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
              required
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="password" class="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Contraseña</label>
          <div class="relative group">
            <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-kapital-dark transition-colors" :size="18" />
            <input 
              v-model="password" 
              id="password"
              type="password" 
              placeholder="••••••••"
              class="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-300 rounded-xl focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
              required
            />
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
            <label class="flex items-center cursor-pointer group">
              <input 
                v-model="remember" 
                type="checkbox" 
                class="w-4 h-4 rounded border-slate-300 text-kapital-dark focus:ring-kapital-dark/20 cursor-pointer"
              />
              <span class="ml-2 text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Recordarme</span>
            </label>
            
            <a href="#" class="text-sm font-semibold text-kapital-dark hover:text-blue-700 transition-colors">
                ¿Olvidaste tu contraseña?
            </a>
        </div>

        <button 
          type="submit" 
          class="w-full bg-kapital-night text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-kapital-night-hover hover:shadow-slate-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
        >
          <span>Acceder</span>
          <ArrowRight :size="20" />
        </button>
      </form>
    </div>
    
    <p class="text-center text-slate-400 text-xs mt-8">
      &copy; 2025 Kapital Marketing. Todos los derechos reservados.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const username = ref('')
const password = ref('')
const remember = ref(false)

const emit = defineEmits(['login'])

function handleLogin() {
  if (!username.value || !password.value) {
    // En un caso real, aquí usaríamos el sistema de notificaciones global
    alert('Por favor completa todos los campos')
    return
  }

  if (remember.value) {
    localStorage.setItem('rememberedUser', username.value)
  }

  emit('login', username.value)
  router.push('/')
}

onMounted(() => {
  const remembered = localStorage.getItem('rememberedUser')
  if (remembered) {
    username.value = remembered
    remember.value = true
    // Si ya está logueado, redirigir
    router.push('/')
  }
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios, pero Tailwind cubre la mayoría */
</style>