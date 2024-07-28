import React from 'react'
import { Link } from 'react-router-dom'
import boostsIcon from '../../../assets/pictures/navigation/boosts.svg'
import refIcon from '../../../assets/pictures/navigation/ref.svg'
import tapIcon from '../../../assets/pictures/navigation/tap.svg'
import tasksIcon from '../../../assets/pictures/navigation/tasks.svg'
import coinsIcon from '../../../assets/pictures/navigation/tree.svg'
import './Navigation.css'
// TODO: Реализовать систему с красной точкой над иконкой задания, если есть новые
const tg = window.Telegram.WebApp

const Navigation = () => {
	const feedBack = () => {
		if (tg.HapticFeedback) {
			tg.HapticFeedback.impactOccurred('light')
		}
	}

	return (
		<div className='block navigation'>
			<Link onClick={feedBack} to='/referrals' className='nav-elem'>
				<div className='nav-icon'>
					<img className='icon' src={refIcon} alt='ref' />
				</div>
				<h3>ref</h3>
			</Link>
			<Link onClick={feedBack} to='/tasks' className='nav-elem'>
				<div className='nav-icon'>
					<img className='icon' src={tasksIcon} alt='tasks' />
				</div>
				<h3>tasks</h3>
			</Link>
			<Link onClick={feedBack} to='/' className='nav-elem'>
				<div className='nav-icon'>
					<img className='icon' src={tapIcon} alt='tap' />
				</div>
				<h3>tap</h3>
			</Link>
			<Link onClick={feedBack} to='/boosts' className='nav-elem'>
				<div className='nav-icon'>
					<img className='icon' src={boostsIcon} alt='boosts' />
				</div>
				<h3>boosts</h3>
			</Link>
			<Link onClick={feedBack} to='/coins' className='nav-elem'>
				<div className='nav-icon'>
					<img className='icon' src={coinsIcon} alt='coins' />
				</div>
				<h3>coins</h3>
			</Link>
		</div>
	)
}

export default Navigation
