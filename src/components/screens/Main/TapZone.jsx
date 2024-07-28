import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
	const [pendingTouches, setPendingTouches] = useState(0)
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
					// handle response if necessary
				} catch (error) {
					console.error('Error updating user:', error)
					// Rollback changes on error if necessary
				}
			}
		}, 300), // Debounce time in milliseconds
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

	const handleTouchStart = useCallback(e => {
		const now = Date.now()
		if (now - lastTapTimeRef.current > 100) {
			// Debounce threshold
			lastTapTimeRef.current = now
			const touches = e.touches.length
			setPendingTouches(prev => prev + touches)
		}
	}, [])

	useEffect(() => {
		if (pendingTouches > 0) {
			debouncedUpdate(pendingTouches)
			setPendingTouches(0) // Reset pending touches
		}
	}, [pendingTouches, debouncedUpdate])

	return (
		<div className='tap-zone' onTouchStart={handleTouchStart}>
			<img src={stage === 1 ? silverCoin : goldenCoin} alt='coin' />
		</div>
	)
}

export default TapZone
