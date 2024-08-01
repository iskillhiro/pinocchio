export const getId = () => {
	let tg = window.Telegram.WebApp
	if (tg) {
		const TELEGRAM_ID = tg.initData.user.id
		return TELEGRAM_ID
	}
	// const TELEGRAM_ID = '1145622789'
	// const TELEGRAM_ID = '6412147982'
}
