import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginRequest } from '@/types/auth';
import Cookies from 'js-cookie';
import { PATHS } from '@/config/paths';

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
			login: async (credentials: LoginRequest) => {
				set({ isLoading: true, error: null });
				try {
					const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${PATHS.API.LOGIN}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(credentials),
					});
					
					if (!response.ok) {
						throw new Error('Ошибка авторизации');
					}
					const data = await response.json();
					const { token, username } = data;
					Cookies.set('token', token, {
						expires: 1,
						secure: process.env.NODE_ENV === 'production',
						sameSite: 'strict'
					});
					set({
						user: { username },
						token,
						isAuthenticated: true,
						isLoading: false,
						error: null,
					});
				} catch (error: any) {
					const errorMessage = error.message || 'Ошибка авторизации';
					set({
						isLoading: false,
						error: errorMessage,
						isAuthenticated: false,
						user: null,
						token: null,
					});
					throw new Error(errorMessage);
				}
			},
			logout: () => {
				Cookies.remove('token');
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					error: null,
				});
				if (typeof window !== 'undefined') {
					window.location.href = PATHS.LOGIN;
				}
			},
			clearError: () => {
				set({ error: null });
			},
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated
			}),
		}
	)
);