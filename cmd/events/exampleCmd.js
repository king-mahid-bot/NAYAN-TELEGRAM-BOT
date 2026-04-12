module.exports = {
  event: "message", // Specifies the event type (message event)
  handle: async ({ msg, bot }) => {
    // The "handle" function is triggered for each new message.
    const chatId = msg.chat.id; // Get the chat ID from the incoming message
    const text = msg.text;      // Extract the message text

    // Check if the message text matches "hi" or "hello" (case-insensitive)
    if (text && (text.toLowerCase() === "hi" || text.toLowerCase() === "hello")) {
      // Send a reply to the chat
      await bot.sendMessage(chatId, "Hi there! How are you?");
    }
  },
};
