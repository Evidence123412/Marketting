import { repository } from '../data/localStorageRepository';
import { createConversation, createMessage } from '../models/Conversation';
import { getNextId } from '../data/idManager';

export const conversationService = {
  /**
   * Adds a message to a conversation.
   * If no conversationId is provided, it finds or creates a conversation based on the channel.
   * @param {number} leadId - The ID of the lead.
   * @param {Object} messageData - { text, sender, channel, conversationId }.
   * @returns {Object} The updated conversation.
   */
  addMessage(leadId, messageData) {
    const { text, sender = 'me', channel = 'Web', conversationId } = messageData;

    let conversation;
    if (conversationId) {
      conversation = repository.findById('conversations', conversationId);
      if (!conversation || conversation.leadId !== leadId) {
        throw new Error(`Conversation with ID ${conversationId} not found for lead ${leadId}.`);
      }
    } else {
      // Find an existing conversation for that channel or create a new one
      const existingConversations = repository.findByProperty('conversations', 'leadId', leadId);
      conversation = existingConversations.find(c => c.channel === channel);

      if (!conversation) {
        const newConversationData = {
          id: getNextId('conversations'),
          leadId,
          channel,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        conversation = repository.save('conversations', newConversationData);
      }
    }

    // Add the new message
    const newMessage = createMessage({ text, sender });
    const updatedMessages = [...conversation.messages, newMessage];

    // Update conversation properties
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      preview: text,
      lastActivity: new Date().toISOString(),
      status: sender === 'me' ? 'replied' : 'pending',
    };

    return repository.save('conversations', updatedConversation);
  },
};
