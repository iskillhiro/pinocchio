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
	const [taps, setTaps] = useState([])
	const pendingTaps = useRef(0)
	const [boostActive, setBoostActive] = useState(false)
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

				pendingTaps.current = 0
				setTotalTaps(0)
			} catch (error) {
				console.error('Error updating user:', error)
			}
		}, 350)
	}, [telegramId, updateUserData, boostActive])

	const handleTouchStart = useCallback(
		e => {
			const touches = e.touches ? e.touches.length : 0

			const boostEndTime = new Date(boostData?.dailyBoosts?.[1]?.endTime || 0)
			const isBoostActive = boostEndTime > Date.now()
			setBoostActive(isBoostActive)

			// If not enough energy and boost is not active, return early
			if (currentEnergy < energyReduction && !isBoostActive) {
				console.log(
					`Not enough energy for reduction. Current energy: ${currentEnergy}`
				)
				return
			}

			if (tg.HapticFeedback) {
				tg.HapticFeedback.impactOccurred('light')
			}

			// If boost is active, energySpent is 0, and newEnergy remains the same
			const energySpent = isBoostActive ? 0 : energyReduction * touches
			const newEnergy = isBoostActive
				? currentEnergy
				: Math.max(0, currentEnergy - energyReduction * touches)

			const coinsToAdd = energyReduction * touches * (isBoostActive ? 10 : 1)

			// Calculate tap positions
			const newTaps = []
			for (let i = 0; i < touches; i++) {
				const { clientX, clientY } = e.touches[i]
				const rect = e.target.getBoundingClientRect()

				if (!rect) {
					console.error('Unable to get bounding rect')
					continue
				}

				const newTap = {
					id: Date.now() + i,
					x: clientX - rect.left,
					y: clientY - rect.top,
				}

				newTaps.push(newTap)
			}

			setTaps(prevTaps => [...prevTaps, ...newTaps])

			// Remove tap animations after 1 second
			setTimeout(() => {
				setTaps(prevTaps =>
					prevTaps.filter(tap => !newTaps.some(newTap => newTap.id === tap.id))
				)
			}, 1000)

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

	if (boostData) {
		return (
			<div className='tap-zone' onTouchStart={handleTouchStart}>
				{boostData.upgradeBoosts[4].level === 2 ? (
					<img src='/boosts/skin.svg' alt='skin' />
				) : (
					<img src={stage === 1 ? silverCoin : goldenCoin} alt='coin' />
				)}

				{taps.map(tap => (
					<span
						key={tap.id}
						className='tap_number'
						style={{ top: `${tap.y + 70}px`, left: `${tap.x}px` }}
					>
						+{boostActive ? energyReduction * 10 : energyReduction}
					</span>
				))}
			</div>
		)
	}
	return null
}

export default TapZone
