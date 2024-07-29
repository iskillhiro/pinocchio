import React, { useEffect, useState } from 'react'
import bronzeCoin from '../../../assets/pictures/coins/bronze/coin_front.svg'
import goldenCoin from '../../../assets/pictures/coins/golden/coin_front.svg'
import treeIcon from '../../../assets/pictures/tree.svg'
import walletIcon from '../../../assets/pictures/wallet.svg'
import axiosDB from '../../../utils/axios/axiosConfig'
import { getId } from '../../../utils/config'
import ErrorMessage from '../../ui/errorMessage/ErrorMessage'
import { Loader } from '../../ui/Loader/Loader'
import Navigation from '../../ui/Navigation/Navigation'
import Loading from '../Loading/Loading'
import './Coins.css'
import ProgressBar from './ProgressBar'

const tg = window.Telegram.WebApp

const Coins = () => {
	const [loading, setLoading] = useState(true)
	const [process, setProcess] = useState(false)
	const [displayedBalance, setDisplayedBalance] = useState(0)
	const [error, setError] = useState(null) // Добавьте состояние для ошибок
	const telegramId = getId()
	const [user, setUser] = useState({})

	const fetchUserData = async () => {
		try {
			const response = await axiosDB.get(`/user/${telegramId}`)
			setUser(response.data)
		} catch (error) {
			console.error('Error fetching user data:', error)
			setError('Failed to fetch user data. Please try again later.') // Установите текст ошибки
		} finally {
			setLoading(false)
		}
	}

	const incrementBalance = () => {
		let start = displayedBalance
		let end = user.tree.lootBalance
		let increment = (end - start) / 30
		let interval = 10

		const intervalId = setInterval(() => {
			start += increment
			if (start >= end) {
				start = end
				clearInterval(intervalId)
			}
			setDisplayedBalance(Math.floor(start))
		}, interval)

		return () => clearInterval(intervalId)
	}

	useEffect(() => {
		fetchUserData()
		const intervalId = setInterval(fetchUserData, 10000)

		return () => clearInterval(intervalId)
	}, [telegramId])

	useEffect(() => {
		if (user.tree) {
			incrementBalance()
		}
	}, [user.tree])

	if (loading) {
		return <Loading />
	}

	const getActiveBoostsCount = () => {
		return user.treeCoinBoosts.reduce(
			(count, boost) => count + (boost.status ? 1 : 0),
			0
		)
	}

	const renderButton = () => {
		if (user.tree.isActive) {
			if (
				user.tree.landingEndDate &&
				new Date(user.tree.landingEndDate) > Date.now()
			) {
				return (
					<button className='gradient-btn' disabled>
						Claim
					</button>
				)
			} else {
				return (
					<button onClick={claim} className='gradient-btn'>
						{process ? <Loader /> : 'Claim'}
					</button>
				)
			}
		} else if (user.tree.coinPlanted > 0) {
			return (
				<button onClick={startLanding} className='gradient-btn'>
					{process ? <Loader /> : 'Plant'}
				</button>
			)
		} else {
			return (
				<button className='gradient-btn' disabled>
					Plant
				</button>
			)
		}
	}

	const updateUserData = async () => {
		try {
			const response = await axiosDB.get(`/user/${telegramId}`)
			setUser(response.data)
		} catch (error) {
			console.error('Error updating user data:', error)
			setError('Failed to update user data. Please try again later.') // Установите текст ошибки
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
					updateUserData()
				}
			} catch (error) {
				console.error('Error planting coin:', error)
				setError('Failed to plant coin. Please try again later.') // Установите текст ошибки
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
				updateUserData()
			}
		} catch (error) {
			console.error('Error starting landing:', error)
			setError('Failed to start landing. Please try again later.') // Установите текст ошибки
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
				updateUserData()
			}
		} catch (error) {
			console.error('Error claiming coins:', error)
			setError('Failed to claim coins. Please try again later.') // Установите текст ошибки
		} finally {
			setProcess(false)
		}
	}

	return (
		<div className='container coins'>
			<ErrorMessage message={error} visible={!!error} />{' '}
			{/* Используйте компонент ErrorMessage */}
			<h1 className='title coins gradient up-case no-wrap fade-in'>
				Pinocchio Coin
			</h1>
			<h1 id='balance'>
				{displayedBalance}
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
					+<p id='count'>{getActiveBoostsCount() * 50}</p>%
				</div>
			</div>
			{user.tree.isActive && (
				<ProgressBar
					min={new Date(user.tree.landingStartDate)}
					max={new Date(user.tree.landingEndDate)}
				/>
			)}
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
				{renderButton()}
				<a href='/wallet' className='block'>
					<img className='icon' src={walletIcon} alt='wallet' />
				</a>
			</div>
			<Navigation />
		</div>
	)
}

export default Coins
