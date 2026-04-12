module.exports.config = {
  name: "rules",
  aliases: ["rule"],
  version: "1.0.0",
  permission: 0,
  prefix: true,
  description: "Add, remove, or view chat rules",
  category: "admin",
  usages: "/rules add <text> | /rules remove <index> | /rules list | /rules",
  cooldowns: 3,
};

const FILE_NAME = "rules.json";

module.exports.start = async ({ event, api, isGroup}) => {
  const chatId = event.message.chat.id;
  const text = event.message.text.trim();
  const args = text.split(" ").slice(1);
  const action = args[0]?.toLowerCase();
  const {message } = event;

  if(!isGroup(event.msg)){
    return api.sendMessage(chatId, "❌ This command can only be used in groups.", {reply_to_message_id: message.message_id});

  }

  const isAdmin = await event.isAdmin;


  let rules = await global.data.get(FILE_NAME) || {};
  rules[chatId] = rules[chatId] || [];


  if (rules[chatId].length === 0) {
    rules[chatId].push("Welcome! Please follow the chat rules.");
    await global.data.set(FILE_NAME, rules);
  }

  if (!action || action === "list") {
    let msg = "📜 *Chat Rules:*\n\n";
    rules[chatId].forEach((rule, i) => {
      msg += `${i + 1}. ${rule}\n`;
    });
    return api.sendMessage(chatId, msg, { parse_mode: "Markdown", reply_to_message_id: message.message_id });
  }

  if (action === "add") {

    if (!isAdmin) {
      return api.sendMessage(chatId, "❌ You don't have permission to add rules.", {reply_to_message_id: message.message_id})
    }
    const ruleText = args.slice(1).join(" ");
    if (!ruleText) return api.sendMessage(chatId, "❌ Please provide the rule text.", {reply_to_message_id: message.message_id});
    rules[chatId].push(ruleText);
    await global.data.set(FILE_NAME, rules);
    return api.sendMessage(chatId, `✅ Rule added:\n${ruleText}`, {reply_to_message_id: message.message_id});
  }

  if (action === "remove") {
    if (!isAdmin) {
      return api.sendMessage(chatId, "❌ You don't have permission to remove rules.", {reply_to_message_id: message.message_id})
    }
    const index = parseInt(args[1]);
    if (isNaN(index) || index < 1 || index > rules[chatId].length) {
      return api.sendMessage(chatId, "❌ Invalid rule number.", {reply_to_message_id: message.message_id});
    }
    const removed = rules[chatId].splice(index - 1, 1);
    await global.data.set(FILE_NAME, rules);
    return api.sendMessage(chatId, `🗑️ Removed rule: ${removed[0]}`, {reply_to_message_id: message.message_id});
  }

  return api.sendMessage(chatId, "❌ Invalid action. Use add, remove, or list.", {reply_to_message_id: message.message_id});
};
