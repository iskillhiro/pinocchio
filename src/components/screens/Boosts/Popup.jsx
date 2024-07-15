import axiosDB from '../../../utils/axios/axiosConfig'

const Popup = ({
	handlePopupClose,
	popupInfo,
	buttonText,
	userData,
	updateBoostData,
}) => {
	console.log(userData)

	const activateBoost = async () => {
		try {
			const response = await axiosDB.get(
				`/boost/activate/${userData.telegramId}/${popupInfo.name}`
			)
			console.log(response)
			updateBoostData() // Update the boost data after successful activation
		} catch (error) {
			console.log(error)
		}
	}

	const boost = userData.boosts.find(boost => boost.name === popupInfo.name)
	return (
		<div className='popup-overlay' onClick={handlePopupClose}>
			<div className='popup block'>
				<div id='boost-info'>
					<div className='popup-icon'>
						<img src={popupInfo.iconSrc} alt='boost icon' />
					</div>
					<h3 className='popup-title'>{popupInfo.title}</h3>
				</div>
				{(boost.usesToday - boost.level == 0 &&
					boost.lastUsed != null &&
					Math.floor(
						(new Date() - new Date(boost.lastUsed)) / (1000 * 60 * 60 * 24)
					) <= 0 && (
						<button
							disabled={true}
							onClick={activateBoost}
							className='gradient-btn'
						>
							{buttonText}
						</button>
					)) || (
					<button onClick={activateBoost} className='gradient-btn'>
						{buttonText}
					</button>
				)}
			</div>
		</div>
	)
}

export default Popup
