import { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	registration?: UseFormRegisterReturn;
}

export default function InputField({
	label,
	error,
	id,
	registration,
	...props
}: InputFieldProps) {
	return (
		<div>
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				{label}
			</label>
			<input
				id={id}
				{...registration}
				{...props}
				className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#AB80DF] focus:border-[#AB80DF] ${
					error
						? 'border-red-300 text-red-900 placeholder-red-300'
						: 'border-gray-300'
				}`}
			/>
			{error && (
				<p className="mt-1 text-sm text-red-600">{error}</p>
			)}
		</div>
	);
}