// components/UsersStats.tsx с обновленными цветами
'use client';

import { useUsers } from '@/hooks/useUsers';
import { UserRole } from '@/types/user';

export default function UsersStats() {
	const { data: users, isLoading } = useUsers();
	
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
				{[...Array(4)].map((_, index) => (
					<div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
						<div className="flex items-center">
							<div className="p-2 bg-gray-100 rounded-lg animate-pulse">
								<div className="w-8 h-8 bg-gray-200 rounded"></div>
							</div>
							<div className="ml-4 space-y-2">
								<div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
								<div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}
	
	const stats = {
		total: users?.length || 0,
		guests: users?.filter(user => user.role === UserRole.GUEST).length || 0,
		novices: users?.filter(user => user.role === UserRole.NOVICE).length || 0,
		fighters: users?.filter(user => user.role === UserRole.FIGHTER).length || 0,
		veterans: users?.filter(user => user.role === UserRole.VETERAN).length || 0,
	};
	
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
			<StatCard
				title="Всего участников"
				value={stats.total}
				icon="👥"
				color="purple"
				description="Все зарегистрированные пользователи"
			/>
			<StatCard
				title="Гости"
				value={stats.guests}
				icon="🎭"
				color="purple"
				description="Участники с ролью Гость"
			/>
			<StatCard
				title="Новички"
				value={stats.novices}
				icon="🌱"
				color="purple"
				description="Участники с ролью Новичок"
			/>
			<StatCard
				title="Бойцы"
				value={stats.fighters}
				icon="🌟"
				color="purple"
				description="Участники с ролью Боец"
			/>
			<StatCard
				title="Старики"
				value={stats.veterans}
				icon="🎓"
				color="purple"
				description="Участники с ролью Старик"
			/>
		</div>
	);
}

function StatCard({
	                  title,
	                  value,
	                  icon,
	                  color,
	                  description
                  }: {
	title: string;
	value: number;
	icon: string;
	color: string;
	description?: string;
}) {
	const colorClasses = {
		purple: 'bg-[#DFC7FD] text-[#5600BE]',
	};
	
	return (
		<div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:border-[#AB80DF] transition-colors hover:shadow-md">
			<div className="flex items-start justify-between">
				<div className="flex items-center">
					<div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
						<span className="text-2xl">{icon}</span>
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-gray-600">{title}</p>
						<p className="text-2xl font-bold text-gray-900">{value}</p>
					</div>
				</div>
			</div>
			{description && (
				<p className="mt-3 text-xs text-gray-500 border-t pt-2">
					{description}
				</p>
			)}
		</div>
	);
}