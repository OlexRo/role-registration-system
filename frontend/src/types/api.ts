export interface ApiError {
	message: string;
	error?: string;
}

export function isApiError(error: unknown): error is ApiError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'message' in error
	);
}