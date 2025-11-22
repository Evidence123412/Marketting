import { getNextId } from '../data/idManager';

/**
 * Creates a new Lead object with default values and timestamps.
 * @param {Object} data - The lead data.
 * @returns {Object} A new lead object.
 */
export const createLead = (data) => {
  const now = new Date().toISOString();
  const name = data.name || 'Sin Nombre';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return {
    id: getNextId('leads'),
    name,
    email: data.email || '',
    phone: data.phone || '',
    company: data.company || '',
    initials,
    origin: data.origin || 'Unknown',
    status: 'new',
    assignedTo: data.assignedTo || null,
    notes: [], // IDs of notes
    opportunities: [], // IDs of opportunities
    conversations: [], // IDs of conversations
    createdAt: now,
    updatedAt: now,
  };
};
