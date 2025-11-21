import LoginForm from '@/components/forms/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Вход в систему',
};

export default function LoginPage() {
	return <LoginForm />;
}