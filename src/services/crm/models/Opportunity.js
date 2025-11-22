import { getNextId } from '../data/idManager';

/**
 * Creates a new Opportunity object.
 * @param {Object} data - The opportunity data { title, value }.
 * @returns {Object} A new opportunity object.
 */
export const createOpportunity = (data) => {
  const now = new Date().toISOString();
  return {
    id: getNextId('opportunities'),
    title: data.title,
    value: data.value,
    status: 'open', // Default status
    createdAt: now,
    updatedAt: now,
  };
};
