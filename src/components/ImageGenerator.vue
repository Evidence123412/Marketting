<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>Asistente de Creación Estratégica</h1>
      <p>Genera contenido estratégico basado en tu segmentación (Design Thinking + Neuromarketing)</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div class="card">
        
        <nav class="flex items-center justify-center mb-6">
          <div v-for="(step, index) in wizardSteps" :key="step.title" class="flex items-center">
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg',
                currentStep >= (index + 1) ? 'bg-kapital-dark text-white' : 'bg-gray-200 text-gray-500'
              ]"
            >
              {{ index + 1 }}
            </div>
            <div v-if="index < wizardSteps.length - 1" :class="['w-12 h-1 rounded', currentStep > (index + 1) ? 'bg-kapital-dark' : 'bg-gray-200']"></div>
          </div>
        </nav>
        <div class="text-center mb-6">
          <span class="text-lg font-bold text-gray-900">{{ wizardSteps[currentStep - 1].title }}</span>
          <p class="text-sm text-gray-600">{{ wizardSteps[currentStep - 1].subtitle }}</p>
        </div>


        <form @submit.prevent="generateImage" class="space-y-6">
          
          <div v-show="currentStep === 1" class="space-y-6">
            
            <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-map-marker-alt"></i> Geográfica</legend>
              <div class="grid grid-cols-2 gap-4">
                <select v-model="form.segment.geo.zone" class="input-field" title="Zona (Urbana/Rural)">
                  <option value="all">Todas las Zonas</option>
                  <option value="urbana">Urbana</option>
                  <option value="rural">Rural</option>
                </select>
                <input v-model="form.segment.geo.city" type="text" placeholder="Distrito/Ciudad" class="input-field" title="Distrito o Ciudad" />
              </div>
            </fieldset>

            <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-users"></i> Demográfica</legend>
              <div class="grid grid-cols-2 gap-4">
                <select v-model="form.segment.demo.age" class="input-field" title="Rango de Edad">
                  <option value="all">Todas las Edades</option>
                  <option value="18-25">18-25 (Jóvenes)</option>
                  <option value="26-40">26-40 (Profesionales)</option>
                  <option value="40+">40+ (Adultos)</option>
                </select>
                <select v-model="form.segment.demo.sex" class="input-field" title="Sexo">
                  <option value="all">Todos</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
            </fieldset>
            
            <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-brain"></i> Psicográfica (Arellano)</legend>
              <select v-model="form.segment.psycho.lifestyle" class="input-field" title="Estilo de Vida Arellano">
                <option value="all">General / No aplicar</option>
                <option value="sofisticados">Sofisticados (Lujo, tendencia, cosmopolita)</option>
                <option value="progresistas">Progresistas (Hombres, prácticos, emprendedores)</option>
                <option value="modernas">Modernas (Mujeres, trabajadoras, moda)</option>
                <option value="formalistas">Formalistas (Hombres, tradicionales, estables)</option>
                <option value="conservadoras">Conservadoras (Mujeres, hogar, familia, tradición)</option>
                <option value="austeros">Austeros (Bajos recursos, reacios al cambio)</option>
              </select>
            </fieldset>
          </div>

          <div v-show="currentStep === 2" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Objetivo del Contenido</label>
              <select v-model="form.contentType" class="input-field">
                <option value="">Seleccionar...</option>
                <option value="product">Vender Producto</option>
                <option value="promotional">Anunciar Promoción</option>
                <option value="educational">Contenido Educativo</option>
                <option value="branding">Branding / Conexión</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mensaje Clave (El "Qué")</label>
              <textarea v-model="form.description" placeholder="Ej: Lanzamiento de nuevo café premium, 20% OFF..." rows="4" class="input-field"></textarea>
            </div>
          </div>

          <div v-show="currentStep === 3" class="space-y-6">
            
            <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-bolt"></i> Neuromarketing Aplicado</legend>
              
              <label class="block text-sm font-medium text-gray-700 mb-2">Estilo de Comunicación</label>
              
              <select v-model="form.tone" class="input-field">
                <option value="professional">Profesional</option>
                <option value="emotional">Emocional</option>
                <option value="playful">Divertido</option>
                <option value="inspirational">Inspirador</option>
                <option value="urgent">Urgente</option>
              </select>

              <label class="block text-sm font-medium text-gray-700 mt-4 mb-2">Disparadores Mentales</label>
              <div class="space-y-3">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.triggers.urgency" class="checkbox-input" />
                  Urgencia (Ej: "Solo por hoy")
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.triggers.exclusivity" class="checkbox-input" />
                  Exclusividad (Ej: "Solo para clientes")
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.triggers.personalization" class="checkbox-input" />
                  Personalización (Ej: "Pensado para ti")
                </label>
              </div>
            </fieldset>

            
            <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-palette"></i> Paleta de Colores (Tu Marca)</legend>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sugerencia (Psicología del Color)</label>
              <select v-model="form.colorPrimary" class="input-field">
                <option value="#2B66FF">Confianza / Lealtad (kapital-dark)</option>
                <option value="#61A3FF">Tranquilidad / Calma (kapital-light-1)</option>
                <option value="#00FFFF">Innovación / Energía (kapital-light-2)</option>
                <option value="#111827">Elegancia / Lujo (kapital-night)</option>
                <option value="#FFFFFF">Minimalismo / Pureza (kapital-white)</option>
                <option value="#C9C9C9">Neutralidad / Balance (kapital-gray)</option>
              </select>

              <div class="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Color Primario (Manual)</label>
                  <input v-model="form.colorPrimary" type="color" class="w-full h-10 border border-gray-300 rounded cursor-pointer" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Color Secundario (Manual)</label>
                  <input v-model="form.colorSecondary" type="color" class="w-full h-10 border border-gray-300 rounded cursor-pointer" />
                </div>
              </div>
            </fieldset>

          </div>

          <div v-show="currentStep === 4" class="space-y-6">
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">1. Selecciona el Formato / Tamaño</label>
              <div class="grid grid-cols-3 gap-3">
                <button 
                  type="button" 
                  v-for="format in allFormats" 
                  :key="format.name"
                  @click="selectFormat(format.value)"
                  :class="['visual-selector', form.format === format.value ? 'selected' : '']"
                >
                  <i :class="['fas', format.icon, 'text-xl mb-1 block']"></i>
                  <span class="text-sm font-medium">{{ format.name }}</span>
                </button>
              </div>
            </div>

            <div v-if="form.format">
              <label class="block text-sm font-medium text-gray-700 mb-2">2. Selecciona las Redes (Canales)</label>
              <div class="grid grid-cols-2 gap-3">
                <label 
                  v-for="network in availableNetworks" 
                  :key="network.id"
                  :class="[
                    'checkbox-label p-3 border rounded-lg',
                    isNetworkCompatible(network.id) ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  ]"
                >
                  <input 
                    type="checkbox" 
                    :value="network.id"
                    v-model="form.networks"
                    :disabled="!isNetworkCompatible(network.id)"
                    class="checkbox-input"
                  />
                  <i :class="['bi', network.icon, 'text-lg']" :style="{ color: network.color }"></i>
                  {{ network.name }}
                </label>
              </div>
            </div>
            
            <button type="submit" class="btn-primary w-full text-base" :disabled="generating || form.networks.length === 0">
              <i :class="['fas', generating ? 'fa-spinner fa-spin' : 'fa-magic']"></i>
              {{ generating ? 'Generando...' : 'Generar Contenido' }}
            </button>
          </div>
        </form>

        <div class="flex justify-between mt-6 pt-6 border-t border-gray-200">
          <button type="button" @click="prevStep" :disabled="currentStep === 1" class="btn-secondary">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          <button type="button" @click="nextStep" :disabled="currentStep === 4" class="btn-primary">
            Siguiente <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <div class="card flex flex-col">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Prototipo y Resultados</h2>
        
        <div class="flex-1 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4 min-h-96">
          
          <div v-if="generating" class="text-center text-kapital-night p-8">
            <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
            <p class="text-lg font-semibold mb-2">Creando magia...</p>
            <p class="text-sm text-gray-600">{{ generationStatus }}</p>
          </div>

          <div v-else-if="!generated && !form.format" class="text-center text-gray-500">
            <i class="fas fa-image text-4xl text-kapital-gray mb-3 block"></i>
            <p class="text-sm">El prototipo de imagen aparecerá aquí<br>cuando selecciones el formato (Paso 4)</p>
          </div>
          
          <div 
            v-if="!generating && (generated || form.format)"
            :class="[
              'rounded-lg flex items-center justify-center text-white font-semibold p-4 text-center transition-all duration-300 ease-in-out shadow-lg',
              previewSizingClass,
              {
                'aspect-square': form.format === '1:1',
                'aspect-[9/16]': form.format === '9:16',
                'aspect-video': form.format === '16:9',
                'aspect-[4/5]': form.format === '4:5'
              }
            ]"
            :style="{ background: `linear-gradient(135deg, ${form.colorPrimary} 0%, ${form.colorSecondary} 100%)` }"
          >
            <span :style="{ color: getContrastingTextColor(form.colorPrimary) }">
              Formato: ({{ form.format }})
              <br> 
              <span v-if="generated">Redes: {{ form.networks.join(', ') }}</span>
            </span>
          </div>
        </div>

        <Transition name="fade">
          <div v-if="generated" class="space-y-4 mt-4">
            <div class="result-box">
              <h3 class="result-title">Copy Persuasivo (Neuromarketing)</h3>
              <p class="text-sm text-gray-700">{{ generatedData.copy }}</p>
            </div>

            <div class="result-box">
              <h3 class="result-title">Hashtags Estratégicos</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in generatedData.hashtags" :key="tag" class="px-3 py-1 bg-kapital-light-1 text-white text-xs font-medium rounded-full">
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button @click="downloadImage" class="btn-secondary flex-1 text-sm">
                <i class="fas fa-download"></i> Descargar
              </button>
              <button @click="useForProduction" class="btn-primary flex-1 text-sm">
                <i class="fas fa-arrow-right"></i> Usar en Producción
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['showToast', 'navigate'])

const currentStep = ref(1)

// ESTRUCTURA DE PASOS DEL WIZARD
const wizardSteps = [
  { title: 'Paso 1: Empatizar', subtitle: '¿Quién es tu audiencia objetivo?' },
  { title: 'Paso 2: Definir', subtitle: '¿Qué quieres comunicar?' },
  { title: 'Paso 3: Idear', subtitle: '¿Cómo lo quieres comunicar? (Estilo y Emoción)' },
  { title: 'Paso 4: Prototipar', subtitle: '¿Dónde se va a publicar?' }
]

// ESTRUCTURA DE DATOS DEL FORMULARIO
const form = ref({
  // Paso 1
  segment: {
    geo: { zone: 'all', city: '' },
    demo: { age: 'all', sex: 'all' },
    psycho: { lifestyle: 'all' }
  },
  // Paso 2
  description: '',
  contentType: '',
  // Paso 3
  tone: 'professional',
  triggers: {
    urgency: false,
    exclusivity: false,
    personalization: false
  },
  colorPrimary: '#2B66FF',
  colorSecondary: '#00FFFF',
  
  // Paso 4
  networks: [], 
  format: '', // Inicializado vacío
  style: 'modern'
})

// --- LÓGICA DE FORMATOS DINÁMICOS (Paso 4) ---

const allFormats = {
  post: { name: 'Post (1:1)', value: '1:1', icon: 'fa-square' },
  story: { name: 'Story (9:16)', value: '9:16', icon: 'fa-mobile-alt' },
  landscape: { name: 'Video (16:9)', value: '16:9', icon: 'fa-video' },
  portrait: { name: 'Post (4:5)', value: '4:5', icon: 'fa-tablet-alt' }
}

// CONFIGURACIÓN DE REDES (Actualizada: Todas soportan todos los formatos)
const availableNetworks = ref([
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: 'bi-instagram', 
    color: '#E4405F', 
    formats: ['1:1', '9:16', '4:5', '16:9'] 
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: 'bi-facebook', 
    color: '#1877F2', 
    formats: ['1:1', '16:9', '9:16', '4:5'] 
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: 'bi-linkedin', 
    color: '#0A66C2', 
    formats: ['1:1', '16:9', '4:5', '9:16'] 
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: 'bi-tiktok', 
    color: '#010101', 
    formats: ['9:16', '1:1', '16:9', '4:5'] 
  }
])

function selectFormat(formatValue) {
  form.value.format = formatValue
  form.value.networks = []
}

function isNetworkCompatible(networkId) {
  const network = availableNetworks.value.find(n => n.id === networkId)
  return network && network.formats.includes(form.value.format)
}

// Devuelve clases de tamaño para el contenedor
const previewSizingClass = computed(() => {
  switch (form.value.format) {
    case '1:1':
      return 'w-full max-w-xs mx-auto'; // Cuadrado
    case '9:16':
      return 'w-full max-w-[200px] mx-auto'; // Vertical
    case '16:9':
      return 'w-full max-w-sm mx-auto'; // Horizontal
    case '4:5':
      return 'w-full max-w-xs mx-auto'; // Vertical Post
    default:
      return 'hidden';
  }
});

// --- ESTADO DE GENERACIÓN ---
const generated = ref(false)
const generating = ref(false)
const generationStatus = ref('')

const generatedData = ref({
  copy: '',
  hashtags: []
})

// --- MÉTODOS ---
function nextStep() {
  if (currentStep.value < 4) currentStep.value++
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}

function generateImage() {
  if (currentStep.value !== 4 || form.value.networks.length === 0 || !form.value.format) {
    emit('showToast', 'Por favor selecciona un formato y al menos una red social', 'error')
    return
  }
  
  generating.value = true
  generated.value = false
  
  setTimeout(() => { generationStatus.value = `Analizando Buyer Persona (Psicográfica: ${form.value.segment.psycho.lifestyle})...` }, 500)
  setTimeout(() => { generationStatus.value = `Aplicando estilo '${form.value.tone}' y disparadores mentales...` }, 1500)
  setTimeout(() => { generationStatus.value = `Adaptando a formato ${form.value.format} para ${form.value.networks.join(', ')}...` }, 2500)
  
  setTimeout(() => {
    generatedData.value = {
      copy: generateCopy(),
      hashtags: generateHashtags()
    }
    generated.value = true
    generating.value = false
    generationStatus.value = ''
    emit('showToast', 'Contenido estratégico generado')
  }, 3500)
}

function generateCopy() {
  let baseCopy = ''
  switch (form.value.tone) {
    case 'emotional': baseCopy = `Conecta con lo que más importa. ${form.value.description}.`; break;
    case 'professional': baseCopy = `Presentamos una solución profesional: ${form.value.description}.`; break;
    case 'playful': baseCopy = `¡La diversión llegó! ${form.value.description}.`; break;
    case 'inspirational': baseCopy = `Atrévete a soñar. ${form.value.description}.`; break;
    case 'urgent': baseCopy = `¡No te lo pierdas! ${form.value.description}.`; break;
    default: baseCopy = `Descubre más sobre: ${form.value.description}.`;
  }

  let lifestyleAdj = ''
  switch(form.value.segment.psycho.lifestyle) {
    case 'sofisticados': lifestyleAdj = 'Una experiencia exclusiva.'; break;
    case 'progresistas': lifestyleAdj = 'La herramienta práctica para tu éxito.'; break;
    case 'modernas': lifestyleAdj = 'Lo último en tendencia para ti.'; break;
    case 'conservadoras': lifestyleAdj = 'La confianza y calidad que tu familia merece.'; break;
    case 'austeros': lifestyleAdj = 'El mejor precio y rendimiento.'; break;
  }

  let triggers = ''
  if (form.value.triggers.urgency) triggers += ' ¡Solo por tiempo limitado!'
  if (form.value.triggers.exclusivity) triggers += ' Una oferta exclusiva para nuestra comunidad.'
  if (form.value.triggers.personalization) triggers += ' Porque te lo mereces.'

  return `${baseCopy} ${lifestyleAdj} ${triggers}`
}

function generateHashtags() {
  const base = ['kapital', 'marketing', ...form.value.networks]
  if (form.value.segment.geo.city) base.push(form.value.segment.geo.city.toLowerCase().replace(' ', ''))
  
  const types = {
    product: ['producto', 'nuevo'],
    promotional: ['promocion', 'descuento', 'oferta'],
    educational: ['educativo', 'aprende', 'tips'],
    branding: ['marca', 'estilodevida']
  }
  const lifestyleTags = {
    sofisticados: ['lujo', 'exclusivo', 'tendencia'],
    progresistas: ['progreso', 'emprendedor', 'exito'],
    modernas: ['mujerempoderada', 'tendencia', 'fashion'],
    conservadoras: ['familia', 'hogar', 'tradicion'],
    austeros: ['ahorro', 'oferta', 'economico']
  }
  
  const tags = [
    ...base, 
    ...(types[form.value.contentType] || []), 
    ...(lifestyleTags[form.value.segment.psycho.lifestyle] || [])
  ]
  
  return [...new Set(tags.filter(t => t))].slice(0, 8).map(t => '#' + t)
}

function downloadImage() {
  emit('showToast', 'Descargando imagen...')
}

function useForProduction() {
  emit('showToast', 'Contenido enviado a Producción')
  emit('navigate', 'production')
}

function getContrastingTextColor(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#111827' : '#FFFFFF'; 
}
</script>

<style scoped>
/* Estilos de Botones */
.btn-primary {
  @apply px-6 py-3 bg-kapital-night text-white font-medium rounded-md transition-all hover:bg-kapital-night-hover active:scale-95 flex items-center gap-2 justify-center;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200 flex items-center gap-2 justify-center;
}

/* Clases de utilidad */
.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20;
}

.fieldset-style {
  @apply space-y-4 rounded-lg border border-gray-200 p-4;
}

.legend-style {
  @apply text-sm font-medium text-kapital-dark px-2;
}

.visual-selector {
  @apply p-3 border-2 rounded-lg text-center cursor-pointer transition-all text-sm font-medium text-gray-800;
  @apply border-gray-300 hover:border-gray-400;
}

.visual-selector.selected {
  @apply border-kapital-dark bg-kapital-dark/10 ring-2 ring-kapital-light-1;
}

.checkbox-label {
  @apply flex items-center gap-2 text-sm text-gray-700;
}

.checkbox-label[disabled] {
  @apply cursor-not-allowed;
}

.checkbox-input {
  @apply w-4 h-4 accent-kapital-dark;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.result-box {
  @apply bg-kapital-dark/5 border border-kapital-dark/20 rounded-lg p-4;
}

.result-title {
  @apply text-xs font-semibold text-kapital-dark uppercase tracking-wider mb-2;
}
</style>