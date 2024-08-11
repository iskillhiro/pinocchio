import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosDB from '../../../../utils/axios/axiosConfig'
import styles from './YearReward.module.css'

const tg = window.Telegram.WebApp

const YearReward = ({ telegramId }) => {
	const [isYearChecked, setIsYearChecked] = useState(false)
	const [rewardAdded, setRewardAdded] = useState(null)
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		let fakeProgress = 0
		const fakeProgressInterval = setInterval(() => {
			if (fakeProgress >= 100) {
				clearInterval(fakeProgressInterval)
			} else {
				fakeProgress += 5
				document.getElementById(
					'fake-progress'
				).style.width = `${fakeProgress}%`
			}
		}, 100)

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
			.finally(() => {
				setLoading(false)
				setIsYearChecked(true)
				clearInterval(fakeProgressInterval)
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
				<div className={styles.progressContainer}>
					<div
						id='fake-progress'
						className={styles.fakeProgressBar}
						style={{ width: '0%' }}
					/>
					<div
						className={styles.progressBar}
						style={{ width: isYearChecked ? '100%' : '0%' }}
						onAnimationEnd={handleYearCheck}
					/>
				</div>
			</div>
			{!loading && isYearChecked && (
				<div>
					<p className={styles.rewardText}>{rewardAdded}</p>
					<button
						className={styles.gradientBtn}
						onClick={() => handleGetReward()}
					>
						Thank you
					</button>
				</div>
			)}
		</div>
	)
}

export default YearReward
