module.exports = {
  config: {
    name: "group",
    credits: "Nayan",
    prefix: true,
    permission: 0,
    aliases: ["grp"],
    description: "Group Management",
    tags: ["Group"],
  },

  start: async ({ event, api, isGroup }) => {
    const chatId = event.message.chat.id;
    const userId = event.message.from.id;

    if(!isGroup(event.msg)){
      return api.sendMessage(chatId, "❌ This command can only be used in groups.");
      
    }
    try {
      
      const admins = await api.getChatAdministrators(chatId);
      const isAdmin = admins.some((admin) => admin.user.id === userId);

      if (!isAdmin) {
        await api.sendMessage(chatId, "❌ You must be an admin to use this command.", {
          reply_to_message_id: event.message.message_id,
        });
        return;
      }

      
      await api.sendMessage(chatId, "Please select a group function:", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Change Group Bio", callback_data: "change_bio" },
              { text: "Change Group Photo", callback_data: "change_photo" },
            ],
            [
              { text: "View Group Info", callback_data: "view_info" },
              { text: "Show Group Name", callback_data: "group_name" },
            ],
          ],
        },
      });

      
      api.on("callback_query", async (query) => {
        const callbackChatId = query.message.chat.id;
        const callbackUserId = query.from.id;
        const callbackData = query.data;

        
        if (callbackChatId !== chatId) return;

        try {
          
          const callbackAdmins = await api.getChatAdministrators(callbackChatId);
          const isCallbackAdmin = callbackAdmins.some((admin) => admin.user.id === callbackUserId);

          if (!isCallbackAdmin) {
            await api.answerCallbackQuery(query.id, {
              text: "❌ You must be an admin to perform this action.",
              show_alert: true,
            });
            return;
          }

          
          switch (callbackData) {
            case "change_bio":
              await api.sendMessage(callbackChatId, "Please send the new group bio.");
              api.once("message", async (msg) => {
                if (msg.chat.id === callbackChatId) {
                  await api.setChatDescription(callbackChatId, msg.text);
                  await api.sendMessage(callbackChatId, "✅ Group bio updated successfully.");
                }
              });
              break;

            case "change_photo":
              await api.sendMessage(callbackChatId, "Please send the new group photo.");
              api.once("photo", async (msg) => {
                if (msg.chat.id === callbackChatId) {
                  const fileId = msg.photo[msg.photo.length - 1].file_id;
                  await api.setChatPhoto(callbackChatId, fileId);
                  await api.sendMessage(callbackChatId, "✅ Group photo updated successfully.");
                }
              });
              break;

            case "view_info":
              const members = await api.getChatAdministrators(callbackChatId);
              let memberList = "👥 Group Admins:\n";
              members.forEach((admin) => {
                memberList += `- ${admin.user.first_name} (@${admin.user.username || "N/A"})\n`;
              });
              await api.sendMessage(callbackChatId, memberList);
              break;

            case "group_name":
              const group = await api.getChat(callbackChatId);
              await api.sendMessage(callbackChatId, `📛 *Group Name:* ${group.title}`, { parse_mode: "Markdown" });
              break;

            default:
              await api.answerCallbackQuery(query.id, {
                text: "❌ Unknown action.",
                show_alert: true,
              });
          }

          
          await api.answerCallbackQuery(query.id);
        } catch (error) {
          
          await api.sendMessage(callbackChatId, "❌ An error occurred while processing your request.");
        }
      });
    } catch (error) {
      
      await api.sendMessage(chatId, "❌ An error occurred while processing the command.", {
        reply_to_message_id: event.message.message_id,
      });
    }
  },
};
