export const USERS = ['Juan Pérez', 'Ana García', 'Luis Fernández', 'Laura M.'];

export const ADVISORS = [
  { id: 1, initials: 'JC', name: 'Juan Carlos', role: 'Asesor Senior' },
  { id: 2, initials: 'MG', name: 'María García', role: 'Asesor Junior' },
  { id: 3, initials: 'LP', name: 'Luis Peña', role: 'Especialista' },
  { id: 4, initials: 'SC', name: 'Sofia Chen', role: 'Community Manager' }
];

export const STATUS_OPTIONS = [
  { value: 'new', label: 'Nuevo', icon: 'fa-star', color: 'green' },
  { value: 'contacted', label: 'Contactado', icon: 'fa-phone', color: 'blue' },
  { value: 'following', label: 'En Seguimiento', icon: 'fa-hourglass-half', color: 'yellow' },
  { value: 'proposal', label: 'Propuesta Enviada', icon: 'fa-file-alt', color: 'cyan' },
  { value: 'negotiation', label: 'Negociación', icon: 'fa-comments', color: 'orange' },
  { value: 'closed', label: 'Cerrado (Ganado)', icon: 'fa-check-circle', color: 'purple' },
  { value: 'lost', label: 'Cerrado (Perdido)', icon: 'fa-times-circle', color: 'red' }
];
