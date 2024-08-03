import React, { useEffect, useState } from 'react'
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
	const [loading, setLoading] = useState(true)
	const [userData, setUserData] = useState({})
	const [statistic, setStatistic] = useState({})

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axiosDB.get(`/user/${telegramId}`)
				const user = response.data
				setUserData(user)
			} catch (error) {
				console.error('Error fetching user data:', error)
			} finally {
				setLoading(false)
			}
		}

		const getStatistic = async () => {
			try {
				const response = await axiosDB.get('/statistic')
				setStatistic(response.data)
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
			}
		}

		getStatistic()
		fetchUserData()
	}, [telegramId])

	if (loading) {
		return (
			<div className='container'>
				<Loader />
			</div>
		)
	}

	const userAvatar = tg.initDataUnsafe.user.photo_url || bronzeCoinIcon

	return (
		<div className='container wallet'>
			<Link to='/stats' className='stats wallet'>
				<div id='coins'>
					<div className='icon'>
						<img src={personIcon} alt='' />
					</div>
					<div className='icon'>
						<img src={personIcon} alt='' />
					</div>
					<div className='icon'>
						<img src={goldenCoinIcon} alt='' />
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
								<img src={icon} alt='' />
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
