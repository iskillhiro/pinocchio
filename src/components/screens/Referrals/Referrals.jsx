import copy from 'copy-to-clipboard'
import React, { useEffect, useState } from 'react'
import bronzeCoin from '../../../assets/pictures/coins/bronze/coin_front.svg'
import goldenCoin from '../../../assets/pictures/coins/golden/coin_front.svg'
import soldoCoin from '../../../assets/pictures/coins/silver/coin_front.svg'
import copyIcon from '../../../assets/pictures/copy.svg'
import personIcon from '../../../assets/pictures/person.svg'
import '../../../assets/style/global.css'
import axiosDB from '../../../utils/axios/axiosConfig.js'
import { getId } from '../../../utils/config.js'
import { Loader } from '../../ui/Loader/Loader.jsx'
import './Referrals.css'
const Referrals = () => {
	const telegramId = getId()
	const [loading, setLoading] = useState(true)
	const inviteLink = `https://t.me/share/url?url=https://t.me/pinocchiolabs_bot?start=${telegramId}&text=Join me on Pinocchio and let's earn together! Use my invite link to join the fun 🚀`
	const copyLink = `https://t.me/share/url?url=https://t.me/pinocchiolabs_bot?start=${telegramId}`

	const onSendRef = () => {
		window.location.href = inviteLink
	}
	const onCopyLink = () => {
		copy(copyLink)
	}
	const [referralData, setReferralData] = useState([])
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axiosDB.get(`/user/${telegramId}`)
				const user = response.data
				setReferralData(user.referrals)
			} catch (error) {
				console.error('Error fetching user data:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchUserData()
	}, [])

	if (loading) {
		return (
			<div className='loader-container'>
				<Loader />
			</div>
		)
	}
	return (
		<div className='container'>
			<h1 className='main-title'>referrals</h1>
			<h3 className='post-title'>TOTAL REFERRALS: {referralData.length}</h3>
			<div className='block referrals'>
				<div className='currency-type'>
					<img src={soldoCoin} alt='' />
					<img src={goldenCoin} alt='' />
					<img src={bronzeCoin} alt='' />
				</div>
				{referralData.map((referral, index) => (
					<div key={index} id='referral'>
						<div id='ref-block'>
							<div className='icon'>
								<img src={personIcon} alt='avatar' />
							</div>
							<p id='username'>{referral.username}</p>
						</div>
						<p id='money-count'>{referral.soldo_count}</p>
						<p id='money-count'>{referral.zecchino_count}</p>
						<p id='money-count'>{referral.coin_count}</p>
					</div>
				))}
			</div>
			<div className='group referrals'>
				<button onClick={onSendRef} className='gradient-btn'>
					Send invite
				</button>
				<button onClick={onCopyLink} className='gray-btn'>
					<div className='icon'>
						<img src={copyIcon} alt='copy' />
					</div>
					Copy link
				</button>
			</div>
		</div>
	)
}

export default Referrals
