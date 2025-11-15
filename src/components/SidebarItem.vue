<template>
  <button
    @click="$emit('navigate', id)"
    :class="[
      // Clases ajustadas: menos padding y margen horizontal (px-0.5, mx-0.5)
      'flex flex-col items-center justify-center gap-1 py-1.5 px-0.5 mx-0.5 rounded-lg transition-all duration-200 border-2',
      activeView === id
        ? 'bg-kapital-dark text-white border-kapital-dark shadow-md' 
        : 'text-gray-600 hover:bg-kapital-dark/10 hover:text-kapital-dark hover:border-kapital-light-1/50'
    ]"
    :title="label"
  >
    <i :class="['fas', icon, 'text-base']"></i>
    <span class="text-[10px] font-semibold leading-none text-center">{{ label }}</span>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  id: String,
  label: String,
  icon: String,
  activeView: String
})

defineEmits(['navigate'])
</script>

<style scoped>
/* Estilos para accesibilidad */
button {
  /* Se recomienda añadir 'white-space: normal;' si Tailwind no lo maneja, */
  /* pero text-center y la columna flex suelen forzar el ajuste. */
  @apply outline-none;
}
</style>