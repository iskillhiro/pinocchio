import React, { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Boosts from './components/screens/Boosts/Boosts'
import Coins from './components/screens/Coins/Coins'
import Loading from './components/screens/Loading/Loading'
import Main from './components/screens/Main/Main'
import Manual from './components/screens/Manual/Manual'
import Referrals from './components/screens/Referrals/Referrals'
import Stats from './components/screens/Stats/Stats'
import Tasks from './components/screens/Tasks/Tasks'
import Wallet from './components/screens/Wallet/Wallet'
import Navigation from './components/ui/Navigation/Navigation'
import { getId } from './utils/config'

const tg = window.Telegram.WebApp

const AppContent = () => {
	const [telegramId, setTelegramId] = useState(null)
	const location = useLocation()

	useEffect(() => {
		tg.ready()
		tg.expand()

		const id = getId()
		if (id) {
			setTelegramId(id)
		}
	}, [])

	const MemoizedNavigation = useMemo(() => {
		if (location.pathname !== '/manual') {
			return <Navigation telegramId={telegramId} />
		}
		return null
	}, [location.pathname, telegramId])

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
			{MemoizedNavigation}
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
