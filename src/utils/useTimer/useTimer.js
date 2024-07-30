import { useEffect, useState } from 'react'

const useTimer = endTime => {
	const [timeLeft, setTimeLeft] = useState(() => {
		const diff = new Date(endTime) - Date.now()
		return Math.max(0, Math.floor(diff / 1000))
	})

	useEffect(() => {
		const interval = setInterval(() => {
			const diff = new Date(endTime) - Date.now()
			setTimeLeft(Math.max(0, Math.floor(diff / 1000)))
		}, 1000)

		return () => clearInterval(interval)
	}, [endTime])

	return timeLeft
}

export default useTimer
