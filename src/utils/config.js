export const getId = () => {
	let tg = window.Telegram.WebApp
	const TELEGRAM_ID = tg.initDataUnsafe.user.id
	return TELEGRAM_ID
}
