import React, { useCallback, useRef } from 'react'
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
	// Use useRef to keep track of the timeout and prevent unnecessary re-renders
	const tapTimeout = useRef(null)
	const latestCoins = useRef(currentCoins)

	// Update the ref whenever currentCoins changes
	latestCoins.current = currentCoins

	// Debounced function for updating user data
	const debouncedUpdateUserData = useCallback(() => {
		if (tapTimeout.current) {
			clearTimeout(tapTimeout.current)
		}

		// Set a timeout to delay the API call
		tapTimeout.current = setTimeout(async () => {
			if (latestCoins.current >= 1000000) {
				updateUserData()
			}

			try {
				await axiosDB.put('/user/update', {
					telegramId,
				})
			} catch (error) {
				console.error('Error updating user:', error)
			}
		}, 300) // 300 ms debounce delay
	}, [telegramId, updateUserData])

	const handleTouchStart = useCallback(
		e => {
			const touches = e.touches.length

			if (currentEnergy >= energyReduction) {
				if (tg.HapticFeedback) {
					tg.HapticFeedback.impactOccurred('light')
				}

				const energySpent =
					new Date(boostData.dailyBoosts[1].endTime) > Date.now()
						? energyReduction * touches * 10
						: energyReduction * touches
				const newEnergy =
					new Date(boostData.dailyBoosts[1].endTime) > Date.now()
						? Math.max(0, currentEnergy - energySpent / 10)
						: Math.max(0, currentEnergy - energySpent)

				setCurrentEnergy(newEnergy)

				const updatedCoins = latestCoins.current + energySpent
				setCurrentCoins(updatedCoins)

				// Call the debounced function
				debouncedUpdateUserData()
			}
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
