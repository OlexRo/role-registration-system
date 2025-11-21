import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios-config';
import { PATHS } from '@/config/paths';
import { LoginRequest } from '@/types/auth';

export const useLogin = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: async (credentials: LoginRequest) => {
			const response = await api.post(PATHS.API.LOGIN, credentials);
			return response.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['profile'] });
		},
	});
};

export const useProfile = () => {
	return useQuery({
		queryKey: ['profile'],
		queryFn: async () => {
			const response = await api.get(PATHS.API.PROFILE);
			return response.data;
		},
		enabled: false,
		retry: false,
	});
};

export const useLogout = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			await api.post(PATHS.API.LOGOUT);
		},
		onSuccess: () => {
			queryClient.clear();
		},
	});
};