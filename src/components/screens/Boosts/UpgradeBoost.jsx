import { useState } from 'react'
import axiosDB from '../../../utils/axios/axiosConfig'
import { Loader } from '../../ui/Loader/Loader'
const tg = window.Telegram.WebApp

const UpgradeBoostPopup = ({
	handlePopupClose,
	boost,
	userData,
	updateBoostData,
}) => {
	const [process, setProcess] = useState(false)

	const upgradeBoost = async () => {
		setProcess(true)
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
		} finally {
			setProcess(false)
			if (tg.HapticFeedback) {
				tg.HapticFeedback.impactOccurred('light')
			}
			handlePopupClose()
		}
	}
	console.log(boost[0])
	const activateTreeBoost = async () => {
		setProcess(true)
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
		} finally {
			setProcess(false)
			if (tg.HapticFeedback) {
				tg.HapticFeedback.impactOccurred('light')
			}
			handlePopupClose()
		}
	}
	const handlePopupClick = event => {
		event.stopPropagation()
	}
	return (
		<div className='popup-overlay' onClick={handlePopupClose}>
			<div className='popup block' onClick={handlePopupClick}>
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
						{process ? <Loader /> : 'Activate'}
					</button>
				)}
				{boost[0].currency === 'soldo' && (
					<button onClick={upgradeBoost} className='gradient-btn'>
						{process ? <Loader /> : 'Upgrade'}
					</button>
				)}
			</div>
		</div>
	)
}

export default UpgradeBoostPopup
