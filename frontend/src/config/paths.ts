export const PATHS = {
	HOME: '/',
	LOGIN: '/pages/login',
	
	DASHBOARD: '/pages/dashboard',
	PROFILE: '/pages/profile',
	SETTINGS: '/pages/settings',
	
	API: {
		LOGIN: '/admin/login',
		LOGOUT: '/admin/logout',
		PROFILE: '/admin/profile',
		USERS: '/users',
		REPORTS: '/api/reports',
	},
	
	REDIRECT: {
		AFTER_LOGIN: '/pages/dashboard',
		AFTER_LOGOUT: '/pages/login',
		UNAUTHORIZED: '/pages/login',
	}
} as const;

export type AppPath = typeof PATHS[keyof typeof PATHS];