<template>
    <button
      @click="$emit('navigate', id)"
      :class="[
        'flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all duration-200 border-2',
        activeView === id
          ? 'bg-kapital-dark text-white border-kapital-dark shadow-md' 
          : 'text-gray-600 hover:bg-kapital-dark/10 hover:text-kapital-dark hover:border-kapital-light-1/50'
      ]"
      :title="label"
    >
      <i :class="['fas', icon, 'text-base']"></i>
      <span class="text-xs font-semibold leading-none">{{ label }}</span>
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
  /*
    You can add any specific component styling here if needed,
    but for this design, Tailwind classes are used directly in the template.
  */
  </style>