const MainCoins = () => (
	<div className='main-coins'>
		{Array(5)
			.fill(0)
			.map((_, index) => (
				<div key={index} className='active' id='coin'></div>
			))}
	</div>
)

export default MainCoins
