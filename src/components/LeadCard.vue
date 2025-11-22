<template>
  <div 
    class="relative bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-kapital-dark/50 transition-all cursor-pointer group" 
    @click.self="$emit('view')"
  >
    <div class="flex justify-between items-start mb-3">
      <span class="font-bold text-sm text-slate-800 pr-4 leading-tight" @click.self="$emit('view')">{{ lead.name }}</span>
      <div class="relative">
        <button 
          @click.stop="showMenu = !showMenu" 
          class="text-slate-400 hover:text-kapital-dark p-1 rounded-lg hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical :size="16" />
        </button>
        <!-- Actions Menu -->
        <div 
          v-if="showMenu" 
          class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-20 border border-slate-100 overflow-hidden" 
          v-click-outside="() => showMenu = false"
        >
          <a @click.prevent="$emit('view'); showMenu = false" class="action-link">
            <Eye :size="16" /> Ver Detalles
          </a>
          <a @click.prevent="$emit('edit'); showMenu = false" class="action-link">
            <Edit2 :size="16" /> Editar
          </a>
          <div class="h-px bg-slate-100 my-1"></div>
          <a @click.prevent="$emit('delete'); showMenu = false" class="action-link text-rose-600 hover:bg-rose-50">
            <Trash2 :size="16" /> Eliminar
          </a>
        </div>
      </div>
    </div>
    
    <div @click.self="$emit('view')">
      <div v-if="lead.company" class="flex items-center gap-1.5 mb-2">
        <Building2 :size="12" class="text-slate-400" />
        <p class="text-xs font-semibold text-slate-500">{{ lead.company }}</p>
      </div>
      
      <p class="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
        {{ latestConversationPreview }}
      </p>
      
      <div class="flex justify-between items-center pt-3 border-t border-slate-100">
        <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <User :size="12" />
          <span>{{ lead.assignedTo }}</span>
        </div>
        <span :class="['px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1', getOriginColor(lead.origin)]">
          {{ lead.origin }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { MoreVertical, Eye, Edit2, Trash2, Building2, User } from 'lucide-vue-next';

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
  return 'Sin conversaciones recientes.';
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
    'Instagram': 'bg-pink-50 text-pink-600',
    'Facebook': 'bg-blue-50 text-blue-600',
    'LinkedIn': 'bg-indigo-50 text-indigo-600',
    'Web': 'bg-emerald-50 text-emerald-600',
    'Email': 'bg-amber-50 text-amber-600',
    'Otro': 'bg-slate-50 text-slate-600'
  };
  return colors[origin] || 'bg-slate-50 text-slate-600';
}
</script>

<style scoped lang="postcss">
.action-link {
  @apply flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-kapital-dark cursor-pointer transition-colors font-medium;
}
</style>