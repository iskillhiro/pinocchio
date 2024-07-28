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
import formatDate from '../../../utils/formatDate/formatDate'
import Navigation from '../../ui/Navigation/Navigation'
import Loading from '../Loading/Loading'
import './Wallet.css'
const Wallet = () => {
	const telegramId = getId()
	const [loading, setLoading] = useState(true)
	const [loadingCount, setLoadingCount] = useState(0)
	const [userData, setUserData] = useState({})

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axiosDB.get(`/user/${telegramId}`)
				setLoadingCount(10)
				const user = response.data
				setUserData(user)
				setLoadingCount(50)
			} catch (error) {
				console.error('Error fetching user data:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchUserData()
	}, [telegramId])
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
				<p id='users-count'>1,501,194</p>
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
			<div className='user-block'>
				<div className='icon'>
					<img src={bronzeCoinIcon} alt='' />
				</div>
				<h3 id='username'>@{userData.username}</h3>
				<p id='started-date'>{formatDate(userData.createdAt)}</p>
			</div>

			<div className='block user-balance'>
				<div className='balance-item'>
					<div className='icon'>
						<img src={silverKeyIcon} alt='' />
					</div>
					<p className='count'>{userData.soldoTaps}</p>
				</div>
				<div className='balance-item'>
					<div className='icon'>
						<img src={goldenKeyIcon} alt='' />
					</div>
					<p className='count'>{userData.zecchinoTaps}</p>
				</div>
				<div className='balance-item'>
					<div className='icon'>
						<img src={silverCoinIcon} alt='' />
					</div>
					<p className='count'>{userData.soldo}</p>
				</div>
				<div className='balance-item'>
					<div className='icon'>
						<img src={goldenCoinIcon} alt='' />
					</div>
					<p className='count'>{userData.zecchino}</p>
				</div>
				<div className='balance-item'>
					<div className='icon'>
						<img src={bronzeCoinIcon} alt='' />
					</div>
					<p className='count'>{userData.coins}</p>
				</div>
			</div>
			<Navigation />
		</div>
	)
}

export default Wallet
