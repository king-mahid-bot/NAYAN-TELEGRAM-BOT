const fs = require("fs");
const path = require("path");
const axios = require("axios");
const nayan = require("nayan-media-downloaders");
const Youtube = require("youtube-search-api");

module.exports = {
  config: {
    name: "song",
    aliases: ["a"],
    prefix: true,
    permission: 0,
    description: "Search and download songs with button selection.",
  },

  start: async function ({ api, event }) {
    const keyword = event.body;
    if (!keyword) {
      return api.sendMessage(
        event.threadId,
        "⚠️ Please provide a keyword.\nExample: `song Believer`",
        { reply_to_message_id: event.msg.message_id }
      );
    }

    const results = await Youtube.GetListByKeyword(keyword, false, 6);
    const list = results.items;

    if (!list.length) {
      return api.sendMessage(event.threadId, "❌ No results found.", {
        reply_to_message_id: event.msg.message_id,
      });
    }

    const buttons = list.map((item, i) => [
      {
        text: item.title.substring(0, 40) + "...",
        callback_data: `song_${i + 1}`,
      },
    ]);

    const msgTxt =
      `🎵 *Search Results for:* ${keyword}\n\n` +
      list
        .map(
          (item, i) =>
            `*${i + 1}. ${item.title}*\nDuration: ${item.length.simpleText}\n`
        )
        .join("\n");

    const sent = await api.sendMessage(
      event.threadId,
      msgTxt,
      {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: buttons },
        reply_to_message_id: event.msg.message_id,
      }
    );

    global.client.handleButton.push({
      name: this.config.name,
      messageID: sent.message_id,
      author: event.senderId,
      umsgid: event.msg.message_id,
      links: list.map((v) => v.id),
    });
  },

  handleButton: async function ({ api, event, handleButton }) {
    const links = handleButton.links;
    const btn = event.button;
    const index = parseInt(btn.split("_")[1]) - 1;

    const videoId = links[index];
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

   const waitMsg = await api.sendMessage(
      event.threadId,
      "⏳ Fetching audio...",
      { reply_to_message_id: handleButton.umsgid }
    );

    try {
      const data = await nayan.ytdown(videoUrl);
      const audioUrl = data.data.audio;
      const title = data.data.title;

      const filePath = path.join(__dirname, "Nayan", `cache_${Date.now()}.mp3`);
      const writer = fs.createWriteStream(filePath);

      const res = await axios.get(audioUrl, { responseType: "stream" });
      res.data.pipe(writer);

      writer.on("finish", async () => {

        await api.deleteMessage(event.threadId, waitMsg.message_id)
        await api.sendAudio(event.threadId, filePath, {
          caption: `🎧 *${title}*`,
          parse_mode: "Markdown",
          reply_to_message_id: handleButton.umsgid
        });

        fs.unlinkSync(filePath);
      });
    } catch (e) {
      console.log("Error:", e);
      api.sendMessage(event.threadId, "❌ Failed to download audio.", {
        reply_to_message_id: handleButton.umsgid,
      });
    }
  }
};
