<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>Generador de Imágenes con IA</h1>
      <p>Crea imágenes para tus redes sociales automáticamente</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Form -->
      <div class="card">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Configuración</h2>
        
        <form @submit.prevent="generateImage" class="space-y-6">
          <!-- General Info -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Información General</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Descripción del contenido</label>
                <textarea 
                  v-model="form.description"
                  placeholder="Ej: Producto de verano, colores tropicales..."
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-blue-100"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Red Social</label>
                  <select v-model="form.network" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark">
                    <option value="">Seleccionar...</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de contenido</label>
                  <select v-model="form.contentType" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark">
                    <option value="">Seleccionar...</option>
                    <option value="product">Producto</option>
                    <option value="promotional">Promocional</option>
                    <option value="educational">Educativo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Audience -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Parámetros de Audiencia</h3>
            
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Público Objetivo</label>
                  <select v-model="form.audience" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark">
                    <option value="">Seleccionar...</option>
                    <option value="young">Jóvenes (18-25)</option>
                    <option value="professionals">Profesionales (26-40)</option>
                    <option value="mature">Adultos (40+)</option>
                    <option value="all">General</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Estilo Visual</label>
                  <select v-model="form.style" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark">
                    <option value="">Seleccionar...</option>
                    <option value="modern">Moderno</option>
                    <option value="minimalist">Minimalista</option>
                    <option value="luxury">Lujo</option>
                    <option value="playful">Lúdico</option>
                    <option value="corporate">Corporativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Palabra clave secundaria</label>
                <input 
                  v-model="form.keyword"
                  type="text"
                  placeholder="Ej: descuento, promoción..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark"
                />
              </div>
            </div>
          </div>

          <!-- Colors & Date -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Configuración Temporal</h3>
            
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Fecha especial</label>
                  <select v-model="form.specialDate" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark">
                    <option value="">Sin fecha especial</option>
                    <option value="blackfriday">Black Friday</option>
                    <option value="summer">Verano</option>
                    <option value="christmas">Navidad</option>
                    <option value="newyear">Año Nuevo</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Colores</label>
                  <div class="flex gap-2">
                    <input 
                      v-model="form.colorPrimary"
                      type="color"
                      class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input 
                      v-model="form.colorSecondary"
                      type="color"
                      class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" class="btn-primary w-full text-base">
            <i class="fas fa-magic"></i> Generar Imagen
          </button>
        </form>
      </div>

      <!-- Preview -->
      <div class="card flex flex-col">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Vista Previa</h2>
        
        <div 
          class="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-kapital-light-1 rounded-lg flex items-center justify-center min-h-96 mb-4"
          :style="{ backgroundImage: generating ? 'none' : '' }"
        >
          <div v-if="!generated" class="text-center text-gray-500">
            <i class="fas fa-image text-4xl text-kapital-light-1 mb-3 block"></i>
            <p class="text-sm">La imagen generada aparecerá aquí</p>
          </div>
          <div 
            v-else
            class="w-full h-full rounded-lg flex items-center justify-center text-white font-semibold"
            :style="{ background: `linear-gradient(135deg, ${form.colorPrimary} 0%, ${form.colorSecondary} 100%)` }"
          >
            Imagen {{ form.network }}
          </div>
        </div>

        <Transition name="fade">
          <div v-if="generated" class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-2 uppercase">Descripción</h3>
              <p class="text-sm text-gray-700">{{ generatedData.description }}</p>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-2 uppercase">Copy Sugerido</h3>
              <p class="text-sm text-gray-700">{{ generatedData.copy }}</p>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-gray-900 mb-2 uppercase">Hashtags</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in generatedData.hashtags"
                  :key="tag"
                  class="px-3 py-1 bg-kapital-light-1 text-white text-xs font-medium rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button @click="downloadImage" class="btn-secondary flex-1 text-sm">
                <i class="fas fa-download"></i> Descargar
              </button>
              <button @click="useForProduction" class="btn-primary flex-1 text-sm">
                <i class="fas fa-arrow-right"></i> Usar
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['showToast'])

const form = ref({
  description: '',
  network: '',
  contentType: '',
  audience: '',
  style: '',
  keyword: '',
  specialDate: '',
  colorPrimary: '#2B66FF',
  colorSecondary: '#FFFFFF'
})

const generated = ref(false)
const generating = ref(false)

const generatedData = ref({
  description: '',
  copy: '',
  hashtags: []
})

function generateImage() {
  if (!form.value.description || !form.value.network || !form.value.contentType || !form.value.audience || !form.value.style) {
    emit('showToast', 'Por favor completa todos los campos requeridos', 'error')
    return
  }

  generating.value = true
  
  setTimeout(() => {
    generatedData.value = {
      description: `Imagen ${form.value.style} para ${form.value.network} dirigida a ${form.value.audience}. ${form.value.description}`,
      copy: generateCopy(),
      hashtags: generateHashtags()
    }
    
    generated.value = true
    generating.value = false
    emit('showToast', 'Imagen generada exitosamente')
  }, 1500)
}

function generateCopy() {
  const templates = {
    instagram: `Descubre nuestro nuevo ${form.value.contentType}. ${form.value.keyword || 'No te lo pierdas'}. ¡Haz clic!`,
    facebook: `Te presentamos nuestro último ${form.value.contentType}. ¡Comparte con tus amigos!`,
    linkedin: `Nos complace anunciar nuestro nuevo ${form.value.contentType}. Conoce más en nuestro sitio.`,
    twitter: `Nuevo ${form.value.contentType} disponible. ${form.value.keyword || 'Consulta ahora'}`,
    tiktok: `No te pierdas nuestro nuevo ${form.value.contentType}. #${form.value.contentType}`
  }
  return templates[form.value.network] || templates.instagram
}

function generateHashtags() {
  const base = ['kapital', 'marketing', 'contenido', 'socialmedia']
  const types = {
    product: ['producto', 'oferta', 'nuevo'],
    promotional: ['promocion', 'descuento', 'oferta'],
    educational: ['educativo', 'aprende', 'tips']
  }
  
  const tags = [...base, ...(types[form.value.contentType] || [])]
  if (form.value.keyword) tags.push(form.value.keyword.toLowerCase())
  
  return [...new Set(tags)].slice(0, 8).map(t => '#' + t)
}

function downloadImage() {
  emit('showToast', 'Descargando imagen...')
}

function useForProduction() {
  emit('showToast', 'Imagen agregada a producción')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>