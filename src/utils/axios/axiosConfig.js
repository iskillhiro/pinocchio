import axios from 'axios'

const axiosDB = axios.create({
	baseURL: 'https://pinocchionode-backend.onrender.com/api',
})

export default axiosDB
