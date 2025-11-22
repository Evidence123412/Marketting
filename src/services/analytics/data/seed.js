// src/services/analytics/data/seed.js

export const detailedDashboardMetrics = [
    { id: 1, icon: 'fa-image', label: 'Imágenes Generadas', value: '152', trend: 12, detail: 'vs 136 el mes anterior' },
    { id: 2, icon: 'fa-share-alt', label: 'Publicaciones Totales', value: '88', trend: 8, detail: '75 programadas, 13 manuales' },
    { id: 3, icon: 'fa-users', label: 'Audiencia Total', value: '25.8K', trend: 15, detail: '+3.4K nuevos seguidores' },
    { id: 4, icon: 'fa-fire', label: 'Engagement Rate', value: '5.2%', trend: -3, detail: 'Pico de 8.1% el martes' },
    { id: 5, icon: 'fa-mouse-pointer', label: 'Click-Through Rate (CTR)', value: '2.8%', trend: 7, detail: 'Mejor campaña: "Verano24" con 4.2%' },
    { id: 6, icon: 'fa-dollar-sign', label: 'Costo por Lead (CPL)', value: '€12.50', trend: -5, detail: 'Objetivo: €14.00' },
    { id: 7, icon: 'fa-user-plus', label: 'Nuevos Seguidores', value: '1.2K', trend: 22, detail: 'Instagram: 800, Facebook: 300, LinkedIn: 100' },
    { id: 8, icon: 'fa-chart-line-down', label: 'Tasa de Rebote', value: '23%', trend: 4, detail: 'Páginas de destino con mayor rebote: /promo-invierno' }
];

export const audienceDemographics = {
    age: [
        { name: '18-24', value: 25 },
        { name: '25-34', value: 40 },
        { name: '35-44', value: 20 },
        { name: '45-54', value: 10 },
        { name: '55+', value: 5 },
    ],
    gender: [
        { name: 'Femenino', value: 55 },
        { name: 'Masculino', value: 42 },
        { name: 'No especificado', value: 3 },
    ],
    location: [
        { name: 'Madrid', value: 30 },
        { name: 'Barcelona', value: 25 },
        { name: 'Valencia', value: 15 },
        { name: 'Sevilla', value: 10 },
        { name: 'Otros', value: 20 },
    ],
    devices: [
        { name: 'Móvil', value: 75 },
        { name: 'Escritorio', value: 25 },
    ]
};

export const contentPerformance = [
    { id: 1, type: 'Video', format: 'Reel', reach: '25.2K', engagement: '8.9%', conversions: 15, platform: 'Instagram' },
    { id: 2, type: 'Imagen', format: 'Carrusel', reach: '18.5K', engagement: '6.2%', conversions: 8, platform: 'Instagram' },
    { id: 3, type: 'Artículo', format: 'Blog Post', reach: '12.1K', engagement: '4.5%', conversions: 22, platform: 'LinkedIn' },
    { id: 4, type: 'Video', format: 'Live', reach: '35.8K', engagement: '12.3%', conversions: 12, platform: 'Facebook' },
    { id: 5, type: 'Imagen', format: 'Infografía', reach: '22.4K', engagement: '7.1%', conversions: 18, platform: 'LinkedIn' },
    { id: 6, type: 'Texto', format: 'Tweet', reach: '8.9K', engagement: '3.1%', conversions: 4, platform: 'X / Twitter' },
    { id: 7, type: 'Video', format: 'Short', reach: '45.1K', engagement: '15.2%', conversions: 25, platform: 'YouTube' },
    { id: 8, type: 'Imagen', format: 'Story', reach: '15.3K', engagement: '5.8%', conversions: 5, platform: 'Instagram' },
];

export const campaignResults = [
    { id: 1, name: 'Lanzamiento Verano 2024', budget: '€5,000', roi: '250%', leads: 120, cpl: '€41.67', status: 'Completada' },
    { id: 2, name: 'Black Friday Deals', budget: '€10,000', roi: '310%', leads: 250, cpl: '€40.00', status: 'Completada' },
    { id: 3, name: 'Webinar "Futuro del Marketing"', budget: '€2,500', roi: '180%', leads: 80, cpl: '€31.25', status: 'Activa' },
    { id: 4, name: 'Campaña de Re-engagement Q4', budget: '€3,000', roi: 'N/A', leads: 45, cpl: '€66.67', status: 'Activa' },
    { id: 5, name: 'Promoción Nuevo Producto', budget: '€7,500', roi: 'N/A', leads: 0, cpl: 'N/A', status: 'Programada' },
    { id: 6, name: 'Campaña de Navidad', budget: '€15,000', roi: 'N/A', leads: 0, cpl: 'N/A', status: 'Programada' },
];

export const topPerformingPosts = [
    { id: 1, postContent: '¡Nuevo Reel! Descubre cómo nuestra IA puede transformar tus diseños...', platform: 'Instagram', reach: '52.3K', likes: '4.8K', comments: 312, shares: 150 },
    { id: 2, postContent: 'Artículo: 5 tendencias de marketing digital para 2025 que no te puedes perder.', platform: 'LinkedIn', reach: '28.1K', likes: '1.2K', comments: 88, shares: 210 },
    { id: 3, postContent: 'Live con nuestro CEO: Sesión de Q&A sobre el futuro de la IA en el marketing.', platform: 'Facebook', reach: '45.8K', likes: '3.5K', comments: 550, shares: 98 },
    { id: 4, postContent: 'Short: Unboxing de nuestra nueva herramienta de análisis de datos.', platform: 'YouTube', reach: '62.5K', likes: '8.2K', comments: 720, shares: 320 },
];

export const audienceGrowth = [
    { month: 'Ene', followers: 12500 },
    { month: 'Feb', followers: 13800 },
    { month: 'Mar', followers: 15200 },
    { month: 'Abr', followers: 16800 },
    { month: 'May', followers: 18300 },
    { month: 'Jun', followers: 19900 },
    { month: 'Jul', followers: 21500 },
    { month: 'Ago', followers: 22800 },
    { month: 'Sep', followers: 24000 },
    { month: 'Oct', followers: 25800 },
];

export const recentActivities = [
    { id: 1, icon: 'fa-thumbs-up', title: 'Nuevo Me Gusta en tu publicación de Instagram', time: 'hace 5 minutos', bgColor: '#E4405F' },
    { id: 2, icon: 'fa-comment', title: 'Nuevo comentario en tu artículo de LinkedIn', time: 'hace 15 minutos', bgColor: '#0A66C2' },
    { id: 3, icon: 'fa-share', title: 'Tu video de YouTube fue compartido', time: 'hace 1 hora', bgColor: '#FF0000' },
    { id: 4, icon: 'fa-user-plus', title: 'Nuevo seguidor en X / Twitter', time: 'hace 3 horas', bgColor: '#000000' },
];

export const reportNetworkPerformance = [
    { id: 1, name: 'Instagram', reach: 120500, engagement: 7.8, ctr: 3.1, followers: 15200, growth: 5.2 },
    { id: 2, name: 'Facebook', reach: 250800, engagement: 5.2, ctr: 2.5, followers: 8500, growth: 2.1 },
    { id: 3, name: 'LinkedIn', reach: 80200, engagement: 3.5, ctr: 4.5, followers: 4200, growth: 8.5 },
    { id: 4, name: 'X / Twitter', reach: 50300, engagement: 2.1, ctr: 1.8, followers: 2100, growth: 1.5 },
    { id: 5, name: 'YouTube', reach: 350000, engagement: 10.2, ctr: 5.5, followers: 6300, growth: 12.3 },
];
