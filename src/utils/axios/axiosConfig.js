import axios from 'axios'

const axiosDB = axios.create({
	baseURL: 'http://localhost:5000/api',
})

export default axiosDB
