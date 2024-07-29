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
	const tapTimeout = useRef(null)
	const latestCoins = useRef(currentCoins)
	const [totalTaps, setTotalTaps] = useState(0)
	const pendingTaps = useRef(0)

	latestCoins.current = currentCoins

	const debouncedUpdateUserData = useCallback(() => {
		if (tapTimeout.current) {
			clearTimeout(tapTimeout.current)
		}

		tapTimeout.current = setTimeout(async () => {
			if (latestCoins.current >= 1000000) {
				updateUserData()
			}

			try {
				const touchesToSend = pendingTaps.current
				const response = await axiosDB.put('/user/update', {
					telegramId,
					touches: touchesToSend,
				})
				console.log('Server response:', response.data)

				pendingTaps.current = 0
				setTotalTaps(0)
			} catch (error) {
				console.error('Error updating user:', error)
			}
		}, 300)
	}, [telegramId, updateUserData])

	const handleTouchStart = useCallback(
		e => {
			const touches = e.touches ? e.touches.length : 0

			if (currentEnergy < energyReduction) {
				console.log(
					`Not enough energy for reduction. Current energy: ${currentEnergy}`
				)
				return
			}

			if (tg.HapticFeedback) {
				tg.HapticFeedback.impactOccurred('light')
			}

			const boostEndTime = new Date(boostData?.dailyBoosts?.[1]?.endTime || 0)
			const isBoostActive = boostEndTime > Date.now()
			const energySpent = isBoostActive
				? energyReduction * touches * 10
				: energyReduction * touches

			const newEnergy = Math.max(0, currentEnergy - energyReduction)
			const coinsToAdd = Math.max(0, energySpent)

			if (newEnergy === currentEnergy) {
				console.log(
					`Energy was not updated. Current energy: ${currentEnergy}, energy spent: ${energySpent}`
				)
				return
			}

			setCurrentEnergy(newEnergy)
			setCurrentCoins(latestCoins.current + coinsToAdd)

			pendingTaps.current += touches
			setTotalTaps(prev => prev + touches)

			debouncedUpdateUserData()
		},
		[
			currentEnergy,
			energyReduction,
			boostData,
			setCurrentEnergy,
			setCurrentCoins,
			debouncedUpdateUserData,
		]
	)

	return (
		<div className='tap-zone' onTouchStart={handleTouchStart}>
			<img src={stage === 1 ? silverCoin : goldenCoin} alt='coin' />
		</div>
	)
}

export default TapZone
