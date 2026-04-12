module.exports = {
  config: {
    name: "user",
    aliases: [],
    prefix: true,
    permission: 2,
    description: "Ban or unban a user",
  },

  start: async ({ event, api }) => {
    const msg = event.msg;
    const chatId = msg.chat.id;
    const text = event.body || "";

    if (!text) {
      return api.sendMessage(chatId, 
        "❌ Usage:\n/user ban @username \n/user unban @username", 
        { reply_to_message_id: msg.message_id }
      );
    }

    const [action, mention, ...reasonArr] = text.split(" ");
    const reason = reasonArr.join(" ") || "No reason provided";

    if (!mention || !mention.startsWith("@")) {
      return api.sendMessage(chatId, "❌ Please mention a valid username.", { reply_to_message_id: msg.message_id });
    }

    const username = mention.replace("@", "").toLowerCase();
    const fileName = "userBan.json";

    // Load banned users from global.data
    let bannedUsers = await global.data.get(fileName) || {};

    if (action.toLowerCase() === "ban") {
      bannedUsers[username] = {
        reason,
        time: new Date().toLocaleString()
      };
      await global.data.set(fileName, bannedUsers);

      return api.sendMessage(chatId, 
        `✅ User @${username} has been banned.\nReason: ${reason}`, 
        { reply_to_message_id: msg.message_id }
      );
    }

    if (action.toLowerCase() === "unban") {
      if (bannedUsers[username]) {
        delete bannedUsers[username];
        await global.data.set(fileName, bannedUsers);
        return api.sendMessage(chatId, `✅ User @${username} has been unbanned.`, { reply_to_message_id: msg.message_id });
      } else {
        return api.sendMessage(chatId, `❌ User @${username} is not banned.`, { reply_to_message_id: msg.message_id });
      }
    }

    return api.sendMessage(chatId, "❌ Invalid action. Use 'ban' or 'unban'.", { reply_to_message_id: msg.message_id });
  }
};
