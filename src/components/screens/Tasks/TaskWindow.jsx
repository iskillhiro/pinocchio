import { Link } from 'react-router-dom'
import './TaskWindow.css'

const TaskWindow = ({ showTaskWindow, taskData, buttonText }) => {
	const goToLink = e => {
		e.stopPropagation()
		window.location.href = taskData.link
	}

	return (
		<div className='task-overlay' onClick={showTaskWindow}>
			<div className='task-popup' onClick={e => e.stopPropagation()}>
				<div className='task-window block'>
					<div id='task-window-info'>
						<div className='task-window-icon'>
							<img src={taskData.iconSrc} alt='boost icon' />
						</div>

						<div className='task-window-data'>
							<h3>{taskData.title}</h3>
							<p>{taskData.reward}</p>
						</div>
					</div>
					<Link to={taskData.link}>
						<button onClick={goToLink} className='gradient-btn'>
							{buttonText}
						</button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default TaskWindow
