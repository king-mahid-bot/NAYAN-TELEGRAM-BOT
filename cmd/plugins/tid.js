module.exports = {
  config: {
    name: "groupid",
    aliases: ["tid"],
    tags: ["info"],
    description: "Get the group ID of the current chat.",
    prefix: true,
    permission: 0,
  },
  start: async ({ event, api }) => {
    const { threadId, chat, chatType } = event;

    
    if (chatType === "private") {
      await api.sendMessage(threadId, "❌ This command can only be used in a group chat.");
    } else {
      // Send the group ID if used in a group chat
      await api.sendMessage(threadId, `✅ This group ID is: \`${threadId}\``, {
        parse_mode: "Markdown",
      });
    }
  },
};
