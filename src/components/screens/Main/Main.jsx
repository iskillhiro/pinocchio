import React, { useCallback, useEffect, useState } from 'react'
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
import YearReward from './YearReward/YearReward'

const tg = window.Telegram.WebApp

const Main = () => {
	const telegramId = getId()
	const [currentEnergy, setCurrentEnergy] = useState(0)
	const [currentMaxEnergy, setCurrentMaxEnergy] = useState(100)
	const [stage, setStage] = useState(1)
	const [coinStage, setCoinStage] = useState(0)
	const [boostData, setBoostData] = useState({})
	const [coins, setCoins] = useState(0)
	const [loading, setLoading] = useState(true)
	const [energyRegeneRate, setEnergyRegeneRate] = useState(1)
	const [taps, setTaps] = useState(1)
	const [showRobotPopup, setShowRobotPopup] = useState(false)
	const [robotMessage, setRobotMessage] = useState('')
	const [process, setProcess] = useState(false)
	const [yearReward, setYearReward] = useState(false)

	const fetchUserData = useCallback(async () => {
		try {
			const response = await axiosDB.get(`/user/${telegramId}`)
			const user = response.data
			console.log(user)
			setCurrentEnergy(user.energy)
			setCurrentMaxEnergy(user.maxEnergy)
			setEnergyRegeneRate(user.upgradeBoosts[2].level)
			setStage(user.stage)
			setUserData(user.data)
			setBoostData({
				upgradeBoosts: user.upgradeBoosts,
				dailyBoosts: user.boosts,
			})
			setCoinStage(user.coinStage)
			setTaps(user.upgradeBoosts[2].level)
			setCoins(user.stage === 1 ? user.soldoTaps : user.zecchinoTaps)

			if (!user.yearBonusClaimed) setYearReward(true)

			if (user.robot.isActive && user.robot.miningBalance > 200) {
				const currency = user.stage === 1 ? 'soldo' : 'zecchino'
				setRobotMessage(
					`Your robot has earned ${user.robot.miningBalance} ${currency}!`
				)
				setShowRobotPopup(true)
			}
		} catch (error) {
			console.error('Error fetching user data:', error)
		} finally {
			setLoading(false)
		}
	}, [telegramId])

	useEffect(() => {
		fetchUserData()
	}, [fetchUserData])

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentEnergy(prevEnergy =>
				Math.min(prevEnergy + energyRegeneRate, currentMaxEnergy)
			)
		}, 1000)

		return () => clearInterval(intervalId)
	}, [energyRegeneRate, currentMaxEnergy])

	const handleRobotPopupClose = () => setShowRobotPopup(false)

	const handleSendRequest = async () => {
		setProcess(true)
		try {
			await axiosDB.get(`/robot/claim/${telegramId}`)
			handleRobotPopupClose()
			fetchUserData()
		} catch (error) {
			console.error('Error sending request:', error)
		} finally {
			if (tg.HapticFeedback) {
				tg.HapticFeedback.impactOccurred('light')
			}
			setProcess(false)
		}
	}

	if (loading) {
		return (
			<div className='loader-container'>
				<Loader />
			</div>
		)
	} else if (yearReward && telegramId) {
		return <YearReward telegramId={telegramId} />
	}

	return (
		<div className='container main'>
			<MainBalance stage={stage} coins={coins} />
			<MainCoins coinStage={coinStage} stage={stage} />
			<TapZone
				telegramId={telegramId}
				currentEnergy={currentEnergy}
				setCurrentEnergy={setCurrentEnergy}
				energyReduction={taps}
				stage={stage}
				boostData={boostData}
				currentCoins={coins}
				setCurrentCoins={setCoins}
				updateUserData={fetchUserData}
			/>
			<div className='group main'>
				<EnergyCount currentEnergy={currentEnergy} />
				<Link to='/wallet' className='block'>
					<img className='icon' src={wallet} alt='wallet' />
				</Link>
			</div>
			<EnergyBar currentEnergy={currentEnergy} maxEnergy={currentMaxEnergy} />
			<Navigation />
			{showRobotPopup && (
				<RobotPopup
					message={robotMessage}
					onClose={handleRobotPopupClose}
					onSendRequest={handleSendRequest}
					process={process}
				/>
			)}
		</div>
	)
}

export default Main
