import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosDB from '../../../utils/axios/axiosConfig'
import Navigation from '../../ui/Navigation/Navigation'
import Loading from '../Loading/Loading'
import './Tasks.css'

const Tasks = () => {
	const [taskData, setTaskData] = useState(null) // Изменено с [] на null
	const [loading, setLoading] = useState(true)

	const telegramId = '1145622789'
	useEffect(() => {
		const getTasks = async () => {
			try {
				const response = await axiosDB.get(`/tasks/${telegramId}`)
				setTaskData(response.data)
				console.log('TASKDATA: ', response.data)
			} catch (error) {
				console.error('Error fetching tasks:', error)
			} finally {
				setLoading(false)
			}
		}

		getTasks()
	}, [telegramId])

	if (loading) {
		return <Loading />
	}

	// Проверка наличия данных перед рендерингом
	if (!taskData) {
		return <div>No tasks available</div>
	}

	return (
		<div className='container'>
			<h1 className='main-title'>Tasks</h1>
			<div className='tasks-content'>
				{taskData.incompleteTasks?.map((task, index) => (
					<div key={index} id='task-container'>
						<div className='block tasks'>
							<div className='task'>
								<div id='task-block'>
									<div className='task-logo'></div>
									<div id='task-info'>
										<p id='name'>{task.taskType}</p>
										<p id='reward'>
											{task.isComplete ? 'Completed' : task.reward}
										</p>
									</div>
								</div>
								<div className='row icon'></div>
							</div>
						</div>
					</div>
				))}
				{taskData.completedTasks?.map((task, index) => (
					<Link to={task.link} key={index} id='task-container'>
						<div className='block tasks'>
							<div className='task'>
								<div id='task-block'>
									<div className='task-logo'></div>
									<div id='task-info'>
										<p id='name'>{task.taskType}</p>
										<p id='reward'>
											{task.isComplete ? 'Completed' : task.reward}
										</p>
									</div>
								</div>
								<div className='row icon'></div>
							</div>
						</div>
					</Link>
				))}
			</div>
			<Navigation />
		</div>
	)
}

export default Tasks
