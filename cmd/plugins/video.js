const axios = require("axios");

module.exports.config = {
  name: "video2",
  aliases: ["album"],
  version: "1.0.0",
  permission: 0,
  credits: "Nayan",
  prefix: true,
  description: "Get various types of videos via inline keyboard",
  category: "media",
  usages: "/video or /videos",
  cooldowns: 5,
};

module.exports.start = async ({ event, api }) => {
  const { message } = event;
  const chatId = message.chat.id;

  const buttons = [
    [
      { text: 'Love', callback_data: '/video/love' },
      { text: 'CPL', callback_data: '/video/cpl' }
    ],
    [
      { text: 'Short Video', callback_data: '/video/shortvideo' },
      { text: 'Sad Video', callback_data: '/video/sadvideo' }
    ],
    [
      { text: 'Status', callback_data: '/video/status' },
      { text: 'Shairi', callback_data: '/video/shairi' }
    ],
    [
      { text: 'Baby', callback_data: '/video/baby' },
      { text: 'Anime', callback_data: '/video/anime' }
    ],
    [
      { text: 'Humaiyun', callback_data: '/video/humaiyun' },
      { text: 'Islam', callback_data: '/video/islam' }
    ],
    [
      { text: 'Random', callback_data: '/video/mixvideo' }
    ]
  ];

  const waitMsg = await api.sendMessage(chatId, "Select Video Type", { reply_markup: { inline_keyboard: buttons } });

  
  global.client.handleButton.push({
    messageID: waitMsg.message_id,
    author: message.from.id,
    name: "video2",
    data: { replyTo: message.message_id }
  });
};

module.exports.handleButton = async ({ api, event, handleButton }) => {
  const chatId = event.threadId;
  const name = event.button;
  const { replyTo } = handleButton.data;

  const waitMsg = await api.sendMessage(chatId, "Please wait...", { reply_to_message_id: replyTo });

  try {
    const apis = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json');
    const n = apis.data.api;
    const data = await axios.get(`${n}${name}`);
    const url = data.data.data || data.data.url?.url;
    const caption = data.data.nayan || `${data.data.cp}`;

    const replyMarkup = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Bot Owner', url: 'https://t.me/MOHAMMADNAYAN' }]
        ]
      }
    };

    await api.sendVideo(chatId, url, { caption, reply_to_message_id: replyTo, ...replyMarkup });
    await api.deleteMessage(chatId, waitMsg.message_id);

  } catch (error) {
    await api.deleteMessage(chatId, waitMsg.message_id);
    console.error('Error fetching video:', error);
    api.sendMessage(chatId, "❌ Failed to fetch video. Try again later.", { reply_to_message_id: replyTo });
  }
};
