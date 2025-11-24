<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>Generador de Buyer Persona & Contenido</h1>
      <p>Define tu cliente ideal y genera anuncios estratégicos con IA.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Configuration Panel -->
      <div class="card h-fit">
        
        <nav class="flex items-center justify-center mb-6">
          <div v-for="(step, index) in wizardSteps" :key="step.title" class="flex items-center">
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300',
                currentStep >= (index + 1) ? 'bg-kapital-dark text-white scale-110 shadow-md' : 'bg-gray-200 text-gray-500'
              ]"
            >
              {{ index + 1 }}
            </div>
            <div v-if="index < wizardSteps.length - 1" :class="['w-12 h-1 rounded transition-colors duration-300', currentStep > (index + 1) ? 'bg-kapital-dark' : 'bg-gray-200']"></div>
          </div>
        </nav>
        <div class="text-center mb-6">
          <span class="text-lg font-bold text-gray-900">{{ wizardSteps[currentStep - 1].title }}</span>
          <p class="text-sm text-gray-600">{{ wizardSteps[currentStep - 1].subtitle }}</p>
        </div>


        <form @submit.prevent="generateContent" class="space-y-6">
          
          <!-- STEP 1: Buyer Persona Configuration -->
          <div v-show="currentStep === 1" class="space-y-6 animate-fade-in">
            
            <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-map-marker-alt"></i> Geográfica</legend>
              <div class="grid grid-cols-2 gap-4">
                <input v-model="form.segment.geo.country" type="text" placeholder="País / Región" class="input-field" />
                <input v-model="form.segment.geo.city" type="text" placeholder="Ciudad" class="input-field" />
              </div>
              <div class="grid grid-cols-3 gap-3 mt-3">
                <select v-model="form.segment.geo.zone" class="input-field text-sm" title="Zona">
                  <option value="all">Todas las Zonas</option>
                  <option v-for="zone in zones" :key="zone" :value="zone">{{ zone }}</option>
                </select>
                <select v-model="form.segment.geo.climate" class="input-field text-sm">
                  <option value="all">Cualquier Clima</option>
                  <option value="tropical">Tropical</option>
                  <option value="templado">Templado</option>
                  <option value="frio">Frío</option>
                  <option value="desertico">Desértico</option>
                </select>
                <select v-model="form.segment.geo.density" class="input-field text-sm">
                  <option value="all">Densidad</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </fieldset>

            <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-user-tie"></i> Perfil Profesional</legend>
              <div class="grid grid-cols-2 gap-4">
                <div class="relative">
                  <input v-model="form.segment.demo.profession" list="professionsList" type="text" placeholder="Profesión (ej. Abogado)" class="input-field" />
                  <datalist id="professionsList">
                    <option v-for="prof in professions" :key="prof" :value="prof"></option>
                  </datalist>
                </div>
                <div class="relative">
                  <input v-model="form.segment.demo.occupation" list="occupationsList" type="text" placeholder="Ocupación Actual" class="input-field" />
                  <datalist id="occupationsList">
                    <option v-for="occ in occupations" :key="occ" :value="occ"></option>
                  </datalist>
                </div>
              </div>
              <div class="mt-3">
                <select v-model="form.segment.demo.education" class="input-field">
                  <option value="">Nivel de Estudios...</option>
                  <option v-for="edu in educationLevels" :key="edu" :value="edu">{{ edu }}</option>
                </select>
              </div>
            </fieldset>

            <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-users"></i> Demográfica</legend>
              <div class="grid grid-cols-2 gap-4">
                <select v-model="form.segment.demo.age" class="input-field">
                  <option value="all">Todas las Edades</option>
                  <option value="18-24">18-24 (Gen Z)</option>
                  <option value="25-34">25-34 (Millennials)</option>
                  <option value="35-44">35-44 (Gen X Joven)</option>
                  <option value="45-54">45-54 (Gen X)</option>
                  <option value="55+">55+ (Boomers)</option>
                </select>
                <select v-model="form.segment.demo.sex" class="input-field">
                  <option value="all">Todos</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
            </fieldset>
            
            <fieldset class="fieldset-style bg-purple-50/50 border-purple-100">
              <legend class="legend-style text-purple-800"><i class="fas fa-brain"></i> Psicográfica</legend>
              <p class="text-xs text-gray-500 mb-3 px-2">Intereses y Estilo de Vida</p>
              
              <div class="grid grid-cols-2 gap-3 mb-3">
                <select v-model="form.segment.psycho.lifestyle" class="input-field">
                  <option value="all">General</option>
                  <option v-for="style in lifestyles" :key="style" :value="style">{{ style }}</option>
                </select>
                <select v-model="form.segment.psycho.archetype" class="input-field">
                  <option value="all">Arquetipo de Cliente</option>
                  <option value="innovador">Innovador (Early Adopter)</option>
                  <option value="seguidor">Seguidor de Tendencias</option>
                  <option value="practico">Práctico / Funcional</option>
                  <option value="aspiracional">Aspiracional</option>
                  <option value="conservador">Conservador</option>
                  <option value="rebelde">Rebelde / Disruptor</option>
                </select>
              </div>
              
              <div class="mb-2">
                <label class="block text-xs font-bold text-gray-500 mb-1">Intereses</label>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="interest in interests" 
                    :key="interest"
                    type="button"
                    @click="toggleInterest(interest)"
                    :class="['px-2 py-1 rounded-full text-xs border transition-colors', form.segment.psycho.interests.includes(interest) ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-gray-200 text-gray-600']"
                  >
                    {{ interest }}
                  </button>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-3 mb-2">
                <div class="relative">
                  <input v-model="form.segment.psycho.values" list="valuesList" type="text" placeholder="Valores (ej. Familia, Éxito)" class="input-field text-sm" />
                  <datalist id="valuesList">
                    <option v-for="val in values" :key="val" :value="val"></option>
                  </datalist>
                </div>
                <input v-model="form.segment.psycho.aspirations" type="text" placeholder="Aspiraciones / Deseos" class="input-field text-sm" />
              </div>
              
              <textarea v-model="form.segment.psycho.painPoints" placeholder="Puntos de Dolor / Problemas que enfrenta" rows="2" class="input-field"></textarea>
            </fieldset>

            <fieldset class="fieldset-style bg-blue-50/50 border-blue-100">
              <legend class="legend-style text-blue-800"><i class="fas fa-shopping-cart"></i> Conductual</legend>
              <div class="grid grid-cols-2 gap-3">
                <select v-model="form.segment.behavioral.purchaseFrequency" class="input-field text-sm">
                  <option value="all">Frecuencia de Compra</option>
                  <option value="daily">Diaria</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                  <option value="occasional">Ocasional</option>
                </select>
                <select v-model="form.segment.behavioral.priceSensitivity" class="input-field text-sm">
                  <option value="low">Baja Sensibilidad al Precio</option>
                  <option value="medium">Media Sensibilidad</option>
                  <option value="high">Alta Sensibilidad (Busca Ofertas)</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-3 mt-3">
                <select v-model="form.segment.behavioral.brandLoyalty" class="input-field text-sm">
                  <option value="low">Baja Lealtad (Cambia Fácil)</option>
                  <option value="medium">Lealtad Media</option>
                  <option value="high">Alta Lealtad</option>
                </select>
                <input v-model="form.segment.behavioral.preferredChannels" type="text" placeholder="Canales Preferidos (Online, Tienda)" class="input-field text-sm" />
              </div>
            </fieldset>
          </div>

          <!-- STEP 2: Advertising Concept (NEW) -->
          <div v-show="currentStep === 2" class="space-y-6 animate-fade-in">
            
            <div class="bg-white border border-gray-200 p-4 rounded-lg mb-4">
              <h3 class="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                <i class="fas fa-lightbulb text-yellow-500"></i> El Mejor Publicista del Mundo
              </h3>
              <p class="text-xs text-gray-600">Define el concepto publicitario que conectará con tu Buyer Persona. La IA actuará como un publicista ganador de Cannes Lions para crear anuncios que cierren ventas.</p>
            </div>

            <fieldset class="fieldset-style bg-purple-50/50 border-purple-100">
              <legend class="legend-style text-purple-800"><i class="fas fa-crown"></i> Arquetipo de Marca</legend>
              <p class="text-xs text-gray-500 mb-3 px-2">¿Cómo quieres que tu marca sea percibida?</p>
              <select v-model="form.advertisingConcept.brandArchetype" class="input-field">
                <option value="hero">El Héroe - Supera obstáculos, inspira coraje</option>
                <option value="sage">El Sabio - Conocimiento, expertise, confianza</option>
                <option value="innocent">El Inocente - Pureza, simplicidad, felicidad</option>
                <option value="explorer">El Explorador - Libertad, aventura, descubrimiento</option>
                <option value="rebel">El Rebelde - Revolución, cambio, disrupción</option>
                <option value="magician">El Mago - Transformación, innovación, sueños</option>
                <option value="lover">El Amante - Pasión, intimidad, placer</option>
                <option value="jester">El Bufón - Diversión, humor, alegría</option>
                <option value="everyman">La Persona Común - Accesible, realista, honesto</option>
                <option value="caregiver">El Cuidador - Servicio, protección, compasión</option>
                <option value="ruler">El Gobernante - Control, liderazgo, éxito</option>
                <option value="creator">El Creador - Innovación, arte, expresión</option>
              </select>
            </fieldset>

            <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-bullseye"></i> Propuesta de Valor</legend>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">¿Qué problema resuelves?</label>
                  <textarea v-model="form.advertisingConcept.problemSolved" placeholder="Ej: Ayudamos a emprendedores a gestionar sus finanzas sin complicaciones" rows="2" class="input-field"></textarea>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">¿Qué beneficio único ofreces?</label>
                  <textarea v-model="form.advertisingConcept.uniqueBenefit" placeholder="Ej: Automatización completa + asesoría personalizada en tiempo real" rows="2" class="input-field"></textarea>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">Propuesta de Valor Completa</label>
                  <textarea v-model="form.advertisingConcept.valueProposition" placeholder="Ej: Somos la única plataforma que combina IA con asesoría humana para que emprendedores tomen decisiones financieras inteligentes" rows="2" class="input-field"></textarea>
                </div>
              </div>
            </fieldset>

            <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-palette"></i> Enfoque Creativo</legend>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <select v-model="form.advertisingConcept.creativeApproach" class="input-field">
                  <option value="emotional">Emocional (Sentimientos, Conexión)</option>
                  <option value="rational">Racional (Datos, Lógica, ROI)</option>
                  <option value="humor">Humor (Divertido, Memorable)</option>
                  <option value="aspirational">Aspiracional (Estilo de Vida)</option>
                  <option value="fear">Urgencia/Miedo (FOMO, Escasez)</option>
                </select>
                <select v-model="form.advertisingConcept.conceptType" class="input-field">
                  <option value="problem-solution">Problema → Solución</option>
                  <option value="benefit-direct">Beneficio Directo</option>
                  <option value="storytelling">Storytelling / Historia</option>
                  <option value="testimonial">Testimonial / Prueba Social</option>
                  <option value="comparison">Comparación (Antes/Después)</option>
                </select>
              </div>
            </fieldset>

            <fieldset class="fieldset-style bg-blue-50/50 border-blue-100">
              <legend class="legend-style text-blue-800"><i class="fas fa-key"></i> Sectorización de Palabras Clave</legend>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">Palabras Clave Primarias (3-5)</label>
                  <input v-model="form.advertisingConcept.primaryKeywords" type="text" placeholder="Ej: Finanzas, Emprendimiento, Automatización" class="input-field" />
                  <p class="text-xs text-gray-500 mt-1">Separadas por comas. Estas DEBEN aparecer en el anuncio.</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">Palabras Clave Secundarias (5-10)</label>
                  <input v-model="form.advertisingConcept.secondaryKeywords" type="text" placeholder="Ej: Ahorro, Inversión, Crecimiento, Rentabilidad" class="input-field" />
                  <p class="text-xs text-gray-500 mt-1">Pueden usarse para enriquecer el contenido.</p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">Palabras Clave Negativas (Evitar)</label>
                  <input v-model="form.advertisingConcept.negativeKeywords" type="text" placeholder="Ej: Gratis, Barato, Complicado" class="input-field" />
                  <p class="text-xs text-gray-500 mt-1">Palabras que NO deben aparecer en el anuncio.</p>
                </div>
              </div>
            </fieldset>
          </div>

          <!-- STEP 3: Content Objective (formerly Step 2) -->
          <div v-show="currentStep === 3" class="space-y-6 animate-fade-in">
            
            <div class="bg-white border border-gray-200 p-4 rounded-lg mb-4">
              <h3 class="text-sm font-bold text-gray-900 mb-1"><i class="fas fa-target text-red-500"></i> Objetivo del Contenido</h3>
              <p class="text-xs text-gray-600">Ahora que definiste tu concepto, especifica qué acción quieres que tome tu audiencia.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Objetivo de la Campaña</label>
              <select v-model="form.contentObjective.objective" class="input-field">
                <option value="awareness">Reconocimiento de Marca</option>
                <option value="traffic">Tráfico al Sitio Web</option>
                <option value="sales">Ventas / Conversión</option>
                <option value="engagement">Interacción / Engagement</option>
                <option value="leads">Generación de Leads</option>
                <option value="app-install">Instalación de App</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Descripción del Producto/Servicio</label>
              <textarea v-model="form.contentObjective.description" placeholder="Ej: Nuevo curso de finanzas personales para jóvenes profesionales..." rows="3" class="input-field"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tono de Comunicación</label>
                <select v-model="form.contentObjective.tone" class="input-field">
                  <option value="professional">Profesional y Autoritario</option>
                  <option value="friendly">Amigable y Cercano</option>
                  <option value="humorous">Humorístico y Divertido</option>
                  <option value="urgent">Urgente y Directo</option>
                  <option value="inspirational">Inspiracional y Emotivo</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Call-to-Action (CTA)</label>
                <select v-model="form.contentObjective.cta" class="input-field">
                  <option value="learn-more">Aprende Más / Descubre</option>
                  <option value="buy-now">Compra Ahora</option>
                  <option value="sign-up">Regístrate / Únete</option>
                  <option value="download">Descarga</option>
                  <option value="contact">Contáctanos</option>
                  <option value="get-offer">Obtén la Oferta</option>
                </select>
              </div>
            </div>
          </div>

          <!-- STEP 4: Platform & Format Selection -->
          <div v-show="currentStep === 4" class="space-y-6 animate-fade-in">
            <div class="bg-white border border-gray-200 p-4 rounded-lg mb-4">
              <h3 class="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                <i class="fas fa-share-alt text-blue-500"></i> Plataformas y Formatos
              </h3>
              <p class="text-xs text-gray-600">Elige tus redes sociales y el formato visual. La vista previa se adaptará a tu selección.</p>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <!-- Networks -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">1. Redes Sociales</label>
                <div class="grid grid-cols-2 gap-3">
                  <label 
                    v-for="network in availableNetworks" 
                    :key="network.id"
                    :class="[
                      'checkbox-label p-3 border rounded-lg transition-all cursor-pointer hover:border-kapital-dark',
                      form.networks.includes(network.id) ? 'border-kapital-dark bg-blue-50' : 'border-gray-200'
                    ]"
                    @click="activePreviewNetwork = network.id"
                  >
                    <input 
                      type="checkbox" 
                      :value="network.id"
                      v-model="form.networks"
                      class="checkbox-input"
                    />
                    <i :class="['bi', network.icon, 'text-lg']" :style="{ color: network.color }"></i>
                    <div class="flex-1">
                      <div class="font-medium text-gray-900">{{ network.name }}</div>
                      <div class="text-xs text-gray-500">Formatos: {{ network.formats.join(', ') }}</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Visual Style & Formats -->
              <div v-if="form.networks.length > 0" class="animate-fade-in">
                <div class="border-t border-gray-200 pt-6 mt-2">
                  <label class="block text-sm font-medium text-gray-700 mb-4">2. Estilo y Formato</label>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Visual Identity -->
                    <div class="space-y-4">
                      <div>
                        <label class="block text-xs font-bold text-gray-700 mb-2">Estilo Visual</label>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <button 
                            v-for="style in visualStyles" 
                            :key="style.id"
                            type="button"
                            @click="form.visualStyle = style.id"
                            :class="['flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all', form.visualStyle === style.id ? 'border-kapital-dark bg-blue-50 text-kapital-dark' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50']"
                          >
                            <i :class="['fas', style.icon, 'text-xl mb-1']"></i>
                            <span class="text-xs font-bold">{{ style.name }}</span>
                            <span class="text-[10px] opacity-70">{{ style.desc }}</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label class="block text-xs font-bold text-gray-700 mb-2">Color de Marca</label>
                        
                        <!-- Color Swatches -->
                        <div class="grid grid-cols-4 gap-2 mb-3">
                          <button 
                            v-for="color in brandColors" 
                            :key="color.value"
                            type="button"
                            @click="form.colorPrimary = color.value"
                            :class="['w-full h-8 rounded-md border transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1', form.colorPrimary === color.value ? 'ring-2 ring-offset-1 ring-gray-400 scale-105' : 'border-gray-200']"
                            :style="{ backgroundColor: color.value }"
                            :title="color.name"
                          ></button>
                        </div>

                        <!-- Custom Picker -->
                        <div class="flex items-center gap-2">
                          <div class="relative">
                            <input v-model="form.colorPrimary" type="color" class="h-9 w-9 rounded cursor-pointer border border-gray-300 p-0 overflow-hidden" />
                          </div>
                          <input v-model="form.colorPrimary" type="text" class="input-field uppercase text-xs py-2" placeholder="#HEX" />
                        </div>
                      </div>
                    </div>

                    <!-- Format Selection -->
                    <div>
                      <div class="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-3">
                        <p class="text-xs text-blue-800">
                          <i class="fas fa-info-circle mr-1"></i>
                          Formatos compatibles con: <strong>{{ selectedNetworksNames }}</strong>
                        </p>
                      </div>
                      
                      <div class="grid grid-cols-2 gap-3">
                        <button 
                          type="button" 
                          v-for="format in availableFormatsForNetworks" 
                          :key="format.name"
                          @click="selectFormat(format.value)"
                          :class="['visual-selector', form.format === format.value ? 'selected' : '']"
                        >
                          <i :class="['fas', format.icon, 'text-xl mb-1 block']"></i>
                          <span class="text-sm font-medium">{{ format.name }}</span>
                          <span v-if="format.compatibleNetworks" class="text-xs text-gray-500 mt-1 block">
                            {{ format.compatibleNetworks }}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <i class="fas fa-mouse-pointer text-gray-400 text-2xl mb-2"></i>
                <p class="text-sm text-gray-500">Selecciona al menos una red social para configurar el formato.</p>
              </div>
            </div>
          </div>

          <!-- STEP 5: Production & Scheduling -->
          <div v-show="currentStep === 5" class="space-y-6 animate-fade-in">
            
            <div class="bg-white p-4 rounded-lg border border-gray-200">
              <h4 class="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <i class="fas fa-magic text-purple-600"></i> Generación de Anuncios con IA
              </h4>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">Cantidad de Variaciones</label>
                  <input v-model.number="form.production.quantity" type="number" min="1" max="10" class="input-field" />
                  <p class="text-xs text-gray-500 mt-1">Genera múltiples versiones para A/B testing</p>
                </div>
                <div class="flex items-center">
                  <label class="flex items-center gap-3 cursor-pointer bg-white p-3 rounded-lg border border-gray-200 w-full hover:border-purple-300 transition-all">
                    <input v-model="form.production.autoPublish" type="checkbox" class="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                    <div>
                      <span class="block font-bold text-gray-900 text-sm">Auto-Publicar</span>
                      <span class="block text-xs text-gray-500">Sin revisión manual</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 class="font-bold text-sm text-gray-800 mb-3"><i class="fas fa-calendar-alt"></i> Programación</h4>
              
              <div class="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">Frecuencia</label>
                  <select v-model="form.production.frequency" class="input-field">
                    <option value="once">Solo una vez</option>
                    <option value="daily">Diaria</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                    <option value="custom">Personalizada</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">Hora de Publicación</label>
                  <input v-model="form.production.time" type="time" class="input-field" />
                </div>
              </div>

              <div v-if="form.production.frequency === 'weekly' || form.production.frequency === 'custom'" class="mb-3">
                <label class="block text-xs font-bold text-gray-600 mb-2">Días de la Semana</label>
                <div class="grid grid-cols-7 gap-2">
                  <label 
                    v-for="day in weekDays" 
                    :key="day.value"
                    :class="['text-center p-2 rounded-lg border text-xs font-bold cursor-pointer transition-all', form.production.recurringDays.includes(day.value) ? 'bg-kapital-dark text-white border-kapital-dark' : 'bg-white text-gray-600 border-gray-200 hover:border-kapital-dark']"
                  >
                    <input type="checkbox" :value="day.value" v-model="form.production.recurringDays" class="hidden" />
                    {{ day.label }}
                  </label>
                </div>
              </div>

              <div v-if="form.production.frequency !== 'once'" class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">Inicio de Campaña</label>
                  <input v-model="form.production.campaignStart" type="date" class="input-field" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">Fin de Campaña</label>
                  <input v-model="form.production.campaignEnd" type="date" class="input-field" />
                </div>
              </div>

              <div v-if="form.production.frequency === 'once'" class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">Día de Publicación</label>
                  <select v-model="form.production.day" class="input-field">
                    <option value="Monday">Lunes</option>
                    <option value="Tuesday">Martes</option>
                    <option value="Wednesday">Miércoles</option>
                    <option value="Thursday">Jueves</option>
                    <option value="Friday">Viernes</option>
                    <option value="Saturday">Sábado</option>
                    <option value="Sunday">Domingo</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 mb-1">Fecha</label>
                  <input v-model="form.production.campaignStart" type="date" class="input-field" />
                </div>
              </div>
            </div>
            
            <button type="submit" class="btn-primary w-full text-base shadow-lg shadow-kapital-dark/20" :disabled="generating || form.networks.length === 0">
              <i :class="['fas', generating ? 'fa-spinner fa-spin' : 'fa-magic']"></i>
              {{ generating ? 'Generando Contenido...' : `Generar ${form.production.quantity} Anuncio${form.production.quantity > 1 ? 's' : ''}` }}
            </button>
          </div>
        </form>

        <div class="flex justify-between mt-6 pt-6 border-t border-gray-200">
          <button v-if="currentStep > 1" type="button" @click="prevStep" class="btn-secondary">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          <div v-else></div>
          
          <button 
            v-if="currentStep < 5" 
            type="button" 
            @click="nextStep" 
            class="btn-primary"
          >
            Siguiente <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Preview / Results Panel -->
      <div class="card flex flex-col min-h-[600px]">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="fas fa-eye text-kapital-dark"></i> Resultados
          </h2>
          <div v-if="form.networks.length > 0" class="flex bg-gray-100 p-1 rounded-lg">
            <button 
              v-for="netId in form.networks" 
              :key="netId"
              @click="activePreviewNetwork = netId"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1',
                activePreviewNetwork === netId ? 'bg-white text-kapital-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              <i :class="['bi', getNetworkIcon(netId)]"></i> {{ getNetworkName(netId) }}
            </button>
          </div>
        </div>
        
        <div class="flex-1 bg-gray-100 border border-gray-200 rounded-xl p-4 flex items-center justify-center relative overflow-hidden">
          
          <div v-if="generating" class="text-center text-kapital-night p-8 z-10">
            <i class="fas fa-circle-notch fa-spin text-4xl mb-4 text-kapital-dark"></i>
            <p class="text-lg font-semibold mb-2">El "Mejor Publicista" está trabajando...</p>
            <p class="text-sm text-gray-600 animate-pulse">{{ generationStatus }}</p>
          </div>

          <div v-else-if="!generated && !form.format" class="text-center text-gray-400">
            <i class="fas fa-layer-group text-5xl mb-3 block opacity-50"></i>
            <p class="text-sm font-medium">Configura tu Buyer Persona y Concepto<br>para ver la magia.</p>
          </div>
          
          <div v-else-if="!generating && (generated || form.format)" class="w-full flex justify-center">
            <!-- Mockup Component (Simplified for brevity, similar to previous but dynamic) -->
             <div :class="['shadow-xl rounded-xl overflow-hidden border transition-all duration-500 max-w-sm w-full flex flex-col', previewStyles.container]">
               
               <!-- Network Header (Hidden for TikTok) -->
               <div v-if="activePreviewNetwork !== 'tiktok'" :class="['p-3 flex items-center gap-2 border-b', previewStyles.header]">
                 <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                   <img src="https://ui-avatars.com/api/?name=Kapital&background=random" alt="Avatar" class="w-full h-full object-cover" />
                 </div>
                 <div class="flex-1">
                   <div :class="['text-xs font-bold', previewStyles.textPrimary]">Kapital App</div>
                   <div v-if="activePreviewNetwork === 'instagram' || activePreviewNetwork === 'facebook'" class="text-[10px] text-gray-500">Publicidad</div>
                   <div v-if="activePreviewNetwork === 'linkedin'" class="text-[10px] text-gray-500">Promocionado</div>
                 </div>
                 <i :class="['fas fa-ellipsis-h text-gray-400']"></i>
               </div>

               <!-- Content / Image -->
               <div class="w-full bg-gray-200 flex items-center justify-center relative overflow-hidden text-white text-center group" 
                    :class="[activePreviewNetwork === 'tiktok' ? 'p-0' : 'p-6']"
                    :style="{ aspectRatio: getAspectRatio(form.format), background: `linear-gradient(135deg, ${form.colorPrimary} 0%, #000 100%)` }">
                  
                  <!-- TikTok UI Overlay -->
                  <div v-if="activePreviewNetwork === 'tiktok'" class="absolute inset-0 z-20 flex flex-col justify-between p-4 bg-gradient-to-b from-black/20 via-transparent to-black/60">
                    <!-- Top Bar -->
                    <div class="flex justify-center pt-2 text-white/80 font-bold text-sm gap-4">
                      <span class="opacity-70">Siguiendo</span>
                      <span class="border-b-2 border-white pb-1">Para ti</span>
                    </div>

                    <!-- Right Sidebar -->
                    <div class="absolute right-2 bottom-20 flex flex-col gap-6 items-center">
                      <div class="relative">
                        <div class="w-10 h-10 rounded-full border border-white overflow-hidden">
                           <img src="https://ui-avatars.com/api/?name=Kapital&background=random" alt="Avatar" class="w-full h-full object-cover" />
                        </div>
                        <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-white font-bold">+</div>
                      </div>
                      
                      <div class="flex flex-col items-center gap-1">
                        <i class="fas fa-heart text-white text-2xl drop-shadow-md"></i>
                        <span class="text-xs font-bold text-white drop-shadow-md">12.5K</span>
                      </div>
                      
                      <div class="flex flex-col items-center gap-1">
                        <i class="fas fa-comment-dots text-white text-2xl drop-shadow-md"></i>
                        <span class="text-xs font-bold text-white drop-shadow-md">842</span>
                      </div>
                      
                      <div class="flex flex-col items-center gap-1">
                        <i class="fas fa-bookmark text-white text-2xl drop-shadow-md"></i>
                        <span class="text-xs font-bold text-white drop-shadow-md">1.2K</span>
                      </div>

                      <div class="flex flex-col items-center gap-1">
                        <i class="fas fa-share text-white text-2xl drop-shadow-md"></i>
                        <span class="text-xs font-bold text-white drop-shadow-md">Share</span>
                      </div>
                    </div>

                    <!-- Bottom Info -->
                    <div class="flex flex-col items-start text-left pr-16 pb-2">
                      <div class="font-bold text-white text-shadow-sm mb-1">@kapital_app</div>
                      <p class="text-sm text-white/90 text-shadow-sm line-clamp-2 mb-2">
                        {{ generated ? generatedData.copy : 'Tu copy generado aparecerá aquí...' }} 
                        <span class="font-bold">{{ generated ? generatedData.hashtags.join(' ') : '#fyp #viral #marketing' }}</span>
                      </p>
                      <div class="flex items-center gap-2 text-white/80 text-xs">
                        <i class="fas fa-music"></i>
                        <div class="w-24 overflow-hidden whitespace-nowrap">Sonido Original - Kapital App</div>
                      </div>
                    </div>
                  </div>

                  <!-- Instagram Reels Overlay (Simplified) -->
                  <div v-else-if="activePreviewNetwork === 'instagram' && form.format === '9:16'" class="absolute right-2 bottom-20 flex flex-col gap-4 items-center z-20">
                    <div class="bg-black/20 p-2 rounded-full backdrop-blur-sm"><i class="fas fa-heart text-white text-xl"></i></div>
                    <div class="bg-black/20 p-2 rounded-full backdrop-blur-sm"><i class="fas fa-comment-dots text-white text-xl"></i></div>
                    <div class="bg-black/20 p-2 rounded-full backdrop-blur-sm"><i class="fas fa-share text-white text-xl"></i></div>
                  </div>

                  <span v-if="activePreviewNetwork !== 'tiktok'" class="text-lg font-bold drop-shadow-md relative z-10 px-6">{{ generated ? form.concept.description?.substring(0, 50) : 'Tu Anuncio Aquí' }}</span>
                  <span v-else class="text-2xl font-bold drop-shadow-md relative z-10 px-12 text-white/90">{{ generated ? form.concept.description?.substring(0, 30) : 'VIDEO CONTENT' }}</span>
                  
                  <!-- Watermark for preview -->
                  <div class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <i :class="['bi', getNetworkIcon(activePreviewNetwork), 'text-9xl']"></i>
                  </div>
               </div>

               <!-- Network Footer / Actions (Hidden for TikTok) -->
               <div v-if="activePreviewNetwork !== 'tiktok'" :class="['p-3', previewStyles.footer]">
                 <!-- Instagram Actions -->
                 <div v-if="activePreviewNetwork === 'instagram'" class="flex justify-between mb-2">
                   <div class="flex gap-3">
                     <i class="far fa-heart text-xl hover:text-red-500 cursor-pointer"></i>
                     <i class="far fa-comment text-xl hover:text-gray-500 cursor-pointer"></i>
                     <i class="far fa-paper-plane text-xl hover:text-gray-500 cursor-pointer"></i>
                   </div>
                   <i class="far fa-bookmark text-xl hover:text-gray-500 cursor-pointer"></i>
                 </div>

                 <!-- Facebook Actions -->
                 <div v-if="activePreviewNetwork === 'facebook'" class="flex justify-between border-t border-b border-gray-100 py-1 mb-2 text-gray-500">
                   <div class="flex items-center gap-1 text-xs font-medium"><i class="far fa-thumbs-up"></i> Me gusta</div>
                   <div class="flex items-center gap-1 text-xs font-medium"><i class="far fa-comment-alt"></i> Comentar</div>
                   <div class="flex items-center gap-1 text-xs font-medium"><i class="fas fa-share"></i> Compartir</div>
                 </div>

                 <!-- LinkedIn Actions -->
                 <div v-if="activePreviewNetwork === 'linkedin'" class="flex justify-between border-t border-gray-100 pt-2 mb-2 text-gray-600">
                   <div class="flex flex-col items-center"><i class="far fa-thumbs-up text-sm"></i> <span class="text-[10px]">Recomendar</span></div>
                   <div class="flex flex-col items-center"><i class="far fa-comment-dots text-sm"></i> <span class="text-[10px]">Comentar</span></div>
                   <div class="flex flex-col items-center"><i class="fas fa-share text-sm"></i> <span class="text-[10px]">Compartir</span></div>
                   <div class="flex flex-col items-center"><i class="far fa-paper-plane text-sm"></i> <span class="text-[10px]">Enviar</span></div>
                 </div>

                 <p class="text-xs text-gray-800 mb-1">
                   <span class="font-bold mr-1">kapital_app</span> 
                   {{ generated ? generatedData.copy : 'El copy generado aparecerá aquí...' }}
                 </p>
                 <p class="text-blue-600 text-xs">{{ generated ? generatedData.hashtags.join(' ') : '#hashtags #marketing #ai' }}</p>
               </div>
             </div>
          </div>
        </div>

        <Transition name="fade">
          <div v-if="generated" class="space-y-4 mt-4">
            <div class="result-box">
              <h3 class="result-title"><i class="fas fa-robot mr-1"></i> Prompt Generado (Midjourney / DALL-E)</h3>
              <textarea v-model="generatedData.imagePrompt" class="w-full text-xs text-gray-600 font-mono bg-white p-2 rounded border border-gray-200 h-20" readonly></textarea>
            </div>
            <div class="result-box">
              <h3 class="result-title"><i class="fas fa-pen-fancy mr-1"></i> Copy Persuasivo</h3>
              <textarea v-model="generatedData.copy" class="w-full text-sm text-gray-700 bg-white p-2 rounded border border-gray-200 h-24"></textarea>
            </div>
            <div class="flex gap-3 pt-2">
              <button @click="sendToProduction" class="btn-primary flex-1 text-sm w-full">
                <i class="fas fa-check-circle"></i> Confirmar y Programar
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'
import { useContentStore } from '../stores/content'

const router = useRouter()
const emit = defineEmits(['showToast'])
const settingsStore = useSettingsStore()
const contentStore = useContentStore()
const { zones, professions, occupations, educationLevels, lifestyles, interests, values } = storeToRefs(settingsStore)

const currentStep = ref(1)
const activePreviewNetwork = ref('instagram')
const generated = ref(false)
const generating = ref(false)
const generationStatus = ref('')

const weekDays = [
  { label: 'L', value: 'Monday' },
  { label: 'M', value: 'Tuesday' },
  { label: 'X', value: 'Wednesdayy' },
  { label: 'J', value: 'Thursday' },
  { label: 'V', value: 'Friday' },
  { label: 'S', value: 'Saturday' },
  { label: 'D', value: 'Sunday' }
]

const wizardSteps = [
  { title: 'Paso 1: Buyer Persona', subtitle: 'Define quién es tu cliente ideal' },
  { title: 'Paso 2: Concepto Publicitario', subtitle: 'Define el enfoque creativo y mensaje' },
  { title: 'Paso 3: Objetivo de Contenido', subtitle: 'Define qué quieres lograr' },
  { title: 'Paso 4: Plataformas y Formatos', subtitle: 'Elige dónde y cómo publicar' },
  { title: 'Paso 5: Producción', subtitle: 'Programa la publicación' }
]

const form = ref({
  segment: {
    geo: { 
      zone: 'all', 
      city: '', 
      country: '',
      climate: 'all',
      density: 'all'
    },
    demo: { 
      age: 'all', 
      sex: 'all', 
      profession: '', 
      occupation: '', 
      education: '' 
    },
    psycho: { 
      lifestyle: 'all', 
      interests: [],
      archetype: 'all',
      values: '',
      painPoints: '',
      aspirations: ''
    },
    behavioral: {
      purchaseFrequency: 'all',
      priceSensitivity: 'medium',
      brandLoyalty: 'medium',
      preferredChannels: ''
    }
  },
  advertisingConcept: {
    brandArchetype: 'hero',
    valueProposition: '',
    problemSolved: '',
    uniqueBenefit: '',
    creativeApproach: 'emotional',
    conceptType: 'problem-solution',
    primaryKeywords: '',
    secondaryKeywords: '',
    negativeKeywords: ''
  },
  contentObjective: {
    objective: 'sales',
    description: '',
    tone: 'professional',
    cta: 'learn-more'
  },
  visualStyle: 'studio',
  colorPrimary: '#2B66FF',
  format: '',
  networks: [],
  production: {
    quantity: 3,
    frequency: 'once',
    day: 'Monday',
    time: '14:00',
    autoPublish: false,
    campaignStart: '',
    campaignEnd: '',
    recurringDays: []
  }
})

const generatedData = ref({
  copy: '',
  hashtags: [],
  imagePrompt: ''
})

// --- WATCHERS ---
watch(() => form.value.networks, (newNetworks) => {
  if (newNetworks.length > 0 && !newNetworks.includes(activePreviewNetwork.value)) {
    activePreviewNetwork.value = newNetworks[0]
  }
  
  // Auto-clear format if it's no longer compatible with selected networks
  if (form.value.format && newNetworks.length > 0) {
    const compatibleFormats = availableFormatsForNetworks.value.map(f => f.value)
    if (!compatibleFormats.includes(form.value.format)) {
      form.value.format = ''
    }
  }
})

// --- FORMATS & NETWORKS ---
const allFormats = {
  post: { name: 'Post (1:1)', value: '1:1', icon: 'fa-square' },
  story: { name: 'Story (9:16)', value: '9:16', icon: 'fa-mobile-alt' },
  landscape: { name: 'Video (16:9)', value: '16:9', icon: 'fa-video' }
}

const availableNetworks = ref([
  { id: 'instagram', name: 'Instagram', icon: 'bi-instagram', color: '#E4405F', formats: ['1:1', '9:16', '16:9'] },
  { id: 'facebook', name: 'Facebook', icon: 'bi-facebook', color: '#1877F2', formats: ['1:1', '16:9', '9:16'] },
  { id: 'linkedin', name: 'LinkedIn', icon: 'bi-linkedin', color: '#0A66C2', formats: ['1:1', '16:9'] },
  { id: 'tiktok', name: 'TikTok', icon: 'bi-tiktok', color: '#010101', formats: ['9:16'] }
])

const brandColors = [
  { name: 'Tech Blue', value: '#2B66FF' },
  { name: 'Luxury Gold', value: '#D4AF37' },
  { name: 'Energetic Red', value: '#FF4B4B' },
  { name: 'Growth Green', value: '#00C853' },
  { name: 'Trust Navy', value: '#0D47A1' },
  { name: 'Creative Purple', value: '#9C27B0' },
  { name: 'Sleek Black', value: '#000000' },
  { name: 'Vibrant Orange', value: '#FF9800' }
]

const visualStyles = [
  { id: 'studio', name: 'Estudio', icon: 'fa-camera', desc: 'Limpio y profesional' },
  { id: 'lifestyle', name: 'Lifestyle', icon: 'fa-user-friends', desc: 'Personas reales' },
  { id: 'minimal', name: 'Minimalista', icon: 'fa-crop-alt', desc: 'Simple y Tech' },
  { id: '3d', name: '3D / Abstracto', icon: 'fa-cube', desc: 'Moderno y digital' },
  { id: 'illustration', name: 'Ilustración', icon: 'fa-pen-nib', desc: 'Artístico' }
]

// --- COMPUTED PROPERTIES ---
const availableFormatsForNetworks = computed(() => {
  // If no networks selected, show all formats
  if (form.value.networks.length === 0) {
    return Object.values(allFormats)
  }
  
  // Get all formats supported by selected networks
  const selectedNetworks = availableNetworks.value.filter(n => form.value.networks.includes(n.id))
  const supportedFormats = new Set()
  
  selectedNetworks.forEach(network => {
    network.formats.forEach(format => supportedFormats.add(format))
  })
  
  // Filter and enhance format objects with compatibility info
  return Object.values(allFormats).filter(format => {
    return supportedFormats.has(format.value)
  }).map(format => {
    // Add info about which networks support this format
    const compatibleNets = selectedNetworks
      .filter(n => n.formats.includes(format.value))
      .map(n => n.name)
    
    return {
      ...format,
      compatibleNetworks: compatibleNets.length < selectedNetworks.length 
        ? `Solo: ${compatibleNets.join(', ')}` 
        : ''
    }
  })
})

const selectedNetworksNames = computed(() => {
  return form.value.networks
    .map(id => availableNetworks.value.find(n => n.id === id)?.name)
    .filter(Boolean)
    .join(', ')
})

// --- METHODS ---
function nextStep() { if (currentStep.value < 5) currentStep.value++ }
function prevStep() { if (currentStep.value > 1) currentStep.value-- }

function toggleInterest(interest) {
  const index = form.value.segment.psycho.interests.indexOf(interest)
  if (index === -1) {
    form.value.segment.psycho.interests.push(interest)
  } else {
    form.value.segment.psycho.interests.splice(index, 1)
  }
}

function selectFormat(val) {
  form.value.format = val
}

function getNetworkIcon(id) {
  const net = availableNetworks.value.find(n => n.id === id)
  return net ? net.icon : 'bi-app'
}

function getNetworkName(id) {
  const net = availableNetworks.value.find(n => n.id === id)
  return net ? net.name : id
}

function getAspectRatio(format) {
  if (!format) return '1/1'
  const [w, h] = format.split(':')
  return `${w}/${h}`
}

const previewStyles = computed(() => {
  const styles = {
    container: 'bg-white border-gray-200',
    header: 'border-gray-100 bg-white',
    textPrimary: 'text-gray-900',
    footer: 'bg-white'
  }

  if (activePreviewNetwork.value === 'facebook') {
    styles.container = 'bg-white border-blue-100'
    styles.header = 'bg-white border-gray-100'
    styles.textPrimary = 'text-[#1877F2]'
  } else if (activePreviewNetwork.value === 'linkedin') {
    styles.container = 'bg-white border-gray-300'
    styles.header = 'bg-white border-gray-200'
    styles.textPrimary = 'text-[#0A66C2]'
  } else if (activePreviewNetwork.value === 'tiktok') {
    styles.container = 'bg-black border-gray-800'
    styles.header = 'bg-black border-gray-800 text-white'
    styles.textPrimary = 'text-white'
    styles.footer = 'bg-black text-white'
  }

  return styles
})




function generateContent() {
  generating.value = true
  generated.value = false
  
  const steps = [
    `Analizando perfil: ${form.value.segment.demo.profession || 'Usuario'} en ${form.value.segment.geo.city || 'General'}...`,
    `Aplicando rol de "Mejor Publicista"...`,
    `Sectorizando palabras clave: ${form.value.advertisingConcept.primaryKeywords || 'Generales'}...`,
    `Creando ${form.value.production.quantity} variaciones de anuncios...`
  ]

  let stepIndex = 0
  const interval = setInterval(() => {
    if (stepIndex < steps.length) {
      generationStatus.value = steps[stepIndex]
      stepIndex++
    }
  }, 800)
  
  setTimeout(() => {
    clearInterval(interval)
    
    // LOGIC: Generate Prompt based on Persona
    const persona = `${form.value.segment.demo.profession} ${form.value.segment.demo.education ? 'con estudios de ' + form.value.segment.demo.education : ''}`
    const style = form.value.visualStyle
    const concept = form.value.advertisingConcept
    const objective = form.value.contentObjective
    
    generatedData.value = {
      copy: `¡Atención ${persona}! \n\n${concept.problemSolved || 'Resolvemos tu problema'}. \n\n${concept.uniqueBenefit || 'Beneficio único'}. \n\nDescubre más aquí.`,
      hashtags: ['#Kapital', `#${form.value.segment.psycho.lifestyle}`, ...(form.value.advertisingConcept.primaryKeywords ? form.value.advertisingConcept.primaryKeywords.split(',').map(k => '#' + k.trim()) : [])],
      imagePrompt: `/imagine prompt: High quality advertisement for ${objective.description}, target audience ${persona}, style ${style}, professional lighting, 8k --ar ${form.value.format.replace(':','-')}`
    }
    
    generated.value = true
    generating.value = false
    emit('showToast', 'Contenido generado con éxito')
  }, 4000)
}

function sendToProduction() {
  const newPost = {
    title: `Campaña ${form.value.advertisingConcept.brandArchetype} - ${form.value.segment.demo.profession}`,
    description: generatedData.value.copy,
    hashtags: generatedData.value.hashtags.join(' '),
    channels: form.value.networks.map(n => getNetworkName(n)).join(', '),
    date: form.value.production.campaignStart || new Date().toISOString().split('T')[0],
    time: form.value.production.time,
    status: form.value.production.autoPublish ? 'published' : 'scheduled',
    hasImage: true
  }

  contentStore.addPublication(newPost)
  emit('showToast', `Programado: ${form.value.production.day} a las ${form.value.production.time}`)
  router.push('/production')
}
</script>

<style scoped lang="postcss">
.btn-primary {
  @apply px-6 py-3 bg-kapital-night text-white font-medium rounded-md transition-all hover:bg-kapital-night-hover active:scale-95 flex items-center gap-2 justify-center;
}
.btn-secondary {
  @apply bg-gray-100 text-gray-800 font-medium rounded-md border border-gray-300 transition-all hover:bg-gray-200 flex items-center gap-2 justify-center;
}
.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-shadow;
}
.fieldset-style {
  @apply border border-gray-200 rounded-lg p-4 bg-white;
}
.legend-style {
  @apply px-2 text-sm font-bold text-gray-700 flex items-center gap-2;
}
.visual-selector {
  @apply flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-500;
}
.visual-selector.selected {
  @apply border-kapital-dark bg-blue-50 text-kapital-dark shadow-md;
}
.checkbox-label {
  @apply flex items-center gap-3 cursor-pointer bg-white hover:bg-gray-50;
}
.checkbox-input {
  @apply w-4 h-4 text-kapital-dark rounded border-gray-300 focus:ring-kapital-dark;
}
.result-box {
  @apply bg-white p-3 rounded-lg border border-gray-200 shadow-sm;
}
.result-title {
  @apply text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide;
}
.text-shadow-sm {
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
</style>