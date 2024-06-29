import React from 'react'
import Navigation from '../../ui/Navigation/Navigation'
import './Tasks.css'

const Tasks = () => {
	const taskData = [
		{ name: 'Follow Command', reward: '200.000' },
		{ name: 'Follow Command', reward: '200.000' },
		{ name: 'Follow Command', reward: '200.000' },
		{ name: 'Follow Command', reward: '200.000' },
		{ name: 'Follow Command', reward: '200.000' },
		{ name: 'Follow Command', reward: '200.000' },
		{ name: 'Follow Command', reward: '200.000' },
	]

	return (
		<div className='container'>
			<h1 className='main-title'>tasks</h1>
			<div className='tasks-content'>
				{taskData.map((task, index) => (
					<div key={index} id='task-container'>
						<div className='block tasks'>
							<div className='task'>
								<div id='task-block'>
									<div className='task-logo'></div>
									<div id='task-info'>
										<p id='name'>{task.name}</p>
										<p id='reward'>{task.reward}</p>
									</div>
								</div>
								<div className='row icon'></div>
							</div>
						</div>
					</div>
				))}
			</div>
			<Navigation />
		</div>
	)
}

export default Tasks
