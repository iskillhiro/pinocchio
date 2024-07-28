import React, { useEffect, useRef } from 'react'
import style from './ProgressBar.module.css'

const ProgressBar = ({ min, max }) => {
	const progressBarRef = useRef(null)

	useEffect(() => {
		if (progressBarRef.current) {
			const progressPercent = Math.min((min / max) * 100, 100)
			progressBarRef.current.style.width = `${progressPercent}%`
		}
	}, [min, max])

	return (
		<div className={style.progress_bar_container}>
			<div ref={progressBarRef} className={style.progress_bar}></div>
		</div>
	)
}

export default ProgressBar
