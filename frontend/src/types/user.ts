export enum UserRole {
	GUEST = 'GUEST',
	NOVICE = 'NOVICE',
	FIGHTER = 'FIGHTER',
	VETERAN = 'VETERAN'
}

export enum EventLocation {
	OFFICIAL_PART = 'OFFICIAL_PART',
	BANQUET = 'BANQUET',
	BOTH = 'BOTH'
}

export enum Squad {
	VAGANTS = 'VAGANTS',
	VEGA = 'VEGA',
	GNOM = 'GNOM',
	KAPITEL = 'KAPITEL',
	PLAMYA = 'PLAMYA',
	TRUVERY = 'TRUVERY',
	FENIKS = 'FENIKS',
	FLIBUSTERY = 'FLIBUSTERY',
	ALTAVISTA = 'ALTAVISTA'
}

export interface UserRequest {
	name: string;
	surname: string;
	patronymic?: string;
	role: UserRole;
	
	// Поля для Гостя
	squad?: Squad;
	needSpeech?: boolean;
	
	// Поля для Новичка
	birthDate?: string;
	
	// Общие поля
	eventLocation?: EventLocation;
	
	// Поля для банкета
	hasAllergies?: boolean;
	allergies?: string;
	foodPreferences?: string;
	wantBowling?: boolean;
	
	// Поля для Бойца и Старика
	alcoholPreferences?: string;
	hasCar?: boolean;
	
	// Поля только для Старика
	tableCompanions?: string;
	speechCompanions?: string;
	willPerform?: boolean;
	performanceCompanions?: string;
}

export interface UserResponse {
	id: number;
	name: string;
	surname: string;
	patronymic?: string;
	role: UserRole;
	squad?: Squad;
	squadRussianName?: string;
	needSpeech?: boolean;
	birthDate?: string;
	alcoholAllowed?: boolean;
	eventLocation?: EventLocation;
	attendingBanquet?: boolean;
	attendingOfficialPart?: boolean;
	hasAllergies?: boolean;
	allergies?: string;
	foodPreferences?: string;
	wantBowling?: boolean;
	alcoholPreferences?: string;
	hasCar?: boolean;
	tableCompanions?: string;
	speechCompanions?: string;
	willPerform?: boolean;
	performanceCompanions?: string;
	valid?: boolean;
	showAlcoholWarning?: boolean;
}