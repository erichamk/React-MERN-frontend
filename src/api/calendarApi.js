import axios from 'axios';
import { getEnvVariables } from '../helpers';

const calendarApi = axios.create({
	baseURL: getEnvVariables().VITE_API_URL,
});

calendarApi.interceptors.request.use((config) => {
	config.headers = {
		...config.headers,
		'x-token': localStorage.getItem('token'),
	};
	return config;
});

export default calendarApi;
