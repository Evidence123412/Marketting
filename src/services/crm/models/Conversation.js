import { getNextId } from '../data/idManager';

/**
 * Creates a new Message object for a conversation.
 * @param {Object} data - { text, sender }.
 * @returns {Object} A new message object.
 */
export const createMessage = (data) => {
  const now = new Date();
  return {
    // No ID for messages for now, they are embedded.
    text: data.text,
    sender: data.sender,
    time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }), // For display
    createdAt: now.toISOString(),
  };
};

/**
 * Creates a new Conversation object.
 * @param {Object} data - { channel, initialMessage }.
 * @returns {Object} A new conversation object.
 */
export const createConversation = (data) => {
  const now = new Date().toISOString();
  const firstMessage = createMessage({
    text: data.initialMessage,
    sender: 'lead', // A new conversation is always started by a lead
  });

  return {
    id: getNextId('conversations'),
    channel: data.channel || 'Web',
    preview: firstMessage.text,
    lastActivity: now,
    status: 'pending', // A new conversation is always pending a reply
    messages: [firstMessage],
    createdAt: now,
    updatedAt: now,
  };
};
