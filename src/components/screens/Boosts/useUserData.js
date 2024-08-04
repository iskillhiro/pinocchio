import { useQuery } from 'react-query'
import axiosDB from '../../../utils/axios/axiosConfig'
import { getId } from '../../../utils/config'

const fetchUserData = async telegramId => {
	const { data } = await axiosDB.get(`/boost/${telegramId}`)
	return data.userData[0]
}

export const useUserData = () => {
	const telegramId = getId()
	return useQuery(['userData', telegramId], () => fetchUserData(telegramId), {
		staleTime: 60000, // 1 minute
		cacheTime: 300000, // 5 minutes
	})
}
