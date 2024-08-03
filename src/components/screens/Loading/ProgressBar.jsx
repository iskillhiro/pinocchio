import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import style from './ProgressBar.module.css'

const ProgressBar = ({ min = 0, max = 100 }) => {
	const progressBarRef = useRef(null)
	const [progress, setProgress] = useState(min)
	const navigate = useNavigate()
	useEffect(() => {
		const interval = setInterval(() => {
			setProgress(prevProgress => {
				const newProgress = Math.min(prevProgress + 10, max)
				return newProgress
			})
		}, 100) // Обновляем каждую 100 мс

		// Останавливаем интервал, когда прогресс достигает максимума
		if (progress >= max) {
			clearInterval(interval)
			navigate('/main')
		}

		return () => clearInterval(interval)
	}, [progress, max])

	useEffect(() => {
		if (progressBarRef.current) {
			const progressPercent = Math.min((progress / max) * 100, 100)
			progressBarRef.current.style.width = `${progressPercent}%`
		}
	}, [progress, max])

	return (
		<div className={style.progress_bar_container}>
			<div ref={progressBarRef} className={style.progress_bar}></div>
		</div>
	)
}

export default ProgressBar
