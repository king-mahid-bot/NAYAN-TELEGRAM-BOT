const axios = require("axios")

module.exports = {
  event: 'left_chat_member',
  handle: async ({ msg, bot }) => {
    const chatId = msg.chat.id;
    const leftUser = msg.left_chat_member;

    const profile = await global.userInfo(leftUser.username);

    const imageUrl = profile?.image;
    const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
     const photoBuffer = Buffer.from(img.data);

    
    const goodbyeGroupMessage = `
👋 *A member has left the group*:
It’s with a heavy heart that we bid farewell to ${leftUser.username} from the group *${msg.chat.title}*. 😢
We hope they’ll return someday. Take care, ${leftUser.username}! 🌟
`;

 
    bot.sendPhoto(chatId, photoBuffer, { caption: goodbyeGroupMessage, parse_mode: "Markdown" });

    
    const goodbyeUserMessage = `
👋 Goodbye, ${leftUser.username}! 😢
You have left the group *${msg.chat.title}*. 
We hope you had a great time with us and that you'll return one day! Take care, and we’ll miss you! ✨
`;

    bot.sendMessage(leftUser.id, goodbyeUserMessage, { parse_mode: "Markdown" });
  },
};
