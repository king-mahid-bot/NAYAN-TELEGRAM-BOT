# 🎬 NAYAN-WHATSAPP-BOT Full Setup Guide

Welcome to **NAYAN-WHATSAPP-BOT**! This guide will help you set up your WhatsApp bot with **pair code login**.

---

## 1️⃣ Requirements

- Node.js v18 or higher
- NPM
- WhatsApp account
- Browser (Chrome/Edge/Firefox)

---

## 2️⃣ Clone the Bot Repository

Clone the GitHub repository:

```bash
git clone https://github.com/MOHAMMAD-NAYAN-07/NAYAN-WHATSAPP-BOT.git
cd NAYAN-WHATSAPP-BOT
```

Install dependencies:

```bash
npm install
```

---

## 3️⃣ Start the Pair Code Generator Server

The bot uses a separate pair code generator server hosted on Render:

```bash
npm run start
```

Or visit:

```
https://nayan-whatsapp-bot-paircode.onrender.com
```

> The server provides **Pair Code** and **QR Code** login options.

---

## 4️⃣ Generate Pair Code

1. Open your browser and visit:

```
https://nayan-whatsapp-bot-paircode.onrender.com
```

2. Ensure **Pair Code** mode is selected (toggle at top).

3. Enter your WhatsApp number with country code, e.g.:

```text
+8801615298449
```

4. Click **Generate Pair Code**.

5. Copy the pair code safely.  
⚠️ Do **not share this code** with anyone.

---

## 5️⃣ Save `creds.json`

After pairing, the server will generate a `creds.json` file.

1. Download `creds.json`.

2. Place it in the **session folder** of your bot:

```
NAYAN-WHATSAPP-BOT/session/creds.json
```

> ⚠️ This file contains your WhatsApp credentials. Keep it safe!

---

## 6️⃣ Run the Bot

Start the bot:

```bash
npm start
```

If `creds.json` is placed correctly, the bot will connect automatically.

---

## 7️⃣ Additional Resources

- **YouTube Full Setup Guide**:

```
https://youtu.be/-oz_u1iMgf8
```

- **Join Support Group**:

```
https://t.me/TEAM_X4X_CHAT
```

---

## ⚠️ Security Notice

Do not share `creds.json` or your pair code with anyone.  
Unauthorized access may compromise your WhatsApp account.

---

© 2025 **Mohammad Nayan**
