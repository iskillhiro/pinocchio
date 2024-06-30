import goldenCoin from '../../../assets/pictures/coins/golden/coin.svg'
import silverCoin from '../../../assets/pictures/coins/silver/coin.svg'

const tg = window.Telegram.WebApp

const TapZone = ({
	currentEnergy,
	setCurrentEnergy,
	energyReduction,
	state,
}) => {
	const handlePress = () => {
		if (currentEnergy > 0) {
			setCurrentEnergy(prev => Math.max(0, prev - energyReduction))
			if (tg.HapticFeedback) {
				tg.HapticFeedback.impactOccurred('light')
			}
		}
	}

	return (
		<div className='tap-zone' onClick={handlePress}>
			<img src={state === 1 ? silverCoin : goldenCoin} alt='coin' />
		</div>
	)
}

export default TapZone
