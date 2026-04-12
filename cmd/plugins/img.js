const axios = require("axios");
const FormData = require("form-data");

module.exports.config = {
  name: "img",
  aliases: ["image", "editimg"],
  version: "1.0.0",
  permission: 0,
  credits: "Nayan",
  prefix: true,
  description: "AI Image Processing Tools",
  category: "tools",
  usages: "/img (reply an image)",
  cooldowns: 5,
};

module.exports.start = async ({ event, api }) => {
  const { message } = event;
  const chatId = message.chat.id;

  if (!message.reply_to_message || !message.reply_to_message.photo || message.reply_to_message.photo.length === 0) {
    return api.sendMessage(chatId, "⚠️ Please reply to an image.", { reply_to_message_id: message.message_id });
  }

  const photo = message.reply_to_message.photo.pop();
  const fileId = photo.file_id;

  const buttons = [
    [{ text: "Upscale", callback_data: "/img/upscale" }, { text: "Enhance", callback_data: "/img/enhance" }],
    [{ text: "Remove Text", callback_data: "/img/rmtext" }, { text: "Watermark Remove", callback_data: "/img/rmwtmk" }],
    [{ text: "OCR (Get Text)", callback_data: "/img/ocr" }, { text: "Remove Background", callback_data: "/img/rmbg" }],
    [{ text: "AI Edit", callback_data: "/img/ai" }]
  ];

  const sent = await api.sendMessage(chatId, "📸 Select AI Image Tool:", { reply_markup: { inline_keyboard: buttons } });

  global.client.handleButton.push({
    name: "img",
    messageID: sent.message_id,
    author: message.from.id,
    data: { fileId, replyTo: message.message_id }
  });
};

module.exports.handleButton = async ({ api, event, handleButton }) => {
  try {
    const chatId = event.threadId || event.message.chat.id;
    const btn = event.button || event.data || "";
    const { fileId, replyTo } = handleButton.data;

    const waitMsg = await api.sendMessage(chatId, "⏳ Processing image...", { reply_to_message_id: replyTo });

    const apis = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json");
    const base = apis.data.api;
    const uploadUrl = apis.data.gemini + "/nayan/postimage";

    const fileLink = await api.getFileLink(fileId);
    const img = await axios.get(fileLink, { responseType: "arraybuffer" });
    const form = new FormData();
    form.append("image", Buffer.from(img.data), "photo.jpg");

    const upload = await axios.post(uploadUrl, form, { headers: form.getHeaders() });
    const uploaded = upload.data.direct_link;
    global.message(`Image uploaded: ${uploaded}`, `IMAGE UPLOADED`, `cyan`, `double`, `#1a1a1a`)
    const encoded = encodeURIComponent(uploaded);

    if (btn === "/img/ai") {
      const sent = await api.sendMessage(chatId, "📝 Send your AI Generation Prompt", { reply_to_message_id: replyTo });
      global.client.handleReply.push({
        name: "img",
        messageID: sent.message_id,
        author: event.senderId,
        data: { url: encoded, replyTo },
        type: "ai-edit"
      });
      await api.deleteMessage(chatId, waitMsg.message_id);
      return;
    }

    const apiMap = {
      "/img/upscale": { url: `${base}/nayan/upscale?url=${encoded}`, type: "Upscaled" },
      "/img/enhance": { url: `${base}/nayan/enhanced?url=${encoded}`, type: "Enhanced" },
      "/img/rmtext": { url: `${base}/nayan/rmtext?url=${encoded}`, type: "Text Removed" },
      "/img/rmwtmk": { url: `${base}/nayan/rmwtmk?url=${encoded}`, type: "Watermark Removed" },
      "/img/ocr": { url: `${base}/nayan/ocr?url=${encoded}`, type: "OCR" },
      "/img/rmbg": { url: `${base}/nayan/rmbg?url=${encoded}`, type: "Background Removed" }
    };

    if (!apiMap[btn]) {
      await api.deleteMessage(chatId, waitMsg.message_id);
      return api.sendMessage(chatId, "❌ Invalid option.");
    }

    const res = await axios.get(apiMap[btn].url);

    if (btn === "/img/ocr") {
      await api.deleteMessage(chatId, waitMsg.message_id);
      if (!res.data.text) return api.sendMessage(chatId, "❌ Could not extract text.");
      return api.sendMessage(chatId, `📄 Extracted Text:\n\n${res.data.text}`, { reply_to_message_id: replyTo });
    }

    const out = res.data.upscaled || res.data.enhanced_image || res.data.removed_text_image || res.data.watermark_removed_image || res.data.removed_background_image;

    global.message(`Image Process Done
    Link: ${out}`,`IMAGE PROCESSED`, `cyan`, `double`, `#1a1a1a`)
    if (!out) {
      await api.deleteMessage(chatId, waitMsg.message_id);
      return api.sendMessage(chatId, "❌ Failed to process image.");
    }

    const processed = await axios.get(out, { responseType: "arraybuffer" });
    await api.deleteMessage(chatId, waitMsg.message_id);
    return api.sendPhoto(chatId, processed.data, { caption: `✔️ ${apiMap[btn].type}`, reply_to_message_id: replyTo });

  } catch (err) {
    console.log(err);
    api.sendMessage(event.threadId, "❌ Error processing image.");
  }
};

module.exports.handleReply = async ({ api, event, handleReply }) => {

  if (handleReply.type !== "ai-edit") return;
  if (event.senderId !== handleReply.author) return;

  const { url, replyTo } = handleReply.data;
  const prompt = event.body.trim();
  if (!prompt) return api.sendMessage(event.threadId, "❌ Prompt cannot be empty.", { reply_to_message_id: event.msg.message_id });

  const waitMsg = await api.sendMessage(event.threadId, "⏳ Generating AI Image...", { reply_to_message_id: replyTo });
  try {
    const apis = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json");
    const base = apis.data.api;

    const mainAPI = `${base}/nayan/ai-generate?url=${url}&prompt=${prompt}`;
    const fallbackAPI = `${base}/nayan/ai-generate2?url=${url}&prompt=${prompt}`;



    let res = await axios.get(mainAPI);

            if (!res.data || res.data.error || !res.data.generated_image) {
                console.log("⚠ Main API failed. Using fallback...");
                res = await axios.get(fallbackAPI);
            }

    const out = res.data.generated_image
    global.message(`Image Process Done
    Link: ${out}`,`IMAGE PROCESSED`, `cyan`, `double`, `#1a1a1a`)

    if (!out) return api.sendMessage(event.threadId, "❌ AI edit failed.", { reply_to_message_id: replyTo });

    const processed = await axios.get(out, { responseType: "arraybuffer" });
    await api.deleteMessage(event.threadId, waitMsg.message_id);
    return api.sendPhoto(event.threadId, processed.data, { caption: "✔️ AI Edit Completed", reply_to_message_id: replyTo });

  } catch (err) {
    console.log(err);
    await api.deleteMessage(event.threadId, waitMsg.message_id);
    return api.sendMessage(event.threadId, "❌ Error generating AI image.", { reply_to_message_id: replyTo });
  }
};
