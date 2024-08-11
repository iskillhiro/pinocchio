import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosDB from '../../../../utils/axios/axiosConfig'
import styles from './YearReward.module.css'

const tg = window.Telegram.WebApp

const YearReward = ({ telegramId }) => {
	const [isYearChecked, setIsYearChecked] = useState(false)
	const [rewardAdded, setRewardAdded] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		axiosDB
			.post(`/bonus/${telegramId}`)
			.then(result => {
				if (result.status === 200) {
					setRewardAdded(result.data.reward)
				}
			})
			.catch(error => {
				console.error('Error fetching reward:', error)
			})
	}, [telegramId])

	useEffect(() => {
		if (isYearChecked) {
			tg.HapticFeedback.impactOccurred('light')
		}
	}, [isYearChecked])

	const handleYearCheck = () => {
		setTimeout(() => {
			setIsYearChecked(true)
		}, 1000)
	}

	const handleGetReward = () => {
		navigate('/main')
	}

	return (
		<div className={styles.container}>
			<div>
				<p className={styles.heading}>
					Let's check how old you are on Telegram
				</p>
				<div className={styles.progress - container}>
					<div
						className={styles.progress - bar}
						style={{ width: isYearChecked ? '100%' : '0%' }}
						onAnimationEnd={handleYearCheck}
					/>
				</div>
			</div>
			{isYearChecked && (
				<div>
					<p className={styles.reward - text}>{rewardAdded}</p>
					<button className={styles.gradient - btn} onClick={handleGetReward}>
						Thank you
					</button>
				</div>
			)}
		</div>
	)
}

export default YearReward
