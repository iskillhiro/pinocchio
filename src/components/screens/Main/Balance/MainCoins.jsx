import goldenFront from '../../../../assets/pictures/coins/golden/coin_front.svg'
import silverFront from '../../../../assets/pictures/coins/silver/coin_front.svg'
import style from './MainCoins.module.css'
const MainCoins = ({ coinStage, stage }) => (
	<div className={style.main_coins}>
		{Array.from({ length: coinStage }, (_, index) => (
			<div key={index} className={`active ${style.coin}`}>
				{stage === 1 ? (
					<img src={silverFront} alt='' />
				) : (
					<img src={goldenFront} alt='' />
				)}
			</div>
		))}
		{Array.from(
			{
				length: stage === 1 ? 4 : 5,
			},
			(_, index) => (
				<div key={index} className={`${style.coin}`}>
					{stage === 1 ? (
						<img className={style.disabled} src={silverFront} alt='' />
					) : (
						<img className={style.disabled} src={goldenFront} alt='' />
					)}
				</div>
			)
		)}
	</div>
)

export default MainCoins
