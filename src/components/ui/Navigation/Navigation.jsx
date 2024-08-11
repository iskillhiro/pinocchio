import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import boostsIcon from '../../../assets/pictures/navigation/boosts.svg'
import refIcon from '../../../assets/pictures/navigation/ref.svg'
import tapIcon from '../../../assets/pictures/navigation/tap.svg'
import tasksIcon from '../../../assets/pictures/navigation/tasks.svg'
import coinsIcon from '../../../assets/pictures/navigation/tree.svg'
import taskNoViewed from '../../../assets/pictures/tasks_no_viewed.svg'
import axiosDB from '../../../utils/axios/axiosConfig'
import './Navigation.css'

const tg = window.Telegram.WebApp

const Navigation = ({ telegramId }) => {
	const [tasksViewed, setTasksViewed] = useState(true)
	const [tasks, setTasks] = useState([])

	const feedBack = () => {
		if (tg.HapticFeedback) {
			tg.HapticFeedback.impactOccurred('light')
		}
	}

	useEffect(() => {
		const getUser = async () => {
			const response = await axiosDB.get(`/user/${telegramId}`)
			const user = response.data
			setTasks(user.tasks)

			// Check if any task within tasksBlock is not viewed
			const anyTaskNotViewed = user.tasks.some(taskGroup =>
				taskGroup.tasksBlock.some(task => !task.isViewed)
			)

			if (anyTaskNotViewed) {
				setTasksViewed(false)
			}
		}
		getUser()
	}, [telegramId])

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
					{tasksViewed ? (
						<img className='icon' src={tasksIcon} alt='tasks' />
					) : (
						<img className='icon' src={taskNoViewed} alt='tasks' />
					)}
				</div>
				<h3>tasks</h3>
			</Link>
			<Link onClick={feedBack} to='/main' className='nav-elem'>
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
