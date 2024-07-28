import debounce from 'lodash.debounce'
import React, { useCallback, useRef, useState } from 'react'
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
	boostData,
	currentCoins,
	setCurrentCoins,
	updateUserData,
}) => {
	const [lastTapTime, setLastTapTime] = useState(0)
	const lastTapTimeRef = useRef(lastTapTime)

	const debouncedUpdate = useCallback(
		debounce(async touches => {
			if (tg.HapticFeedback) {
				tg.HapticFeedback.impactOccurred('light')
			}

			if (currentEnergy >= energyReduction) {
				const energySpent =
					new Date(boostData.dailyBoosts[1].endTime) > Date.now()
						? energyReduction * touches * 10
						: energyReduction * touches
				const newEnergy = Math.max(
					0,
					currentEnergy -
						(new Date(boostData.dailyBoosts[1].endTime) > Date.now()
							? energySpent / 10
							: energySpent)
				)

				setCurrentEnergy(newEnergy)

				const updatedCoins = currentCoins + energySpent
				setCurrentCoins(updatedCoins)

				try {
					const response = await axiosDB.put('/user/update', {
						telegramId,
						touches,
					})
				} catch (error) {
					console.error('Error updating user:', error)
					// В случае ошибки можно добавить логику для отката изменений на клиенте
				}
			}
		}, 300),
		[
			currentEnergy,
			energyReduction,
			boostData,
			currentCoins,
			setCurrentEnergy,
			setCurrentCoins,
			telegramId,
		]
	)

	const handleTouchStart = useCallback(
		e => {
			const now = Date.now()
			if (now - lastTapTimeRef.current > 100) {
				// 100ms debounce threshold
				lastTapTimeRef.current = now
				const touches = e.touches.length
				debouncedUpdate(touches)
			}
		},
		[debouncedUpdate]
	)

	return (
		<div className='tap-zone' onTouchStart={handleTouchStart}>
			<img src={stage === 1 ? silverCoin : goldenCoin} alt='coin' />
		</div>
	)
}

export default TapZone
