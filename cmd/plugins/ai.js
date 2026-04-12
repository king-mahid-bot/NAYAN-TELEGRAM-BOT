const axios = require("axios");

module.exports.config = {
  name: "ai",
  aliases: [],
  description: "Chat with GPT AI",
  version: "1.0.0",
  permission: 0,
  prefix: true,
  category: "ai",
  usages: [
    "/ai <message>"
  ]
};

module.exports.start = async ({ api, event, args }) => {
  const threadID = event.threadId;
  if (!args) return api.sendMessage(threadID, "❌ Please provide a message for the AI.", {reply_to_message_id: event.msg.message_id});
  const text = args.join(" ").trim();

  

  const apiss = await axios.get(`https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/refs/heads/main/api.json`)
  const apis = apiss.data

  try {
    const { data } = await axios.get(`${apis.api}/nayan/gpt3?text=${encodeURIComponent(text)}`);

    if (data.status !== "Success" || !data.response)
      return api.sendMessage(threadID, "❌ Failed to get a response from GPT.", {reply_to_message_id: event.msg.message_id});

    return api.sendMessage(threadID, `💬 *AI Response:*\n\n${data.response}`, {
      parse_mode: "Markdown",
      reply_to_message_id: event.msg.message_id
    });
  } catch (err) {
    console.error(err);
    return api.sendMessage(threadID, "❌ Error contacting GPT-3 API.");
  }
};
