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
	const debouncedUpdateUserData = useCallback(
		touches => {
			console.log('Debounced update triggered with touches:', touches)

			if (tapTimeout.current) {
				console.log('Clearing previous timeout')
				clearTimeout(tapTimeout.current)
			}

			// Set a timeout to delay the API call
			tapTimeout.current = setTimeout(async () => {
				console.log('Performing update request to server...')
				if (latestCoins.current >= 1000000) {
					console.log('User has 1,000,000 or more coins. Updating user data...')
					updateUserData()
				}

				try {
					const response = await axiosDB.put('/user/update', {
						telegramId,
						touches: touches || 0,
					})
					console.log('Server response:', response.data)
				} catch (error) {
					console.error('Error updating user:', error)
				}
			}, 300) // 300 ms debounce delay
		},
		[telegramId, updateUserData]
	)

	const handleTouchStart = useCallback(
		e => {
			const touches = e.touches ? e.touches.length : 0
			console.log('handleTouchStart triggered with touches:', touches)

			if (currentEnergy >= energyReduction) {
				console.log(
					`Current energy (${currentEnergy}) is sufficient for reduction (${energyReduction}).`
				)

				if (tg.HapticFeedback) {
					tg.HapticFeedback.impactOccurred('light')
					console.log('Haptic feedback triggered')
				}

				// Handle boost data safely with nullish coalescing
				const boostEndTime = new Date(boostData?.dailyBoosts?.[1]?.endTime || 0)
				const isBoostActive = boostEndTime > Date.now()
				console.log('Boost status:', isBoostActive)

				const energySpent = isBoostActive
					? energyReduction * touches * 10
					: energyReduction * touches
				const newEnergy = isBoostActive
					? Math.max(0, currentEnergy - energySpent / 10)
					: Math.max(0, currentEnergy - energySpent)

				console.log('Energy spent:', energySpent)
				console.log('New energy level:', newEnergy)

				setCurrentEnergy(newEnergy)

				const updatedCoins = latestCoins.current + energySpent
				console.log('Updated coins:', updatedCoins)

				setCurrentCoins(updatedCoins)

				// Call the debounced function
				debouncedUpdateUserData(touches)
			} else {
				console.log(
					`Not enough energy (${currentEnergy}) for reduction (${energyReduction}).`
				)
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
