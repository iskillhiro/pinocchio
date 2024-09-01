import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosDB from '../../../utils/axios/axiosConfig.js'
import { getId } from '../../../utils/config.js'
import { numberWithSpaces } from '../../../utils/filterNumbers.js'
import { Loader } from '../../ui/Loader/Loader.jsx'
import Navigation from '../../ui/Navigation/Navigation.jsx'
import './Stats.css'
const Stats = () => {
	const telegramId = getId()
	const [loading, setLoading] = useState(true)
	const [statistic, setStatistic] = useState({})
	useEffect(() => {
		const getStatistic = async () => {
			try {
				const response = await axiosDB.get('/statistic')
				setStatistic(response.data)
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
			}
		}
		getStatistic()
	}, [])
	if (loading) {
		return (
			<div className='loader-container'>
				<Loader />
			</div>
		)
	}
	return (
		<div className='container stats'>
			<Link to='/wallet' className='row stats'></Link>
			<h1 className='main-title'>TOTAL TOUCHERS</h1>
			<h3 className='post-title'>{numberWithSpaces(statistic.allTouchers)}</h3>
			<h1 className='main-title'>TOTAL PLAYERS</h1>
			<h3 className='post-title'>{numberWithSpaces(statistic.totalUsers)}</h3>
			<h1 className='main-title'>DAILY USERS</h1>
			<h3 className='post-title'>
				{numberWithSpaces(statistic.dailyUsers.length)}
			</h3>
			<Navigation telegramId={telegramId} />
		</div>
	)
}

export default Stats
