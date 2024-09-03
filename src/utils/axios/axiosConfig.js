import axios from 'axios'

const axiosDB = axios.create({
	// baseURL: 'https://pinocchionode-backend.onrender.com/api',
	baseURL: 'http://localhost:5000/api',
})

export default axiosDB
