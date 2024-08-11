import React, { useEffect, useState } from 'react'
import starIcon from '../../../assets/pictures/star.svg'
import axiosDB from '../../../utils/axios/axiosConfig'
import { getId } from '../../../utils/config.js'
import { Loader } from '../../ui/Loader/Loader.jsx'
import Navigation from '../../ui/Navigation/Navigation'
import './Boosts.css'
import Popup from './Popup'
import UpgradeBoostPopup from './UpgradeBoost.jsx'

const Boosts = () => {
	const telegramId = getId()
	const [activeMenuItem, setActiveMenuItem] = useState('SoldoZecchino')
	const [upgradeBoosts, setUpgradeBoosts] = useState([])
	const [boostData, setBoostData] = useState([])
	const [userData, setUserData] = useState({})
	const [loading, setLoading] = useState(true)

	const [popupInfo, setPopupInfo] = useState({
		title: '',
		iconSrc: '',
		boostType: '',
		name: '',
	})
	const [upgradePopupInfo, setUpgradePopupInfo] = useState([])
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const { data } = await axiosDB.get(`/boost/${telegramId}`)
				if (data) {
					const userData = data.userData[0]
					setBoostData(userData.boosts)
					setUserData(userData)
					setUpgradeBoosts([
						...userData.upgradeBoosts,
						...userData.treeCoinBoosts,
					])
				}
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
			const { data } = await axiosDB.get(`/boost/${telegramId}`)
			const userData = data.userData[0]
			setBoostData(userData.boosts)
			setUserData(userData)
			setUpgradeBoosts([...userData.upgradeBoosts, ...userData.treeCoinBoosts])
		} catch (error) {
			console.error('Failed to fetch updated boost data:', error)
		}
	}

	const handleBoostClick = (
		title,
		iconSrc,
		boostType = 'default-boost',
		name
	) => {
		setPopupInfo({ title, iconSrc, boostType, name })
	}
	const filteredBoosts = upgradeBoosts.filter(
		activeMenuItem === 'SoldoZecchino'
			? boost => boost.currency === 'soldo'
			: boost => boost.currency === 'zecchino'
	)

	if (loading) {
		return (
			<div className='loader-container'>
				<Loader />
			</div>
		)
	}

	return (
		<div className='container'>
			{popupInfo.title && (
				<Popup
					handlePopupClose={() =>
						setPopupInfo({ title: '', iconSrc: '', boostType: '', name: '' })
					}
					popupInfo={popupInfo}
					buttonText={
						popupInfo.boostType !== 'SoldoZecchino' ? 'Get' : 'Upgrade'
					}
					userData={userData}
					updateBoostData={updateBoostData}
				/>
			)}
			{upgradePopupInfo.length > 0 && (
				<UpgradeBoostPopup
					handlePopupClose={() => setUpgradePopupInfo([])}
					updateBoostData={updateBoostData}
					boost={upgradePopupInfo}
					userData={userData}
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
								<span>
									{boost.lastUsed != null &&
										boost.level - boost.usesToday === 0 && (
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
								</span>
								<span>
									{new Date(boost.endTime) > Date.now() && (
										<span>
											{Math.floor(
												(new Date(boost.endTime) - Date.now()) / 1000
											)}{' '}
											seconds
										</span>
									)}
								</span>
							</h3>
						</div>
						<div className='icon'>
							<img src={`/boosts/${boost.icon}`} alt={boost.name} />
						</div>
					</button>
				))}
			</div>

			<h3 className='up-case text-center post-title'>Boosts</h3>
			<div className='boost-menu'>
				<div className='menu'>
					{['SoldoZecchino', 'PinocchioCoin'].map(menu => (
						<div
							key={menu}
							className={`menu-item up-case ${
								activeMenuItem === menu ? 'active' : ''
							}`}
							onClick={() => setActiveMenuItem(menu)}
						>
							{menu.replace(/([A-Z])/g, ' $1').trim()}
						</div>
					))}
					<div
						className='menu-block'
						style={{ left: activeMenuItem === 'PinocchioCoin' ? '50%' : '0%' }}
					/>
				</div>

				<div className='boost-list'>
					{filteredBoosts.map(boost => (
						<div key={boost.name} className='boost'>
							<button
								disabled={
									boost.currency === 'zecchino'
										? boost.status === true
											? true
											: false
										: boost.level === boost.maxLevel
										? true
										: false
								}
								className='block'
								onClick={() => setUpgradePopupInfo([boost])}
							>
								<h3 className='up-case'>{boost.name}</h3>
								<div className='icon'>
									<img src={'/boosts/' + boost.icon} alt={boost.name} />
								</div>
								{boost.currency === 'zecchino' && (
									<img className='star-boost' src={starIcon} />
								)}
							</button>
							<p className='up-case' id='price'>
								{boost.level !== 0
									? boost.currency === 'soldo'
										? boost.level === boost.maxLevel
											? ' '
											: `${boost.level * 10000}`
										: '1 zechhino'
									: '50000'}
							</p>

							<div id='level'>
								{boost.currency === 'soldo' &&
									boost.boostType !== 'one-time' && (
										<>
											<p id='level-count'>
												{boost.level === 0
													? 'BUY'
													: boost.level === boost.maxLevel
													? 'MAX'
													: boost.level}
											</p>
											<p className='up-case'>{boost.level !== 0 && 'level'}</p>
										</>
									)}
								{boost.currency === 'zecchino' && (
									<p>{boost.status === false ? 'INACTIVE' : 'ACTIVE'}</p>
								)}
								{boost.boostType === 'one-time' && (
									<p>{boost.level === 1 ? 'UNBOUGHT' : 'BOUGHT'}</p>
								)}
							</div>
						</div>
					))}
					{activeMenuItem === 'PinocchioCoin' ? (
						<h3 className='post-title life-boosts'>
							<div className='icon star'>
								<img src={starIcon} alt='' />
							</div>
							Life Boosts are 10 days
						</h3>
					) : (
						''
					)}
				</div>
			</div>

			<Navigation telegramId={telegramId} />
		</div>
	)
}

export default Boosts
