import goldenCoin from '../../../assets/pictures/coins/golden/coin.svg'
import silverCoin from '../../../assets/pictures/coins/silver/coin.svg'

const TapZone = ({
	currentEnergy,
	setCurrentEnergy,
	energyReduction,
	state,
}) => {
	const handlePress = () => {
		if (currentEnergy > 0) {
			setCurrentEnergy(prev => Math.max(0, prev - energyReduction))
		}
	}

	return (
		<div
			className='tap-zone'
			onMouseDown={handlePress}
			onTouchStart={handlePress}
			onMouseUp={e => e.currentTarget.classList.remove('active')}
			onTouchEnd={e => e.currentTarget.classList.remove('active')}
		>
			<img src={state == 1 ? silverCoin : goldenCoin} alt='silver coin' />
		</div>
	)
}
export default TapZone
