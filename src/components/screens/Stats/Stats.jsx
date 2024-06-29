import React from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../../ui/Navigation/Navigation.jsx'
import './Stats.css'

const Stats = () => {
	return (
		<div className='container stats'>
			<Link href='/wallet' className='row stats'></Link>
			<h1 className='main-title'>TOTAL TOUCHERS</h1>
			<h3 className='post-title'>3,400,402</h3>
			<h1 className='main-title'>TOTAL PLAYERS</h1>
			<h3 className='post-title'>1,501,194</h3>
			<h1 className='main-title'>DAILY USERS</h1>
			<h3 className='post-title'>544,343</h3>

			<Navigation />
		</div>
	)
}

export default Stats
