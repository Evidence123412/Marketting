import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    // --- Buyer Persona Variables ---
    const zones = ref(['Urbana', 'Rural', 'Suburbana', 'Industrial', 'Costera'])
    const professions = ref(['Abogado', 'Médico', 'Ingeniero', 'Docente', 'Emprendedor', 'Estudiante', 'Arquitecto', 'Contador'])
    const occupations = ref(['Director', 'Gerente', 'Analista', 'Asistente', 'Freelance', 'Dueño de Negocio'])
    const educationLevels = ref(['Secundaria', 'Técnico', 'Universitario', 'Postgrado', 'Doctorado'])

    // Psychographic
    const lifestyles = ref(['Sofisticado', 'Progresista', 'Moderno', 'Formalista', 'Conservador', 'Austero', 'Aventurero'])
    const interests = ref(['Tecnología', 'Deportes', 'Finanzas', 'Viajes', 'Moda', 'Gastronomía', 'Salud y Bienestar', 'Arte', 'Música'])
    const values = ref(['Familia', 'Éxito', 'Libertad', 'Seguridad', 'Innovación', 'Tradición', 'Sostenibilidad'])

    // --- Branding & AI ---
    const branding = ref({
        companyName: 'Kapital CMS',
        website: 'https://kapital.com',
        tone: 'professional',
        colors: ['#0F172A', '#2563EB', '#F59E0B']
    })

    const aiSettings = ref({
        creativity: 70,
        defaultHashtags: '#Marketing #Business #Growth'
    })

    // --- Actions to Manage Lists ---
    function addOption(listName, value) {
        if (!value) return
        const target = getList(listName)
        if (target && !target.value.includes(value)) {
            target.value.push(value)
        }
    }

    function removeOption(listName, value) {
        const target = getList(listName)
        if (target) {
            target.value = target.value.filter(item => item !== value)
        }
    }

    function getList(listName) {
        switch (listName) {
            case 'zones': return zones
            case 'professions': return professions
            case 'occupations': return occupations
            case 'educationLevels': return educationLevels
            case 'lifestyles': return lifestyles
            case 'interests': return interests
            case 'values': return values
            default: return null
        }
    }

    return {
        // State
        zones,
        professions,
        occupations,
        educationLevels,
        lifestyles,
        interests,
        values,
        branding,
        aiSettings,

        // Actions
        addOption,
        removeOption
    }
}, {
    persist: true
})
