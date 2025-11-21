'use client';

import { useState, useMemo, useEffect } from 'react';
import { UserResponse, UserRole } from '@/types/user';
import { useUsers, useDeleteUsers, useSearchUsers } from '@/hooks/useUsers';

const roleLabels = {
	[UserRole.GUEST]: 'Гость',
	[UserRole.NOVICE]: 'Новичок',
	[UserRole.FIGHTER]: 'Боец',
	[UserRole.VETERAN]: 'Старик'
};

const eventLocationLabels = {
	OFFICIAL_PART: 'Официальная часть',
	BANQUET: 'Банкет',
	BOTH: 'Оба мероприятия'
};

export default function UsersTable() {
	const [selectedRole, setSelectedRole] = useState<string>('ALL');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [searchInput, setSearchInput] = useState<string>('');
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
	
	const { data: users, isLoading: isLoadingUsers } = useUsers();
	const { mutate: searchUsers, data: searchResults, isPending: isSearchingPending } = useSearchUsers();
	const deleteUsersMutation = useDeleteUsers();
	
	const displayUsers = isSearching ? searchResults : users;
	
	const filteredUsers = useMemo(() => {
		if (!displayUsers) return [];
		if (selectedRole === 'ALL') return displayUsers;
		return displayUsers.filter(user => user.role === selectedRole);
	}, [displayUsers, selectedRole]);
	
	useEffect(() => {
		if (isSearching) {
			setIsSearching(false);
			setSearchInput('');
		}
	}, [selectedRole]);
	
	const handleSelectUser = (userId: number) => {
		setSelectedUsers(prev =>
			prev.includes(userId)
				? prev.filter(id => id !== userId)
				: [...prev, userId]
		);
	};
	
	const handleSelectAll = () => {
		if (selectedUsers.length === filteredUsers.length) {
			setSelectedUsers([]);
		} else {
			setSelectedUsers(filteredUsers.map(user => user.id));
		}
	};
	
	const handleSearch = () => {
		if (searchInput.trim()) {
			setIsSearching(true);
			searchUsers(searchInput);
		} else {
			setIsSearching(false);
		}
	};
	
	const handleClearSearch = () => {
		setSearchInput('');
		setIsSearching(false);
	};
	
	const handleDeleteClick = () => {
		if (selectedUsers.length === 0) return;
		setShowDeleteModal(true);
	};
	
	const handleConfirmDelete = async () => {
		try {
			await deleteUsersMutation.mutateAsync(selectedUsers);
			setSelectedUsers([]);
			setShowDeleteModal(false);
		} catch (error) {
			console.error('Ошибка при удалении пользователей:', error);
		}
	};
	
	const handleSingleDelete = (userId: number) => {
		setSelectedUsers([userId]);
		setShowDeleteModal(true);
	};
	
	const isLoading = isLoadingUsers || isSearchingPending;
	
	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AB80DF] mx-auto mb-4"></div>
					<div className="text-lg text-gray-600">Загрузка пользователей...</div>
				</div>
			</div>
		);
	}
	
	return (
		<div className="space-y-6">
			{/* Панель управления - улучшенная версия */}
			<div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
				{/* Мобильное меню */}
				<div className="lg:hidden mb-4">
					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
					>
						<span className="font-medium text-gray-700">Фильтры и действия</span>
						<svg
							className={`w-5 h-5 transform transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</button>
				</div>
				
				<div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
					<div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
						{/* Поиск - улучшенный */}
						<div className="flex-1 w-full">
							<label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
								🔍 Поиск по ФИО
							</label>
							<div className="flex flex-col sm:flex-row gap-2">
								<div className="flex-1 relative">
									<input
										id="search"
										type="text"
										placeholder="Введите фамилию, имя или отчество..."
										value={searchInput}
										onChange={(e) => setSearchInput(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												handleSearch();
											}
										}}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB80DF] focus:border-transparent transition-colors"
									/>
									{searchInput && (
										<button
											onClick={() => setSearchInput('')}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
										>
											✕
										</button>
									)}
								</div>
								<div className="flex gap-2">
									<button
										onClick={handleSearch}
										className="px-6 py-3 bg-[#AB80DF] text-white rounded-lg hover:bg-[#5600BE] transition-colors flex items-center gap-2 font-medium"
									>
										<span>Поиск</span>
									</button>
									{isSearching && (
										<button
											onClick={handleClearSearch}
											className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
										>
											Сброс
										</button>
									)}
								</div>
							</div>
						</div>
						
						{/* Фильтр по ролям - улучшенный */}
						<div className="w-full lg:w-auto">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								🎭 Фильтр по роли
							</label>
							<select
								value={selectedRole}
								onChange={(e) => setSelectedRole(e.target.value)}
								className="w-full lg:w-48 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB80DF] focus:border-transparent transition-colors bg-white"
							>
								<option value="ALL">Все роли</option>
								<option value={UserRole.GUEST}>Гости</option>
								<option value={UserRole.NOVICE}>Новички</option>
								<option value={UserRole.FIGHTER}>Бойцы</option>
								<option value={UserRole.VETERAN}>Старики</option>
							</select>
						</div>
						
						{/* Кнопки управления - улучшенные */}
						<div className="w-full lg:w-auto">
							<label className="block text-sm font-medium text-gray-700 mb-2 lg:sr-only">
								Действия
							</label>
							<div className="flex flex-col sm:flex-row gap-3">
								<button
									onClick={handleSelectAll}
									disabled={filteredUsers.length === 0}
									className="px-6 py-3 bg-[#AB80DF] text-white rounded-lg hover:bg-[#5600BE] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
								>
									{selectedUsers.length === filteredUsers.length ? '🗑️ Снять все' : '☑️ Выбрать все'}
								</button>
								
								<button
									onClick={handleDeleteClick}
									disabled={selectedUsers.length === 0}
									className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
								>
									🗑️ Удалить ({selectedUsers.length})
								</button>
							</div>
							
							<div className="mt-3 text-sm text-gray-500 text-center lg:text-left">
								Показано: <span className="font-semibold">{filteredUsers?.length || 0}</span> пользователей
								{isSearching && ' (результаты поиска)'}
							</div>
						</div>
					</div>
				</div>
			</div>
			
			{/* Таблица пользователей - адаптивная */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
				{/* Десктопная таблица */}
				<div className="hidden lg:block">
					<table className="w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
						<tr>
							<th className="w-12 px-4 py-4">
								<input
									type="checkbox"
									checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
									onChange={handleSelectAll}
									className="h-4 w-4 text-[#AB80DF] focus:ring-[#AB80DF] border-gray-300 rounded"
								/>
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ФИО
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Роль
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Место события
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Дополнительно
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Действия
							</th>
						</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
						{filteredUsers?.map((user) => (
							<UserTableRow
								key={user.id}
								user={user}
								isSelected={selectedUsers.includes(user.id)}
								onSelect={() => handleSelectUser(user.id)}
								onDelete={() => handleSingleDelete(user.id)}
							/>
						))}
						{(!filteredUsers || filteredUsers.length === 0) && (
							<tr>
								<td colSpan={6} className="px-6 py-8 text-center">
									<div className="text-gray-500 text-lg mb-2">
										{isSearching ? '🔍 Пользователи не найдены' : '📝 Нет пользователей'}
									</div>
									<p className="text-gray-400 text-sm">
										{isSearching ? 'Попробуйте изменить поисковый запрос' : 'Создайте первого пользователя'}
									</p>
								</td>
							</tr>
						)}
						</tbody>
					</table>
				</div>
				
				{/* Мобильная версия - карточки */}
				<div className="lg:hidden">
					<div className="p-4 space-y-4">
						{filteredUsers?.map((user) => (
							<UserMobileCard
								key={user.id}
								user={user}
								isSelected={selectedUsers.includes(user.id)}
								onSelect={() => handleSelectUser(user.id)}
								onDelete={() => handleSingleDelete(user.id)}
							/>
						))}
						{(!filteredUsers || filteredUsers.length === 0) && (
							<div className="text-center py-8">
								<div className="text-gray-500 text-lg mb-2">
									{isSearching ? '🔍 Пользователи не найдены' : '📝 Нет пользователей'}
								</div>
								<p className="text-gray-400 text-sm">
									{isSearching ? 'Попробуйте изменить поисковый запрос' : 'Создайте первого пользователя'}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
			
			{/* Модальное окно подтверждения удаления */}
			{showDeleteModal && (
				<DeleteConfirmationModal
					count={selectedUsers.length}
					onConfirm={handleConfirmDelete}
					onCancel={() => {
						setShowDeleteModal(false);
						if (selectedUsers.length === 1) {
							setSelectedUsers([]);
						}
					}}
					isDeleting={deleteUsersMutation.isPending}
				/>
			)}
		</div>
	);
}

// Компонент строки таблицы для десктопа
function UserTableRow({
	                      user,
	                      isSelected,
	                      onSelect,
	                      onDelete
                      }: {
	user: UserResponse;
	isSelected: boolean;
	onSelect: () => void;
	onDelete: () => void;
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	
	const getFullName = () => {
		return `${user.surname} ${user.name}${user.patronymic ? ' ' + user.patronymic : ''}`;
	};
	
	const getRoleInfo = () => {
		switch (user.role) {
			case UserRole.GUEST:
				return `Отряд: ${user.squadRussianName || user.squad}`;
			case UserRole.NOVICE:
				return `Возраст: ${user.birthDate ? new Date().getFullYear() - new Date(user.birthDate).getFullYear() + ' лет' : 'не указан'}`;
			case UserRole.FIGHTER:
				return user.hasCar ? '🚗 С машиной' : '🚶 Без машины';
			case UserRole.VETERAN:
				const info = [];
				if (user.hasCar) info.push('🚗 С машиной');
				if (user.willPerform) info.push('🎤 Выступает');
				return info.length > 0 ? info.join(', ') : 'Без доп. опций';
			default:
				return '';
		}
	};
	
	return (
		<>
			<tr className="hover:bg-gray-50 transition-colors">
				<td className="px-4 py-4">
					<input
						type="checkbox"
						checked={isSelected}
						onChange={onSelect}
						className="h-4 w-4 text-[#AB80DF] focus:ring-[#AB80DF] border-gray-300 rounded"
					/>
				</td>
				<td
					className="px-6 py-4 cursor-pointer"
					onClick={() => setIsExpanded(!isExpanded)}
				>
					<div className="text-sm font-semibold text-gray-900">
						{getFullName()}
					</div>
					<div className="text-xs text-gray-500 mt-1">
						Нажмите для подробностей
					</div>
				</td>
				<td
					className="px-6 py-4 cursor-pointer"
					onClick={() => setIsExpanded(!isExpanded)}
				>
					<div className="text-sm font-medium text-gray-900">
						{roleLabels[user.role]}
					</div>
					<div className="text-sm text-gray-600 mt-1">
						{getRoleInfo()}
					</div>
				</td>
				<td
					className="px-6 py-4 cursor-pointer"
					onClick={() => setIsExpanded(!isExpanded)}
				>
					<div className="text-sm text-gray-900">
						{user.eventLocation ? eventLocationLabels[user.eventLocation] : 'Не указано'}
					</div>
					<div className="flex gap-2 mt-1">
						{user.attendingBanquet && (
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
								🍽️ Банкет
							</span>
						)}
						{user.attendingOfficialPart && (
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
								🏛️ Официальная
							</span>
						)}
					</div>
				</td>
				<td
					className="px-6 py-4 text-sm text-gray-600 cursor-pointer"
					onClick={() => setIsExpanded(!isExpanded)}
				>
					<div className="flex flex-wrap gap-1">
						{user.needSpeech && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">🗣️ Речь</span>}
						{user.wantBowling && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">🎳 Боулинг</span>}
						{user.hasAllergies && <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">⚠️ Аллергии</span>}
						{user.alcoholPreferences && <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">🍷 Алкоголь</span>}
					</div>
				</td>
				<td className="px-6 py-4">
					<button
						onClick={onDelete}
						className="text-red-500 hover:text-red-700 font-medium transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
					>
						Удалить
					</button>
				</td>
			</tr>
			
			{isExpanded && (
				<tr className="bg-gray-50">
					<td colSpan={6} className="px-6 py-4">
						<UserDetails user={user} />
					</td>
				</tr>
			)}
		</>
	);
}

// Компонент карточки для мобильной версии
function UserMobileCard({
	                        user,
	                        isSelected,
	                        onSelect,
	                        onDelete
                        }: {
	user: UserResponse;
	isSelected: boolean;
	onSelect: () => void;
	onDelete: () => void;
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	
	const getFullName = () => {
		return `${user.surname} ${user.name}${user.patronymic ? ' ' + user.patronymic : ''}`;
	};
	
	return (
		<div className={`bg-white border rounded-xl p-4 transition-all ${isSelected ? 'border-[#AB80DF] bg-[#F8F5FF]' : 'border-gray-200'}`}>
			{/* Верхняя часть карточки */}
			<div className="flex items-start justify-between mb-3">
				<div className="flex items-start space-x-3 flex-1">
					<input
						type="checkbox"
						checked={isSelected}
						onChange={onSelect}
						className="h-5 w-5 text-[#AB80DF] focus:ring-[#AB80DF] border-gray-300 rounded mt-1"
					/>
					<div className="flex-1">
						<h3 className="font-semibold text-gray-900 text-lg">{getFullName()}</h3>
						<div className="flex items-center gap-2 mt-1">
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#DFC7FD] text-[#5600BE]">
								{roleLabels[user.role]}
							</span>
							{user.eventLocation && (
								<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
									{eventLocationLabels[user.eventLocation]}
								</span>
							)}
						</div>
					</div>
				</div>
				<button
					onClick={onDelete}
					className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
				>
					🗑️
				</button>
			</div>
			
			{/* Быстрая информация */}
			<div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
				{user.birthDate && (
					<div>🎂 {new Date().getFullYear() - new Date(user.birthDate).getFullYear()} лет</div>
				)}
				{user.hasCar && <div>🚗 С машиной</div>}
				{user.wantBowling && <div>🎳 Боулинг</div>}
				{user.willPerform && <div>🎤 Выступает</div>}
			</div>
			
			{/* Дополнительные индикаторы */}
			<div className="flex flex-wrap gap-1 mb-3">
				{user.needSpeech && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">🗣️ Речь</span>}
				{user.hasAllergies && <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">⚠️ Аллергии</span>}
				{user.alcoholPreferences && <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">🍷 Алкоголь</span>}
			</div>
			
			{/* Кнопка раскрытия */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[#AB80DF] hover:text-[#5600BE] transition-colors border-t border-gray-100 pt-3"
			>
				<span>{isExpanded ? 'Скрыть подробности' : 'Показать подробности'}</span>
				<svg
					className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>
			
			{/* Расширенная информация */}
			{isExpanded && (
				<div className="mt-3 pt-3 border-t border-gray-100">
					<UserDetails user={user} />
				</div>
			)}
		</div>
	);
}

// Улучшенное модальное окно подтверждения удаления
function DeleteConfirmationModal({
	                                 count,
	                                 onConfirm,
	                                 onCancel,
	                                 isDeleting
                                 }: {
	count: number;
	onConfirm: () => void;
	onCancel: () => void;
	isDeleting: boolean;
}) {
	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
				<div className="text-center mb-2">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">
						Подтверждение удаления
					</h3>
					<p className="text-gray-600 mb-6">
						Вы точно хотите удалить {count} {count === 1 ? 'пользователя' : 'пользователей'}?
						<br />
						<strong className="text-red-600">Это действие нельзя будет отменить.</strong>
					</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-3">
					<button
						onClick={onCancel}
						disabled={isDeleting}
						className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
					>
						Отмена
					</button>
					<button
						onClick={onConfirm}
						disabled={isDeleting}
						className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
					>
						{isDeleting ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
								Удаление...
							</>
						) : (
							`Удалить (${count})`
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

// Компонент детальной информации о пользователе (адаптированный)
function UserDetails({ user }: { user: UserResponse }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
			<div>
				<h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
					<span className="w-2 h-2 bg-[#AB80DF] rounded-full"></span>
					Основная информация
				</h4>
				<div className="space-y-2">
					<div><span className="text-gray-600">Роль:</span> <strong>{roleLabels[user.role]}</strong></div>
					{user.squad && <div><span className="text-gray-600">Отряд:</span> {user.squadRussianName || user.squad}</div>}
					{user.birthDate && (
						<div>
							<span className="text-gray-600">Дата рождения:</span> {new Date(user.birthDate).toLocaleDateString('ru-RU')}
							{user.showAlcoholWarning && <span className="ml-2 text-red-600 text-xs bg-red-50 px-2 py-1 rounded">🚫 Алкоголь запрещен</span>}
						</div>
					)}
					{user.eventLocation && (
						<div><span className="text-gray-600">Место:</span> {eventLocationLabels[user.eventLocation]}</div>
					)}
				</div>
			</div>
			
			{(user.attendingBanquet && (user.hasAllergies || user.foodPreferences || user.wantBowling || user.alcoholPreferences)) && (
				<div>
					<h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
						<span className="w-2 h-2 bg-green-500 rounded-full"></span>
						Информация для банкета
					</h4>
					<div className="space-y-2">
						{user.hasAllergies && (
							<div>
								<span className="text-gray-600">Аллергии:</span> {user.allergies || 'есть'}
							</div>
						)}
						{user.foodPreferences && (
							<div>
								<span className="text-gray-600">Предпочтения в еде:</span> {user.foodPreferences}
							</div>
						)}
						{user.wantBowling && <div>🎳 Хочет играть в боулинг</div>}
						{user.alcoholPreferences && (
							<div>
								<span className="text-gray-600">Алкоголь:</span> {user.alcoholPreferences}
							</div>
						)}
					</div>
				</div>
			)}
			
			{user.role === UserRole.VETERAN && (
				<div className="md:col-span-2">
					<h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
						<span className="w-2 h-2 bg-purple-500 rounded-full"></span>
						Дополнительная информация
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{user.tableCompanions && (
							<div>
								<span className="text-gray-600">Хочет сидеть с:</span> {user.tableCompanions}
							</div>
						)}
						{user.needSpeech && (
							<div>
								<span className="text-gray-600">Слово на сцене с:</span> {user.speechCompanions || 'не указано'}
							</div>
						)}
						{user.willPerform && (
							<div>
								<span className="text-gray-600">Номер с:</span> {user.performanceCompanions || 'не указано'}
							</div>
						)}
						{user.hasCar && <div>🚗 Будет на машине</div>}
					</div>
				</div>
			)}
			
			{user.valid === false && (
				<div className="md:col-span-2">
					<div className="text-red-600 font-medium bg-red-50 px-4 py-3 rounded-lg border border-red-200">
						⚠️ Не все обязательные поля заполнены
					</div>
				</div>
			)}
		</div>
	);
}