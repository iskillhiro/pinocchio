import React, { useEffect, useState } from 'react'
import axiosDB from '../../../utils/axios/axiosConfig'
import { getId } from '../../../utils/config'
import { Loader } from '../../ui/Loader/Loader'
import Navigation from '../../ui/Navigation/Navigation'
import TaskWindow from './TaskWindow'
import './Tasks.css'

const Tasks = () => {
	const telegramId = getId()
	const [taskData, setTaskData] = useState(null)
	const [selectedTask, setSelectedTask] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!telegramId) {
			console.error('telegramId is not defined')
			setLoading(false)
			return
		}

		const getTasks = async () => {
			try {
				const response = await axiosDB.get(`/tasks/${telegramId}`)
				setTaskData(response.data)
			} catch (error) {
				console.error('Error fetching tasks:', error)
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
		}
	}

	if (loading) {
		return (
			<div className='loader-container'>
				<Loader />
			</div>
		)
	}

	if (!taskData || !taskData.incompleteTasks.length) {
		return (
			<div className='container'>
				<h1 className='main-title'>Tasks</h1>
				<div className='tasks-content'>
					<h1 className='text-center gradient'>Soon...</h1>
				</div>
				<Navigation telegramId={telegramId} />
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
			{selectedTask && (
				<TaskWindow
					showTaskWindow={closeTaskWindow}
					taskData={selectedTask}
					buttonText={'Join'}
					completeTask={completeTask}
				/>
			)}
			<Navigation telegramId={telegramId} />
		</div>
	)
}

export default Tasks
