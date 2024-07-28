import React, { useEffect, useRef } from 'react'

const EnergyBar = ({ currentEnergy, maxEnergy }) => {
	const progressBarRef = useRef(null)

	useEffect(() => {
		if (progressBarRef.current) {
			const progressPercent = (currentEnergy / maxEnergy) * 100
			progressBarRef.current.style.width = `${progressPercent}%`
		}
	}, [currentEnergy, maxEnergy])

	return (
		<div className='progress-bar-container'>
			<div ref={progressBarRef} className='progress-bar'></div>
		</div>
	)
}

export default EnergyBar
