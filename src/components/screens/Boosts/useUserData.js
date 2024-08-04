import { useQuery } from 'react-query'
import axiosDB from '../../../utils/axios/axiosConfig'
import { getId } from '../../../utils/config'

// Function to fetch user data from the API
const fetchUserData = async telegramId => {
	const { data } = await axiosDB.get(`/boost/${telegramId}`)
	return data.userData[0]
}

// Custom hook to use user data in a React component
export const useUserData = () => {
	const telegramId = getId()
	return useQuery(['userData', telegramId], () => fetchUserData(telegramId), {
		staleTime: 60000, // Data is considered fresh for 1 minute
		cacheTime: 300000, // Data is cached for 5 minutes
	})
}
