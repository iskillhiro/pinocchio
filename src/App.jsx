import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Boosts from './components/screens/Boosts/Boosts'
import Coins from './components/screens/Coins/Coins'
import Main from './components/screens/Main/Main'
import Referrals from './components/screens/Referrals/Referrals'
import Stats from './components/screens/Stats/Stats'
import Tasks from './components/screens/Tasks/Tasks'
import Wallet from './components/screens/Wallet/Wallet'

const App = () => {
	useEffect(() => {
		if (window.Telegram && window.Telegram.webApp) {
			window.Telegram.webApp.ready()
		} else {
			console.error('Telegram Web App is not available')
		}
	}, [])

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Main />} />
				<Route path='/coins' element={<Coins />} />
				<Route path='/referrals' element={<Referrals />} />
				<Route path='/stats' element={<Stats />} />
				<Route path='/tasks' element={<Tasks />} />
				<Route path='/wallet' element={<Wallet />} />
				<Route path='/boosts' element={<Boosts />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
