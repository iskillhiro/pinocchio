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
			tg.HapticFeedback.impactOccurred('light')
		}
	}

	const handleTouchStart = e => {
		e.preventDefault()
		handlePress()
	}

	return (
		<div
			className='tap-zone'
			onMouseDown={handlePress}
			onTouchStart={handleTouchStart}
			onMouseUp={e => e.currentTarget.classList.remove('active')}
			onTouchEnd={e => e.currentTarget.classList.remove('active')}
		>
			<img src={state === 1 ? silverCoin : goldenCoin} alt='coin' />
		</div>
	)
}

export default TapZone
