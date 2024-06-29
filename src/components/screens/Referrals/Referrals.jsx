import React from 'react'
import copyIcon from '../../../assets/pictures/copy.svg'
import personIcon from '../../../assets/pictures/person.svg'
import '../../../assets/style/global.css'
import Navigation from '../../ui/Navigation/Navigation.jsx'
import './Referrals.css'

const Referrals = () => {
	const referralData = [
		{ username: 'USERNAME', moneyCount: 'MONEY COUNT' },
		{ username: 'USERNAME', moneyCount: 'MONEY COUNT' },
		{ username: 'USERNAME', moneyCount: 'MONEY COUNT' },
		{ username: 'USERNAME', moneyCount: 'MONEY COUNT' },
		{ username: 'USERNAME', moneyCount: 'MONEY COUNT' },
		{ username: 'USERNAME', moneyCount: 'MONEY COUNT' },
		{ username: 'USERNAME', moneyCount: 'MONEY COUNT' },
		{ username: 'USERNAME', moneyCount: 'MONEY COUNT' },
	]

	return (
		<div className='container'>
			<h1 className='main-title'>referrals</h1>
			<h3 className='post-title'>REFERRALS GREY COUNT</h3>
			<div className='block referrals'>
				{referralData.map((referral, index) => (
					<div key={index} id='referral'>
						<div id='ref-block'>
							<div className='icon'>
								<img src={personIcon} alt='avatar' />
							</div>
							<p id='username'>{referral.username}</p>
						</div>
						<p id='money-count'>{referral.moneyCount}</p>
					</div>
				))}
			</div>
			<div className='group referrals'>
				<button className='gradient-btn'>Send invite</button>
				<button className='gray-btn'>
					<div className='icon'>
						<img src={copyIcon} alt='copy' />
					</div>
					Copy link
				</button>
			</div>
			<Navigation />
		</div>
	)
}

export default Referrals
