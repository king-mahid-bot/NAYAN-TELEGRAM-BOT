

module.exports.config = {
  name: "lock",
  aliases: [],
  description: "Chat Lock System",
  version: "1.0.7",
  permission: 3,
  prefix: true,
  category: "moderation",
  usages: [
    "/lock",               
    "/lock types",         
    "/lock on <type>",     
    "/lock off <type>"     
  ]
};

module.exports.start = async ({ api, event, args }) => {
  const threadID = event.threadId;
  const lockDB = await global.data.get("lockDB.json") || {};

  args = Array.isArray(args) ? args : [];

  if (!lockDB[threadID]) lockDB[threadID] = {};

  const LOCK_TYPES = [
    "photo", "video", "audio", "sticker", "gif",
    "document", "voice", "url", "contact",
    "forward", "bots"
  ];

  const sub = args[0] ? String(args[0]).toLowerCase() : null;

  
  if (!sub) {
    const list = Object.entries(lockDB[threadID])
      .map(([k, v]) => `• ${k}: ${v ? "🔒 Locked" : "🔓 Unlocked"}`)
      .join("\n") || "No locks set.";

    return api.sendMessage(
      threadID,
      `🔐 *Chat Lock System*\n\n` +
      `👉 *Current Locks:*\n${list}\n\n` +
      `👉 *Available Lock Types:*\n${LOCK_TYPES.map(i => `• ${i}`).join("\n")}\n\n` +
      `📌 Usage:\n` +
      `• /lock types\n` +
      `• /lock status\n` +
      `• /lock on <type>\n` +
      `• /lock off <type>`,
      {reply_to_message_id: event.msg.message_id, parse_mode: "Markdown"}
    );
  }

  
  if (sub === "types") {
    return api.sendMessage(
      threadID,
      `🔐 *Available Lock Types:*\n${LOCK_TYPES.map(i => `• ${i}`).join("\n")}`, {reply_to_message_id: event.msg.message_id, parse_mode: "Markdown"}
    );
  }

  
  if (sub === "status") {
    console.log(lockDB)
    const statusList = LOCK_TYPES.map(type =>
      `• ${type}: ${lockDB[threadID][type] ? "🔒 Locked" : "🔓 Unlocked"}`
    ).join("\n");

    return api.sendMessage(
      threadID,
      `📊 *Current Lock Status*\n\n${statusList}`, {reply_to_message_id: event.msg.message_id, parse_mode: "Markdown"}
    );
  }

  
  if (sub === "on") {
    const type = args[1] ? String(args[1]).toLowerCase() : null;
    if (!type) return api.sendMessage(threadID, "❌ Please provide a lock type.", {reply_to_message_id: event.msg.message_id});
    if (!LOCK_TYPES.includes(type)) return api.sendMessage(threadID, "❌ Invalid lock type.", {reply_to_message_id: event.msg.message_id});

    lockDB[threadID][type] = true;
    global.data.set("lockDB.json", lockDB);

    return api.sendMessage(threadID, `🔒 Locked: *${type}*`, {reply_to_message_id: event.msg.message_id, parse_mode: "Markdown"});
  }

  
  if (sub === "off") {
    const type = args[1] ? String(args[1]).toLowerCase() : null;
    if (!type) return api.sendMessage(threadID, "❌ Please provide a lock type.", {reply_to_message_id: event.msg.message_id});
    if (!LOCK_TYPES.includes(type)) return api.sendMessage(threadID, "❌ Invalid lock type.", {reply_to_message_id: event.msg.message_id});

    lockDB[threadID][type] = false;
    global.data.set("lockDB.json", lockDB);

    return api.sendMessage(threadID, `🔓 Unlocked: *${type}*`, {reply_to_message_id: event.msg.message_id, parse_mode: "Markdown"});
  }

  
  return api.sendMessage(
    threadID,
    `❌ Invalid usage.\n\nUse:\n` +
    `• /lock\n` +
    `• /lock types\n` +
    `• /lock status\n` +
    `• /lock on <type>\n` +
    `• /lock off <type>`, {reply_to_message_id: event.msg.message_id}
  );
};
