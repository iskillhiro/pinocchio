import axios from 'axios'

const axiosDB = axios.create({
	baseURL: 'https://pinocchionode-backend.onrender.com',
})

export default axiosDB
