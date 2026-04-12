const fs = require("fs");
const path = require("path");

const dbFile = path.join(__dirname, "../../Nayan/data/keyboard.json");


if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({ users: {} }, null, 2));
}

let db = JSON.parse(fs.readFileSync(dbFile));


if (!db.users || typeof db.users !== "object") {
  db.users = {};
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

function save() {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

function updateKeyboard(api, chatId, userId) {
  const user = db.users[userId];

  if (!user || !user.commands || user.commands.length === 0) {
    api.sendMessage(chatId, "❌ Your keyboard is now empty.", {
      reply_markup: { remove_keyboard: true }
    });
    return;
  }

  const rows = [];
  for (let i = 0; i < user.commands.length; i += 2) {
    rows.push(user.commands.slice(i, i + 2));
  }

  let list = user.commands
  .map((cmd, index) => `${index + 1}. ${cmd}`)
  .join("\n");

  api.sendMessage(chatId, `✅ Your keyboard updated.\n\nCommands:\n${list}`, {
    reply_markup: { keyboard: rows, resize_keyboard: true }
  });
}

module.exports.config = {
  name: "keyboardmarkup",
  aliases: ["kb"],
  version: "2.0",
  prefix: true
};

module.exports.start = async ({ event, api }) => {
  const msg = event.message;
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString(); 

  const args = msg.text.trim().split(" ").slice(1);
  const type = args[0];
  const value = args[1];


  if (!db.users[userId]) {
    db.users[userId] = { commands: [] };
    save();
  }

  const user = db.users[userId];

  if (!type) return api.sendMessage(chatId, "Usage: /keyboardmarkup add /help");

  if (type === "add") {
    if (!value) return api.sendMessage(chatId, "Specify a command.");
    if (!value.startsWith("/")) return api.sendMessage(chatId, "Use /command");

    if (!user.commands.includes(value)) {
      user.commands.push(value);
      save();
    }

    return updateKeyboard(api, chatId, userId);
  }

  if (type === "remove") {
    if (value === "all") {
      user.commands = [];
      save();
      return updateKeyboard(api, chatId, userId);
    }

    if (!value) return api.sendMessage(chatId, "Specify a command.");

    user.commands = user.commands.filter(cmd => cmd !== value);
    save();

    return updateKeyboard(api, chatId, userId);
  }

  api.sendMessage(chatId, "Invalid option.");
};
