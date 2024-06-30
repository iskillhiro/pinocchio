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
				setCurrentCoins(updatedCoins) // Оптимистическое обновление на клиенте

				try {
					const response = await axiosDB.put('/user/update', {
						telegramId,
						energy: newEnergy,
						...(stage === 1
							? { soldo: updatedCoins }
							: { zecchino: updatedCoins }),
					})

					// Фактическое обновление состояния после успешного ответа
					setCurrentEnergy(response.data.energy)
					if (stage === 1) {
						setCurrentCoins(response.data.soldo)
					} else {
						setCurrentCoins(response.data.zecchino)
					}
				} catch (error) {
					console.error('Error updating user:', error)
					// В случае ошибки можно добавить логику для отката изменений на клиенте
				}

				if (tg.HapticFeedback) {
					tg.HapticFeedback.impactOccurred('light')
				}
			}
		},
		[
			telegramId,
			currentEnergy,
			setCurrentEnergy,
			energyReduction,
			stage,
			currentCoins,
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
