const axios = require("axios");

module.exports.config = {
  name: "gemini",
  aliases: [],
  description: "Chat with Gemini AI (text or text+image)",
  version: "1.0.0",
  permission: 0,
  prefix: true,
  category: "ai",
  usages: [
    "/gemini <message>",
    "/gemini <message> <image>"
  ]
};

module.exports.start = async ({ api, event, args }) => {
  const threadID = event.threadId;

  if (!args) return api.sendMessage(threadID, "❌ Please provide a prompt for Gemini.", {reply_to_message_id: event.msg.message_id});
  const text = args.join(" ").trim();

  

  const apiss = await axios.get(`https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/refs/heads/main/api.json`)
  const apis = apiss.data

  
  let url;
  if (event.message.reply_to_message && event.message.reply_to_message.photo) {
    const photo = event.message.reply_to_message.photo.pop();
    url = await api.getFileLink(photo.file_id);
  }

  let config;
  if (url) {

    const pimage = await axios.get(`${apis.gemini}/nayan/postimage?url=${url}`)
    
    config = {
      modelType: 'text_and_image',
      prompt: text,
      imageParts: [pimage.data.direct_link]
    };
  } else {
    
    config = {
      modelType: 'text_only',
      prompt: text
    };
  }

  try {
    const waitMsg = await api.sendMessage(threadID, "⏳ Contacting Gemini API....", {reply_to_message_id: event.msg.message_id})
    
    const { data } = await axios.post(
      apis.gemini+'/chat-with-gemini',
      config
    );

    const result = data.result || "❌ Gemini did not return a result.";

    await api.deleteMessage(threadID, waitMsg.message_id)

    return api.sendMessage(threadID, `💬 *Gemini AI Response:*\n\n${result}`, {
      parse_mode: "Markdown",
      reply_to_message_id: event.msg.message_id
    });
  } catch (err) {
    console.error(err);
    return api.sendMessage(threadID, "❌ Failed to contact Gemini API.", {reply_to_message_id: event.msg.message_id});
  }
};
