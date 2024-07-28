import copy from 'copy-to-clipboard'
import React, { useEffect, useState } from 'react'
import copyIcon from '../../../assets/pictures/copy.svg'
import personIcon from '../../../assets/pictures/person.svg'
import '../../../assets/style/global.css'
import axiosDB from '../../../utils/axios/axiosConfig.js'
import { getId } from '../../../utils/config.js'
import Navigation from '../../ui/Navigation/Navigation.jsx'
import Loading from '../Loading/Loading.jsx'
import './Referrals.css'

const Referrals = () => {
	const telegramId = getId()
	const [loading, setLoading] = useState(true)
	const [loadingCount, setLoadingCount] = useState(0)

	const inviteLink = `https://t.me/share/url?url=https://t.me/isKillhiroBot?start=${telegramId}&text=Join me on Pinocchio and let's earn together! Use my invite link to join the fun 🚀`
	const copyLink = `https://t.me/share/url?url=https://t.me/isKillhiroBot?start=${telegramId}`

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
				setLoadingCount(10)
				const user = response.data
				console.log(user)
				setReferralData(user.referrals)
				setLoadingCount(50)
			} catch (error) {
				console.error('Error fetching user data:', error)
			} finally {
				setLoadingCount(100)
				setLoading(false)
			}
		}
		console.log(referralData)
		fetchUserData()
	}, [])

	if (loading && loadingCount < 100) {
		return <Loading min={loadingCount} />
	}
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
			<Navigation />
		</div>
	)
}

export default Referrals
