import React from 'react'
import bronzeCoinIcon from '../../../assets/pictures/coins/bronze/coin_front.svg'
import goldenCoinIcon from '../../../assets/pictures/coins/golden/coin_front.svg'
import silverCoinIcon from '../../../assets/pictures/coins/silver/coin_front.svg'
import goldenKeyIcon from '../../../assets/pictures/keys/golden.svg'
import silverKeyIcon from '../../../assets/pictures/keys/silver.svg'
import personIcon from '../../../assets/pictures/person.svg'
import Navigation from '../../ui/Navigation/Navigation'
import './Wallet.css'

const Wallet = () => {
	return (
		<div className='container wallet'>
			<a href='/stats' className='stats wallet'>
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
			</a>
			<div className='user-block'>
				<div className='icon'>
					<img src={bronzeCoinIcon} alt='' />
				</div>
				<h3 id='username'>@killhiro</h3>
				<p id='started-date'>24.06.2024</p>
			</div>
			<div className='block user-balance'>
				<div className='balance-item'>
					<div className='icon'>
						<img src={silverKeyIcon} alt='' />
					</div>
					<p className='count'>3</p>
				</div>
				<div className='balance-item'>
					<div className='icon'>
						<img src={goldenKeyIcon} alt='' />
					</div>
					<p className='count'>3</p>
				</div>
				<div className='balance-item'>
					<div className='icon'>
						<img src={silverCoinIcon} alt='' />
					</div>
					<p className='count'>3</p>
				</div>
				<div className='balance-item'>
					<div className='icon'>
						<img src={goldenCoinIcon} alt='' />
					</div>
					<p className='count'>3</p>
				</div>
				<div className='balance-item'>
					<div className='icon'>
						<img src={bronzeCoinIcon} alt='' />
					</div>
					<p className='count'>3</p>
				</div>
			</div>
			<Navigation />
		</div>
	)
}

export default Wallet
