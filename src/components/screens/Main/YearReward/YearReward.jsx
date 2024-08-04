import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosDB from '../../../../utils/axios/axiosConfig'
const tg = window.Telegram.WebApp

const YearRewardComponent = ({ userData }) => {
	const [isYearChecked, setIsYearChecked] = useState(false)
	const [isPremiumChecked, setIsPremiumChecked] = useState(false)
	const [rewardAdded, setRewardAdded] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		axiosDB
			.post(`/bonus/${userData.telegramId}/${tg.initDataUnsafe.user.isPremium}`)
			.then(result => {
				if (result.status === 200) {
					setRewardAdded(result.data.reward) // Исправлено обращение к полю reward
				}
			})
			.catch(error => {
				console.error('Error fetching reward:', error)
			})
	}, [userData.telegramId])

	useEffect(() => {
		if (isYearChecked) {
			tg.HapticFeedback.impactOccurred('light')
		}
	}, [isYearChecked])

	useEffect(() => {
		if (isPremiumChecked) {
			tg.HapticFeedback.impactOccurred('light')
		}
	}, [isPremiumChecked])

	const handleYearCheck = () => {
		setTimeout(() => {
			setIsYearChecked(true)
		}, 1000) // Симуляция проверки времени
	}

	const handlePremiumCheck = () => {
		setTimeout(() => {
			setIsPremiumChecked(true)
		}, 1000) // Симуляция проверки Telegram Premium
	}

	const handleGetReward = () => {
		navigate('/main')
	}

	return (
		<div style={{ padding: '20px', textAlign: 'center' }}>
			<div>
				<p>Let's check how old you are in Telegram</p>
				<div style={{ width: '100%', backgroundColor: '#ccc' }}>
					<div
						style={{
							width: isYearChecked ? '100%' : '0%',
							height: '10px',
							backgroundColor: '#4caf50',
							transition: 'width 1s',
						}}
						onAnimationEnd={handleYearCheck}
					/>
				</div>
			</div>
			{isYearChecked && (
				<div>
					<p>Telegram Premium check</p>
					<div style={{ width: '100%', backgroundColor: '#ccc' }}>
						<div
							style={{
								width: isPremiumChecked ? '100%' : '0%',
								height: '10px',
								backgroundColor: '#2196f3',
								transition: 'width 1s',
							}}
							onAnimationEnd={handlePremiumCheck}
						/>
					</div>
				</div>
			)}
			{isPremiumChecked && (
				<div>
					<p>{rewardAdded}</p>
					<button className='gradient-btn' onClick={handleGetReward}>
						Thank you
					</button>
				</div>
			)}
		</div>
	)
}

export default YearRewardComponent
