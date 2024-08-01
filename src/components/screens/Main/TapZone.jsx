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
	const [taps, setTaps] = useState([]) // Initialize taps state
	const pendingTaps = useRef(0)
	const [boostActive, setBoostActive] = useState(false)
	latestCoins.current = currentCoins
	// TODO: Добавить обработку события, когда буст закончился, например добавить кастомную переменную, isBoostActive и сравнивавать её с boostData, если они не равны - делать запрос с обновлением

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
			isBoostActive ? setBoostActive(true) : setBoostActive(false)
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
			const newTaps = []

			// Loop through all touches (fingers) on the screen
			for (let i = 0; i < e.touches.length; i++) {
				const { clientX, clientY } = e.touches[i]
				const rect = e.target.getBoundingClientRect()

				if (!rect) {
					console.error('Unable to get bounding rect')
					continue
				}

				const newTap = {
					id: Date.now() + i, // Unique ID
					x: clientX - rect.left,
					y: clientY - rect.top,
				}

				newTaps.push(newTap)
			}
			setTaps(prevTaps => [...prevTaps, ...newTaps])

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

export default TapZone
