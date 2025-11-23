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
                  <option value="urbana">Urbana</option>
                  <option value="rural">Rural</option>
                  <option value="suburbana">Suburbana</option>
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
                <input v-model="form.segment.demo.profession" type="text" placeholder="Profesión (ej. Abogado)" class="input-field" />
                <input v-model="form.segment.demo.occupation" type="text" placeholder="Ocupación Actual" class="input-field" />
              </div>
              <div class="mt-3">
                <select v-model="form.segment.demo.education" class="input-field">
                  <option value="">Nivel de Estudios...</option>
                  <option value="secundaria">Secundaria</option>
                  <option value="tecnico">Técnico</option>
                  <option value="universitario">Universitario</option>
                  <option value="postgrado">Postgrado / Maestría</option>
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
                  <option value="sofisticados">Sofisticados (Lujo, Exclusividad)</option>
                  <option value="progresistas">Progresistas (Emprendedores, Prácticos)</option>
                  <option value="modernas">Modernas (Tendencia, Moda)</option>
                  <option value="formalistas">Formalistas (Tradicionales)</option>
                  <option value="conservadoras">Conservadoras (Familia, Hogar)</option>
                  <option value="austeros">Austeros (Ahorro)</option>
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
              
              <textarea v-model="form.segment.psycho.interests" placeholder="Intereses específicos (ej. Tecnología, Deportes, Finanzas...)" rows="2" class="input-field mb-2"></textarea>
              
              <div class="grid grid-cols-2 gap-3 mb-2">
                <input v-model="form.segment.psycho.values" type="text" placeholder="Valores (ej. Familia, Éxito, Libertad)" class="input-field text-sm" />
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
            
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 p-4 rounded-lg mb-4">
              <h3 class="text-sm font-bold text-yellow-900 mb-1 flex items-center gap-2">
                <i class="fas fa-lightbulb"></i> El Mejor Publicista del Mundo
              </h3>
              <p class="text-xs text-yellow-800">Define el concepto publicitario que conectará con tu Buyer Persona. La IA actuará como un publicista ganador de Cannes Lions para crear anuncios que cierren ventas.</p>
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
            
            <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
              <h3 class="text-sm font-bold text-yellow-800 mb-1"><i class="fas fa-target"></i> Objetivo del Contenido</h3>
              <p class="text-xs text-yellow-700">Ahora que definiste tu concepto, especifica qué acción quieres que tome tu audiencia.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Objetivo de la Campaña</label>
              <select v-model="form.contentObjective.objective" class="input-field">
                <option value="awareness">Reconocimiento de Marca</option>
                <option value="traffic">Tráfico al Sitio Web</option>
                <option value="sales">Ventas / Conversión 💰</option>
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

          <!-- STEP 4: Visuals & Format (formerly Step 3) -->
          <div v-show="currentStep === 4" class="space-y-6 animate-fade-in">
             <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-palette"></i> Identidad Visual</legend>
              
              <div class="mb-4">
                <label class="block text-xs font-bold text-gray-700 mb-1">Estilo Visual</label>
                <select v-model="form.visualStyle" class="input-field text-sm">
                  <option value="studio">Fotografía de Estudio (Clean)</option>
                  <option value="lifestyle">Lifestyle (Personas reales)</option>
                  <option value="minimal">Minimalista / Tech</option>
                  <option value="3d">Render 3D / Abstracto</option>
                  <option value="illustration">Ilustración Moderna</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="col-span-2">
                  <label class="block text-xs font-bold text-gray-700 mb-1">Color Principal</label>
                  <div class="flex items-center gap-2">
                    <input v-model="form.colorPrimary" type="color" class="h-10 w-10 rounded cursor-pointer border border-gray-300" />
                    <input v-model="form.colorPrimary" type="text" class="input-field uppercase" />
                  </div>
                </div>
              </div>
            </fieldset>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Formato</label>
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
          </div>

          <!-- STEP 5: Production & Scheduling (formerly Step 4) -->
          <div v-show="currentStep === 5" class="space-y-6 animate-fade-in">
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Redes Sociales</label>
              <div class="grid grid-cols-2 gap-3">
                <label 
                  v-for="network in availableNetworks" 
                  :key="network.id"
                  :class="[
                    'checkbox-label p-3 border rounded-lg transition-all',
                    isNetworkCompatible(network.id) ? 'cursor-pointer hover:border-kapital-dark' : 'opacity-50 cursor-not-allowed bg-gray-50'
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

            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
              <h4 class="font-bold text-sm text-purple-900 mb-3 flex items-center gap-2">
                <i class="fas fa-magic"></i> Generación de Anuncios con IA
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
          <button type="button" @click="prevStep" :disabled="currentStep === 1" class="btn-secondary">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          
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
             <div :class="['bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 flex flex-col transition-all duration-500 max-w-sm w-full']">
               <div class="p-3 flex items-center gap-2 border-b border-gray-100">
                 <div class="w-8 h-8 rounded-full bg-gray-200"></div>
                 <div class="text-xs font-bold text-gray-800">Kapital Preview</div>
               </div>
               <div class="w-full bg-gray-200 flex items-center justify-center relative overflow-hidden text-white text-center p-6" 
                    :style="{ aspectRatio: getAspectRatio(form.format), background: `linear-gradient(135deg, ${form.colorPrimary} 0%, #000 100%)` }">
                  <span class="text-lg font-bold drop-shadow-md">{{ generated ? form.concept.description.substring(0, 50) : 'Tu Anuncio Aquí' }}</span>
               </div>
               <div class="p-3">
                 <p class="text-xs text-gray-800 mb-2">
                   <span class="font-bold">kapital_app</span> {{ generated ? generatedData.copy : 'El copy generado aparecerá aquí...' }}
                 </p>
                 <p class="text-blue-600 text-xs">{{ generated ? generatedData.hashtags.join(' ') : '#hashtags' }}</p>
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

const router = useRouter()
const emit = defineEmits(['showToast'])

const currentStep = ref(1)
const activePreviewNetwork = ref('instagram')
const generated = ref(false)
const generating = ref(false)
const generationStatus = ref('')

const weekDays = [
  { label: 'L', value: 'Monday' },
  { label: 'M', value: 'Tuesday' },
  { label: 'X', value: 'Wednesday' },
  { label: 'J', value: 'Thursday' },
  { label: 'V', value: 'Friday' },
  { label: 'S', value: 'Saturday' },
  { label: 'D', value: 'Sunday' }
]

const wizardSteps = [
  { title: 'Paso 1: Buyer Persona', subtitle: 'Define quién es tu cliente ideal' },
  { title: 'Paso 2: Concepto Publicitario', subtitle: 'Define el enfoque creativo y mensaje' },
  { title: 'Paso 3: Objetivo de Contenido', subtitle: 'Define qué quieres lograr' },
  { title: 'Paso 4: Estilo Visual', subtitle: 'Define la estética de tu anuncio' },
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
      interests: '',
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

// --- METHODS ---
function nextStep() { if (currentStep.value < 5) currentStep.value++ }
function prevStep() { if (currentStep.value > 1) currentStep.value-- }

function selectFormat(val) {
  form.value.format = val
  form.value.networks = []
}

function isNetworkCompatible(netId) {
  const net = availableNetworks.value.find(n => n.id === netId)
  return net && net.formats.includes(form.value.format)
}

function getAspectRatio(fmt) {
  if (!fmt) return '1 / 1'
  const [w, h] = fmt.split(':').map(Number)
  return `${w} / ${h}`
}

function getNetworkName(id) {
  const net = availableNetworks.value.find(n => n.id === id)
  return net ? net.name : id
}

function getNetworkIcon(id) {
  const net = availableNetworks.value.find(n => n.id === id)
  return net ? net.icon : 'bi-app'
}

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
      copy: `🚀 ¡Atención ${persona}! \n\n${concept.problemSolved || 'Resolvemos tu problema'}. \n\n✨ ${concept.uniqueBenefit || 'Beneficio único'}. \n\n👉 Descubre más aquí.`,
      hashtags: ['#Kapital', `#${form.value.segment.psycho.lifestyle}`, ...(form.value.advertisingConcept.primaryKeywords ? form.value.advertisingConcept.primaryKeywords.split(',').map(k => '#' + k.trim()) : [])],
      imagePrompt: `/imagine prompt: High quality advertisement for ${objective.description}, target audience ${persona}, style ${style}, professional lighting, 8k --ar ${form.value.format.replace(':','-')}`
    }
    
    generated.value = true
    generating.value = false
    emit('showToast', 'Contenido generado con éxito')
  }, 4000)
}

function sendToProduction() {
  // In a real app, this would send data to a store or API
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
</style>
