// pages/DashboardPage.tsx - обновленная версия с цветами как в HomePage
'use client';

import ProtectedRoute from '@/components/fields/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';
import { PATHS } from '@/config/paths';
import UsersTable from '@/components/UsersTable';
import UsersStats from '@/components/UsersStats';
import ReportsSection from '@/components/ReportsSection';
import Link from 'next/link';
import {useUsers} from '@/hooks/useUsers';

export default function DashboardPage() {
	const { user, logout } = useAuthStore();
	
	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50 p-8">
				<div className="max-w-7xl mx-auto">
					{/* Шапка */}
					<div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-200">
						<div className="flex justify-between items-center">
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									Панель управления
								</h1>
								<p className="text-gray-600 mt-1">
									Управление участниками мероприятия
								</p>
							</div>
							<div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Добро пожаловать, {user?.username}
                </span>
								<Link
									href="/"
									className="bg-[#AB80DF] text-white px-4 py-2 rounded-lg hover:bg-[#5600BE] transition-colors flex items-center space-x-2"
								>
									<span>📝</span>
									<span>Создать участника</span>
								</Link>
								<button
									onClick={logout}
									className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
								>
									Выйти
								</button>
							</div>
						</div>
					</div>
					
					{/* Секция отчетов */}
					<ReportsSection />
					
					{/* Статистика */}
					<UsersStats />
					
					{/* Дополнительная статистика по мероприятиям */}
					<EventStats />
					
					{/* Таблица пользователей */}
					<div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
						<div className="mb-6">
							<h2 className="text-xl font-bold text-gray-900 mb-2">
								Список участников
							</h2>
							<p className="text-gray-600">
								Просмотр и управление всеми зарегистрированными участниками
							</p>
						</div>
						<UsersTable />
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
}

// Компонент EventStats с обновленными цветами
function EventStats() {
	const { data: users } = useUsers();
	
	const eventStats = {
		official: users?.filter(user =>
			user.eventLocation === 'OFFICIAL_PART' || user.eventLocation === 'BOTH'
		).length || 0,
		banquet: users?.filter(user =>
			user.eventLocation === 'BANQUET' || user.eventLocation === 'BOTH'
		).length || 0,
		both: users?.filter(user => user.eventLocation === 'BOTH').length || 0,
		withCar: users?.filter(user => user.hasCar).length || 0,
		bowling: users?.filter(user => user.wantBowling).length || 0,
		performance: users?.filter(user => user.willPerform).length || 0,
	};
	
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
			<div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:border-[#AB80DF] transition-colors">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-600">На официальной части</p>
						<p className="text-2xl font-bold text-gray-900">{eventStats.official}</p>
					</div>
					<div className="p-3 bg-[#DFC7FD] rounded-lg">
						<span className="text-2xl text-[#5600BE]">🏛️</span>
					</div>
				</div>
			</div>
			
			<div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:border-[#AB80DF] transition-colors">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-600">На банкете</p>
						<p className="text-2xl font-bold text-gray-900">{eventStats.banquet}</p>
					</div>
					<div className="p-3 bg-[#DFC7FD] rounded-lg">
						<span className="text-2xl text-[#5600BE]">🍽️</span>
					</div>
				</div>
			</div>
			
			<div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:border-[#AB80DF] transition-colors">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-600">На обоих мероприятиях</p>
						<p className="text-2xl font-bold text-gray-900">{eventStats.both}</p>
					</div>
					<div className="p-3 bg-[#DFC7FD] rounded-lg">
						<span className="text-2xl text-[#5600BE]">🎉</span>
					</div>
				</div>
			</div>
		</div>
	);
}