import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosDB from '../../../utils/axios/axiosConfig.js'
import Navigation from '../../ui/Navigation/Navigation.jsx'
import Loading from '../Loading/Loading.jsx'

import ErrorMessage from '../../ui/ErrorMessageBlock/ErrorMessageBlock.jsx'
import './Stats.css'

const Stats = () => {
	const [loading, setLoading] = useState(true)
	const [statistic, setStatistic] = useState({})
	const [error, setError] = useState(null) // Добавьте состояние для ошибок

	useEffect(() => {
		const getStatistic = async () => {
			try {
				const response = await axiosDB.get('/statistic')
				setStatistic(response.data)
			} catch (error) {
				console.log(error)
				setError('Failed to fetch statistics. Please try again later.') // Установите текст ошибки
			} finally {
				setLoading(false)
			}
		}
		getStatistic()
	}, [])

	if (loading) {
		return <Loading />
	}

	return (
		<div className='container stats'>
			<ErrorMessage message={error} visible={!!error} />{' '}
			<Link to='/wallet' className='row stats'></Link>
			<h1 className='main-title'>TOTAL TOUCHERS</h1>
			<h3 className='post-title'>{statistic.allTouchers}</h3>
			<h1 className='main-title'>TOTAL PLAYERS</h1>
			<h3 className='post-title'>{statistic.totalUsers}</h3>
			<h1 className='main-title'>DAILY USERS</h1>
			<h3 className='post-title'>{statistic.dailyUsers?.length || 0}</h3>{' '}
			<Navigation />
		</div>
	)
}

export default Stats
