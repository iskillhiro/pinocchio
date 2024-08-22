import React, { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Boosts from './components/screens/Boosts/Boosts'
import Coins from './components/screens/Coins/Coins'
import Loading from './components/screens/Loading/Loading'
import Main from './components/screens/Main/Main'
import Referrals from './components/screens/Referrals/Referrals'
import Stats from './components/screens/Stats/Stats'
import Tasks from './components/screens/Tasks/Tasks'
import Wallet from './components/screens/Wallet/Wallet'
import Navigation from './components/ui/Navigation/Navigation'
import { getId } from './utils/config'

const tg = window.Telegram.WebApp

const App = () => {
	const [telegramId, setTelegramId] = useState(null)

	useEffect(() => {
		tg.ready()
		tg.expand()

		const id = getId()
		if (id) {
			setTelegramId(id)
		}
	}, [])

	const MemoizedNavigation = useMemo(() => {
		return <Navigation telegramId={telegramId} />
	}, [telegramId])

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Loading />} />
				<Route path='/main' element={<Main />} />
				<Route path='/coins' element={<Coins />} />
				<Route path='/referrals' element={<Referrals />} />
				<Route path='/stats' element={<Stats />} />
				<Route path='/tasks' element={<Tasks />} />
				<Route path='/wallet' element={<Wallet />} />
				<Route path='/boosts' element={<Boosts />} />
			</Routes>
			{MemoizedNavigation}
		</BrowserRouter>
	)
}

export default App
