import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import wallet from '../../../assets/pictures/wallet.svg'
import axiosDB from '../../../utils/axios/axiosConfig'
import { getId } from '../../../utils/config'
import { Loader } from '../../ui/Loader/Loader'
import Navigation from '../../ui/Navigation/Navigation'
import MainBalance from './Balance/Balance'
import MainCoins from './Balance/MainCoins'
import EnergyBar from './Energy/EnergyBar'
import EnergyCount from './Energy/EnergyCount'
import './Main.css'
import RobotPopup from './Robot/RobotPopup'
import TapZone from './TapZone'

const tg = window.Telegram.WebApp

const fetchUserData = async telegramId => {
	const response = await axiosDB.get(`/user/${telegramId}`)
	return response.data
}

const claimRobot = async telegramId => {
	const response = await axiosDB.get(`/robot/claim/${telegramId}`)
	return response.data
}

const Main = () => {
	const telegramId = getId()
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [showRobotPopup, setShowRobotPopup] = useState(false)
	const [robotMessage, setRobotMessage] = useState('')
	const [process, setProcess] = useState(false)
	const [currentEnergy, setCurrentEnergy] = useState(0)
	const [coins, setCoins] = useState(0)

	const getUserData = async () => {
		try {
			setIsLoading(true)
			const userData = await fetchUserData(telegramId)
			setUser(userData)
			setCurrentEnergy(userData.currentEnergy)
			setCoins(userData.coins)
			if (userData.robot.isActive && userData.robot.miningBalance > 200) {
				const currency = userData.stage === 1 ? 'soldo' : 'zecchino'
				setRobotMessage(
					`Your robot has earned ${userData.robot.miningBalance} ${currency}!`
				)
				setShowRobotPopup(true)
			}
		} catch (error) {
			console.error('Error fetching user data:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleSendRequest = async () => {
		try {
			setProcess(true)
			await claimRobot(telegramId)
			setShowRobotPopup(false)
			getUserData()
		} catch (error) {
			console.error('Error sending request:', error)
		} finally {
			if (tg.HapticFeedback) {
				tg.HapticFeedback.impactOccurred('light')
			}
			setProcess(false)
		}
	}

	useEffect(() => {
		getUserData()
	}, [])

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (user) {
				setCurrentEnergy(prevEnergy =>
					Math.min(prevEnergy + user.energyRegeneRate, user.currentMaxEnergy)
				)
			}
		}, 1000)

		return () => clearInterval(intervalId)
	}, [user])

	if (isLoading) {
		return (
			<div className='loader-container'>
				<Loader />
			</div>
		)
	}

	if (!user) {
		return <div>Error loading data</div}
	}

	return (
		<div className='container main'>
			<MainBalance stage={user.stage} coins={coins} />
			<MainCoins coinStage={user.coinStage} stage={user.stage} />
			<TapZone
				telegramId={telegramId}
				currentEnergy={currentEnergy}
				setCurrentEnergy={setCurrentEnergy}
				energyReduction={user.taps}
				stage={user.stage}
				boostData={user.boostData}
				currentCoins={coins}
				setCurrentCoins={setCoins}
				updateUserData={getUserData}
			/>
			<div className='group main'>
				<EnergyCount currentEnergy={currentEnergy} />
				<Link to='/wallet' className='block'>
					<img className='icon' src={wallet} alt='wallet' />
				</Link>
			</div>
			<EnergyBar
				currentEnergy={currentEnergy}
				maxEnergy={user.currentMaxEnergy}
			/>
			<Navigation />
			{showRobotPopup && (
				<RobotPopup
					message={robotMessage}
					onClose={() => setShowRobotPopup(false)}
					onSendRequest={handleSendRequest}
					process={process}
				/>
			)}
		</div>
	)
}

export default Main
