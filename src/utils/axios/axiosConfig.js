import axios from 'axios'

const axiosDB = axios.create({
	// baseURL: 'http://localhost:5000/api',
	baseURL: 'https://pinocchionode-backend.onrender.com/api',
})

export default axiosDB
