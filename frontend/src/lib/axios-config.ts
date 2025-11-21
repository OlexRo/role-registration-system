import axios from 'axios';
import Cookies from 'js-cookie';
import { PATHS } from '@/config/paths';

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(
	(config) => {
		if (typeof window !== 'undefined') {
			const token = Cookies.get('token');
			if (token) config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => { return Promise.reject(error) }
);

api.interceptors.response.use(
	(response) => {
		if (response.config.responseType === 'blob') {
			return response;
		}
		return response;
	},
	(error) => {
		if (error.response?.status === 401) {
			if (typeof window !== 'undefined') {
				Cookies.remove('token');
				window.location.href = PATHS.LOGIN;
			}
		}
		return Promise.reject(error);
	}
);