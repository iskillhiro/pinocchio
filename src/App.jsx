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
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		try {
			tg.ready()
			tg.expand()
		} catch (error) {
			console.error('Telegram WebApp initialization error:', error)
		}

		const id = getId()
		if (id) {
			setTelegramId(id)
		}

		const loadTimeout = setTimeout(() => {
			setIsLoading(false)
		}, 1000)

		return () => clearTimeout(loadTimeout)
	}, [])

	const MemoizedNavigation = useMemo(() => {
		return <Navigation telegramId={telegramId} />
	}, [telegramId])

	if (isLoading) {
		return <Loading />
	}

	return (
		<BrowserRouter>
			<Routes>
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
