import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import wallet from '../../../assets/pictures/wallet.svg'
import axiosDB from '../../../utils/axios/axiosConfig'
import Navigation from '../../ui/Navigation/Navigation'
import Loading from '../Loading/Loading'
import MainBalance from './Balance/Balance'
import MainCoins from './Balance/Coins'
import EnergyBar from './Energy/EnergyBar'
import EnergyCount from './Energy/EnergyCount'
import './Main.css'
import TapZone from './TapZone'

const Main = () => {
	const [currentEnergy, setCurrentEnergy] = useState(0)
	const [currentMaxEnergy, setCurrentMaxEnergy] = useState(100)
	const [stage, setStage] = useState(1)
	const [coins, setCoins] = useState(0)
	const [loading, setLoading] = useState(true)
	const energyReduction = 3
	const energyRegenRate = 1 // Скорость восстановления энергии
	const telegramId = '1145622789'

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axiosDB.get(`/user/${telegramId}`)
				const user = response.data
				setCurrentEnergy(user.energy)
				setCurrentMaxEnergy(user.maxEnergy)
				setStage(user.stage)
				user.stage === 1 ? setCoins(user.soldo) : setCoins(user.zecchino)
			} catch (error) {
				console.error('Error fetching user data:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchUserData()
	}, [telegramId])

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentEnergy(prevEnergy =>
				Math.min(prevEnergy + energyRegenRate, currentMaxEnergy)
			)
		}, 1000)

		return () => clearInterval(intervalId)
	}, [currentMaxEnergy])

	if (loading) {
		return <Loading />
	}

	return (
		<div className='container main'>
			<MainBalance stage={stage} coins={coins} />
			<MainCoins />
			<TapZone
				telegramId={telegramId}
				currentEnergy={currentEnergy}
				setCurrentEnergy={setCurrentEnergy}
				energyReduction={energyReduction}
				stage={stage}
				currentCoins={coins}
				setCurrentCoins={setCoins}
			/>
			<div className='group main'>
				<EnergyCount currentEnergy={currentEnergy} />
				<Link to='/wallet' className='block'>
					<img className='icon' src={wallet} alt='wallet' />
				</Link>
			</div>
			<EnergyBar currentEnergy={currentEnergy} maxEnergy={currentMaxEnergy} />
			<Navigation />
		</div>
	)
}

export default Main
