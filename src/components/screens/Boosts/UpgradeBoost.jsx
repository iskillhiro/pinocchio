import axiosDB from '../../../utils/axios/axiosConfig'

const UpgradeBoostPopup = ({
	handlePopupClose,
	boost,
	userData,
	updateBoostData,
}) => {
	const upgradeBoost = async () => {
		try {
			const boostElem = boost[0]
			const response = await axiosDB.put(
				`/upgradeBoost/${userData.telegramId}/${boostElem.name}`
			)
			console.log(response)
			if (response.status === 200) {
				updateBoostData()
			}
		} catch (error) {
			console.log(error)
		}
	}
	console.log(boost[0])
	const activateTreeBoost = async () => {
		try {
			const boostElem = boost[0]
			const response = await axiosDB.put(
				`/treeBoost/${userData.telegramId}/${boostElem.name}`
			)
			console.log(response)
			if (response.status === 200) {
				updateBoostData()
			}
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<div className='popup-overlay' onClick={handlePopupClose}>
			<div className='popup block'>
				<div id='boost-info'>
					<div className='popup-icon'>
						<img src={boost[0].icon} alt='boost icon' />
					</div>
					<h3 className='popup-title'>{boost[0].name}</h3>
					{boost[0].boostType !== 'one-time' && (
						<h3 className='boost-level-info'>
							{(boost[0].currency === 'soldo' &&
								boost[0].level + '→ ' + boost[0].level + 1) ||
								'→ Activate'}
						</h3>
					)}
				</div>
				{boost[0].currency === 'zecchino' && (
					<button onClick={activateTreeBoost} className='gradient-btn'>
						Activate
					</button>
				)}
				{boost[0].currency === 'soldo' && (
					<button onClick={upgradeBoost} className='gradient-btn'>
						Upgrade
					</button>
				)}
			</div>
		</div>
	)
}

export default UpgradeBoostPopup
