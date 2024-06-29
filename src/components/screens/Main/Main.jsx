import React, { useEffect, useState } from 'react'
import silverCoin from '../../../assets/pictures/coins/silver/coin.svg'
import goldenKey from '../../../assets/pictures/keys/golden.svg'
import lightning from '../../../assets/pictures/lightning.svg'
import wallet from '../../../assets/pictures/wallet.svg'
import Navigation from '../../ui/Navigation/Navigation'
import './Main.css'

const Main = () => {
	const [currentEnergy, setCurrentEnergy] = useState(3000)
	const maxEnergy = 3000
	const energyReduction = 50

	const updateProgressBar = () => {
		const progressPercent = (currentEnergy / maxEnergy) * 100
		document.querySelector('.progress-bar').style.width = `${progressPercent}%`
	}

	useEffect(() => {
		updateProgressBar()
	}, [currentEnergy])

	return (
		<div className='container main'>
			<div id='main-balance'>
				<h1 id='count'>4.046.100</h1>
				<div className='key'>
					<img
						draggable='false'
						src={goldenKey}
						className='icon'
						alt='golden key'
					/>
				</div>
			</div>
			<div className='main-coins'>
				{Array(5)
					.fill(0)
					.map((_, index) => (
						<div key={index} className='active' id='coin'></div>
					))}
			</div>
			<div
				className='tap-zone'
				onMouseDown={() => {
					if (currentEnergy > 0) {
						setCurrentEnergy(prev => Math.max(0, prev - energyReduction))
					}
				}}
				onMouseUp={event => {
					event.currentTarget.classList.remove('active')
				}}
				onTouchStart={() => {
					if (currentEnergy > 0) {
						setCurrentEnergy(prev => Math.max(0, prev - energyReduction))
					}
				}}
				onTouchEnd={event => {
					event.currentTarget.classList.remove('active')
				}}
			>
				<img src={silverCoin} alt='silver coin' />
			</div>
			<div className='group main'>
				<div className='block energy'>
					<img className='icon' src={lightning} alt='lightning' />
					<h1>{currentEnergy}</h1>
				</div>
				<a href='/wallet' className='block'>
					<img className='icon' src={wallet} alt='wallet' />
				</a>
			</div>
			<div className='progress-bar-container'>
				<div className='progress-bar'></div>
			</div>
			<Navigation />
		</div>
	)
}

export default Main
