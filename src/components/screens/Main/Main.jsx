import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import wallet from '../../../assets/pictures/wallet.svg'
import Navigation from '../../ui/Navigation/Navigation'
import MainBalance from './Balance/Balance'
import MainCoins from './Balance/Coins'
import EnergyBar from './Energy/EnergyBar'
import EnergyCount from './Energy/EnergyCount'
import './Main.css'
import TapZone from './TapZone'

const Main = () => {
	const [currentEnergy, setCurrentEnergy] = useState(3000)
	const maxEnergy = 3000
	const energyReduction = 50
	const state = 2
	return (
		<div className='container main'>
			<MainBalance />
			<MainCoins />
			<TapZone
				currentEnergy={currentEnergy}
				setCurrentEnergy={setCurrentEnergy}
				energyReduction={energyReduction}
				state={state}
			/>
			<div className='group main'>
				<EnergyCount currentEnergy={currentEnergy} />
				<Link to='/wallet' className='block'>
					<img className='icon' src={wallet} alt='wallet' />
				</Link>
			</div>
			<EnergyBar currentEnergy={currentEnergy} maxEnergy={maxEnergy} />
			<Navigation />
		</div>
	)
}

export default Main
