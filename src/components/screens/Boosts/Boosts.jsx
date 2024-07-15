import React, { useEffect, useState } from 'react'
import bucketIcon from '../../../assets/pictures/bucket.svg'
import robotIcon from '../../../assets/pictures/robot.svg'
import saltIcon from '../../../assets/pictures/salt.svg'
import shovelIcon from '../../../assets/pictures/shovel.svg'
import skinIcon from '../../../assets/pictures/skin.svg'
import starIcon from '../../../assets/pictures/star.svg'
import tapIcon from '../../../assets/pictures/tap.svg'
import axiosDB from '../../../utils/axios/axiosConfig'
import Navigation from '../../ui/Navigation/Navigation'
import Loading from '../Loading/Loading'
import './Boosts.css'
import Popup from './Popup'

const Boosts = () => {
	const telegramId = '1145622789'
	const [activeMenuItem, setActiveMenuItem] = useState('SoldoZecchino')
	const [boostData, setBoostData] = useState([])
	const [userData, setUserData] = useState({})
	const [loading, setLoading] = useState(true)

	const [popupInfo, setPopupInfo] = useState({
		title: '',
		iconSrc: '',
		boostType: '',
		name: '',
	})

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axiosDB.get(`/boost/${telegramId}`)
				setBoostData(response.data.userData[0].boosts)
				setUserData(response.data.userData[0])
			} catch (error) {
				console.error('Failed to fetch boost data:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchUserData()
	}, [telegramId])

	const updateBoostData = async () => {
		try {
			const response = await axiosDB.get(`/boost/${telegramId}`)
			setBoostData(response.data.userData[0].boosts)
			setUserData(response.data.userData[0])
		} catch (error) {
			console.error('Failed to fetch updated boost data:', error)
		}
	}

	const allBoosts = [
		{
			name: 'energy',
			icon: 'lightning.svg',
			boostType: 'SoldoZecchino',
			price: '10000',
		},
		{
			name: 'turbo',
			icon: 'golden.svg',
			boostType: 'SoldoZecchino',
			price: '10000',
		},
		{ name: 'tap', icon: tapIcon, boostType: 'SoldoZecchino', price: '10000' },
		{
			name: 'auto',
			icon: robotIcon,
			boostType: 'SoldoZecchino',
			price: '10000',
		},
		{
			name: 'skin',
			icon: skinIcon,
			boostType: 'SoldoZecchino',
			price: '10000',
		},
		{
			name: 'shovel',
			icon: shovelIcon,
			boostType: 'PinocchioCoin',
			price: '1 zecchino',
		},
		{
			name: 'bucket',
			icon: bucketIcon,
			boostType: 'PinocchioCoin',
			price: '1 zecchino',
		},
		{
			name: 'salt',
			icon: saltIcon,
			boostType: 'PinocchioCoin',
			price: '1 zecchino',
		},
	]

	const handleMenuItemClick = name => {
		setActiveMenuItem(name)
	}

	const handleBoostClick = (
		title,
		iconSrc,
		boostType = 'default-boost',
		name
	) => {
		setPopupInfo({ title, iconSrc, boostType, name })
	}

	const handlePopupClose = () => {
		setPopupInfo({ title: '', iconSrc: '', boostType: '', name: '' })
	}

	const filteredBoosts = allBoosts.filter(
		boost =>
			boost.boostType === activeMenuItem || boost.boostType === 'daily-boost'
	)

	if (loading) {
		return <Loading />
	}
	return (
		<div className='container'>
			{popupInfo.title && (
				<Popup
					handlePopupClose={handlePopupClose}
					popupInfo={popupInfo}
					buttonText={
						popupInfo.boostType != 'SoldoZecchino' ? 'Get' : 'Upgrade'
					}
					userData={userData}
					updateBoostData={updateBoostData} // Pass the function to update boost data
				/>
			)}

			<h1 className='main-title'>Boosts</h1>
			<h3 className='post-title'>Free Day Boosts</h3>

			<div className='day-boosts'>
				{boostData.map(boost => (
					<button
						key={boost.name}
						className='block day-boost'
						onClick={() =>
							handleBoostClick(
								boost.name,
								boost.icon,
								boost.boostType,
								boost.name
							)
						}
					>
						<div id='boost-info'>
							<h3 className='up-case'>
								{boost.name} {boost.level - boost.usesToday}
							</h3>
							<h3 className='up-case' id='timer'>
								{boost.lastUsed != null && (
									<span>
										{Math.floor(
											24 -
												(Date.now() - new Date(boost.lastUsed)) /
													1000 /
													60 /
													60 /
													24
										)}{' '}
										hours
									</span>
								)}
							</h3>
						</div>
						<div className='icon'>
							{boost.name === 'turbo' &&
								(userData.stage === 1 ? (
									<img src={'/boosts/' + boost.icon} alt={boost.name} />
								) : (
									<img src={'/boosts/' + 'golden.svg'} alt={boost.name} />
								))}
							{boost.name !== 'turbo' && (
								<img src={'/boosts/' + boost.icon} alt={boost.name} />
							)}
						</div>
					</button>
				))}
			</div>

			<h3 className='up-case text-center post-title'>Boosts</h3>
			<div className='boost-menu'>
				<div className='menu'>
					<div
						className={`menu-item up-case ${
							activeMenuItem === 'SoldoZecchino' ? 'active' : ''
						}`}
						data-name='SoldoZecchino'
						onClick={() => handleMenuItemClick('SoldoZecchino')}
					>
						Soldo & Zecchino
					</div>
					<div
						className={`menu-item up-case ${
							activeMenuItem === 'PinocchioCoin' ? 'active' : ''
						}`}
						data-name='PinocchioCoin'
						onClick={() => handleMenuItemClick('PinocchioCoin')}
					>
						Pinocchio Coin
					</div>
					<div
						className='menu-block'
						style={{ left: activeMenuItem === 'PinocchioCoin' ? '50%' : '0%' }}
					></div>
				</div>

				<div className='boost-list'>
					{filteredBoosts.map(boost => (
						<div key={boost.name} className='boost'>
							<button
								className='block'
								onClick={() =>
									handleBoostClick(boost.name, boost.icon, boost.boostType)
								}
							>
								<h3 className='up-case'>{boost.name}</h3>
								<div className='icon'>
									<img src={boost.icon} alt={boost.name} />
								</div>
							</button>
							<p className='up-case' id='price'>
								{boost.price}
							</p>
							<div id='level'>
								<p id='level-count'>1</p>
								<p className='up-case'>level</p>
							</div>
						</div>
					))}
					<h3 className='post-title life-boosts'>
						<div className='icon star'>
							<img src={starIcon} alt='' />
						</div>
						Life Boosts are 10 days
					</h3>
				</div>
			</div>

			<Navigation />
		</div>
	)
}

export default Boosts
