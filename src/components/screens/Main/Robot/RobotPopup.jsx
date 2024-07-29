import React from 'react'
import { Loader } from '../../../ui/Loader/Loader'
import style from './RobotPopup.module.css' // Добавьте стили для всплывающего окна

const RobotPopup = ({ message, onClose, onSendRequest, process }) => {
	return (
		<div className={style.robot_popup_overlay}>
			<div className={style.robot_popup_content}>
				<img src='/boosts/robot.svg' alt='' />
				<h2>{message}</h2>
				<button className='gradient-btn' onClick={onSendRequest}>
					{process ? <Loader /> : 'Claim'}
				</button>
			</div>
		</div>
	)
}

export default RobotPopup
