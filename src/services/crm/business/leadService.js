import { repository } from '../data/localStorageRepository';
import { createLead } from '../models/Lead';

export const leadService = {
  /**
   * Gets all leads and populates their related entities.
   * @returns {Array} A list of fully populated leads.
   */
  getAllLeads() {
    const leads = repository.getAll('leads');
    const notes = repository.getAll('notes');
    const opportunities = repository.getAll('opportunities');
    const conversations = repository.getAll('conversations');

    // This simulates a JOIN operation.
    return leads.map(lead => ({
      ...lead,
      notes: notes.filter(n => n.leadId === lead.id),
      opportunities: opportunities.filter(o => o.leadId === lead.id),
      conversations: conversations.filter(c => c.leadId === lead.id),
    }));
  },

  /**
   * Saves a lead (creates or updates).
   * @param {Object} leadData - The data for the lead.
   * @returns {Object} The saved lead.
   */
  saveLead(leadData) {
    let leadToSave;
    if (leadData.id) {
      // It's an update
      const existingLead = repository.findById('leads', leadData.id);
      if (!existingLead) {
        throw new Error(`Lead with ID ${leadData.id} not found.`);
      }
      leadToSave = { ...existingLead, ...leadData };
    } else {
      // It's a creation
      leadToSave = createLead(leadData);
    }
    return repository.save('leads', leadToSave);
  },

  /**
   * Deletes a lead and all its related data.
   * @param {number} leadId - The ID of the lead to delete.
   * @returns {boolean} True if successful.
   */
  deleteLead(leadId) {
    // Also delete related entities
    const notes = repository.findByProperty('notes', 'leadId', leadId);
    notes.forEach(note => repository.destroy('notes', note.id));

    const opportunities = repository.findByProperty('opportunities', 'leadId', leadId);
    opportunities.forEach(opp => repository.destroy('opportunities', opp.id));

    const conversations = repository.findByProperty('conversations', 'leadId', leadId);
    conversations.forEach(conv => repository.destroy('conversations', conv.id));

    return repository.destroy('leads', leadId);
  },

  /**
   * Updates the status of a lead.
   * @param {number} leadId - The ID of the lead.
   * @param {string} newStatus - The new status.
   * @returns {Object} The updated lead.
   */
  updateLeadStatus(leadId, newStatus) {
    const lead = repository.findById('leads', leadId);
    if (!lead) {
      throw new Error(`Lead with ID ${leadId} not found.`);
    }
    const updatedLead = { ...lead, status: newStatus };
    return repository.save('leads', updatedLead);
  },
};
