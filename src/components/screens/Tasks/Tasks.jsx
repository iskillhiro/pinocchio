import React from 'react'
import { useQuery } from 'react-query'
import axiosDB from '../../../utils/axios/axiosConfig'
import { getId } from '../../../utils/config'
import { Loader } from '../../ui/Loader/Loader'
import Navigation from '../../ui/Navigation/Navigation'
import TaskWindow from './TaskWindow'
import './Tasks.css'

const Tasks = () => {
	const telegramId = getId()

	const {
		data: taskData,
		isLoading,
		isError,
		refetch,
	} = useQuery(['tasks', telegramId], async () => {
		const response = await axiosDB.get(`/tasks/${telegramId}`)
		return response.data
	})

	const completeTask = async taskId => {
		try {
			await axiosDB.post(`/tasks/complete`, {
				id: taskId,
				telegramId: telegramId,
			})
			// Optionally, refetch tasks after completion
			refetch()
		} catch (error) {
			console.error('Error completing task:', error)
		}
	}

	const showTaskWindow = task => {
		setSelectedTask(task)
	}

	const closeTaskWindow = () => {
		setSelectedTask(null)
	}

	if (isLoading) {
		return (
			<div className='loader-container'>
				<Loader />
			</div>
		)
	}

	if (isError || !taskData || !taskData.incompleteTasks.length) {
		return (
			<div className='container'>
				<h1 className='main-title'>Tasks</h1>
				<div className='tasks-content'>
					<h1 className='text-center gradient'>Soon...</h1>
				</div>
				<Navigation />
			</div>
		)
	}

	return (
		<div className='container'>
			<h1 className='main-title'>Tasks</h1>
			<div className='tasks-content'>
				{taskData.incompleteTasks.map((taskBlock, blockIndex) => (
					<div key={`block-${blockIndex}`} className='block tasks'>
						{taskBlock.tasksBlock.map((task, taskIndex) => (
							<div
								key={`task-${taskIndex}`}
								className='task'
								onClick={() => showTaskWindow(task)}
							>
								<div id='task-block'>
									<div className='task-logo'>
										<img src={`/${task.iconSrc}`} alt='task' />
									</div>
									<div id='task-info'>
										<p id='name'>{task.title}</p>
										<p id='reward'>{task.reward}</p>
									</div>
								</div>
								{!task.isComplete ? (
									<div className='row icon'></div>
								) : (
									<div className='success icon'></div>
								)}
							</div>
						))}
					</div>
				))}
			</div>
			<Navigation />
			{selectedTask && (
				<TaskWindow
					showTaskWindow={closeTaskWindow}
					taskData={selectedTask}
					buttonText={'Join'}
					completeTask={completeTask}
				/>
			)}
		</div>
	)
}

export default Tasks
