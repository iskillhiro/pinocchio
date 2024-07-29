// src/components/ErrorMessage/ErrorMessage.jsx
import PropTypes from 'prop-types'
import React from 'react'
import './ErrorMessageBlock.module.css'

/**
 * Компонент для отображения сообщений об ошибках.
 *
 * @param {Object} props - Свойства компонента.
 * @param {string} props.message - Сообщение об ошибке для отображения.
 * @param {boolean} [props.visible=true] - Управляет видимостью компонента.
 * @param {string} [props.type='error'] - Тип сообщения ('error', 'warning', 'info').
 */
const ErrorMessage = ({ message, visible = true, type = 'error' }) => {
	if (!visible || !message) return null

	return <div className={`error-message ${type}`}>{message}</div>
}

ErrorMessage.propTypes = {
	message: PropTypes.string.isRequired,
	visible: PropTypes.bool,
	type: PropTypes.oneOf(['error', 'warning', 'info']),
}

export default ErrorMessage
