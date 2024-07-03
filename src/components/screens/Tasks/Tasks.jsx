import React, { useEffect, useState } from 'react'
import axiosDB from '../../../utils/axios/axiosConfig'
import Navigation from '../../ui/Navigation/Navigation'
import Loading from '../Loading/Loading'
import TaskWindow from './TaskWindow'
import './Tasks.css'

const Tasks = () => {
	const [taskData, setTaskData] = useState(null)
	const [selectedTask, setSelectedTask] = useState(null)
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

	if (!taskData) {
		return <div>No tasks available</div>
	}

	const showTaskWindow = task => {
		setSelectedTask(task)
	}

	const closeTaskWindow = () => {
		setSelectedTask(null)
	}

	return (
		<div className='container'>
			<h1 className='main-title'>Tasks</h1>
			<div className='tasks-content'>
				{taskData.incompleteTasks?.map((task, index) => (
					<div key={index} id='task-container'>
						<div className='block tasks'>
							<div onClick={() => showTaskWindow(task)} className='task'>
								<div id='task-block'>
									<div className='task-logo'>
										<img src={task.iconSrc} alt='task' />
									</div>
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
			</div>
			<Navigation />
			{selectedTask && (
				<TaskWindow
					showTaskWindow={closeTaskWindow}
					taskData={selectedTask}
					buttonText={'Перейти'}
				/>
			)}
		</div>
	)
}

export default Tasks
