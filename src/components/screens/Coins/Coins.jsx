import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import bronzeCoin from '../../../assets/pictures/coins/bronze/coin_front.svg'
import goldenCoin from '../../../assets/pictures/coins/golden/coin_front.svg'
import treeIcon from '../../../assets/pictures/tree.svg'
import walletIcon from '../../../assets/pictures/wallet.svg'
import axiosDB from '../../../utils/axios/axiosConfig'
import { getId } from '../../../utils/config'
import { Loader } from '../../ui/Loader/Loader'
import Navigation from '../../ui/Navigation/Navigation'
import './Coins'
import './Coins.css'
import ProgressBar from './ProgressBar'
import style from './interface.module.css'

const tg = window.Telegram.WebApp

const fetchUserData = async telegramId => {
	const { data } = await axiosDB.get(`/user/${telegramId}`)
	return data
}

const plantCoin = async telegramId => {
	await axiosDB.post('/tree/plant', { telegramId })
}

const startLanding = async telegramId => {
	await axiosDB.put('/tree/start', { telegramId })
}

const claim = async telegramId => {
	await axiosDB.get(`/tree/claim/${telegramId}`)
}

const Coins = () => {
	const telegramId = getId()
	const queryClient = useQueryClient()

	const {
		data: user,
		isLoading,
		isFetching,
	} = useQuery(['user', telegramId], () => fetchUserData(telegramId), {
		refetchInterval: 10000,
	})

	const plantCoinMutation = useMutation(() => plantCoin(telegramId), {
		onSuccess: () => queryClient.invalidateQueries(['user', telegramId]),
	})

	const startLandingMutation = useMutation(() => startLanding(telegramId), {
		onSuccess: () => queryClient.invalidateQueries(['user', telegramId]),
	})

	const claimMutation = useMutation(() => claim(telegramId), {
		onSuccess: () => queryClient.invalidateQueries(['user', telegramId]),
	})

	const incrementBalance = () => {
		let start = displayedBalance
		let end = user?.tree?.lootBalance || 0
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
		if (user?.tree) {
			incrementBalance()
		}
	}, [user?.tree])

	if (isLoading) {
		return (
			<div className='loader-container'>
				<Loader />
			</div>
		)
	}

	const getActiveBoostsCount = () => {
		return (
			user?.treeCoinBoosts.reduce(
				(count, boost) => count + (boost.status ? 1 : 0),
				0
			) || 0
		)
	}

	const renderButton = () => {
		if (user?.tree?.isActive) {
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
					<button
						onClick={() => claimMutation.mutate()}
						className='gradient-btn'
					>
						{claimMutation.isLoading ? <Loader /> : 'Claim'}
					</button>
				)
			}
		} else if (user?.tree.coinPlanted > 0) {
			return (
				<button
					onClick={() => startLandingMutation.mutate()}
					className='gradient-btn'
				>
					{startLandingMutation.isLoading ? <Loader /> : 'Plant'}
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

	return (
		<div className='container coins'>
			<h1 className='title coins gradient up-case no-wrap fade-in'>
				Pinocchio Coin
			</h1>
			<h1 id='balance'>
				{displayedBalance}
				<div className='icon'>
					<img src={bronzeCoin} alt='bronze coin' />
				</div>
			</h1>
			<div className={style.tree_zone}>
				{Array.from(
					{ length: Math.min(user?.tree.coinPlanted || 0, 7) },
					(_, index) => (
						<div key={index} className={`${style.coin} active fade-in`}>
							<img src='./zecchino.svg' alt='coin' />
						</div>
					)
				)}
				<img
					onClick={() => plantCoinMutation.mutate()}
					className='fade-in main-tree pointer'
					src={treeIcon}
					alt='tree'
				/>
			</div>

			<div id='planted-coins'>
				<div id='coin-count'>
					<p id='count'>{user?.tree.coinPlanted || 0}</p>
					<div className='icon'>
						<img src={goldenCoin} alt='golden coin' />
					</div>
				</div>
				<div id='percent-count'>
					+<p id='count'>{getActiveBoostsCount() * 50}</p>%
				</div>
			</div>
			{user?.tree?.isActive && (
				<ProgressBar
					min={new Date(user.tree.landingStartDate)}
					max={new Date(user.tree.landingEndDate)}
				/>
			)}
			<div className='tools'>
				{user?.treeCoinBoosts.map((boost, index) => {
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
