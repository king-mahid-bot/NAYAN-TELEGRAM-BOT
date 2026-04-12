module.exports = {
  config: {
    name: "admin",
    credits: "Nayan",
    prefix: true,
    permission: 2,
    aliases: ["admin"],
    description: "Manage Admin",
    tags: ["Group"],
  },

  start: async ({ event, api, isGroup }) => {
    const escapeMarkdown = (text) => {
      return text
        .replace(/_/g, "\\_")
        .replace(/\*/g, "\\*")
        .replace(/\[/g, "\\[")
        .replace(/\]/g, "\\]")
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

    const chatId = event.msg.chat.id;
    const messageText = event.message.text;
    const bot = api

    if(!isGroup(event.msg)){
      return bot.sendMessage(chatId, "❌ This command can only be used in groups.");
      
    }
    
    if (messageText.startsWith("/admin add")) {
      const match = messageText.match(/^\/admin add (\d+)$/);
      if (!match) return bot.sendMessage(chatId, "❌ Invalid syntax. Use `/admin add <USER_ID>`.");

      const mentionedUserId = match[1];
      const userId = event.msg.from.id;

      // Check if the sender is an admin
      const senderInfo = await bot.getChatMember(chatId, userId);
      if (senderInfo.status !== "administrator" && senderInfo.status !== "creator") {
        return bot.sendMessage(chatId, "❌ You must be an admin or group creator to use this command.");
      }

      try {
        const userInfo = await bot.getChatMember(chatId, mentionedUserId);

        if (userInfo.status === "administrator") {
          return bot.sendMessage(chatId, `❌ User ID ${mentionedUserId} is already an admin.`);
        }

        // Promote the user with permissions
        await bot.promoteChatMember(chatId, mentionedUserId, {
          can_change_info: true,
          can_post_messages: true,
          can_edit_messages: true,
          can_delete_messages: true,
          can_invite_users: true,
          can_restrict_members: true,
          can_pin_messages: true,
          can_promote_members: false,
        });

        bot.sendMessage(
          chatId,
          `✅ Successfully added User ID ${mentionedUserId} as an admin.`,
          { parse_mode: "MarkdownV2" }
        );
      } catch (error) {
        console.error("Error promoting user:", error);
        bot.sendMessage(chatId, `❌ Error: Unable to add User ID ${mentionedUserId} as an admin.`);
      }
    } else if (messageText.startsWith("/admin remove")) {
      const match = messageText.match(/^\/admin remove (\d+)$/);
      if (!match) return bot.sendMessage(chatId, "❌ Invalid syntax. Use `/admin remove <USER_ID>`.");

      const mentionedUserId = match[1];
      const userId = event.from.id;

      // Check if the sender is an admin
      const senderInfo = await bot.getChatMember(chatId, userId);
      if (senderInfo.status !== "administrator" && senderInfo.status !== "creator") {
        return bot.sendMessage(chatId, "❌ You must be an admin or group creator to use this command.");
      }

      try {
        const userInfo = await bot.getChatMember(chatId, mentionedUserId);

        if (userInfo.status !== "administrator") {
          return bot.sendMessage(chatId, `❌ User ID ${mentionedUserId} is not an admin.`);
        }

        // Demote the user
        await bot.promoteChatMember(chatId, mentionedUserId, {
          can_change_info: false,
          can_post_messages: false,
          can_edit_messages: false,
          can_delete_messages: false,
          can_invite_users: false,
          can_restrict_members: false,
          can_pin_messages: false,
          can_promote_members: false,
        });

        bot.sendMessage(
          chatId,
          `✅ Successfully removed User ID ${mentionedUserId} as an admin.`,
          { parse_mode: "MarkdownV2" }
        );
      } catch (error) {
        console.error("Error demoting user:", error);
        bot.sendMessage(chatId, `❌ Error: Unable to remove User ID ${mentionedUserId} as an admin.`);
      }
    } else {
      bot.sendMessage(chatId, "❌ Invalid command. Use `/admin add <USER_ID>` or `/admin remove <USER_ID>`.");
    }
  },
};
