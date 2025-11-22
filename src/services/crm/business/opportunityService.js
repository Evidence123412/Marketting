import { repository } from '../data/localStorageRepository';
import { createOpportunity } from '../models/Opportunity';

export const opportunityService = {
  /**
   * Adds an opportunity to a lead.
   * @param {number} leadId - The ID of the lead.
   * @param {Object} oppData - { title, value }.
   * @returns {Object} The created opportunity.
   */
  addOpportunity(leadId, oppData) {
    const lead = repository.findById('leads', leadId);
    if (!lead) {
      throw new Error(`Lead with ID ${leadId} not found.`);
    }

    const newOpportunity = createOpportunity(oppData);
    
    const opportunityToSave = { ...newOpportunity, leadId };

    return repository.save('opportunities', opportunityToSave);
  },
};
