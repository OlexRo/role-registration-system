'use client';

import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/config/paths';
import { useLogin } from '@/hooks/useAuth';
import InputField from '@/components/fields/InputField';
import ErrorMessage from '@/components/fields/ErrorMessage';
import SubmitButton from '@/components/buttons/SubmitButton';

interface LoginFormData {
	username: string;
	password: string;
}

export default function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setError
	} = useForm<LoginFormData>({
		mode: 'onChange',
		defaultValues: {
			username: '',
			password: ''
		}
	});
	const { clearError } = useAuthStore();
	const router = useRouter();
	const loginMutation = useLogin();
	
	const onSubmit = async (data: LoginFormData) => {
		clearError();
		try {
			await loginMutation.mutateAsync(data);
			await useAuthStore.getState().login(data);
			router.push(PATHS.REDIRECT.AFTER_LOGIN);
		} catch (error: any) {
			if (error.response?.data?.message) {
				setError('root', {
					type: 'server',
					message: error.response.data.message
				});
			}
		}
	};
	
	const isLoading = loginMutation.isPending;
	const serverError = loginMutation.error?.message || null;
	
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Вход в систему
					</h2>
				</div>
				
				<form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
					<InputField
						id="username"
						label="Имя пользователя"
						type="text"
						required
						registration={register('username', {
							required: 'Имя пользователя обязательно',
							minLength: {
								value: 3,
								message: 'Имя пользователя должно содержать минимум 3 символа'
							},
							maxLength: {
								value: 20,
								message: 'Имя пользователя должно содержать максимум 20 символов'
							}
						})}
						error={errors.username?.message}
					/>
					<InputField
						id="password"
						label="Пароль"
						type="password"
						required
						registration={register('password', {
							required: 'Пароль обязателен',
							minLength: {
								value: 6,
								message: 'Пароль должен содержать минимум 6 символов'
							}
						})}
						error={errors.password?.message}
					/>
					{/* Показываем серверные ошибки */}
					<ErrorMessage message={serverError} />
					{/* Показываем ошибки формы из react-hook-form */}
					{errors.root && (
						<ErrorMessage message={errors.root.message} />
					)}
					<SubmitButton
						isLoading={isLoading}
						loadingText="Вход..."
						disabled={!isValid || isLoading}
					>
						Войти
					</SubmitButton>
				</form>
			</div>
		</div>
	);
}