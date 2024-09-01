import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Boosts from './components/screens/Boosts/Boosts'
import Coins from './components/screens/Coins/Coins'
import Loading from './components/screens/Loading/Loading'
import Main from './components/screens/Main/Main'
import Manual from './components/screens/Manual/Manual'
import Referrals from './components/screens/Referrals/Referrals'
import Stats from './components/screens/Stats/Stats'
import Tasks from './components/screens/Tasks/Tasks'
import Wallet from './components/screens/Wallet/Wallet'

const tg = window.Telegram.WebApp

const AppContent = () => {
	useEffect(() => {
		tg.ready()
		tg.expand()
	}, [])

	return (
		<>
			<Routes>
				<Route path='/' element={<Loading />} />
				<Route path='/manual' element={<Manual />} />
				<Route path='/main' element={<Main />} />
				<Route path='/coins' element={<Coins />} />
				<Route path='/referrals' element={<Referrals />} />
				<Route path='/stats' element={<Stats />} />
				<Route path='/tasks' element={<Tasks />} />
				<Route path='/wallet' element={<Wallet />} />
				<Route path='/boosts' element={<Boosts />} />
			</Routes>
		</>
	)
}

const App = () => {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	)
}

export default App
