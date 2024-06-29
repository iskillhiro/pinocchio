import React from 'react'
import bucketIcon from '../../../assets/pictures/bucket.svg'
import bronzeCoin from '../../../assets/pictures/coins/bronze/coin_front.svg'
import goldenCoin from '../../../assets/pictures/coins/golden/coin_front.svg'
import saltIcon from '../../../assets/pictures/salt.svg'
import shovelIcon from '../../../assets/pictures/shovel.svg'
import treeIcon from '../../../assets/pictures/tree.svg'
import walletIcon from '../../../assets/pictures/wallet.svg'
import Navigation from '../../ui/Navigation/Navigation'
import './Coins.css'

const Coins = () => {
	return (
		<div className='container coins'>
			<h1 className='title gradient up-case no-wrap fade-in'>pinocchio coin</h1>
			<h1 id='balance'>
				4.046.100{' '}
				<div className='icon'>
					<img src={bronzeCoin} alt='bronze coin' />
				</div>
			</h1>
			<img className='fade-in main-tree' src={treeIcon} alt='tree' />
			<div id='planted-coins'>
				<div id='coin-count'>
					<p id='count'>7</p>
					<div className='icon'>
						<img src={goldenCoin} alt='golden coin' />
					</div>
				</div>
				<div id='percent-count'>
					+<p id='count'>150</p>%
				</div>
			</div>
			<div className='tools'>
				<div className='block'>
					<img className='icon' src={shovelIcon} alt='shovel' />
					<p>shovel</p>
				</div>
				<div className='block'>
					<img className='icon' src={bucketIcon} alt='bucket' />
					<p>bucket</p>
				</div>
				<div className='block'>
					<img className='icon' src={saltIcon} alt='salt' />
					<p>salt</p>
				</div>
			</div>
			<div className='group coins'>
				<button className='gradient-btn'>Claim</button>
				<a href='/wallet' className='block'>
					<img className='icon' src={walletIcon} alt='wallet' />
				</a>
			</div>
			<Navigation />
		</div>
	)
}

export default Coins
