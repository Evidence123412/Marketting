// --- ANALYTICS SERVICE REMOVED ---


// --- CRM SERVICE FACADE ---

export const crmService = {
  getLeads: () => Promise.resolve(crmModule.getLeads()),
  getUsers: () => Promise.resolve(crmModule.getUsers()),
  getAdvisors: () => Promise.resolve(crmModule.getAdvisors()),
  getStatusOptions: () => Promise.resolve(crmModule.getStatusOptions()),

  saveLead: (leadData) => {
    crmModule.saveLead(leadData);
    return Promise.resolve(crmModule.getLeads());
  },

  deleteLead: (leadId) => {
    crmModule.deleteLead(leadId);
    return Promise.resolve(crmModule.getLeads());
  },

  updateLeadStatus: (leadId, newStatus) => {
    crmModule.updateLeadStatus(leadId, newStatus);
    return Promise.resolve(crmModule.getLeads());
  },

  addMessageToConversation: (leadId, messageText, sender = 'me') => {
    const messageData = {
      text: messageText,
      sender: sender,
      channel: 'Web',
    };
    crmModule.addMessageToConversation(leadId, messageData);
    return Promise.resolve(crmModule.getLeads());
  },

  addNoteToLead: (leadId, noteText, author) => {
    const noteData = { text: noteText, author };
    crmModule.addNoteToLead(leadId, noteData);
    return Promise.resolve(crmModule.getLeads());
  },

  addOpportunityToLead: (leadId, oppData) => {
    crmModule.addOpportunityToLead(leadId, oppData);
    return Promise.resolve(crmModule.getLeads());
  }
};
