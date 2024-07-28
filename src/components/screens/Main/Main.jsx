import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import wallet from '../../../assets/pictures/wallet.svg'
import axiosDB from '../../../utils/axios/axiosConfig'
import { getId } from '../../../utils/config'
import Navigation from '../../ui/Navigation/Navigation'
import Loading from '../Loading/Loading'
import MainBalance from './Balance/Balance'
import MainCoins from './Balance/MainCoins'
import EnergyBar from './Energy/EnergyBar'
import EnergyCount from './Energy/EnergyCount'
import './Main.css'
import TapZone from './TapZone'

const Main = () => {
	const telegramId = getId()
	const [userData, setUserData] = useState({
		currentEnergy: 0,
		currentMaxEnergy: 100,
		stage: 1,
		coinStage: 0,
		boostData: {},
		coins: 0,
		energyRegeneRate: 1,
		taps: 1,
	})
	const [loading, setLoading] = useState(true)
	const [loadingCount, setLoadingCount] = useState(0)

	const fetchUserData = async () => {
		try {
			const response = await axiosDB.get(`/user/${telegramId}`)
			setLoadingCount(10)

			const user = response.data
			setUserData({
				currentEnergy: user.energy,
				currentMaxEnergy: user.maxEnergy,
				stage: user.stage,
				coinStage: user.coinStage,
				boostData: {
					upgradeBoosts: user.upgradeBoosts,
					dailyBoosts: user.boosts,
				},
				coins: user.stage === 1 ? user.soldoTaps : user.zecchinoTaps,
				energyRegeneRate: user.upgradeBoosts[2].level,
				taps: user.upgradeBoosts[0].level,
			})

			setLoadingCount(50)
		} catch (error) {
			console.error('Error fetching user data:', error)
		} finally {
			setLoading(false)
		}
	}

	const updateUserData = async () => {
		try {
			const response = await axiosDB.get(`/user/${telegramId}`)
			const user = response.data

			setUserData(prevData => ({
				...prevData,
				stage: user.stage,
				taps: user.upgradeBoosts[0].level,
				coinStage: user.coinStage,
				coins: user.stage === 1 ? user.soldoTaps : user.zecchinoTaps,
			}))
		} catch (error) {
			console.error('Error updating user data:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchUserData()
	}, [telegramId])

	useEffect(() => {
		const intervalId = setInterval(() => {
			setUserData(prevData => ({
				...prevData,
				currentEnergy: Math.min(
					prevData.currentEnergy + prevData.energyRegeneRate,
					prevData.currentMaxEnergy
				),
			}))
		}, 1000)

		return () => clearInterval(intervalId)
	}, [userData.currentMaxEnergy, userData.energyRegeneRate])

	if (loading && loadingCount < 100) {
		return <Loading min={loadingCount} />
	}
	useEffect(() => {
		const handlePageLoad = () => {
			setLoadingCount(100)
		}

		window.addEventListener('load', handlePageLoad)

		return () => window.removeEventListener('load', handlePageLoad)
	}, [])

	return (
		<div className='container main'>
			<MainBalance stage={userData.stage} coins={userData.coins} />
			<MainCoins coinStage={userData.coinStage} stage={userData.stage} />
			<TapZone
				telegramId={telegramId}
				currentEnergy={userData.currentEnergy}
				setCurrentEnergy={energy =>
					setUserData(prevData => ({ ...prevData, currentEnergy: energy }))
				}
				energyReduction={userData.taps}
				stage={userData.stage}
				boostData={userData.boostData}
				currentCoins={userData.coins}
				setCurrentCoins={coins =>
					setUserData(prevData => ({ ...prevData, coins }))
				}
				updateUserData={updateUserData}
			/>
			<div className='group main'>
				<EnergyCount currentEnergy={userData.currentEnergy} />
				<Link to='/wallet' className='block'>
					<img className='icon' src={wallet} alt='wallet' />
				</Link>
			</div>
			<EnergyBar
				currentEnergy={userData.currentEnergy}
				maxEnergy={userData.currentMaxEnergy}
			/>
			<Navigation />
		</div>
	)
}

export default Main
