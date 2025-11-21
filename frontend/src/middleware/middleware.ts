import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PATHS } from '@/config/paths';

export function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	const { pathname } = request.nextUrl;
	
	// Защищенные маршруты
	const protectedRoutes = [
		PATHS.DASHBOARD,
		PATHS.PROFILE,
		PATHS.SETTINGS,
	];
	
	const isProtectedRoute = protectedRoutes.some(route =>
		pathname.startsWith(route)
	);
	
	if (!token && isProtectedRoute) {
		return NextResponse.redirect(new URL(PATHS.LOGIN, request.url));
	}
	
	if (token && pathname.startsWith(PATHS.LOGIN)) {
		return NextResponse.redirect(new URL(PATHS.DASHBOARD, request.url));
	}
	
	return NextResponse.next();
}

export const config = {
	matcher: [
		'/pages/dashboard/:path*',
		'/pages/login',
		'/pages/profile/:path*',
		'/pages/settings/:path*',
	],
};