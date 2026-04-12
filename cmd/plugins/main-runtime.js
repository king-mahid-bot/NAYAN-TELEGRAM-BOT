const Start = new Date();

module.exports = {
  config: {
    name: "uptime",
    credits: "Nayan",
    aliases: ["up", "runtime"],
    prefix: "auto",
    permission: 0,
    description: "Check the bot's runtime duration",
    tags: ["media"],
  },
  start: async ({ event, api }) => {
    const { threadId, messageID } = event;

    const now = new Date();
    const uptimeMilliseconds = now - Start;
    const uptimeSeconds = Math.floor(uptimeMilliseconds / 1000);
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);
    const uptimeDays = Math.floor(uptimeHours / 24);

    const uptimeMessage = `𝐀𝐜𝐭𝐢𝐯𝐞 ⚙️: ${uptimeDays} day(s), ${uptimeHours % 24} hour(s), ${uptimeMinutes % 60} minute(s), ${uptimeSeconds % 60} second(s).`;

    const replyMarkup = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Bot Owner', url: 'https://t.me/MOHAMMADNAYAN' }],
        ],
      },
    };

    await api.sendMessage(threadId, uptimeMessage, {
      reply_to_message_id: messageID,
      ...replyMarkup,
    });
  },
};
