module.exports.config = {
  name: "prefix",
  aliases: ["pre", "pr"],
  permission: 0,
  credits: "Nayan",
  prefix: 'auto',
  description: "guide",
};

module.exports.start = async ({ event, api, config, match }) => {

  api.sendMessage(event.threadId, `✅ My prefix is: \`/\``, {
    parse_mode: 'Markdown',
  });
};
