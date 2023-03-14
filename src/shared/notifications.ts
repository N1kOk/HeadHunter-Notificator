import { Telegraf } from 'telegraf'

const app = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

export function sendNotification(text: string) {
	return app.telegram.sendMessage(1687228973, text, {
		disable_web_page_preview: true,
	})
}
