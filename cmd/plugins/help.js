module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands", "cmds"],
    version: "1.0.0",
    permission: 0,
    prefix: true,
    description: "Interactive help menu with buttons",
    category: "utility",
    usages: "/help",
  },

  start: async ({ event, api, pluginsLoad }) => {
    const chatId = event.msg.chat.id;
    const userId = event.msg.from.id;

    const commandsPerPage = 8;
    const commands = pluginsLoad.map(p => p.config);
    const totalPages = Math.ceil(commands.length / commandsPerPage);

    const createPageText = (page) => {
      const start = (page - 1) * commandsPerPage;
      const end = start + commandsPerPage;
      const pageCommands = commands.slice(start, end);

      let text = `📜 *Help Menu* (Page ${page}/${totalPages})\n\n`;
      pageCommands.forEach((plugin, i) => {
        const permissionMsg = plugin.permission === 2 ? "⚠️ Admin only" : "✅ Everyone";
        const aliasesMsg = plugin.aliases?.length ? plugin.aliases.join(", ") : "None";

        text += `*${start + i + 1}. ${global.config.prefix}${plugin.name}*\n`;
        text += `   📌 ${plugin.description || "No description"}\n`;
        text += `   👤 ${permissionMsg}\n`;
        text += `   📝 Aliases: ${aliasesMsg}\n`;
        text += `   👑 Credits: ${plugin.credits || "Unknown"}\n\n`;
      });

      text += `💡 Use buttons below to navigate pages.`;
      return text;
    };

    const createKeyboard = (page) => {
      const buttons = [];
      if (page > 1) buttons.push({ text: "⬅️ Previous", callback_data: `help:${userId}:prev:${page - 1}` });
      if (page < totalPages) buttons.push({ text: "➡️ Next", callback_data: `help:${userId}:next:${page + 1}` });
      return buttons.length ? { inline_keyboard: [buttons] } : {};
    };

    
    const sent = await api.sendMessage(chatId, createPageText(1), {
      reply_markup: createKeyboard(1),
      parse_mode: "Markdown",
    });

    
    global.client.handleButton.push({
      name: "help",
      messageID: sent.message_id,
      author: userId,
      data: { commands, commandsPerPage, totalPages, page: 1 },
      api,
      chatId,
      createPageText,
      createKeyboard
    });
  },

  handleButton: async ({ api, event, handleButton }) => {
    const chatId = handleButton.chatId;
    const userId = handleButton.author;
    const btn = event.button || event.data || "";
    const parts = btn.split(":");

    if (parts[0] !== "help") return;

    const type = parts[2];
    let page = parseInt(parts[3], 10);
    

    if (event.senderId.toString() !== userId.toString()) {
      return api.answerCallbackQuery(event.query.id, {
        text: "❌ Only the menu owner can use these buttons!",
        show_alert: true,
      });
    }

    
    if (type === "next" || type === "prev") {
      const text = handleButton.createPageText(page);
      const keyboard = handleButton.createKeyboard(page);

      await api.editMessageText(text, {
        chat_id: chatId,
        message_id: handleButton.messageID,
        reply_markup: keyboard,
        parse_mode: "Markdown",
      });

      return api.answerCallbackQuery(event.query.id);
    }
  },
};