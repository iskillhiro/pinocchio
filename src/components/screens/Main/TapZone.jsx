import React, { useCallback } from 'react'
import goldenCoin from '../../../assets/pictures/coins/golden/coin.svg'
import silverCoin from '../../../assets/pictures/coins/silver/coin.svg'
import axiosDB from '../../../utils/axios/axiosConfig'

const tg = window.Telegram.WebApp

const TapZone = ({
	// TODO: Переписать логику. Мы не должны брать тапы с клиента, тапы будут обрабатываться на сервере
	telegramId,
	currentEnergy,
	setCurrentEnergy,
	energyReduction,
	stage,
	boostData,
	currentCoins,
	setCurrentCoins,
	updateUserData,
}) => {
	if (currentCoins === 1000000 || currentCoins > 1000000) {
		updateUserData()
	}
	console.log(boostData)
	const handleTouchStart = useCallback(
		async e => {
			const touches = e.touches.length
			if (currentEnergy >= energyReduction) {
				const energySpent =
					new Date(boostData.dailyBoosts[1].endTime) > Date.now()
						? energyReduction * touches * 10
						: energyReduction * touches
				const newEnergy =
					new Date(boostData.dailyBoosts[1].endTime) > Date.now()
						? Math.max(0, currentEnergy - energySpent / 10)
						: Math.max(0, currentEnergy - energySpent)
				setCurrentEnergy(newEnergy)

				const updatedCoins = currentCoins + energySpent
				setCurrentCoins(updatedCoins) // Оптимистическое обновление на клиенте
				try {
					const response = await axiosDB.put('/user/update', {
						// TODO: ИСПРАВИТЬ
						telegramId,
						...{ touches },
					})
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
