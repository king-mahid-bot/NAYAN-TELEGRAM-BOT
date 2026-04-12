module.exports = {
  config: {
    name: "groupinfo",
    credits: "Nayan",
    prefix: true,
    aliases: ["grpinfo"],
    tags: ["Group"],
    description: "Get group information",
    permission: 0,
  },
  start: async ({ event, api, isGroup }) => {
    const chatId = event.msg.chat.id;

    if (!isGroup) {
      return api.sendMessage(chatId, "❌ This command can only be used in groups.");
    }

    try {
      const chat = await api.getChat(chatId);
      const memberCount = await api.getChatMembersCount(chatId);
      const admins = await api.getChatAdministrators(chatId);


      const escapeMarkdown = (text) => {
        return text
          .replace(/_/g, "\\_")
          .replace(/\*/g, "\\*")
          .replace(/\[/g, "\\[")
          .replace(/]/g, "\\]")
          .replace(/\(/g, "\\(")
          .replace(/\)/g, "\\)")
          .replace(/~/g, "\\~")
          .replace(/`/g, "\\`")
          .replace(/>/g, "\\>")
          .replace(/#/g, "\\#")
          .replace(/\+/g, "\\+")
          .replace(/-/g, "\\-")
          .replace(/=/g, "\\=")
          .replace(/\|/g, "\\|")
          .replace(/\{/g, "\\{")
          .replace(/\}/g, "\\}")
          .replace(/\./g, "\\.")
          .replace(/!/g, "\\!");
      };

      const adminList = admins
        .map((admin) => {
          const username = admin.user.username
            ? `@${escapeMarkdown(admin.user.username)}`
            : escapeMarkdown(admin.user.first_name);
          return `\\- ${username}`;
        })
        .join("\n");

      let groupInfo = `👥 *Group Info:*\n`;
      groupInfo += `\\- *Name:* ${escapeMarkdown(chat.title)}\n`;
      groupInfo += `\\- *Member Count:* ${memberCount}\n`;
      groupInfo += `\\- *Created:* ${new Date(chat.created_at * 1000).toLocaleDateString()}\n`;
      groupInfo += `\\- *Admins:*\n${adminList}\n`;


      if (chat.photo) {
        const fileId = chat.photo.big_file_id;
        await api.sendPhoto(chatId, fileId, {
          caption: groupInfo,
          parse_mode: "MarkdownV2",
        });
      } else {
        await api.sendMessage(chatId, groupInfo, { parse_mode: "MarkdownV2" });
      }
    } catch (error) {
      
      await api.sendMessage(chatId, "❌ An error occurred while processing the command.");
    }
  },
};
