<template>
  <div class="space-y-6 h-full flex flex-col">
    <!-- Header & Controls -->
    <div 
      v-motion
      :initial="{ opacity: 0, y: -20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
      class="flex flex-col gap-6"
    >
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Reportes y Análisis</h1>
        <p class="text-gray-500 mt-1">Visualiza el rendimiento de tus campañas y redes sociales.</p>
      </div>

      <div class="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-soft flex flex-col md:flex-row gap-4 items-end">
        <div class="flex-1 w-full">
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
            <Calendar :size="14" class="inline mr-1" /> Rango de Fechas
          </label>
          <div class="flex gap-2 items-center">
            <input 
              v-model="dateRange.start"
              type="date" 
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all"
            />
            <span class="text-gray-400">-</span>
            <input 
              v-model="dateRange.end"
              type="date" 
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-kapital-dark focus:ring-2 focus:ring-kapital-dark/20 transition-all"
            />
          </div>
        </div>
        
        <div class="flex-1 w-full">
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
            <Share2 :size="14" class="inline mr-1" /> Canal
          </label>
          <div class="relative">
            <select 
              v-model="selectedChannel"
              class="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-kapital-dark appearance-none cursor-pointer"
            >
              <option value="">Todos los canales</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
            </select>
            <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" :size="16" />
          </div>
        </div>

        <div class="flex gap-2 w-full md:w-auto">
          <button @click="generateReport" class="btn-primary flex-1 md:w-auto shadow-lg shadow-kapital-dark/20 whitespace-nowrap">
            <BarChart2 :size="18" /> Generar
          </button>
          <button @click="exportReport" class="btn-secondary px-3" title="Exportar PDF">
            <Download :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200/60">
      <nav class="-mb-px flex gap-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
        <button 
          @click="activeTab = 'resumen'" 
          :class="[
            'py-4 px-1 border-b-2 font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap',
            activeTab === 'resumen' 
              ? 'border-kapital-dark text-kapital-dark' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <LayoutDashboard :size="18" /> Resumen General
        </button>
        <button 
          @click="activeTab = 'analisis'" 
          :class="[
            'py-4 px-1 border-b-2 font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap',
            activeTab === 'analisis' 
              ? 'border-kapital-dark text-kapital-dark' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <PieChart :size="18" /> Análisis de KPIs
        </button>
        <button 
          @click="activeTab = 'canales'" 
          :class="[
            'py-4 px-1 border-b-2 font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap',
            activeTab === 'canales' 
              ? 'border-kapital-dark text-kapital-dark' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <Share2 :size="18" /> Desempeño por Canal
        </button>
      </nav>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-y-auto scrollbar-thin pr-2 pb-4">
      
      <!-- TAB: RESUMEN -->
      <div v-show="activeTab === 'resumen'" class="space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="(kpi, index) in kpis" 
            :key="kpi.id" 
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
            :class="[
              'bg-white p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden',
              selectedKpi && selectedKpi.id === kpi.id ? 'border-kapital-dark ring-1 ring-kapital-dark shadow-md' : 'border-gray-200 hover:border-kapital-dark/50 hover:shadow-sm'
            ]"
            @click="selectKpiForDetail(kpi)"
          >
            <div class="flex items-start justify-between mb-4 relative z-10">
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110', kpi.bgClass, kpi.textClass]">
                <component :is="kpi.iconComponent" :size="24" />
              </div>
              <span :class="['text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1', kpi.trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700']">
                <component :is="kpi.trend > 0 ? TrendingUp : TrendingDown" :size="12" />
                {{ Math.abs(kpi.trend) }}%
              </span>
            </div>
            <h4 class="text-sm font-bold text-gray-500 mb-1 relative z-10">{{ kpi.label }}</h4>
            <p class="text-3xl font-bold text-gray-900 mb-3 relative z-10">{{ kpi.value }}</p>
            <div class="w-full bg-gray-100 rounded-full h-1.5 relative z-10">
              <div 
                class="h-1.5 rounded-full transition-all duration-1000 ease-out" 
                :style="{ width: kpi.progress + '%', backgroundColor: kpi.color }"
              ></div>
            </div>
            <p class="text-[10px] text-gray-400 mt-3 font-medium relative z-10">{{ kpi.detail }}</p>
            
            <!-- Background decoration -->
            <div :class="['absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-5 transition-transform group-hover:scale-150', kpi.bgClass]"></div>
          </div>
        </div>

        <div v-if="selectedKpi" class="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
          <div :class="['w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center', selectedKpi.bgClass, selectedKpi.textClass]">
            <Lightbulb :size="20" />
          </div>
          <div>
            <h3 class="font-bold text-gray-900 text-sm">Insight: {{ selectedKpi.label }}</h3>
            <p class="text-sm text-gray-600 mt-0.5">{{ computedInsightText }}</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h2 class="text-lg font-bold text-gray-900">{{ computedChartTitle }}</h2>
              <p class="text-sm text-gray-500 mt-1">Últimos 7 días</p>
            </div>
            <div class="flex bg-gray-100 p-1 rounded-xl">
              <button 
                @click="chartView = 'performance'"
                :class="['px-4 py-1.5 text-xs font-bold rounded-lg transition-all', chartView === 'performance' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
              >
                Comparativa
              </button>
              <button 
                @click="chartView = 'reach'"
                :class="['px-4 py-1.5 text-xs font-bold rounded-lg transition-all', chartView === 'reach' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
              >
                {{ selectedKpi ? selectedKpi.label : 'Detalle' }}
              </button>
            </div>
          </div>

          <div v-if="chartView === 'performance'" class="flex items-end justify-around gap-4 h-64 mb-6 px-4">
            <div 
              v-for="(bar, idx) in chartData" 
              :key="'perf-' + idx" 
              class="flex-1 flex flex-col items-center justify-end gap-3 group relative"
            >
              <div class="flex gap-1 h-full w-full items-end justify-center">
                <div 
                  class="bg-slate-900 rounded-t-md w-full transition-all group-hover:opacity-80 relative"
                  :style="{ height: bar.height + '%' }"
                >
                  <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded pointer-events-none whitespace-nowrap z-20">
                    {{ bar.reach }}
                  </div>
                </div>
                <div 
                  class="bg-blue-600 rounded-t-md w-full transition-all group-hover:opacity-80 relative"
                  :style="{ height: bar.interactionHeight + '%' }"
                >
                  <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded pointer-events-none whitespace-nowrap z-20">
                    {{ bar.interactions }}
                  </div>
                </div>
              </div>
              <span class="text-xs font-bold text-gray-400">{{ bar.day }}</span>
            </div>
          </div>

          <div v-else class="flex items-end justify-around gap-4 h-64 mb-6 px-4">
            <div 
              v-for="(bar, idx) in chartData" 
              :key="'reach-' + idx" 
              class="flex-1 flex flex-col items-center gap-3 group relative cursor-pointer"
            >
              <div class="relative w-full h-full flex items-end justify-center">
                <div 
                  :class="['w-full max-w-[40px] rounded-t-lg transition-all group-hover:opacity-80', selectedKpi ? selectedKpi.bgClass.replace('/10', '') : 'bg-slate-900']"
                  :style="{ height: bar.height + '%', backgroundColor: selectedKpi ? selectedKpi.color : undefined }"
                ></div>
                <span class="absolute -top-8 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">{{ bar.reach }}</span>
              </div>
              <span class="text-xs font-bold text-gray-400">{{ bar.day }}</span>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4 flex justify-center gap-8 text-xs font-medium text-gray-500">
            <div v-if="chartView === 'performance'" class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-slate-900"></div>
              <span>Alcance</span>
            </div>
            <div v-if="chartView === 'performance'" class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-600"></div>
              <span>Interacciones</span>
            </div>
            <div class="flex items-center gap-2">
              <Info :size="14" />
              <span>Hover para ver detalles</span>
            </div>
          </div>
        </div>

      </div>

      <!-- TAB: ANALISIS -->
      <div v-show="activeTab === 'analisis'" class="space-y-6">
        
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-6">Comparativa KPIs - Período Anterior vs Actual</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h3 class="font-bold text-gray-700 mb-6 text-sm uppercase tracking-wide">Rendimiento Comparativo</h3>
              <div class="space-y-6">
                <div v-for="kpi in kpis" :key="kpi.id" class="space-y-2">
                  <div class="flex justify-between items-center mb-1">
                    <div class="flex items-center gap-3">
                      <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', kpi.bgClass, kpi.textClass]">
                        <component :is="kpi.iconComponent" :size="14" />
                      </div>
                      <span class="font-bold text-gray-700 text-sm">{{ kpi.label }}</span>
                    </div>
                    <span class="font-bold text-gray-900">{{ kpi.value }}</span>
                  </div>
                  <div class="flex gap-1 h-2.5 w-full">
                    <div class="flex-1 bg-gray-100 rounded-l-full overflow-hidden relative group">
                      <div 
                        class="h-full rounded-l-full transition-all duration-500 opacity-40"
                        :style="{ width: '65%', backgroundColor: kpi.color }"
                      ></div>
                      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 text-[8px] font-bold transition-opacity">ANTERIOR</div>
                    </div>
                    <div class="flex-1 bg-gray-100 rounded-r-full overflow-hidden relative group">
                      <div 
                        class="h-full rounded-r-full transition-all duration-500"
                        :style="{ width: '85%', backgroundColor: kpi.color }"
                      ></div>
                      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 text-[8px] font-bold transition-opacity">ACTUAL</div>
                    </div>
                  </div>
                  <div class="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    <span>Anterior</span>
                    <span class="text-emerald-600">Actual (+{{ kpi.trend }}%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="font-bold text-gray-700 mb-6 text-sm uppercase tracking-wide">Progreso hacia Metas</h3>
              <div class="grid grid-cols-2 gap-6">
                <div v-for="kpi in kpis" :key="'goal-' + kpi.id" class="flex flex-col items-center bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                  <div class="relative w-24 h-24 mb-3">
                    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" stroke-width="8" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        :stroke="kpi.color" 
                        stroke-width="8"
                        stroke-dasharray="251.2"
                        :stroke-dashoffset="251.2 - (251.2 * kpi.progress / 100)"
                        stroke-linecap="round"
                        class="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center flex-col">
                      <span class="text-xl font-bold text-gray-900">{{ kpi.progress }}%</span>
                    </div>
                  </div>
                  <p class="text-xs font-bold text-gray-600 text-center">{{ kpi.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Tendencia de Engagement</h2>
              <p class="text-sm text-gray-500 mt-1">Comportamiento semanal - CTR vs Engagement</p>
            </div>
            <div class="flex bg-gray-100 p-1 rounded-xl">
              <button 
                @click="engagementView = 'comparative'"
                :class="['px-4 py-1.5 text-xs font-bold rounded-lg transition-all', engagementView === 'comparative' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
              >
                Comparativa
              </button>
              <button 
                @click="engagementView = 'engagement'"
                :class="['px-4 py-1.5 text-xs font-bold rounded-lg transition-all', engagementView === 'engagement' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
              >
                Engagement
              </button>
            </div>
          </div>

          <div v-if="engagementView === 'comparative'" class="h-64 flex items-end justify-around gap-1 mb-6 relative px-2">
            <div 
              v-for="(point, idx) in engagementData" 
              :key="'comp-' + idx" 
              class="flex-1 flex flex-col items-center gap-2 group relative z-10"
            >
              <div class="relative w-full h-full flex items-end justify-center gap-1">
                <div 
                  class="flex-1 bg-slate-900 rounded-t transition-all group-hover:opacity-80 relative"
                  :style="{ height: point.height + '%' }"
                >
                   <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded pointer-events-none whitespace-nowrap z-20">
                    Eng: {{ point.engagement }}%
                  </div>
                </div>
                <div 
                  class="flex-1 bg-blue-400 rounded-t transition-all group-hover:opacity-80 relative"
                  :style="{ height: point.ctrHeight + '%' }"
                >
                   <div class="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded pointer-events-none whitespace-nowrap z-20">
                    CTR: {{ point.ctr }}%
                  </div>
                </div>
              </div>
              <small class="text-gray-500 font-bold text-xs">{{ point.day }}</small>
            </div>
          </div>

          <div v-else class="h-64 flex items-end justify-around gap-2 mb-6 relative">
            <div 
              v-for="(point, idx) in engagementData" 
              :key="'eng-' + idx" 
              class="flex-1 flex flex-col items-center gap-2 group relative z-10"
            >
              <div class="relative w-full h-full flex items-end justify-center">
                <div 
                  class="w-2/3 bg-slate-900 rounded-t-lg transition-all group-hover:opacity-80"
                  :style="{ height: point.height + '%' }"
                ></div>
                <span class="absolute -top-8 text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">{{ point.engagement }}%</span>
              </div>
              <small class="text-gray-500 font-bold text-xs">{{ point.day }}</small>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4 flex justify-center gap-8 text-xs font-medium text-gray-500">
            <div v-if="engagementView === 'comparative'" class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-slate-900"></div>
              <span>Engagement</span>
            </div>
            <div v-if="engagementView === 'comparative'" class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-400"></div>
              <span>CTR</span>
            </div>
            <div class="flex items-center gap-2">
              <Info :size="14" />
              <span>Promedio: {{ avgEngagement }}%</span>
            </div>
          </div>
        </div>

      </div>

      <!-- TAB: CANALES -->
      <div v-show="activeTab === 'canales'" class="space-y-6">
        
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900">Desempeño por Red Social</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider">
                <tr>
                  <th class="px-6 py-4">Red Social</th>
                  <th class="px-6 py-4">Alcance</th>
                  <th class="px-6 py-4">Engagement</th>
                  <th class="px-6 py-4">CTR</th>
                  <th class="px-6 py-4">Seguidores</th>
                  <th class="px-6 py-4">Crecimiento</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="network in networkPerformance" :key="network.id" class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div :class="['w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm', network.bgClass]">
                        <component :is="network.iconComponent" :size="16" />
                      </div>
                      <span class="font-bold text-gray-900">{{ network.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-bold text-gray-900 block">{{ network.reach }}</span>
                    <small class="text-emerald-600 font-bold text-[10px]">+{{ network.reachChange }}%</small>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          class="h-full rounded-full" 
                          :style="{ width: network.engagement + '%', backgroundColor: network.color }"
                        ></div>
                      </div>
                      <span class="font-bold text-gray-700">{{ network.engagement }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-bold text-gray-700">{{ network.ctr }}%</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-bold text-gray-900">{{ network.followers }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="['text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit', network.growth > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700']">
                      <component :is="network.growth > 0 ? TrendingUp : TrendingDown" :size="10" />
                      {{ Math.abs(network.growth) }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden">
            <div class="relative z-10">
              <h3 class="font-bold text-lg mb-2 flex items-center gap-2">
                <FileText :size="20" class="text-blue-400" /> Exportar Datos
              </h3>
              <p class="text-gray-400 text-sm mb-6">Descarga el reporte completo en formato CSV para realizar tus propios análisis.</p>
              <button @click="exportCSV" class="w-full py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                <Download :size="18" /> Descargar CSV
              </button>
            </div>
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          </div>

          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
            <div class="relative z-10">
              <h3 class="font-bold text-lg mb-2 flex items-center gap-2">
                <Mail :size="20" class="text-blue-200" /> Compartir Reporte
              </h3>
              <p class="text-blue-100 text-sm mb-6">Envía este reporte automáticamente por correo electrónico a tu equipo o clientes.</p>
              <button @click="emailReport" class="w-full py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
                <Send :size="18" /> Enviar por Email
              </button>
            </div>
             <div class="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/40 rounded-full blur-3xl -ml-10 -mb-10"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Calendar, Share2, BarChart2, Download, LayoutDashboard, PieChart, TrendingUp, TrendingDown, 
  Lightbulb, Info, FileText, Mail, Send, ChevronDown,
  Facebook, Instagram, Linkedin, Twitter, Youtube, MessageCircle
} from 'lucide-vue-next'

const emit = defineEmits(['showToast'])

// --- STATE REFS ---
const dateRange = ref({ start: '2025-11-09', end: '2025-11-15' })
const selectedChannel = ref('')
const chartView = ref('performance')
const engagementView = ref('comparative')
const activeTab = ref('resumen') // 'resumen', 'analisis', 'canales'

// --- DATOS ---

const kpis = ref([
  { 
    id: 1, 
    iconComponent: Share2, 
    label: 'Alcance Total', 
    value: '45.2K', 
    trend: 12,
    bgClass: 'bg-gray-900',
    textClass: 'text-white',
    color: '#0f172a',
    progress: 75,
    detail: '+5.4K desde el período anterior'
  },
  { 
    id: 2, 
    iconComponent: TrendingUp, 
    label: 'Engagement', 
    value: '3.8%', 
    trend: 5,
    bgClass: 'bg-blue-600',
    textClass: 'text-white',
    color: '#2563eb',
    progress: 65,
    detail: '+0.5% desde el período anterior'
  },
  { 
    id: 3, 
    iconComponent: BarChart2, 
    label: 'CTR', 
    value: '2.1%', 
    trend: 3,
    bgClass: 'bg-indigo-500',
    textClass: 'text-white',
    color: '#6366f1',
    progress: 55,
    detail: '+0.3% desde el período anterior'
  },
  { 
    id: 4, 
    iconComponent: MessageCircle, 
    label: 'Leads', 
    value: '87', 
    trend: 25,
    bgClass: 'bg-cyan-400',
    textClass: 'text-gray-900',
    color: '#22d3ee',
    progress: 85,
    detail: '+25 desde el período anterior'
  }
])

// KPI seleccionada (Maestro-Detalle), inicia con la primera
const selectedKpi = ref(kpis.value[0]) 

const chartData = ref([
  { day: 'Lun', height: 60, reach: '6.2K', interactions: 320, interactionHeight: 55 },
  { day: 'Mar', height: 75, reach: '8.1K', interactions: 420, interactionHeight: 72 },
  { day: 'Mié', height: 55, reach: '5.8K', interactions: 280, interactionHeight: 48 },
  { day: 'Jue', height: 85, reach: '9.3K', interactions: 510, interactionHeight: 87 },
  { day: 'Vie', height: 70, reach: '7.6K', interactions: 380, interactionHeight: 65 },
  { day: 'Sáb', height: 40, reach: '4.2K', interactions: 180, interactionHeight: 39 },
  { day: 'Dom', height: 35, reach: '3.8K', interactions: 150, interactionHeight: 32 }
])

const engagementData = ref([
  { day: 'Lun', height: 65, engagement: '3.2', ctr: '1.8', ctrHeight: 48 },
  { day: 'Mar', height: 80, engagement: '4.1', ctr: '2.4', ctrHeight: 64 },
  { day: 'Mié', height: 55, engagement: '2.8', ctr: '1.5', ctrHeight: 40 },
  { day: 'Jue', height: 90, engagement: '4.8', ctr: '2.9', ctrHeight: 77 },
  { day: 'Vie', height: 75, engagement: '4.0', ctr: '2.3', ctrHeight: 61 },
  { day: 'Sáb', height: 45, engagement: '2.3', ctr: '1.2', ctrHeight: 32 },
  { day: 'Dom', height: 40, engagement: '2.1', ctr: '1.0', ctrHeight: 27 }
])

const networkPerformance = ref([
  { id: 1, name: 'Instagram', iconComponent: Instagram, bgClass: 'bg-pink-600', color: '#db2777', reach: '18.5K', reachChange: 15, engagement: 5.2, ctr: 2.8, followers: '5.2K', growth: 8 },
  { id: 2, name: 'Facebook', iconComponent: Facebook, bgClass: 'bg-blue-600', color: '#2563eb', reach: '14.2K', reachChange: 9, engagement: 3.1, ctr: 1.9, followers: '3.8K', growth: 5 },
  { id: 3, name: 'LinkedIn', iconComponent: Linkedin, bgClass: 'bg-blue-700', color: '#1d4ed8', reach: '8.6K', reachChange: 12, engagement: 4.5, ctr: 3.2, followers: '2.1K', growth: 12 },
  { id: 4, name: 'X / Twitter', iconComponent: Twitter, bgClass: 'bg-gray-900', color: '#0f172a', reach: '3.9K', reachChange: 6, engagement: 2.1, ctr: 1.5, followers: '1.4K', growth: -2 },
  { id: 5, name: 'YouTube', iconComponent: Youtube, bgClass: 'bg-red-600', color: '#dc2626', reach: '22.3K', reachChange: 21, engagement: 6.3, ctr: 4.2, followers: '7.4K', growth: 14 },
])

// --- COMPUTED PROPERTIES ---

const avgEngagement = computed(() => {
  const avg = engagementData.value.reduce((sum, item) => sum + parseFloat(item.engagement), 0) / engagementData.value.length
  return avg.toFixed(1)
})

// Computed property para el Insight
const computedInsightText = computed(() => {
  if (!selectedKpi.value) return 'Selecciona una KPI para ver más detalles.'
  
  const trendText = selectedKpi.value.trend > 0 
    ? `creció un ${selectedKpi.value.trend}%` 
    : `disminuyó un ${Math.abs(selectedKpi.value.trend)}%`;

  switch(selectedKpi.value.id) {
    case 1: return `¡Buen trabajo! Tu alcance total ${trendText}. Tu contenido está llegando a más personas.`
    case 2: return `Tu engagement ${trendText}. La audiencia está interactuando más con tus publicaciones.`
    case 3: return `Un CTR de ${selectedKpi.value.value} es sólido. Los anuncios están atrayendo clics.`
    case 4: return `¡${selectedKpi.value.value} leads! Un ${selectedKpi.value.trend}% más que el período anterior. Excelente.`
    default: return 'Analizando...'
  }
})

// Computed property para el título del gráfico
const computedChartTitle = computed(() => {
  return selectedKpi.value ? `Tendencia de ${selectedKpi.value.label}` : 'Rendimiento por Día'
})

// --- MÉTODOS ---

function selectKpiForDetail(kpi) {
  selectedKpi.value = kpi
}

function generateReport() {
  if (!dateRange.value.start || !dateRange.value.end) {
    emit('showToast', 'Por favor selecciona un rango de fechas', 'error')
    return
  }
  emit('showToast', `Reporte generado para ${dateRange.value.start} - ${dateRange.value.end}`)
}

function exportReport() {
  emit('showToast', 'Iniciando descarga del reporte...')
}

function exportCSV() {
  emit('showToast', 'Exportando datos a CSV... Descarga iniciada')
}

function emailReport() {
  emit('showToast', 'Tu reporte exclusivo ha sido enviado a tu equipo')
}
</script>

<style scoped lang="postcss">
.btn-primary {
  @apply px-5 py-2.5 bg-kapital-dark text-white font-medium rounded-xl transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 flex items-center gap-2 justify-center text-sm;
}

.btn-secondary {
  @apply px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 transition-all hover:bg-gray-50 hover:border-gray-300 flex items-center gap-2 justify-center text-sm;
}

/* Scrollbar fina */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.scrollbar-thin:hover::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>