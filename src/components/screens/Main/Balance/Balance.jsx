import goldenKey from '../../../../assets/pictures/keys/golden.svg'
import silverKey from '../../../../assets/pictures/keys/silver.svg'

const MainBalance = ({ stage, coins }) => {
	return (
		<div id='main-balance'>
			<h1 id='count'>{coins}</h1>
			<div className='key'>
				<img
					draggable='false'
					src={stage === 1 ? silverKey : goldenKey}
					className='icon'
					alt=''
				/>
			</div>
		</div>
	)
}

export default MainBalance
