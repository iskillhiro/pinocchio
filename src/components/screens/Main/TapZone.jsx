import React, { useCallback } from 'react'
import goldenCoin from '../../../assets/pictures/coins/golden/coin.svg'
import silverCoin from '../../../assets/pictures/coins/silver/coin.svg'
import axiosDB from '../../../utils/axios/axiosConfig'

const tg = window.Telegram.WebApp

const TapZone = ({
	telegramId,
	currentEnergy,
	setCurrentEnergy,
	energyReduction,
	stage,
	currentCoins,
	setCurrentCoins,
}) => {
	const handleTouchStart = useCallback(
		async e => {
			const touches = e.touches.length
			if (currentEnergy > 0) {
				const energySpent = energyReduction * touches
				const newEnergy = Math.max(0, currentEnergy - energySpent)
				setCurrentEnergy(newEnergy)

				const updatedCoins = currentCoins + energySpent

				try {
					const response = await axiosDB.put('/user/update', {
						telegramId,
						energy: newEnergy,
						...(stage === 1
							? { soldo: updatedCoins }
							: { zecchino: updatedCoins }),
					})

					if (stage === 1) {
						setCurrentCoins(response.data.soldo)
					} else {
						setCurrentCoins(response.data.zecchino)
					}
					setCurrentEnergy(response.data.energy)
				} catch (error) {
					console.error('Error updating user:', error)
				}

				if (tg.HapticFeedback) {
					tg.HapticFeedback.impactOccurred('light')
				}
			}
		},
		[
			telegramId,
			currentEnergy,
			energyReduction,
			stage,
			currentCoins,
			setCurrentEnergy,
			setCurrentCoins,
		]
	)

	return (
		<div className='tap-zone' onTouchStart={handleTouchStart}>
			<img src={stage === 1 ? silverCoin : goldenCoin} alt='coin' />
		</div>
	)
}

export default TapZone
