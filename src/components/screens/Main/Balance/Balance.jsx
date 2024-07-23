import React, { useEffect, useState } from 'react'
import goldenKey from '../../../../assets/pictures/keys/golden.svg'
import silverKey from '../../../../assets/pictures/keys/silver.svg'

const MainBalance = ({ stage, coins }) => {
	const [displayedCoins, setDisplayedCoins] = useState(coins)

	useEffect(() => {
		// добавляет эффект постепенного обновления баланса
		let start = displayedCoins
		let end = coins
		let increment = (end - start) / 5 // Делим на количество шагов, например, 30 шагов
		let interval = 50 // Интервал обновления в миллисекундах

		const intervalId = setInterval(() => {
			start += increment
			if (start >= end) {
				start = end
				clearInterval(intervalId)
			}
			setDisplayedCoins(Math.floor(start))
		}, interval)

		return () => clearInterval(intervalId)
	}, [coins])

	return (
		<div id='main-balance'>
			<h1 id='count'>{displayedCoins}</h1>
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
