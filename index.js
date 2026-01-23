import TelegramBot from "node-telegram-bot-api";
import YTDlpWrap from "yt-dlp-wrap";
import fs from "fs";
import ffmpegPath from "ffmpeg-static";

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const ytDlp = new YTDlpWrap();

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🎵 Send a YouTube link and I’ll convert it to MP3"
  );
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const url = msg.text;

  if (!url || !url.startsWith("http")) return;

  const output = `song_${chatId}.mp3`;

  bot.sendMessage(chatId, "⏳ Downloading audio...");

  try {
    await ytDlp.exec([
      url,
      "-x",
      "--audio-format", "mp3",
      "--audio-quality", "192K",
      "--ffmpeg-location", ffmpegPath,
      "-o", output
    ]);

    await bot.sendAudio(chatId, fs.createReadStream(output));
    fs.unlinkSync(output);

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Failed to download audio");
  }
});

console.log("Bot is running...");