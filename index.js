import { Telegraf } from "telegraf";
import { exec } from "child_process";
import fs from "fs";

const bot = new Telegraf("PASTE_YOUR_BOT_TOKEN");

bot.start(ctx => {
  ctx.reply("👋 Send YouTube Shorts link");
});

bot.on("text", async (ctx) => {
  const url = ctx.message.text;
  const file = `video_${Date.now()}.mp4`;

  const msg = await ctx.reply("⏳ Downloading...");

  exec(
    `yt-dlp -f mp4 -o "${file}" "${url}"`,
    async (error) => {
      if (error) {
        console.error(error);
        return ctx.reply("❌ Download failed");
      }

      await ctx.replyWithVideo({ source: file });
      fs.unlinkSync(file);
      ctx.deleteMessage(msg.message_id);
    }
  );
});

bot.launch();
console.log("🤖 Bot Running...");
