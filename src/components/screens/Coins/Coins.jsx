import React, { useEffect, useState } from 'react'
import bronzeCoin from '../../../assets/pictures/coins/bronze/coin_front.svg'
import goldenCoin from '../../../assets/pictures/coins/golden/coin_front.svg'
import treeIcon from '../../../assets/pictures/tree.svg'
import walletIcon from '../../../assets/pictures/wallet.svg'
import axiosDB from '../../../utils/axios/axiosConfig'
import { getId } from '../../../utils/config'
import { Loader } from '../../ui/Loader/Loader'
import Navigation from '../../ui/Navigation/Navigation'
import Loading from '../Loading/Loading'
import './Coins.css'

const tg = window.Telegram.WebApp

const Coins = () => {
	const [loading, setLoading] = useState(true)
	const [process, setProcess] = useState(false) // состояние для отслеживания процесса claim
	const telegramId = getId()
	const [user, setUser] = useState({})

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axiosDB.get(`/user/${telegramId}`)
				const user = response.data
				setUser(user)
				console.log(user)
			} catch (error) {
				console.error('Error fetching user data:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchUserData()
	}, [telegramId])

	if (loading) {
		return <Loading />
	}

	const getActiveBoosts = () => {
		let activeBoostsCount = 0
		user.treeCoinBoosts.map(boost => {
			if (boost.status) {
				activeBoostsCount += 1
			}
		})
		return activeBoostsCount
	}

	const getButtonStatus = () => {
		if (user.tree.isActive) {
			if (
				user.tree.landingEndDate != null &&
				new Date(user.tree.landingEndDate) > Date.now()
			) {
				return (
					<button className='gradient-btn' disabled={true}>
						Claim
					</button>
				)
			} else {
				return (
					<button onClick={claim} className='gradient-btn'>
						{process ? <Loader /> : 'Claim'}{' '}
					</button>
				)
			}
		} else if (user.tree.coinPlanted > 0) {
			return (
				<button onClick={startLanding} className='gradient-btn'>
					{process ? <Loader /> : 'Plant'}{' '}
				</button>
			)
		} else {
			return (
				<button className='gradient-btn' disabled={true}>
					Plant
				</button>
			)
		}
	}

	const getUserData = async () => {
		try {
			const response = await axiosDB.get(`/user/${telegramId}`)
			const user = response.data
			setUser(user)
			console.log(user)
		} catch (error) {
			console.error('Error fetching user data:', error)
		}
	}

	const plantCoin = async () => {
		if (!user.tree.isActive) {
			try {
				const response = await axiosDB.post('/tree/plant', {
					telegramId: user.telegramId,
				})
				tg.HapticFeedback.impactOccurred('light')
				if (response.status === 200) {
					getUserData()
				}
			} catch (error) {
				console.log(error)
			}
		}
	}

	const startLanding = async () => {
		setProcess(true)
		try {
			const response = await axiosDB.put('/tree/start', {
				telegramId: user.telegramId,
			})
			tg.HapticFeedback.impactOccurred('light')
			if (response.status === 200) {
				getUserData()
			}
		} catch (error) {
			console.log(error)
		} finally {
			setProcess(false)
		}
	}

	const claim = async () => {
		setProcess(true)
		try {
			const response = await axiosDB.get(`/tree/claim/${user.telegramId}`)
			tg.HapticFeedback.impactOccurred('light')
			if (response.status === 200) {
				getUserData()
			}
		} catch (error) {
			console.error('Error claiming coins:', error)
		} finally {
			setProcess(false)
		}
	}

	return (
		<div className='container coins'>
			<h1 className='title coins gradient up-case no-wrap fade-in'>
				pinocchio coin
			</h1>
			<h1 id='balance'>
				{user.tree.lootBalance}{' '}
				<div className='icon'>
					<img src={bronzeCoin} alt='bronze coin' />
				</div>
			</h1>
			<img
				onClick={plantCoin}
				className='fade-in main-tree pointer'
				src={treeIcon}
				alt='tree'
			/>
			<div id='planted-coins'>
				<div id='coin-count'>
					<p id='count'>{user.tree.coinPlanted}</p>
					<div className='icon'>
						<img src={goldenCoin} alt='golden coin' />
					</div>
				</div>
				<div id='percent-count'>
					+<p id='count'>{getActiveBoosts() * 50}</p>%
				</div>
			</div>
			<div className='tools'>
				{user.treeCoinBoosts.map((boost, index) => {
					const iconPath = require(`/src/assets/pictures/${boost.icon}`)
					return (
						<div
							key={index}
							className='block'
							style={{ opacity: boost.status ? 1 : 0.5 }}
						>
							<img className='icon' src={iconPath} alt={boost.name} />
							<p>{boost.name}</p>
						</div>
					)
				})}
			</div>
			<div className='group coins'>
				{getButtonStatus()}
				<a href='/wallet' className='block'>
					<img className='icon' src={walletIcon} alt='wallet' />
				</a>
			</div>
			<Navigation />
		</div>
	)
}

export default Coins
