import { ButtonHTMLAttributes } from 'react';

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean;
	loadingText?: string;
	children: string;
}

export default function SubmitButton({
	                                     isLoading = false,
	                                     loadingText = 'Загрузка...',
	                                     children,
	                                     ...props
                                     }: SubmitButtonProps) {
	return (
		<button
			type="submit"
			disabled={isLoading}
			className="group relative cursor-pointer w-full flex justify-center py-4 px-6 border border-transparent text-lg font-medium rounded-xl text-white bg-[#AB80DF] hover:bg-[#975DDE] focus:outline-none focus:ring-2 focus:ring-[#AB80DF] focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200 transform disabled:hover:scale-100"
			{...props}
		>
			{isLoading ? (
				<div className="flex items-center">
					<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					{loadingText}
				</div>
			) : (
				children
			)}
		</button>
	);
}