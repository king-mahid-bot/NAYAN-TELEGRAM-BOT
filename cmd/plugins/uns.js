module.exports = {
  config: {
    name: "uns",
    credits: "Nayan",
    prefix: true,
    permission: 2,
    aliases: [],
    description: "Delete bot messages when replying.",
    tags: [""],
  },
  start: async ({ admin, event, api }) => {
    const chatId = event.msg.chat.id;
    const userId = event.msg.from.id;

    if (!event.msg.reply_to_message) {
      return api.sendMessage(chatId, "❌ Please reply to a bot message to delete it.", { reply_to_message_id: event.msg.message_id });
    }

    const repliedMessage = event.msg.reply_to_message;

    try {
      const botInfo = await api.getMe();

      if (repliedMessage.from.id !== botInfo.id) {
        return api.sendMessage(chatId, "❌ You can only delete messages sent by this bot.", { reply_to_message_id: event.msg.message_id });
      }

      // Check if the chat is private
      if (event.msg.chat.type === 'private') {
        await api.deleteMessage(chatId, repliedMessage.message_id);
        return api.sendMessage(chatId, "✅ Bot message deleted successfully.", { reply_to_message_id: event.msg.message_id });
      }

      // If not private, check if the user is an admin
      const chatAdmins = await api.getChatAdministrators(chatId);
      const isAdmin = chatAdmins.some(admin => admin.user.id === userId) || admin.includes(userId.toString());

      if (isAdmin) {
        await api.deleteMessage(chatId, repliedMessage.message_id);
        return api.sendMessage(chatId, "✅ Bot message deleted successfully.", { reply_to_message_id: event.msg.message_id });
      } else {
        return api.sendMessage(chatId, "❌ Only group admins or bot admin can use this command.", { reply_to_message_id: event.msg.message_id });
      }
    } catch (error) {
      api.sendMessage(chatId, "❌ An error occurred while processing your request.", { reply_to_message_id: event.msg.message_id });
      console.error("Error:", error);
    }
  },
};
