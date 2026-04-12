  module.exports = {
    config: {
      name: "uid",
      credits: "Nayan",
      prefix: true,
      permission: 0,
      aliases: ["id"],
      description: "Get Your User Id"
    },
  start: async ({ event, api }) => {
      const chatId = event.msg.chat.id;
      const userId = event.msg.from.id;

      api.sendMessage(chatId, `✅ Your user ID is: \`${userId}\``, {
        parse_mode: 'Markdown',
        reply_to_message_id: event.msg.message_id,
      });
    }
}