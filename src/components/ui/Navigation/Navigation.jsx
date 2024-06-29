import React from 'react'
import { Link } from 'react-router-dom'
import boostsIcon from '../../../assets/pictures/navigation/boosts.svg'
import refIcon from '../../../assets/pictures/navigation/ref.svg'
import tapIcon from '../../../assets/pictures/navigation/tap.svg'
import tasksIcon from '../../../assets/pictures/navigation/tasks.svg'
import coinsIcon from '../../../assets/pictures/navigation/tree.svg'
import './Navigation.css'

const Navigation = () => {
	return (
		<div className='block navigation'>
			<Link to='/referrals' className='nav-elem'>
				<div className='nav-icon'>
					<img className='icon' src={refIcon} alt='ref' />
				</div>
				<h3>ref</h3>
			</Link>
			<Link to='/tasks' className='nav-elem'>
				<div className='nav-icon'>
					<img className='icon' src={tasksIcon} alt='tasks' />
				</div>
				<h3>tasks</h3>
			</Link>
			<Link to='/' className='nav-elem'>
				<div className='nav-icon'>
					<img className='icon' src={tapIcon} alt='tap' />
				</div>
				<h3>tap</h3>
			</Link>
			<Link to='/boosts' className='nav-elem'>
				<div className='nav-icon'>
					<img className='icon' src={boostsIcon} alt='boosts' />
				</div>
				<h3>boosts</h3>
			</Link>
			<Link to='/coins' className='nav-elem'>
				<div className='nav-icon'>
					<img className='icon' src={coinsIcon} alt='coins' />
				</div>
				<h3>coins</h3>
			</Link>
		</div>
	)
}

export default Navigation
