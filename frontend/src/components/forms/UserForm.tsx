'use client';

import { useForm } from 'react-hook-form';
import { UserRequest, UserRole, EventLocation, Squad } from '@/types/user';
import { isApiError } from '@/types/api';
import InputField from '@/components/fields/InputField';
import SubmitButton from '@/components/buttons/SubmitButton';
import ErrorMessage from '@/components/fields/ErrorMessage';
import { useCreateUser } from '@/hooks/useUsers';

interface UserFormProps {
	selectedRole: UserRole;
	onSuccess?: () => void;
	onCancel?: () => void;
}

export default function UserForm({ selectedRole, onSuccess, onCancel }: UserFormProps) {
	const { register, handleSubmit, watch, formState: { errors } } = useForm<UserRequest>();
	const { mutate: createUser, isPending, error } = useCreateUser();
	
	const watchedHasAllergies = watch('hasAllergies');
	const watchedNeedSpeech = watch('needSpeech');
	const watchedWillPerform = watch('willPerform');
	const watchedEventLocation = watch('eventLocation');
	
	const isAttendingBanquet = watchedEventLocation === EventLocation.BANQUET ||
		watchedEventLocation === EventLocation.BOTH;
	const isAttendingOfficialPart = watchedEventLocation === EventLocation.OFFICIAL_PART ||
		watchedEventLocation === EventLocation.BOTH;
	
	const onSubmit = (data: UserRequest) => {
		createUser(
			{ ...data, role: selectedRole },
			{
				onSuccess: () => {
					onSuccess?.();
				}
			}
		);
	};
	
	// Правильная обработка ошибок
	const getErrorMessage = (error: unknown): string | null => {
		if (!error) return null;
		
		if (error instanceof Error) {
			return error.message;
		}
		
		if (isApiError(error)) {
			return error.error || error.message;
		}
		
		if (typeof error === 'string') {
			return error;
		}
		
		return 'Произошла неизвестная ошибка';
	};
	
	const errorMessage = getErrorMessage(error);
	
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-900 mb-3">Регистрация</h2>
				<p className="text-gray-600">Заполните информацию для участия в мероприятии</p>
			</div>
			
			<ErrorMessage message={errorMessage} />
			
			{/* Основные поля для всех ролей */}
			<div className="bg-gray-50 rounded-2xl p-6">
				<h3 className="text-xl font-semibold text-gray-900 mb-6">Основная информация</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<InputField
						label="Имя *"
						error={errors.name?.message}
						registration={register('name', { required: 'Имя обязательно' })}
					/>
					<InputField
						label="Фамилия *"
						error={errors.surname?.message}
						registration={register('surname', { required: 'Фамилия обязательна' })}
					/>
					<InputField
						label="Отчество *"
						error={errors.patronymic?.message}
						registration={register('patronymic', { required: 'Отчество обязательно' })}
					/>
				</div>
			</div>
			
			{/* Поля для Гостя */}
			{selectedRole === UserRole.GUEST && (
				<div className="bg-gray-50 rounded-2xl p-6">
					<h3 className="text-xl font-semibold text-gray-900 mb-6">Информация гостя</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-lg font-medium text-gray-700 mb-3">Отряд *</label>
							<select
								{...register('squad', { required: 'Отряд обязателен' })}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AB80DF] focus:border-[#AB80DF] transition-colors duration-200"
							>
								<option value="">Выберите отряд</option>
								<option value={Squad.VAGANTS}>СПО "Ваганты"</option>
								<option value={Squad.VEGA}>СО "Вега"</option>
								<option value={Squad.GNOM}>СПО "ГНОМ"</option>
								<option value={Squad.KAPITEL}>СПО "КапиТель"</option>
								<option value={Squad.PLAMYA}>СПО "Пламя"</option>
								<option value={Squad.TRUVERY}>СПО "Труверы"</option>
								<option value={Squad.FENIKS}>СО "ФениксЪ"</option>
								<option value={Squad.FLIBUSTERY}>СО "Флибустьеры"</option>
								<option value={Squad.ALTAVISTA}>СО "ALTAVISTA"</option>
							</select>
							{errors.squad && (
								<p className="mt-2 text-sm text-red-600">{errors.squad.message}</p>
							)}
						</div>
					</div>
					
					<div className="flex items-center mt-6">
						<label className="flex items-center cursor-pointer">
							<input
								type="checkbox"
								{...register('needSpeech')}
								className="sr-only"
							/>
							<div className={`w-6 h-6 border-2 rounded-md mr-3 flex items-center justify-center transition-colors duration-200 ${
								watchedNeedSpeech ? 'bg-[#AB80DF] border-[#AB80DF]' : 'border-gray-300'
							}`}>
								{watchedNeedSpeech && (
									<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
									</svg>
								)}
							</div>
							<span className="text-lg text-gray-700">Нужно слово на сцене</span>
						</label>
					</div>
				</div>
			)}
			
			{/* Поля для Новичка */}
			{selectedRole === UserRole.NOVICE && (
				<div className="bg-gray-50 rounded-2xl p-6">
					<h3 className="text-xl font-semibold text-gray-900 mb-6">Информация новичка</h3>
					<InputField
						type="date"
						label="Дата рождения *"
						error={errors.birthDate?.message}
						registration={register('birthDate', { required: 'Дата рождения обязательна' })}
					/>
				</div>
			)}
			
			{/* Поля места события для Новичка, Бойца, Старика */}
			{(selectedRole === UserRole.NOVICE || selectedRole === UserRole.FIGHTER || selectedRole === UserRole.VETERAN) && (
				<div className="bg-gray-50 rounded-2xl p-6">
					<h3 className="text-xl font-semibold text-gray-900 mb-6">Место проведения</h3>
					<div>
						<label className="block text-lg font-medium text-gray-700 mb-3">Место события *</label>
						<select
							{...register('eventLocation', { required: 'Место события обязательно' })}
							className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AB80DF] focus:border-[#AB80DF] transition-colors duration-200"
						>
							<option value="">Где Вас ждать?</option>
							<option value={EventLocation.OFFICIAL_PART}>Только официальная часть</option>
							<option value={EventLocation.BANQUET}>Только банкет</option>
							<option value={EventLocation.BOTH}>Полное мероприятие</option>
						</select>
						{errors.eventLocation && (
							<p className="mt-2 text-sm text-red-600">{errors.eventLocation.message}</p>
						)}
					</div>
				</div>
			)}
			
			{/* Поля для Только банкета (если выбрано Только банкет или оба) */}
			{isAttendingBanquet && (selectedRole === UserRole.NOVICE || selectedRole === UserRole.FIGHTER || selectedRole === UserRole.VETERAN) && (
				<div className="bg-gray-50 rounded-2xl p-6">
					<h3 className="text-xl font-semibold text-gray-900 mb-6">Информация для банкета</h3>
					
					<div className="space-y-6">
						<div className="flex items-center">
							<label className="flex items-center cursor-pointer">
								<input
									type="checkbox"
									{...register('hasAllergies')}
									className="sr-only"
								/>
								<div className={`w-6 h-6 border-2 rounded-md mr-3 flex items-center justify-center transition-colors duration-200 ${
									watchedHasAllergies ? 'bg-[#AB80DF] border-[#AB80DF]' : 'border-gray-300'
								}`}>
									{watchedHasAllergies && (
										<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
										</svg>
									)}
								</div>
								<span className="text-lg text-gray-700">Есть аллергия</span>
							</label>
						</div>
						
						{watchedHasAllergies && (
							<InputField
								label="Укажите аллергии"
								registration={register('allergies')}
							/>
						)}
						
						<InputField
							label="Предпочтения в еде"
							registration={register('foodPreferences')}
						/>
						
						<div className="flex items-center">
							<label className="flex items-center cursor-pointer">
								<input
									type="checkbox"
									{...register('wantBowling')}
									className="sr-only"
								/>
								<div className={`w-6 h-6 border-2 rounded-md mr-3 flex items-center justify-center transition-colors duration-200 ${
									watch('wantBowling') ? 'bg-[#AB80DF] border-[#AB80DF]' : 'border-gray-300'
								}`}>
									{watch('wantBowling') && (
										<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
										</svg>
									)}
								</div>
								<span className="text-lg text-gray-700">Хотите играть в боулинг</span>
							</label>
						</div>
					</div>
				</div>
			)}
			
			{/* Поля алкоголя для Бойца на Только банкете (убрали для Старика) */}
			{isAttendingBanquet && selectedRole === UserRole.FIGHTER && (
				<div className="bg-gray-50 rounded-2xl p-6">
					<h3 className="text-xl font-semibold text-gray-900 mb-6">Предпочтения в алкоголе</h3>
					<InputField
						label="Предпочтения в алкоголе"
						registration={register('alcoholPreferences')}
					/>
				</div>
			)}
			
			{/* Поля машины для Бойца и Старика */}
			{(selectedRole === UserRole.FIGHTER || selectedRole === UserRole.VETERAN) && (
				<div className="bg-gray-50 rounded-2xl p-6">
					<h3 className="text-xl font-semibold text-gray-900 mb-6">Транспорт</h3>
					<div className="flex items-center">
						<label className="flex items-center cursor-pointer">
							<input
								type="checkbox"
								{...register('hasCar')}
								className="sr-only"
							/>
							<div className={`w-6 h-6 border-2 rounded-md mr-3 flex items-center justify-center transition-colors duration-200 ${
								watch('hasCar') ? 'bg-[#AB80DF] border-[#AB80DF]' : 'border-gray-300'
							}`}>
								{watch('hasCar') && (
									<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
									</svg>
								)}
							</div>
							<span className="text-lg text-gray-700">Буду на машине</span>
						</label>
					</div>
				</div>
			)}
			
			{/* Поля только для Старика - показываются только если выбрано место события */}
			{selectedRole === UserRole.VETERAN && watchedEventLocation && (
				<div className="bg-gray-50 rounded-2xl p-6">
					<h3 className="text-xl font-semibold text-gray-900 mb-6">Дополнительная информация</h3>
					
					<div className="space-y-6">
						{isAttendingBanquet && (
							<InputField
								label="С кем хотите сидеть на банкете"
								registration={register('tableCompanions')}
							/>
						)}
						
						{/* Поле "Нужно слово на сцене" для всех ролей при выборе официальной части */}
						{isAttendingOfficialPart && (
							<>
								<div className="flex items-center">
									<label className="flex items-center cursor-pointer">
										<input
											type="checkbox"
											{...register('needSpeech')}
											className="sr-only"
										/>
										<div className={`w-6 h-6 border-2 rounded-md mr-3 flex items-center justify-center transition-colors duration-200 ${
											watchedNeedSpeech ? 'bg-[#AB80DF] border-[#AB80DF]' : 'border-gray-300'
										}`}>
											{watchedNeedSpeech && (
												<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
												</svg>
											)}
										</div>
										<span className="text-lg text-gray-700">Нужно слово на сцене</span>
									</label>
								</div>
								
								{watchedNeedSpeech && (
									<InputField
										label="С кем нужно слово на сцене"
										registration={register('speechCompanions')}
									/>
								)}
							</>
						)}
						
						{isAttendingOfficialPart && (
							<>
								<div className="flex items-center">
									<label className="flex items-center cursor-pointer">
										<input
											type="checkbox"
											{...register('willPerform')}
											className="sr-only"
										/>
										<div className={`w-6 h-6 border-2 rounded-md mr-3 flex items-center justify-center transition-colors duration-200 ${
											watchedWillPerform ? 'bg-[#AB80DF] border-[#AB80DF]' : 'border-gray-300'
										}`}>
											{watchedWillPerform && (
												<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
												</svg>
											)}
										</div>
										<span className="text-lg text-gray-700">Буду выступать с номером</span>
									</label>
								</div>
								
								{watchedWillPerform && (
									<InputField
										label="С кем будет номер"
										registration={register('performanceCompanions')}
									/>
								)}
							</>
						)}
					</div>
				</div>
			)}
			
			{/* Поле "Нужно слово на сцене" для Новичка и Бойца при выборе официальной части */}
			{/*{(selectedRole === UserRole.NOVICE || selectedRole === UserRole.FIGHTER) && isAttendingOfficialPart && (*/}
			{/*	<div className="bg-gray-50 rounded-2xl p-6">*/}
			{/*		<h3 className="text-xl font-semibold text-gray-900 mb-6">Дополнительная информация</h3>*/}
			{/*		*/}
			{/*		<div className="space-y-6">*/}
			{/*			<div className="flex items-center">*/}
			{/*				<label className="flex items-center cursor-pointer">*/}
			{/*					<input*/}
			{/*						type="checkbox"*/}
			{/*						{...register('needSpeech')}*/}
			{/*						className="sr-only"*/}
			{/*					/>*/}
			{/*					<div className={`w-6 h-6 border-2 rounded-md mr-3 flex items-center justify-center transition-colors duration-200 ${*/}
			{/*						watchedNeedSpeech ? 'bg-[#AB80DF] border-[#AB80DF]' : 'border-gray-300'*/}
			{/*					}`}>*/}
			{/*						{watchedNeedSpeech && (*/}
			{/*							<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
			{/*								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />*/}
			{/*							</svg>*/}
			{/*						)}*/}
			{/*					</div>*/}
			{/*					<span className="text-lg text-gray-700">Нужно слово на сцене</span>*/}
			{/*				</label>*/}
			{/*			</div>*/}
			{/*			*/}
			{/*			{watchedNeedSpeech && (*/}
			{/*				<InputField*/}
			{/*					label="С кем нужно слово на сцене"*/}
			{/*					registration={register('speechCompanions')}*/}
			{/*				/>*/}
			{/*			)}*/}
			{/*		</div>*/}
			{/*	</div>*/}
			{/*)}*/}
			
			<div className="flex gap-4 pt-6">
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 py-4 px-6 border cursor-pointer border-gray-300 rounded-xl text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#AB80DF] transition-colors duration-200"
					>
						Отмена
					</button>
				)}
				<SubmitButton isLoading={isPending}>
					Отправить
				</SubmitButton>
			</div>
		</form>
	);
}