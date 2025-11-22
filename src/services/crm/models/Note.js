import { getNextId } from '../data/idManager';

/**
 * Creates a new Note object.
 * @param {Object} data - The note data { text, author }.
 * @returns {Object} A new note object.
 */
export const createNote = (data) => {
  const now = new Date().toISOString();
  return {
    id: getNextId('notes'),
    text: data.text,
    author: data.author,
    date: now, // For backward compatibility, but we'll use createdAt
    createdAt: now,
    updatedAt: now,
  };
};
