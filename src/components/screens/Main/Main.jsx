import { useMutation, useQuery } from '@tanstack/react-query'
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
	const [showRobotPopup, setShowRobotPopup] = useState(false)
	const [robotMessage, setRobotMessage] = useState('')
	const [process, setProcess] = useState(false)
	const [currentEnergy, setCurrentEnergy] = useState(0)
	const [coins, setCoins] = useState(0)

	const {
		data: user,
		isLoading,
		refetch,
	} = useQuery(['userData', telegramId], () => fetchUserData(telegramId), {
		onSuccess: user => {
			if (user.robot.isActive && user.robot.miningBalance > 200) {
				const currency = user.stage === 1 ? 'soldo' : 'zecchino'
				setRobotMessage(
					`Your robot has earned ${user.robot.miningBalance} ${currency}!`
				)
				setShowRobotPopup(true)
			}
		},
	})

	const { mutate: handleSendRequest } = useMutation(
		() => claimRobot(telegramId),
		{
			onSuccess: () => {
				setShowRobotPopup(false)
				refetch()
			},
			onError: error => {
				console.error('Error sending request:', error)
			},
			onSettled: () => {
				if (tg.HapticFeedback) {
					tg.HapticFeedback.impactOccurred('light')
				}
				setProcess(false)
			},
		}
	)

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
		return <div>Error loading data</div>
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
				updateUserData={refetch}
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
					onSendRequest={() => {
						setProcess(true)
						handleSendRequest()
					}}
					process={process}
				/>
			)}
		</div>
	)
}

export default Main
