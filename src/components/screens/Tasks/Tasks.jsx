import React, { useEffect, useState } from 'react'
import axiosDB from '../../../utils/axios/axiosConfig'
import { getId } from '../../../utils/config'
import Navigation from '../../ui/Navigation/Navigation'
import Loading from '../Loading/Loading'

import ErrorMessage from '../../ui/ErrorMessageBlock/ErrorMessageBlock'
import TaskWindow from './TaskWindow'
import './Tasks.css'

const Tasks = () => {
	const telegramId = getId()
	const [taskData, setTaskData] = useState(null)
	const [selectedTask, setSelectedTask] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null) // Добавьте состояние для ошибок

	useEffect(() => {
		const getTasks = async () => {
			try {
				const response = await axiosDB.get(`/tasks/${telegramId}`)
				console.log('Fetched task data:', response.data) // Log the fetched data
				setTaskData(response.data)
			} catch (error) {
				console.error('Error fetching tasks:', error)
				setError('Failed to fetch tasks. Please try again later.') // Установите текст ошибки
			} finally {
				setLoading(false)
			}
		}

		getTasks()
	}, [telegramId])

	const completeTask = async taskId => {
		try {
			await axiosDB.post(`/tasks/complete`, {
				id: taskId,
				telegramId: telegramId,
			})

			// Update task state after a successful request
			setTaskData(prevData => {
				const updatedIncompleteTasks = prevData.incompleteTasks.map(
					taskBlock => {
						const updatedTasks = taskBlock.tasksBlock.map(task => {
							if (task._id === taskId) {
								return { ...task, isComplete: true }
							}
							return task
						})

						return { ...taskBlock, tasksBlock: updatedTasks }
					}
				)

				return {
					...prevData,
					incompleteTasks: updatedIncompleteTasks.filter(taskBlock =>
						taskBlock.tasksBlock.some(task => !task.isComplete)
					),
				}
			})
		} catch (error) {
			console.error('Error completing task:', error)
			setError('Failed to complete the task. Please try again later.') // Установите текст ошибки
		}
	}

	if (loading) {
		return <Loading />
	}

	if (!taskData || !taskData.incompleteTasks.length) {
		return (
			<div className='container'>
				<ErrorMessage message={error} visible={!!error} />{' '}
				{/* Используйте компонент ErrorMessage */}
				<h1 className='main-title'>Tasks</h1>
				<div className='tasks-content'>
					<h1 className='text-center gradient'>Soon...</h1>
				</div>
				<Navigation />
			</div>
		)
	}

	const showTaskWindow = task => {
		setSelectedTask(task)
	}

	const closeTaskWindow = () => {
		setSelectedTask(null)
	}

	return (
		<div className='container'>
			<ErrorMessage message={error} visible={!!error} />{' '}
			{/* Используйте компонент ErrorMessage */}
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
										<p id='name'>{task.taskType}</p>
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
					buttonText={'Перейти'}
					completeTask={completeTask}
				/>
			)}
		</div>
	)
}

export default Tasks
