import os
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes
import yt_dlp

BOT_TOKEN = os.environ.get("BOT_TOKEN")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Send YouTube Shorts link\n🎥 Max Quality: 1080p"
    )

async def download_short(update: Update, context: ContextTypes.DEFAULT_TYPE):
    url = update.message.text

    if "youtube.com" not in url and "youtu.be" not in url:
        await update.message.reply_text("❌ Invalid YouTube link")
        return

    await update.message.reply_text("⏳ Downloading 1080p...")

    ydl_opts = {
        'format': 'bv*[height<=1080]+ba/best',
        'merge_output_format': 'mp4',
        'outtmpl': 'video.%(ext)s',
        'quiet': True
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        await update.message.reply_video(
            video=open("video.mp4", "rb"),
            caption="✅ 1080p Downloaded"
        )

        os.remove("video.mp4")

    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")

def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, download_short))
    app.run_polling()

if __name__ == "__main__":
    main()