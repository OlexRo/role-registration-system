'use client';

import { UserRole } from '@/types/user';

interface RoleSelectionProps {
	selectedRole: UserRole | null;
	onRoleSelect: (role: UserRole) => void;
}

const roleConfig = {
	[UserRole.GUEST]: {
		title: 'Гость',
		description: 'Приглашенный гость мероприятия'
	},
	[UserRole.NOVICE]: {
		title: 'Новичок',
		description: 'Новый участник отряда'
	},
	[UserRole.FIGHTER]: {
		title: 'Боец',
		description: 'Активный участник отряда'
	},
	[UserRole.VETERAN]: {
		title: 'Старик',
		description: 'Ветеран отряда'
	}
};

export default function RoleSelection({ selectedRole, onRoleSelect }: RoleSelectionProps) {
	return (
		<div className="space-y-8">
			<div className="text-center">
				<h2 className="text-3xl font-bold text-gray-900 mb-3">Выберите вашу роль</h2>
				<p className="text-gray-600">Выберите категорию, которая лучше всего описывает вашу связь с отрядом</p>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
				{Object.entries(roleConfig).map(([role, config]) => (
					<button
						key={role}
						onClick={() => onRoleSelect(role as UserRole)}
						className={`p-8 border-2 rounded-2xl text-left transition-all duration-300 group ${
							selectedRole === role
								? 'border-[#5600BE] bg-[#5600BE] text-white shadow-lg transform scale-105'
								: 'border-gray-200 bg-white hover:border-[#5600BE] hover:shadow-md hover:transform hover:scale-105'
						}`}
					>
						<div className="flex flex-col items-center text-center h-full">
							{/* Иконка круга */}
							<div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${
								selectedRole === role
									? 'bg-white/20'
									: 'bg-gray-100 group-hover:bg-[#5600BE]/10'
							}`}>
								<div className={`w-12 h-12 rounded-full flex items-center justify-center ${
									selectedRole === role
										? 'bg-white'
										: 'bg-[#5600BE] group-hover:bg-[#5600BE]'
								}`}>
									<span className={`text-lg font-bold ${
										selectedRole === role ? 'text-[#5600BE]' : 'text-white'
									}`}>
										{config.title.charAt(0)}
									</span>
								</div>
							</div>
							
							{/* Заголовок */}
							<h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
								selectedRole === role ? 'text-white' : 'text-gray-900'
							}`}>
								{config.title}
							</h3>
							
							{/* Описание */}
							<p className={`text-lg transition-colors duration-300 ${
								selectedRole === role ? 'text-white/90' : 'text-gray-600'
							}`}>
								{config.description}
							</p>
							
							{/* Индикатор выбора с галочкой при наведении */}
							<div className={`mt-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
								selectedRole === role
									? 'border-white bg-white'
									: 'border-gray-300 group-hover:border-[#5600BE] group-hover:bg-[#5600BE]'
							}`}>
								{selectedRole === role ? (
									<div className="w-4 h-4 rounded-full bg-[#5600BE]"></div>
								) : (
									<svg
										className={`w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
											selectedRole === role ? 'hidden' : ''
										}`}
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={3}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								)}
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}