import React from 'react'
import goldenCoin from '../../../assets/pictures/coins/golden/coin.svg'
import silverCoin from '../../../assets/pictures/coins/silver/coin.svg'

const tg = window.Telegram.WebApp

const TapZone = ({
	currentEnergy,
	setCurrentEnergy,
	energyReduction,
	state,
}) => {
	const handleTouchStart = e => {
		const touches = e.touches.length
		if (currentEnergy > 0) {
			setCurrentEnergy(prev => Math.max(0, prev - energyReduction * touches))
			if (tg.HapticFeedback) {
				tg.HapticFeedback.impactOccurred('light')
			}
		}
	}

	return (
		<div className='tap-zone' onTouchStart={handleTouchStart}>
			<img src={state === 1 ? silverCoin : goldenCoin} alt='coin' />
		</div>
	)
}

export default TapZone
