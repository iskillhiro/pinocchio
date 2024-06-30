import goldenKey from '../../../../assets/pictures/keys/golden.svg'
import silverKey from '../../../../assets/pictures/keys/silver.svg'

const MainBalance = ({ state }) => (
	<div id='main-balance'>
		<h1 id='count'>4.046.100</h1>
		<div className='key'>
			<img
				draggable='false'
				src={state === 1 ? silverKey : goldenKey}
				className='icon'
				alt=''
			/>
		</div>
	</div>
)

export default MainBalance
