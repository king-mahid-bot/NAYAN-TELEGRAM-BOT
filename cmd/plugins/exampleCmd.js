module.exports = {
  config: {
    name: "hi", // Command name
    credits: "Nayan", // command creator
    aliases: ["hello", "hlw"], // Alternative names for the command
    prefix: true,              // Indicates the command requires a prefix (e.g., "/hi")
    permission: 0              // Sets the permission level (0 = accessible to all users)
  },
  start: async ({api, event}) => {
    // The "start" function is executed when the command is triggered.
    const { chat, from } = event.msg; // Extract chat and message details
    const {senderId, threadId, messageId} = event              // Get the senderId, group id, message id

    // Send a reply to the user
    await api.sendMessage(threadId, "Hi there! How are you?", { reply_to_message_id: messageId });
  },
};
