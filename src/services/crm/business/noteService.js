import { repository } from '../data/localStorageRepository';
import { createNote } from '../models/Note';

export const noteService = {
  /**
   * Adds a note to a lead.
   * @param {number} leadId - The ID of the lead.
   * @param {Object} noteData - { text, author }.
   * @returns {Object} The created note.
   */
  addNote(leadId, noteData) {
    const lead = repository.findById('leads', leadId);
    if (!lead) {
      throw new Error(`Lead with ID ${leadId} not found.`);
    }

    const newNote = createNote({
      ...noteData,
      leadId, // This is not in the model, but we add it here.
    });
    
    // The model doesn't know about leadId, so we add it before saving.
    const noteToSave = { ...newNote, leadId };

    return repository.save('notes', noteToSave);
  },
};
