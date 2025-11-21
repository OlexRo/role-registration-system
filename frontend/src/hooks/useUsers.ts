import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios-config';
import { UserRequest, UserResponse } from '@/types/user';
import { PATHS } from '@/config/paths';

export const useCreateUser = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async (userData: UserRequest) => {
			const response = await api.post(PATHS.API.USERS, userData);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};

export const useUsers = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: async (): Promise<UserResponse[]> => {
			const response = await api.get(PATHS.API.USERS);
			return response.data;
		},
	});
};

export const useUsersByRole = (role: string) => {
	return useQuery({
		queryKey: ['users', 'role', role],
		queryFn: async (): Promise<UserResponse[]> => {
			const response = await api.get(`${PATHS.API.USERS}/role/${role}`);
			return response.data;
		},
		enabled: !!role,
	});
};

export const useUsersByEventLocation = (eventLocation: string) => {
	return useQuery({
		queryKey: ['users', 'location', eventLocation],
		queryFn: async (): Promise<UserResponse[]> => {
			const response = await api.get(`${PATHS.API.USERS}/location/${eventLocation}`);
			return response.data;
		},
		enabled: !!eventLocation,
	});
};

export const useDeleteUsers = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async (ids: number[]): Promise<void> => {
			await api.delete(`${PATHS.API.USERS}/batch`, { data: ids });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};

// Новый хук для поиска по кнопке
export const useSearchUsers = () => {
	return useMutation({
		mutationFn: async (searchTerm: string): Promise<UserResponse[]> => {
			if (!searchTerm.trim()) {
				const response = await api.get(PATHS.API.USERS);
				return response.data;
			}
			const response = await api.get(`${PATHS.API.USERS}/search?name=${encodeURIComponent(searchTerm)}`);
			return response.data;
		},
	});
};