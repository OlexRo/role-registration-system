export interface LoginRequest {
	username: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	message: string;
	username: string;
}

export interface User {
	username: string;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	login: (credentials: LoginRequest) => Promise<void>;
	logout: () => void;
	clearError: () => void;
}