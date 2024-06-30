import React from 'react'
import loadingCoin from '../../../assets/pictures/coins/bronze/coin_front.svg'
import tonIcon from '../../../assets/pictures/ton.svg'
import '../../../assets/style/animations.css'
import '../../../assets/style/global.css'
import './Loading.css'

const Loading = () => {
	return (
		<div className='container loading'>
			<h1 className='title first gradient up-case no-wrap fade-in'>
				pinocchio coin
			</h1>
			<img
				className='fade-in pulse'
				id='loading-coin'
				src={loadingCoin}
				alt='loading'
			/>
			<h4 className='gradient no-wrap up-case fade-in'>krex</h4>
			<h4 className='gradient no-wrap up-case fade-in'>fex</h4>
			<h4 className='gradient no-wrap up-case fade-in'>pex</h4>
			<h1 className='title second gradient up-case no-wrap fade-in'>
				pinocchio labs
				<img className='ton fade-in' src={tonIcon} alt='ton' />
			</h1>
		</div>
	)
}

export default Loading
