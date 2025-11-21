'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/config/paths';

interface ProtectedRouteProps {
	children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, isLoading } = useAuthStore();
	const [isClient, setIsClient] = useState(false);
	const router = useRouter();
	
	useEffect(() => {
		setIsClient(true);
	}, []);
	
	useEffect(() => {
		if (isClient && !isLoading && !isAuthenticated) {
			router.push(PATHS.LOGIN);
		}
	}, [isAuthenticated, isLoading, router, isClient]);
	
	if (!isClient || isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Загрузка...</div>
			</div>
		);
	}
	
	return isAuthenticated ? <>{children}</> : null;
}