import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosDB from '../../../utils/axios/axiosConfig'
import { Loader } from '../../ui/Loader/Loader'
const tg = window.Telegram.WebApp

const Popup = ({
	handlePopupClose,
	popupInfo,
	buttonText,
	userData,
	updateBoostData,
}) => {
	const [process, setProcess] = useState(false)
	const navigate = useNavigate()
	const activateBoost = async () => {
		setProcess(true)
		try {
			const response = await axiosDB.get(
				`/boost/activate/${userData.telegramId}/${popupInfo.name}`
			)
			updateBoostData() // Update the boost data after successful activation
		} catch (error) {
			console.log(error)
		} finally {
			setProcess(false)
			if (tg.HapticFeedback) {
				tg.HapticFeedback.impactOccurred('light')
			}
			handlePopupClose()
			navigate('/main')
		}
	}

	const boost = userData.boosts.find(boost => boost.name === popupInfo.name)
	const isBoostExpired =
		boost.usesToday - boost.level === 0 &&
		boost.lastUsed != null &&
		Math.floor(
			(new Date() - new Date(boost.lastUsed)) / (1000 * 60 * 60 * 24)
		) <= 0
	const isBoostActive = new Date(boost.endTime) > Date.now()

	const handlePopupClick = event => {
		event.stopPropagation()
	}

	return (
		<div className='popup-overlay' onClick={handlePopupClose}>
			<div className='popup block' onClick={handlePopupClick}>
				<div id='boost-info'>
					<div className='popup-icon'>
						<img src={'/boosts/' + popupInfo.iconSrc} alt='boost icon' />
					</div>
					<h3 className='popup-title'>{popupInfo.title}</h3>
				</div>
				{isBoostExpired || isBoostActive ? (
					<button
						disabled={true}
						onClick={activateBoost}
						className='gradient-btn'
					>
						{buttonText}
					</button>
				) : (
					<button onClick={activateBoost} className='gradient-btn'>
						{process ? <Loader /> : buttonText}
					</button>
				)}
			</div>
		</div>
	)
}

export default Popup
