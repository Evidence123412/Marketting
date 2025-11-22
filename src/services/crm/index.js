import { leadService } from './business/leadService';
import { conversationService } from './business/conversationService';
import { noteService } from './business/noteService';
import { opportunityService } from './business/opportunityService';
import { USERS, ADVISORS, STATUS_OPTIONS } from './constants';

/**
 * The new, clean, and modular CRM service API.
 */
export const crmModule = {
  // Lead operations
  getLeads: leadService.getAllLeads,
  saveLead: leadService.saveLead,
  deleteLead: leadService.deleteLead,
  updateLeadStatus: leadService.updateLeadStatus,

  // Note operations
  addNoteToLead: noteService.addNote,

  // Opportunity operations
  addOpportunityToLead: opportunityService.addOpportunity,

  // Conversation operations
  addMessageToConversation: conversationService.addMessage,

  // Static data getters
  getUsers: () => USERS,
  getAdvisors: () => ADVISORS,
  getStatusOptions: () => STATUS_OPTIONS,
};
