import React, { useEffect, useRef } from 'react'
import style from './ProgressBar.module.css'

const ProgressBar = ({ min, max }) => {
	const progressBarRef = useRef(null)

	useEffect(() => {
		if (progressBarRef.current) {
			const now = Date.now()
			const minTime = new Date(min).getTime()
			const maxTime = new Date(max).getTime()
			const progressPercent = Math.min(
				((now - minTime) / (maxTime - minTime)) * 100,
				100
			)
			progressBarRef.current.style.width = `${progressPercent}%`
		}
	}, [min, max])

	return (
		<div className={style.progress_bar_container}>
			<p>0ч</p>
			<div ref={progressBarRef} className={style.progress_bar}></div>
			<p>24ч</p>
		</div>
	)
}

export default ProgressBar
