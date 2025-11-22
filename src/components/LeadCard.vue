<template>
  <div class="relative bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-kapital-dark transition-all cursor-pointer" @click.self="$emit('view')">
    <div class="flex justify-between items-start mb-2">
      <span class="font-semibold text-sm text-gray-800 pr-4" @click.self="$emit('view')">{{ lead.name }}</span>
      <div class="relative">
        <button @click.stop="showMenu = !showMenu" class="text-gray-500 hover:text-gray-800 px-2 py-1 rounded-full hover:bg-gray-200">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <!-- Actions Menu -->
        <div v-if="showMenu" class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border" v-click-outside="() => showMenu = false">
          <a @click.prevent="$emit('view'); showMenu = false" class="action-link">
            <i class="fas fa-eye w-6"></i> Ver Detalles
          </a>
          <a @click.prevent="$emit('edit'); showMenu = false" class="action-link">
            <i class="fas fa-edit w-6"></i> Editar
          </a>
          <a @click.prevent="$emit('delete'); showMenu = false" class="action-link text-red-600 hover:bg-red-50">
            <i class="fas fa-trash w-6"></i> Eliminar
          </a>
        </div>
      </div>
    </div>
    <div @click.self="$emit('view')">
      <p v-if="lead.company" class="text-xs font-medium text-gray-500 mb-2">{{ lead.company }}</p>
      <p class="text-xs text-gray-500 mb-3 break-words">
        {{ latestConversationPreview }}
      </p>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <i class="fas fa-user"></i>
          <span>{{ lead.assignedTo }}</span>
        </div>
        <span :class="['px-2 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1', getOriginColor(lead.origin)]">
          {{ lead.origin }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  lead: {
    type: Object,
    required: true
  }
});

defineEmits(['view', 'edit', 'delete']);

const showMenu = ref(false);

const latestConversationPreview = computed(() => {
  if (props.lead.conversations && props.lead.conversations.length > 0) {
    // Assuming conversations are sorted newest first
    return props.lead.conversations[0].preview;
  }
  return 'Sin conversaciones aún.';
});

// Custom directive to detect clicks outside an element
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
};

function getOriginColor(origin) {
  const colors = {
    'Instagram': 'bg-pink-100 text-pink-700',
    'Facebook': 'bg-blue-100 text-blue-700',
    'LinkedIn': 'bg-indigo-100 text-indigo-700',
    'Web': 'bg-green-100 text-green-700',
    'Email': 'bg-orange-100 text-orange-700',
    'Otro': 'bg-gray-100 text-gray-700'
  };
  return colors[origin] || 'bg-gray-100 text-gray-700';
}
</script>

<style scoped lang="postcss">
.action-link {
  @apply flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer;
}
</style>