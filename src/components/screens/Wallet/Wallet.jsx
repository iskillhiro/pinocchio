import React from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import bronzeCoinIcon from '../../../assets/pictures/coins/bronze/coin_front.svg'
import goldenCoinIcon from '../../../assets/pictures/coins/golden/coin_front.svg'
import silverCoinIcon from '../../../assets/pictures/coins/silver/coin_front.svg'
import goldenKeyIcon from '../../../assets/pictures/keys/golden.svg'
import silverKeyIcon from '../../../assets/pictures/keys/silver.svg'
import personIcon from '../../../assets/pictures/person.svg'
import axiosDB from '../../../utils/axios/axiosConfig'
import { getId } from '../../../utils/config'
import { numberWithSpaces } from '../../../utils/filterNumbers'
import formatDate from '../../../utils/formatDate/formatDate'
import { Loader } from '../../ui/Loader/Loader'
import Navigation from '../../ui/Navigation/Navigation'
import './Wallet.css'

const tg = window.Telegram.WebApp

const Wallet = () => {
	const telegramId = getId()

	// Fetch user data
	const {
		data: userData,
		isLoading: userLoading,
		isError: userError,
	} = useQuery(['userData', telegramId], async () => {
		const response = await axiosDB.get(`/user/${telegramId}`)
		return response.data
	})

	// Fetch statistics
	const {
		data: statistic,
		isLoading: statLoading,
		isError: statError,
	} = useQuery('statistic', async () => {
		const response = await axiosDB.get('/statistic')
		return response.data
	})

	if (userLoading || statLoading) {
		return (
			<div className='loader-container'>
				<Loader />
			</div>
		)
	}

	if (userError || statError) {
		console.error('Error fetching data:', userError || statError)
		return <div>Error fetching data</div>
	}

	const userAvatar = tg.initDataUnsafe.user.photo_url || bronzeCoinIcon

	return (
		<div className='container wallet'>
			<Link to='/stats' className='stats wallet'>
				<div id='coins'>
					<div className='icon'>
						<img src={personIcon} alt='Person icon' />
					</div>
					<div className='icon'>
						<img src={personIcon} alt='Person icon' />
					</div>
					<div className='icon'>
						<img src={goldenCoinIcon} alt='Golden coin icon' />
					</div>
				</div>
				<p id='users-count'>{numberWithSpaces(statistic.totalUsers)}</p>
				<p>Pinocchio coin miners</p>
				<span>
					Stats
					<svg
						className='row'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M8 4.5L16 12.5L8 20.5'
							stroke='#00000080'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				</span>
			</Link>

			{userData.telegramId ? (
				<div className='user-block'>
					<div className='icon'>
						<img src={userAvatar} alt='user avatar' />
					</div>
					<h3 id='username'>@{userData.username}</h3>
					<p id='started-date'>{formatDate(userData.createdAt)}</p>
				</div>
			) : (
				<Loader />
			)}

			{userData.telegramId && (
				<div className='block user-balance'>
					{[
						{ icon: silverKeyIcon, count: userData.soldoTaps },
						{ icon: goldenKeyIcon, count: userData.zecchinoTaps },
						{ icon: silverCoinIcon, count: userData.soldo },
						{ icon: goldenCoinIcon, count: userData.zecchino },
						{ icon: bronzeCoinIcon, count: userData.coins },
					].map(({ icon, count }, index) => (
						<div key={index} className='balance-item'>
							<div className='icon'>
								<img src={icon} alt='Balance icon' />
							</div>
							<p className='count'>{numberWithSpaces(count)}</p>
						</div>
					))}
				</div>
			)}

			<Navigation />
		</div>
	)
}

export default Wallet
