import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useContentStore = defineStore('content', () => {
    const publications = ref([
        { id: 1, title: 'Lanzamiento Verano', description: '¡Llegó la nueva colección! ☀️ #Verano2025', channels: 'Instagram, Facebook', status: 'published', date: '2025-11-10', time: '10:00', hashtags: '#fashion #summer', hasImage: true, created_at: '2025-11-01' },
        { id: 2, title: 'Tips de Marketing', description: '5 consejos para mejorar tu SEO hoy mismo.', channels: 'LinkedIn', status: 'scheduled', date: '2025-11-25', time: '09:00', hashtags: '#seo #marketing', hasImage: true, created_at: '2025-11-20' },
        { id: 3, title: 'Black Friday Teaser', description: 'Prepárate... algo grande viene.', channels: 'Instagram, TikTok', status: 'draft', date: '', time: '', hashtags: '#blackfriday', hasImage: false, created_at: new Date().toISOString().split('T')[0] },
    ])

    function addPublication(pub) {
        publications.value.unshift({
            ...pub,
            id: Date.now(),
            created_at: new Date().toISOString(),
            hasImage: true // Mocking image presence
        })
    }

    function updatePublication(updatedPub) {
        const index = publications.value.findIndex(p => p.id === updatedPub.id)
        if (index !== -1) {
            publications.value[index] = updatedPub
        }
    }

    function deletePublication(id) {
        publications.value = publications.value.filter(p => p.id !== id)
    }

    function checkExpiredDrafts(daysToKeep = 2) {
        const now = new Date()
        const initialCount = publications.value.length

        publications.value = publications.value.filter(pub => {
            if (pub.status !== 'draft') return true

            const created = new Date(pub.created_at)
            const diffTime = Math.abs(now - created)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            return diffDays <= daysToKeep
        })

        return initialCount - publications.value.length
    }

    return {
        publications,
        addPublication,
        updatePublication,
        deletePublication,
        checkExpiredDrafts
    }
}, {
    persist: true
})
