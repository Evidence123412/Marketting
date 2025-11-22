<template>
  <div class="space-y-8">
    <div class="section-header">
      <h1>Asistente de Creación Estratégica</h1>
      <p>Genera contenido estratégico basado en tu segmentación (Design Thinking + Neuromarketing)</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
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


        <form @submit.prevent="generateImage" class="space-y-6">
          
          <div v-show="currentStep === 1" class="space-y-6 animate-fade-in">
            
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
            
            <fieldset class="fieldset-style bg-blue-50/50 border-blue-100">
              <legend class="legend-style text-blue-800"><i class="fas fa-brain"></i> Psicográfica (Arellano)</legend>
              <p class="text-xs text-gray-500 mb-2 px-2">Define el comportamiento de compra de tu usuario.</p>
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

          <div v-show="currentStep === 2" class="space-y-6 animate-fade-in">
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
              <textarea v-model="form.description" placeholder="Ej: Lanzamiento de nuevo servicio de consultoría para PYMES..." rows="4" class="input-field"></textarea>
            </div>
          </div>

          <div v-show="currentStep === 3" class="space-y-6 animate-fade-in">
            
            <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-briefcase"></i> Estrategia de Comunicación</legend>
              
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Tono de Voz</label>
                  <select v-model="form.tone" class="input-field text-sm">
                    <option value="professional">Profesional (Autoridad)</option>
                    <option value="emotional">Emocional (Cercanía)</option>
                    <option value="playful">Dinámico (Entretenido)</option>
                    <option value="urgent">Directo (Venta)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 mb-1">Estructura del Copy</label>
                  <select v-model="form.copyStructure" class="input-field text-sm">
                    <option value="aida">Fórmula AIDA (Atención...)</option>
                    <option value="pas">Fórmula PAS (Problema...)</option>
                    <option value="story">Storytelling (Historia)</option>
                    <option value="direct">Venta Directa</option>
                  </select>
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-xs font-bold text-gray-700 mb-1">Dirección de Arte (Estilo Visual)</label>
                <select v-model="form.visualStyle" class="input-field text-sm">
                  <option value="studio">Fotografía de Producto (Estudio / Clean)</option>
                  <option value="lifestyle_business">Lifestyle Corporativo (Oficina / Profesional)</option>
                  <option value="minimal_tech">Minimalismo Premium (Tech / SaaS)</option>
                  <option value="editorial">Editorial / High-End (Estilo Revista)</option>
                  <option value="render_3d">Abstracto 3D (Branding Moderno)</option>
                </select>
              </div>

              <label class="block text-xs font-bold text-gray-700 mb-2">Disparadores Mentales</label>
              <div class="space-y-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                <label class="checkbox-label group">
                  <input type="checkbox" v-model="form.triggers.urgency" class="checkbox-input" />
                  <span class="text-sm">Urgencia (Tiempo limitado)</span>
                </label>
                <label class="checkbox-label group">
                  <input type="checkbox" v-model="form.triggers.exclusivity" class="checkbox-input" />
                  <span class="text-sm">Exclusividad (VIP / Único)</span>
                </label>
                <label class="checkbox-label group">
                  <input type="checkbox" v-model="form.triggers.personalization" class="checkbox-input" />
                  <span class="text-sm">Personalización (Para ti)</span>
                </label>
              </div>
            </fieldset>

            <fieldset class="fieldset-style">
              <legend class="legend-style"><i class="fas fa-palette"></i> Identidad Visual</legend>
              <p class="text-xs text-gray-500 mb-3 px-2">Selecciona el color principal que defina la intención de la campaña.</p>
              
              <div class="grid grid-cols-2 gap-3 mb-3">
                <button 
                  v-for="colorOption in colorPsychology" 
                  :key="colorOption.hex"
                  type="button"
                  @click="setBrandColor(colorOption.hex)"
                  :class="[
                    'text-left p-3 rounded-lg border-2 transition-all relative overflow-hidden group hover:shadow-md',
                    form.colorPrimary === colorOption.hex ? 'border-kapital-dark bg-blue-50 ring-1 ring-kapital-dark' : 'border-gray-200 hover:border-gray-300 bg-white'
                  ]"
                >
                  <div class="absolute left-0 top-0 bottom-0 w-1.5" :style="{ backgroundColor: colorOption.hex }"></div>
                  <div class="pl-2">
                    <span class="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-0.5">{{ colorOption.emotion }}</span>
                    <span class="block text-[10px] text-gray-500 leading-tight">{{ colorOption.desc }}</span>
                  </div>
                  <div v-if="form.colorPrimary === colorOption.hex" class="absolute right-2 top-2 text-kapital-dark">
                    <i class="fas fa-check-circle text-xs"></i>
                  </div>
                </button>
              </div>

              <div class="mt-1">
                <label 
                  :class="[
                    'flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all group relative overflow-hidden',
                    !isPresetColor(form.colorPrimary) ? 'bg-white shadow-md border-kapital-dark' : 'border-gray-200 bg-gray-50 hover:bg-white'
                  ]"
                >
                  <div v-if="!isPresetColor(form.colorPrimary)" class="absolute inset-0 opacity-10 pointer-events-none" :style="{ backgroundColor: form.colorPrimary }"></div>
                  <div class="flex items-center gap-3 relative z-10 w-full">
                    <div class="w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-white border-2 border-white ring-1 ring-gray-200 transition-transform group-hover:scale-110 flex-shrink-0" :style="{ backgroundColor: form.colorPrimary }">
                      <i :class="['fas', !isPresetColor(form.colorPrimary) ? 'fa-check' : 'fa-eye-dropper', 'text-xs drop-shadow-md']"></i>
                    </div>
                    <div class="flex-1">
                      <span class="text-xs font-bold text-gray-900 group-hover:text-kapital-dark transition-colors block">
                        {{ !isPresetColor(form.colorPrimary) ? 'Color Personalizado' : 'Usar otro color (Manual)' }}
                      </span>
                      <div class="flex items-center justify-between mt-1">
                        <span class="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{{ form.colorPrimary.toUpperCase() }}</span>
                      </div>
                    </div>
                  </div>
                  <input v-model="form.colorPrimary" type="color" class="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20" />
                </label>
              </div>
            </fieldset>

          </div>

          <div v-show="currentStep === 4" class="space-y-6 animate-fade-in">
            
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
            
            <button type="submit" class="btn-primary w-full text-base shadow-lg shadow-kapital-dark/20" :disabled="generating || form.networks.length === 0">
              <i :class="['fas', generating ? 'fa-spinner fa-spin' : 'fa-magic']"></i>
              {{ generating ? 'Generando Estrategia...' : 'Generar Contenido' }}
            </button>
          </div>
        </form>

        <div class="flex justify-between mt-6 pt-6 border-t border-gray-200">
          <button type="button" @click="prevStep" :disabled="currentStep === 1" class="btn-secondary">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          
          <button 
            v-if="currentStep < 4" 
            type="button" 
            @click="nextStep" 
            class="btn-primary"
          >
            Siguiente <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <div class="card flex flex-col min-h-[600px]">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="fas fa-eye text-kapital-dark"></i> Resultados
          </h2>
          <div v-if="form.networks.length > 1" class="flex bg-gray-100 p-1 rounded-lg">
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
          
          <div v-if="generated && (form.format === '9:16') && (activePreviewNetwork === 'tiktok' || activePreviewNetwork === 'instagram')" 
               class="absolute top-4 right-4 z-30">
            <button @click="showSafeZone = !showSafeZone" 
                    :class="['text-xs px-2 py-1 rounded shadow-sm flex items-center gap-1 transition-all', showSafeZone ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700']">
              <i class="fas fa-ruler-combined"></i> {{ showSafeZone ? 'Ocultar Zonas' : 'Zona Segura' }}
            </button>
          </div>

          <div v-if="generating" class="text-center text-kapital-night p-8 z-10">
            <i class="fas fa-circle-notch fa-spin text-4xl mb-4 text-kapital-dark"></i>
            <p class="text-lg font-semibold mb-2">Generando Estrategia...</p>
            <p class="text-sm text-gray-600 animate-pulse">{{ generationStatus }}</p>
          </div>

          <div v-else-if="!generated && !form.format" class="text-center text-gray-400">
            <i class="fas fa-mobile-alt text-5xl mb-3 block opacity-50"></i>
            <p class="text-sm font-medium">Selecciona un formato en el Paso 4<br>para ver la simulación.</p>
          </div>
          
          <div v-else-if="!generating && (generated || form.format)" class="w-full flex justify-center">
            
            <div v-if="activePreviewNetwork === 'instagram'" :class="['bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 flex flex-col transition-all duration-500 max-w-sm w-full']">
              <div class="px-3 py-3 flex items-center justify-between bg-white">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                    <div class="w-full h-full rounded-full bg-white border-2 border-white overflow-hidden">
                      <img src="https://ui-avatars.com/api/?name=Kapital+App&background=random" class="w-full h-full object-cover">
                    </div>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-900">kapital_app</p>
                    <p class="text-[10px] text-gray-500 leading-none">Original Audio</p>
                  </div>
                </div>
                <i class="bi bi-three-dots text-gray-600"></i>
              </div>
              <div class="w-full bg-gray-100 flex items-center justify-center overflow-hidden relative" :style="{ aspectRatio: getAspectRatio(form.format) }">
                 <div class="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center p-6 text-white z-10" 
                      :style="{ background: `linear-gradient(135deg, ${form.colorPrimary} 0%, ${form.colorSecondary} 100%)` }">
                    <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <span class="text-xl font-bold drop-shadow-md relative z-20">{{ generated ? form.description.substring(0, 50) : 'Tu Imagen Aquí' }}</span>
                 </div>
                 <div v-if="showSafeZone && form.format === '9:16'" class="absolute inset-0 z-20 pointer-events-none border-y-[60px] border-transparent bg-red-500/20">
                    <div class="w-full h-full border-x-[20px] border-transparent bg-transparent"></div>
                    <div class="absolute right-2 bottom-20 flex flex-col gap-4 text-white/50 text-2xl"><i class="bi bi-heart-fill"></i><i class="bi bi-chat-dots-fill"></i></div>
                 </div>
              </div>
              <div class="p-3">
                <div class="flex justify-between mb-2 text-xl text-gray-800">
                  <div class="flex gap-4">
                    <i class="bi bi-heart hover:text-red-500 cursor-pointer"></i>
                    <i class="bi bi-chat hover:text-gray-500 cursor-pointer"></i>
                    <i class="bi bi-send hover:text-gray-500 cursor-pointer"></i>
                  </div>
                  <i class="bi bi-bookmark cursor-pointer"></i>
                </div>
                <p class="text-xs font-bold mb-1">1,234 Me gusta</p>
                <div class="text-xs text-gray-800 max-h-24 overflow-y-auto">
                  <p><span class="font-bold mr-1">kapital_app</span> {{ generated ? generatedData.copy : 'El copy generado aparecerá aquí...' }}</p>
                  <p class="text-blue-900 mt-1">{{ generated ? generatedData.hashtags.join(' ') : '#hashtags' }}</p>
                </div>
              </div>
            </div>

            <div v-else-if="activePreviewNetwork === 'tiktok'" :class="['bg-black shadow-xl rounded-2xl overflow-hidden border border-gray-800 flex flex-col relative max-w-[280px] w-full h-[500px]']">
              <div class="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center p-6 text-white z-0" 
                   :style="{ background: `linear-gradient(180deg, ${form.colorPrimary} 0%, ${form.colorSecondary} 100%)` }">
                 <h2 class="text-2xl font-bold drop-shadow-lg">{{ generated ? 'Video Dinámico' : 'Video Preview' }}</h2>
              </div>
              
              <div v-if="showSafeZone" class="absolute inset-0 z-20 pointer-events-none">
                 <div class="absolute top-[10%] bottom-[20%] right-[60px] left-[10px] border-2 border-dashed border-green-400 bg-green-400/10">
                    <span class="text-[10px] text-green-400 bg-black/50 px-1 absolute top-0 left-0">Zona Segura</span>
                 </div>
              </div>

              <div class="absolute inset-0 z-10 flex flex-col justify-between p-4">
                <div class="flex justify-center pt-4 text-white/80 font-bold text-sm">Siguiendo | Para ti</div>
                
                <div class="flex items-end">
                  <div class="flex-1 text-white pr-12 mb-2">
                    <p class="font-bold text-sm shadow-black drop-shadow-md">@kapital_app</p>
                    <p class="text-xs leading-tight mt-1 opacity-90 drop-shadow-md">{{ generated ? generatedData.copy.substring(0, 80) + '...' : 'Descripción del video...' }}</p>
                    <p class="text-xs font-bold mt-2 flex items-center gap-1"><i class="bi bi-music-note-beamed"></i> Sonido original - Kapital</p>
                  </div>
                  
                  <div class="flex flex-col items-center gap-4 text-white">
                    <div class="w-10 h-10 rounded-full border-2 border-white bg-gray-500 overflow-hidden relative">
                       <img src="https://ui-avatars.com/api/?name=Kapital+App" class="w-full h-full">
                       <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]"><i class="bi bi-plus"></i></div>
                    </div>
                    <div class="flex flex-col items-center"><i class="bi bi-heart-fill text-3xl drop-shadow-md"></i><span class="text-xs font-bold">8.5K</span></div>
                    <div class="flex flex-col items-center"><i class="bi bi-chat-dots-fill text-3xl drop-shadow-md"></i><span class="text-xs font-bold">402</span></div>
                    <div class="flex flex-col items-center"><i class="bi bi-share-fill text-3xl drop-shadow-md"></i><span class="text-xs font-bold">Share</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activePreviewNetwork === 'facebook'" :class="['bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 flex flex-col transition-all duration-500 max-w-sm w-full']">
              <div class="p-3 flex items-center gap-2">
                <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Kapital+App&background=1877F2&color=fff" class="w-full h-full object-cover">
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900">Kapital App</p>
                  <div class="flex items-center gap-1 text-xs text-gray-500">
                    <span>Publicidad</span>
                    <span>&middot;</span>
                    <i class="bi bi-globe-americas"></i>
                  </div>
                </div>
                <i class="bi bi-three-dots ml-auto text-gray-600"></i>
              </div>
              
              <div class="px-3 pb-2 text-sm text-gray-800">
                <p>{{ generated ? generatedData.copy : 'El texto de tu publicación aparecerá aquí.' }}</p>
                <p class="text-blue-600 mt-1 text-xs">{{ generated ? generatedData.hashtags.slice(0,3).join(' ') : '' }}</p>
              </div>

              <div class="w-full flex items-center justify-center text-white font-bold text-center relative overflow-hidden"
                   :style="{ aspectRatio: getAspectRatio(form.format), background: `linear-gradient(135deg, ${form.colorPrimary} 0%, ${form.colorSecondary} 100%)` }">
                 <span class="text-xl drop-shadow-md px-4">{{ generated ? form.description : 'Imagen' }}</span>
              </div>

              <div class="p-3 border-t border-gray-100">
                <div class="flex justify-between items-center text-gray-500 text-xs mb-3">
                  <div class="flex items-center gap-1"><i class="bi bi-hand-thumbs-up-fill text-blue-500"></i> 45</div>
                  <div>12 comentarios</div>
                </div>
                <div class="flex justify-between border-t border-gray-100 pt-2">
                  <button class="flex items-center gap-2 text-gray-600 font-medium text-sm flex-1 justify-center hover:bg-gray-50 py-1 rounded"><i class="bi bi-hand-thumbs-up"></i> Me gusta</button>
                  <button class="flex items-center gap-2 text-gray-600 font-medium text-sm flex-1 justify-center hover:bg-gray-50 py-1 rounded"><i class="bi bi-chat-square"></i> Comentar</button>
                  <button class="flex items-center gap-2 text-gray-600 font-medium text-sm flex-1 justify-center hover:bg-gray-50 py-1 rounded"><i class="bi bi-share"></i> Compartir</button>
                </div>
              </div>
            </div>

            <div v-else-if="activePreviewNetwork === 'linkedin'" :class="['bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 flex flex-col transition-all duration-500 max-w-sm w-full']">
              <div class="p-3 flex gap-2">
                <div class="w-12 h-12 rounded bg-gray-200 overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Kapital+App&background=0A66C2&color=fff" class="w-full h-full object-cover">
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900">Kapital App</p>
                  <p class="text-xs text-gray-500 truncate w-48">Strategic Marketing Solutions & AI Tools</p>
                  <p class="text-xs text-gray-500 flex items-center gap-1">Promocionado <i class="bi bi-globe"></i></p>
                </div>
                <button class="ml-auto text-blue-600 font-bold text-sm flex items-center gap-1 h-fit"><i class="bi bi-plus-lg"></i> Seguir</button>
              </div>

              <div class="px-3 pb-2 text-sm text-gray-800">
                <p class="mb-1">{{ generated ? generatedData.copy : 'Texto profesional para tu red.' }}</p>
                <p class="text-blue-600 font-bold text-xs cursor-pointer">ver más</p>
              </div>

              <div class="w-full flex items-center justify-center text-white font-bold text-center relative overflow-hidden"
                   :style="{ aspectRatio: getAspectRatio(form.format), background: `linear-gradient(135deg, ${form.colorPrimary} 0%, ${form.colorSecondary} 100%)` }">
                 <span class="text-xl drop-shadow-md px-4">{{ generated ? form.description : 'Contenido Visual' }}</span>
              </div>

              <div class="px-3 py-2 bg-gray-50 flex justify-between items-center text-xs text-gray-500 border-b border-gray-100">
                <span>Publicidad</span>
                <button class="border border-blue-600 text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-50">Ver oferta</button>
              </div>
              <div class="p-2 flex justify-around border-t border-gray-100">
                <button class="flex flex-col items-center text-gray-600 hover:bg-gray-100 p-2 rounded flex-1"><i class="bi bi-hand-thumbs-up text-lg"></i><span class="text-xs">Recomendar</span></button>
                <button class="flex flex-col items-center text-gray-600 hover:bg-gray-100 p-2 rounded flex-1"><i class="bi bi-chat-text text-lg"></i><span class="text-xs">Comentar</span></button>
                <button class="flex flex-col items-center text-gray-600 hover:bg-gray-100 p-2 rounded flex-1"><i class="bi bi-arrow-repeat text-lg"></i><span class="text-xs">Compartir</span></button>
                <button class="flex flex-col items-center text-gray-600 hover:bg-gray-100 p-2 rounded flex-1"><i class="bi bi-send-fill text-lg"></i><span class="text-xs">Enviar</span></button>
              </div>
            </div>

          </div>
        </div>

        <Transition name="fade">
          <div v-if="generated" class="space-y-4 mt-4">
            
            <div class="result-box">
              <div class="flex justify-between items-center mb-2">
                <h3 class="result-title"><i class="fas fa-robot mr-1"></i> Prompt para Imagen IA (Editable)</h3>
                <div class="flex gap-2">
                  <button class="text-xs text-kapital-dark hover:underline" @click="generatedData.imagePrompt = generateAIPrompt()"><i class="fas fa-sync"></i> Regenerar</button>
                  <button class="text-xs text-kapital-dark hover:underline" @click="copyToClipboard(generatedData.imagePrompt)">Copiar</button>
                </div>
              </div>
              <textarea 
                v-model="generatedData.imagePrompt" 
                class="w-full text-xs text-gray-600 font-mono bg-white p-2 rounded border border-gray-200 focus:ring-1 focus:ring-kapital-dark outline-none resize-none h-20"
              ></textarea>
            </div>

            <div class="result-box">
              <div class="flex justify-between items-center mb-2">
                <h3 class="result-title"><i class="fas fa-pen-fancy mr-1"></i> Copy Persuasivo (Editable)</h3>
                <div class="flex gap-2">
                  <button class="text-xs text-kapital-dark hover:underline" @click="generatedData.copy = generateCopy()"><i class="fas fa-sync"></i> Regenerar</button>
                  <button class="text-xs text-kapital-dark hover:underline" @click="copyToClipboard(generatedData.copy)">Copiar</button>
                </div>
              </div>
              <textarea 
                v-model="generatedData.copy" 
                class="w-full text-sm text-gray-700 bg-white p-2 rounded border border-gray-200 focus:ring-1 focus:ring-kapital-dark outline-none resize-none h-28"
              ></textarea>
            </div>

            <div class="result-box bg-white">
              <h3 class="result-title mb-2">Hashtags Estratégicos</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in generatedData.hashtags" :key="tag" class="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded hover:bg-kapital-light-1 hover:text-white transition-colors cursor-pointer">
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button @click="useForProduction" class="btn-primary flex-1 text-sm w-full">
                <i class="fas fa-arrow-right"></i> Enviar a Producción
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['showToast', 'navigate'])

const currentStep = ref(1)
const activePreviewNetwork = ref('instagram')
const showSafeZone = ref(false)

// ESTRUCTURA DE PASOS DEL WIZARD
const wizardSteps = [
  { title: 'Paso 1: Empatizar', subtitle: '¿Quién es tu audiencia objetivo?' },
  { title: 'Paso 2: Definir', subtitle: '¿Qué quieres comunicar?' },
  { title: 'Paso 3: Idear', subtitle: '¿Cómo lo quieres comunicar? (Estilo y Emoción)' },
  { title: 'Paso 4: Prototipar', subtitle: '¿Dónde se va a publicar?' }
]

// --- DATOS PARA PSICOLOGÍA DEL COLOR ---
const colorPsychology = [
  { hex: '#2B66FF', emotion: 'Confianza', desc: 'Seguridad y tecnología' }, // Kapital Blue
  { hex: '#EF4444', emotion: 'Energía', desc: 'Urgencia y pasión' }, // Red
  { hex: '#10B981', emotion: 'Crecimiento', desc: 'Dinero y salud' }, // Green
  { hex: '#F59E0B', emotion: 'Optimismo', desc: 'Claridad y juventud' }, // Yellow
  { hex: '#111827', emotion: 'Autoridad', desc: 'Lujo y exclusividad' }, // Dark
  { hex: '#8B5CF6', emotion: 'Creatividad', desc: 'Sabiduría y magia' }, // Purple
]

// ESTRUCTURA DE DATOS DEL FORMULARIO
const form = ref({
  segment: {
    geo: { zone: 'all', city: '' },
    demo: { age: 'all', sex: 'all' },
    psycho: { lifestyle: 'all' }
  },
  description: '',
  contentType: '',
  tone: 'professional',
  copyStructure: 'aida',
  visualStyle: 'studio', // Cambiado a opción profesional por defecto
  triggers: {
    urgency: false,
    exclusivity: false,
    personalization: false
  },
  colorPrimary: '#2B66FF',
  colorSecondary: '#00FFFF',
  networks: [], 
  format: '', 
  style: 'modern'
})

// Observar cambios en las redes seleccionadas para actualizar la vista previa
watch(() => form.value.networks, (newNetworks) => {
  if (newNetworks.length > 0) {
    if (!newNetworks.includes(activePreviewNetwork.value)) {
      activePreviewNetwork.value = newNetworks[0]
    }
  } else {
    activePreviewNetwork.value = 'instagram' // Fallback
  }
})

// --- LÓGICA DE FORMATOS DINÁMICOS ---
const allFormats = {
  post: { name: 'Post (1:1)', value: '1:1', icon: 'fa-square' },
  story: { name: 'Story (9:16)', value: '9:16', icon: 'fa-mobile-alt' },
  landscape: { name: 'Video (16:9)', value: '16:9', icon: 'fa-video' },
  portrait: { name: 'Post (4:5)', value: '4:5', icon: 'fa-tablet-alt' }
}

const availableNetworks = ref([
  { id: 'instagram', name: 'Instagram', icon: 'bi-instagram', color: '#E4405F', formats: ['1:1', '9:16', '4:5', '16:9'] },
  { id: 'facebook', name: 'Facebook', icon: 'bi-facebook', color: '#1877F2', formats: ['1:1', '16:9', '9:16', '4:5'] },
  { id: 'linkedin', name: 'LinkedIn', icon: 'bi-linkedin', color: '#0A66C2', formats: ['1:1', '16:9', '4:5', '9:16'] },
  { id: 'tiktok', name: 'TikTok', icon: 'bi-tiktok', color: '#010101', formats: ['9:16', '1:1', '16:9', '4:5'] }
])

function selectFormat(formatValue) {
  form.value.format = formatValue
  form.value.networks = []
}

function isNetworkCompatible(networkId) {
  const network = availableNetworks.value.find(n => n.id === networkId)
  return network && network.formats.includes(form.value.format)
}

function setBrandColor(color) {
  form.value.colorPrimary = color
}

function isPresetColor(hex) {
  return colorPsychology.some(c => c.hex.toLowerCase() === hex.toLowerCase())
}

function getAspectRatio(format) {
  if (!format) return '1 / 1'
  const [w, h] = format.split(':').map(Number)
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

// Clases para el contenedor del mockup
const previewSizingClass = computed(() => {
  // Si es TikTok, forzamos tamaño móvil vertical
  if (activePreviewNetwork.value === 'tiktok') return ''; 
  
  switch (form.value.format) {
    case '1:1': return 'w-full max-w-xs mx-auto'; 
    case '9:16': return 'w-full max-w-[240px] mx-auto'; 
    case '16:9': return 'w-full max-w-sm mx-auto'; 
    case '4:5': return 'w-full max-w-[260px] mx-auto'; 
    default: return 'hidden';
  }
});

// --- ESTADO DE GENERACIÓN ---
const generated = ref(false)
const generating = ref(false)
const generationStatus = ref('')

const generatedData = ref({
  copy: '',
  hashtags: [],
  imagePrompt: '' 
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
  showSafeZone.value = false // Reset safe zone
  
  const steps = [
    `Analizando Buyer Persona (${form.value.segment.psycho.lifestyle})...`,
    `Estructurando Copy con fórmula ${form.value.copyStructure.toUpperCase()}...`,
    `Diseñando prompt con estilo ${form.value.visualStyle}...`,
    `Finalizando estrategia...`
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
    generatedData.value = {
      copy: generateCopy(),
      hashtags: generateHashtags(),
      imagePrompt: generateAIPrompt() 
    }
    generated.value = true
    generating.value = false
    generationStatus.value = ''
    emit('showToast', 'Contenido estratégico generado')
  }, 3500)
}

function generateCopy() {
  const desc = form.value.description
  let copy = ''

  // Lógica de Estructura de Copy (AIDA/PAS)
  if (form.value.copyStructure === 'aida') {
    copy = `🛑 ¡Atención! ¿Buscas ${desc}? \n\n` +
           `💡 Interés: Imagina poder lograrlo sin esfuerzo. \n` +
           `🔥 Deseo: Nuestra solución exclusiva está diseñada para ti. \n\n` +
           `👇 Acción: Haz clic en el enlace y descúbrelo.`;
  } else if (form.value.copyStructure === 'pas') {
    copy = `😓 Problema: ¿Cansado de lidiar con ${desc}? \n\n` +
           `😖 Agitación: Sabemos lo frustrante que es no encontrar una solución real. \n\n` +
           `✅ Solución: Presentamos la respuesta definitiva.`;
  } else if (form.value.copyStructure === 'story') {
    copy = `📖 Todo comenzó cuando decidimos cambiar la forma de ver ${desc}. \n` +
           `No fue fácil, pero el resultado valió la pena. \n\n` +
           `Ahora queremos compartirlo contigo. ¿Nos acompañas?`;
  } else {
    // Directo
    copy = `🚀 ${desc} \n\n` +
           `La mejor opción para ti. Descubre más aquí. 👇`;
  }

  // Añadir triggers
  if (form.value.triggers.urgency) copy += '\n\n⏳ Oferta por tiempo limitado.';
  if (form.value.triggers.exclusivity) copy += '\n💎 Solo para miembros VIP.';

  return copy;
}

function generateAIPrompt() {
  const visualMap = {
    'studio': 'high-end studio photography, softbox lighting, solid background, 8k resolution, product focus, highly detailed',
    'lifestyle_business': 'corporate lifestyle photography, modern office setting, authentic people, natural lighting, professional atmosphere, bokeh',
    'minimal_tech': 'minimalist tech design, isometric view, clean lines, pastel tones, apple design style, negative space, high quality',
    'editorial': 'fashion editorial style, high contrast, dramatic lighting, vogue magazine quality, sharp focus, elegant',
    'render_3d': '3d octane render, abstract smooth shapes, glass texture, futuristic business concept, soft gradient lighting, 4k'
  };

  const style = visualMap[form.value.visualStyle] || 'high quality photography';
  const colorHex = form.value.colorPrimary.replace('#', '');
  const subject = form.value.description || 'Professional service showcase';
  
  return `/imagine prompt: ${subject}, ${style}, dominant color code #${colorHex}, commercial photography, trending on artstation --ar ${form.value.format.replace(':','-')}`
}

function generateHashtags() {
  const base = ['kapital', 'marketing', ...form.value.networks]
  if (form.value.segment.geo.city) base.push(form.value.segment.geo.city.toLowerCase().replace(' ', ''))
  
  const lifestyleTags = {
    sofisticados: ['lujo', 'exclusivo', 'vip'],
    progresistas: ['emprendedor', 'metas', 'negocios'],
    modernas: ['tendencia', 'lifestyle', 'mujer'],
    conservadoras: ['familia', 'bienestar', 'hogar'],
    austeros: ['oferta', 'ahorro', 'oportunidad']
  }
  
  const tags = [...base, ...(lifestyleTags[form.value.segment.psycho.lifestyle] || [])]
  return [...new Set(tags.filter(t => t))].slice(0, 10).map(t => '#' + t)
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  emit('showToast', 'Copiado al portapapeles');
}

function useForProduction() {
  emit('showToast', 'Enviado a Producción')
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

<style scoped lang="postcss">
/* Estilos Base */
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
  @apply space-y-4 rounded-lg border border-gray-200 p-4 bg-white;
}

.legend-style {
  @apply text-sm font-medium text-kapital-dark px-2 uppercase tracking-wide;
}

.visual-selector {
  @apply p-3 border-2 rounded-lg text-center cursor-pointer transition-all text-sm font-medium text-gray-600 bg-white;
  @apply border-gray-200 hover:border-gray-400 hover:shadow-sm;
}

.visual-selector.selected {
  @apply border-kapital-dark bg-blue-50 text-kapital-dark ring-2 ring-blue-100 ring-offset-1;
}

.checkbox-label {
  @apply flex items-start gap-3 p-2 hover:bg-gray-50 rounded transition-colors cursor-pointer;
}

.checkbox-input {
  @apply w-4 h-4 mt-1 accent-kapital-dark;
}

.result-box {
  @apply bg-blue-50/50 border border-blue-100 rounded-lg p-4 transition-all hover:bg-blue-50;
}

.result-title {
  @apply text-xs font-bold text-kapital-dark uppercase tracking-wider;
}

/* Animaciones */
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0; transform: translateY(10px);
}
</style>