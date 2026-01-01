import { Telegraf } from "telegraf";
import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";

ffmpeg.setFfmpegPath(ffmpegPath);

// 🔴 DIRECT TOKEN (yahin paste karo)
const bot = new Telegraf("7653619302:AAFC5awOLf0tBK7RcxYAb_wjH00FD2oYv84");

bot.start(ctx => {
  ctx.reply("👋 YouTube Shorts link bhejo (1080p download hoga)");
});

bot.on("text", async (ctx) => {
  const url = ctx.message.text;

  if (!ytdl.validateURL(url)) {
    return ctx.reply("❌ Invalid YouTube link!");
  }

  const status = await ctx.reply("⏳ Downloading...");

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");
    const file = `${title}.mp4`;

    const stream = ytdl(url, {
      quality: "highestvideo",
      filter: "audioandvideo"
    });

    ffmpeg(stream)
      .outputOptions(["-c copy"])
      .save(file)
      .on("end", async () => {
        const sent = await ctx.replyWithVideo({ source: file });

        // ✅ Auto delete after 10 seconds
        setTimeout(async () => {
          try {
            await ctx.deleteMessage(sent.message_id);
            fs.unlinkSync(file);
          } catch (e) {}
        }, 10000);

        await ctx.deleteMessage(status.message_id);
      });

  } catch (err) {
    console.error(err);
    ctx.reply("❌ Error while downloading video!");
  }
});

bot.launch();
console.log("🤖 Bot Running...");