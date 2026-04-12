const axios = require("axios");

module.exports = {
  event: "new_chat_members",

  handle: async ({ msg, bot, moments }) => {
    try {
      const chatId = msg.chat.id;
      const newUser = msg.new_chat_members[0];

      const timestamp = moments.tz("Asia/Dhaka").format("hh:mm:ss");
      const joinDate = new Date(msg.date * 1000).toLocaleDateString();

      const profile = await global.userInfo(newUser.username);

      const imageUrl = profile?.image;

      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
     const photoBuffer = Buffer.from(img.data);

      const welcomeMessage = `
🎉 Hai ${newUser.username || newUser.first_name}! 🎉
Welcome to the group ${msg.chat.title}.
Hour: ${timestamp}
Day: ${joinDate}
Hope you enjoy your stay. 😊
`;

      await bot.sendPhoto(chatId, photoBuffer, { caption: welcomeMessage });

    } catch (err) {
      console.error("WELCOME ERROR:", err);
    }
  }
};
