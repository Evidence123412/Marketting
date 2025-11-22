// This file contains the initial data to seed the database if it's empty.
import { getNextId } from './idManager';

// --- Data Generators ---

const generateName = (i) => {
  const names = ['Alejandro', 'Beatriz', 'Carlos', 'Diana', 'Eduardo', 'Fernanda', 'Gabriel', 'Hilda', 'Ignacio', 'Jimena', 'Kevin', 'Lorena', 'Manuel', 'Nora', 'Oscar'];
  const lastNames = ['Castillo', 'Rojas', 'Ortega', 'Mendoza', 'Guerrero', 'Vega', 'Reyes', 'Morales', 'Paredes', 'Salazar', 'Campos', 'Rios', 'Soto', 'Delgado', 'Vargas'];
  return `${names[i % names.length]} ${lastNames[i % lastNames.length]}`;
};

const generateCompany = (i) => {
  const prefixes = ['Global', 'Future', 'Dynamic', 'Quantum', 'Alpha', 'Omega', 'Hyper', 'Cyber', 'NextGen', 'Pro'];
  const suffixes = ['Solutions', 'Systems', 'Dynamics', 'Enterprises', 'Group', 'Technologies', 'Innovations', 'Labs', 'Consulting', 'Ventures'];
  return `${prefixes[i % prefixes.length]} ${suffixes[i % suffixes.length]}`;
};

const generateConversations = (count, leadId) => {
  const conversations = [];

  const channels = ['Email', 'Phone Call', 'Meeting', 'WhatsApp', 'LinkedIn Message'];

  const messagePairs = [
    {
      lead: ["Hola, hemos revisado la propuesta y tenemos algunas dudas.", "¿Podemos coordinar una llamada esta semana?"],
      user: ["Por supuesto, encantado de ayudar.", "¿Les viene bien mañana por la mañana?"]
    },
    {
      lead: ["Gracias por la demostración, fue muy útil.", "El equipo tiene algunas preguntas técnicas adicionales."],
      user: ["Me alegra que fuese útil.", "Puedo preparar una sesión técnica con un especialista si lo desean."]
    },
    {
      lead: ["Confirmamos asistencia para la reunión del martes.", "Por favor, comparte el enlace a la videollamada."],
      user: ["Perfecto, aquí tienen el enlace de Google Meet.", "Nos vemos entonces."]
    },
    {
      lead: ["Estamos integrando la API y nos surgió un error 401.", "¿Nuestra API key es correcta?"],
      user: ["Claro, déjame verificar el estado de la clave.", "Parece que expiró ayer. Acabo de generar una nueva y se la he enviado por email."]
    },
    {
      lead: ["El periodo de prueba ha ido muy bien.", "Queremos discutir los planes de licenciamiento para empresas."],
      user: ["Excelente noticia.", "Les enviaré la propuesta actualizada con los precios por volumen."]
    },
    {
      lead: ["¿Podrían enviarnos el caso de estudio del sector retail que mencionaron?", "Nos sería de gran ayuda."],
      user: ["Por supuesto, adjunto el documento.", "Quedo a su disposición para cualquier consulta."]
    },
    {
      lead: ["Hemos tenido un problema con la última actualización.", "La función de exportación ha dejado de funcionar."],
      user: ["Lamento oír eso. Nuestro equipo técnico ya está investigando la incidencia.", "Le mantendremos informado del progreso."]
    },
    {
      lead: ["¿Ofrecen algún tipo de descuento para startups?", "Estamos empezando y el presupuesto es ajustado."],
      user: ["Sí, tenemos un plan especial para startups con un 50% de descuento el primer año.", "Les envío los detalles."]
    },
    {
      lead: ["La funcionalidad de reportes es justo lo que necesitábamos.", "Gran trabajo."],
      user: ["Nos alegra mucho que les sea de utilidad.", "Estamos trabajando en nuevas plantillas de reportes que lanzaremos pronto."]
    },
    {
      lead: ["¿Es posible personalizar los colores de la interfaz?", "Nos gustaría que encajara con nuestra marca."],
      user: ["Actualmente la personalización es limitada, pero estamos desarrollando un editor de temas visuales.", "Puedo añadirles a la beta cuando esté disponible."]
    }
  ];

  const generateMessageList = (template, dateBase) => {
    const messages = [];
    const timeBase = dateBase.getTime();

    template.lead.forEach((line, idx) => {
      messages.push({
        id: getNextId("messages"),
        sender: "lead",
        text: line,
        time: new Date(timeBase + idx * 60000 * 10).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date(timeBase + idx * 60000 * 10).toISOString()
      });
    });

    template.user.forEach((line, idx) => {
      messages.push({
        id: getNextId("messages"),
        sender: "user",
        text: line,
        time: new Date(timeBase + (template.lead.length + idx) * 60000 * 10).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date(timeBase + (template.lead.length + idx) * 60000 * 10).toISOString()
      });
    });

    return messages;
  };

  for (let i = 0; i < count; i++) {
    const now = new Date();
    now.setDate(now.getDate() - (i * 2 + 1)); // distribución realista

    const id = getNextId("conversations");
    const channel = channels[i % channels.length];
    const template = messagePairs[i % messagePairs.length];

    const messages = generateMessageList(template, now);
    const lastMessage = messages[messages.length - 1];

    conversations.push({
      id,
      leadId,
      channel,
      preview: lastMessage.text.slice(0, 80), // preview más profesional
      lastActivity: lastMessage.createdAt,
      status: i % 3 === 0 ? "pending" : "replied",
      messages,
      createdAt: now.toISOString(),
      updatedAt: lastMessage.createdAt,
    });
  }

  return conversations;
};


const generateNotes = (count, leadId, author) => {
  let notes = [];
  const noteTemplates = [
    "El cliente mostró gran interés en la funcionalidad de reportes.",
    "Necesita una propuesta personalizada antes del fin de semana.",
    "Se discutieron los términos de licenciamiento y SLA.",
    "El principal punto de dolor es la falta de automatización actual.",
    "Enviado el caso de estudio de 'Innovatech'. Pendiente de feedback.",
    "El contacto clave estará de vacaciones hasta el próximo lunes.",
    "La decisión final depende del CTO, agendar reunión.",
    "Comparando nuestra solución con la de 'Competidor X'.",
    "Solicitó referencias de clientes en el sector financiero.",
    "Presupuesto confirmado, esperando la orden de compra."
  ];
  for (let i = 0; i < count; i++) {
    const now = new Date();
    now.setDate(now.getDate() - (i * 2));
    const id = getNextId('notes');
    notes.push({
      id,
      leadId,
      text: noteTemplates[i % noteTemplates.length],
      author,
      date: now.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  }
  return notes;
};

const generateOpportunities = (count, leadId) => {
  let opportunities = [];
  const opportunityTitles = [
    "Implementación de Plataforma CRM",
    "Servicio de Consultoría Digital",
    "Licenciamiento Anual de Software",
    "Desarrollo de Módulo a Medida",
    "Contrato de Soporte Premium",
    "Expansión a Nuevas Sucursales"
  ];
  const statuses = ['discovery', 'proposal', 'negotiation', 'won', 'lost'];

  for (let i = 0; i < count; i++) {
    const id = getNextId('opportunities');
    const value = 5000 + Math.floor(Math.random() * 45000); // Random value between 5k and 50k
    opportunities.push({
      id,
      leadId,
      title: `${opportunityTitles[i % opportunityTitles.length]}`,
      value: value,
      status: statuses[i % statuses.length],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return opportunities;
};


// --- Main Seeding Function ---

export const seedInitialData = () => {
  // Clean previous data
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('crm_')) {
      localStorage.removeItem(key);
    }
  });

  let allLeads = [];
  let allNotes = [];
  let allOpportunities = [];
  let allConversations = [];

  const statusConfig = {
    'new': { convos: 1, notes: 1, opps: 0 },
    'contacted': { convos: 3, notes: 2, opps: 1 },
    'following': { convos: 5, notes: 3, opps: 1 },
    'proposal': { convos: 8, notes: 5, opps: 2 },
    'negotiation': { convos: 10, notes: 7, opps: 2 },
    'closed': { convos: 12, notes: 8, opps: 1 },
    'lost': { convos: 12, notes: 8, opps: 1 },
  };

  const statuses = Object.keys(statusConfig);
  const assignedUsers = ['Elena Ríos', 'Javier Morales', 'Patricia Sanz', 'Marcos Vega'];

  for (let i = 0; i < 15; i++) {
    const leadId = getNextId('leads');
    const name = generateName(i);
    const company = generateCompany(i);
    const status = statuses[i % statuses.length];
    const config = statusConfig[status];
    const assignedTo = assignedUsers[i % assignedUsers.length];

    allLeads.push({
      id: leadId,
      name,
      email: `${name.split(' ')[0].toLowerCase().replace('ñ', 'n')}@${company.toLowerCase().replace(/ /g, '')}.com`,
      phone: `+34 6${Math.floor(10 + Math.random() * 90)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`,
      company,
      initials: name.split(' ').map(n => n[0]).join('').toUpperCase(),
      origin: ['Website', 'LinkedIn', 'Referral', 'Trade Show'][i % 4],
      status,
      assignedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    allConversations.push(...generateConversations(config.convos, leadId));
    allNotes.push(...generateNotes(config.notes, leadId, assignedTo));
    allOpportunities.push(...generateOpportunities(config.opps, leadId));
  }

  // Set initial data
  localStorage.setItem('crm_leads', JSON.stringify(allLeads));
  localStorage.setItem('crm_notes', JSON.stringify(allNotes));
  localStorage.setItem('crm_opportunities', JSON.stringify(allOpportunities));
  localStorage.setItem('crm_conversations', JSON.stringify(allConversations));

  // Set ID counters to the max ID of the sample data
  const counters = {
    leads: Math.max(...allLeads.map(l => l.id)),
    notes: allNotes.length > 0 ? Math.max(...allNotes.map(n => n.id)) : 0,
    opportunities: allOpportunities.length > 0 ? Math.max(...allOpportunities.map(o => o.id)) : 0,
    conversations: allConversations.length > 0 ? Math.max(...allConversations.map(c => c.id)) : 0,
  };
  localStorage.setItem('crm_id_counters', JSON.stringify(counters));

  // Mark DB as initialized
  localStorage.setItem('crm_initialized', 'true');

  console.log('Database seeded with 15 professional-looking leads and related data.');
};