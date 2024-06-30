import lightning from '../../../../assets/pictures/lightning.svg'

const EnergyCount = ({ currentEnergy }) => (
	<div className='block energy'>
		<img className='icon' src={lightning} alt='lightning' />
		<h1>{currentEnergy}</h1>
	</div>
)
export default EnergyCount
