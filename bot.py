import os
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, ContextTypes, filters
import yt_dlp

BOT_TOKEN = os.environ.get("BOT_TOKEN")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Send YouTube Shorts link 🎥")

async def download(update: Update, context: ContextTypes.DEFAULT_TYPE):
    url = update.message.text
    await update.message.reply_text("Downloading...")

    ydl_opts = {
        'format': 'bv*[height<=1080]+ba/best',
        'merge_output_format': 'mp4',
        'outtmpl': 'video.%(ext)s',
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        await update.message.reply_video(
            video=open("video.mp4", "rb"),
            caption="✅ Done"
        )

    except Exception as e:
        await update.message.reply_text(str(e))

def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, download))

    app.run_polling()

if __name__ == "__main__":
    main()