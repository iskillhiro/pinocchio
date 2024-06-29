import React, { useState } from 'react'
import bucketIcon from '../../../assets/pictures/bucket.svg'
import goldenKeyIcon from '../../../assets/pictures/keys/golden.svg'
import lightningIcon from '../../../assets/pictures/lightning.svg'
import robotIcon from '../../../assets/pictures/robot.svg'
import saltIcon from '../../../assets/pictures/salt.svg'
import shovelIcon from '../../../assets/pictures/shovel.svg'
import skinIcon from '../../../assets/pictures/skin.svg'
import starIcon from '../../../assets/pictures/star.svg'
import tapIcon from '../../../assets/pictures/tap.svg'
import Navigation from '../../ui/Navigation/Navigation'
import './Boosts.css'
import Popup from './Popup'

const Boosts = () => {
	const [activeMenuItem, setActiveMenuItem] = useState('SoldoZecchino')
	const [popupInfo, setPopupInfo] = useState({
		title: '',
		iconSrc: '',
		boostType: '',
	})

	// Combined boosts data
	const allBoosts = [
		{
			name: 'energy',
			icon: lightningIcon,
			time: '00:00',
			boostType: 'daily-boost',
			price: '10000',
		},
		{
			name: 'turbo',
			icon: goldenKeyIcon,
			time: '00:00',
			boostType: 'daily-boost',
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

	// Event Handlers
	const handleMenuItemClick = name => {
		setActiveMenuItem(name)
	}

	const handleBoostClick = (title, iconSrc, boostType = 'default-boost') => {
		setPopupInfo({ title, iconSrc, boostType })
	}

	const handlePopupClose = () => {
		setPopupInfo({ title: '', iconSrc: '', boostType: '' })
	}

	// Filtered boosts based on active menu item
	const filteredBoosts = allBoosts.filter(
		boost =>
			boost.boostType === activeMenuItem || boost.boostType === 'daily-boost'
	)

	return (
		<div className='container'>
			{/* Popup modal */}
			{popupInfo.title && (
				<Popup
					handlePopupClose={handlePopupClose}
					popupInfo={popupInfo}
					buttonText={
						popupInfo.boostType === 'default-boost' ? 'Upgrade' : 'Get'
					}
				/>
			)}

			{/* Page Titles */}
			<h1 className='main-title'>Boosts</h1>
			<h3 className='post-title'>Free Day Boosts</h3>

			{/* Day Boosts Section */}
			<div className='day-boosts'>
				{filteredBoosts
					.filter(boost => boost.boostType === 'daily-boost')
					.map(boost => (
						<button
							key={boost.name}
							className='block day-boost'
							onClick={() =>
								handleBoostClick(boost.name, boost.icon, boost.boostType)
							}
						>
							<div id='boost-info'>
								<h3 className='up-case'>{boost.name}</h3>
								<h3 className='up-case' id='timer'>
									{boost.time}
								</h3>
							</div>
							<div className='icon'>
								<img src={boost.icon} alt={boost.name} />
							</div>
						</button>
					))}
			</div>

			{/* Boost Menu */}
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

				{/* Boosts List */}
				<div className='boost-list'>
					{filteredBoosts
						.filter(boost => boost.boostType === activeMenuItem)
						.map(boost => (
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
