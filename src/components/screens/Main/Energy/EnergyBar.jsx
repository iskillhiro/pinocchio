import { useEffect } from 'react'

const EnergyBar = ({ currentEnergy, maxEnergy }) => {
	useEffect(() => {
		const progressPercent = (currentEnergy / maxEnergy) * 100
		document.querySelector('.progress-bar').style.width = `${progressPercent}%`
	}, [currentEnergy, maxEnergy])

	return (
		<div className='progress-bar-container'>
			<div className='progress-bar'></div>
		</div>
	)
}

export default EnergyBar
