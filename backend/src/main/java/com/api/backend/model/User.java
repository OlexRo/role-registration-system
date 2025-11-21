package com.api.backend.model;

import com.api.backend.model.enums.EventLocation;
import com.api.backend.model.enums.Squad;
import com.api.backend.model.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.Period;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	// Основные поля для всех ролей
	@Column(nullable = false)
	@NotBlank(message = "Имя пользователя не может быть пустым")
	@Size(min = 1, max = 100, message = "Имя пользователя должно содержать от 1 до 100 символов")
	private String name;
	
	@Column(nullable = false)
	@NotBlank(message = "Фамилия пользователя не может быть пустым")
	@Size(min = 1, max = 100, message = "Фамилия пользователя должна быть от 1 до 100 символов")
	private String surname;
	
	@Column(nullable = true)
	@Size(max = 100, message = "Отчество пользователя должно быть до 100 символов")
	private String patronymic;
	
	// Роль пользователя
	@Enumerated(EnumType.STRING)
	@Column(name = "role", nullable = false)
	@NotNull(message = "Роль пользователя не может быть пустой")
	private UserRole role;
	
	// Поля для Гостя
	@Enumerated(EnumType.STRING)
	@Column(name = "squad")
	private Squad squad; // Отряд - только для Гостя
	
	// Общее поле для речи на сцене (для Гостя и Старика)
	@Column(name = "need_speech")
	private Boolean needSpeech; // Слово на сцене - да/нет
	
	// Поля только для Старика (если needSpeech = true)
	@Column(name = "speech_companions")
	private String speechCompanions; // С кем нужно слово на сцене
	
	// Поля для Новичка
	@Column(name = "birth_date")
	private LocalDate birthDate; // Дата рождения - только для Новичка
	
	// Общие поля для Новичка, Бойца, Старика
	@Enumerated(EnumType.STRING)
	@Column(name = "event_location")
	private EventLocation eventLocation; // Место события
	
	// Поля для банкета
	@Column(name = "has_allergies")
	private Boolean hasAllergies; // Есть ли аллергия - да/нет
	
	@Column(name = "allergies")
	private String allergies; // Аллергии (показывается только если hasAllergies = true)
	
	@Column(name = "food_preferences")
	private String foodPreferences; // Предпочтения в еде
	
	@Column(name = "want_bowling")
	private Boolean wantBowling; // Хотите ли боулинг
	
	// Поля для Бойца и Старика
	@Column(name = "alcohol_preferences")
	private String alcoholPreferences; // Предпочтения в алкоголе
	
	@Column(name = "has_car")
	private Boolean hasCar; // Будет ли машина
	
	// Поля только для Старика
	@Column(name = "table_companions")
	private String tableCompanions; // С кем хотите сидеть на банкете
	
	@Column(name = "will_perform")
	private Boolean willPerform; // Будете ли ставить номер на концерте
	
	@Column(name = "performance_companions")
	private String performanceCompanions; // С кем будет номер
	
	// Вычисляемое свойство для проверки возраста
	public boolean isAlcoholAllowed() {
		if (birthDate == null) return true;
		return Period.between(birthDate, LocalDate.now()).getYears() >= 18;
	}
	
	// Методы для проверки ролей
	public boolean isGuest() {
		return UserRole.GUEST.equals(role);
	}
	
	public boolean isNovice() {
		return UserRole.NOVICE.equals(role);
	}
	
	public boolean isFighter() {
		return UserRole.FIGHTER.equals(role);
	}
	
	public boolean isVeteran() {
		return UserRole.VETERAN.equals(role);
	}
	
	// Метод для проверки, будет ли пользователь на банкете
	public boolean isAttendingBanquet() {
		return eventLocation != null &&
				(EventLocation.BANQUET.equals(eventLocation) || EventLocation.BOTH.equals(eventLocation));
	}
	
	// Метод для проверки, будет ли пользователь на официальной части
	public boolean isAttendingOfficialPart() {
		return eventLocation != null &&
				(EventLocation.OFFICIAL_PART.equals(eventLocation) || EventLocation.BOTH.equals(eventLocation));
	}
	
	// Метод для получения названия отряда на русском
	public String getSquadRussianName() {
		if (squad == null) return null;
		return switch (squad) {
			case VAGANTS -> "СПО \"Ваганты\"";
			case VEGA -> "СО \"Вега\"";
			case GNOM -> "СПО \"ГНОМ\"";
			case KAPITEL -> "СПО \"КапиТель\"";
			case PLAMYA -> "СПО \"Пламя\"";
			case TRUVERY -> "СПО \"Труверы\"";
			case FENIKS -> "СО \"ФениксЪ\"";
			case FLIBUSTERY -> "СО \"Флибустьеры\"";
			case ALTAVISTA -> "СО \"ALTAVISTA\"";
		};
	}
	
	// === МЕТОДЫ ДЛЯ ПРОВЕРКИ ДОСТУПНОСТИ ПОЛЕЙ ===
	
	// Для Гостя: отряд обязателен
	public boolean shouldShowSquadField() {
		return isGuest();
	}
	
	// Для Гостя: слово на сцене всегда доступно
	public boolean shouldShowNeedSpeechForGuest() {
		return isGuest();
	}
	
	// Для Старика: слово на сцене всегда доступно
	public boolean shouldShowNeedSpeechForVeteran() {
		return isVeteran();
	}
	
	// Для Новичка: дата рождения обязательна
	public boolean shouldShowBirthDateField() {
		return isNovice();
	}
	
	// Поля места события для Новичка, Бойца, Старика
	public boolean shouldShowEventLocationField() {
		return isNovice() || isFighter() || isVeteran();
	}
	
	// Поля аллергии и еды (только если на банкете)
	public boolean shouldShowAllergyAndFoodFields() {
		return isAttendingBanquet() && (isNovice() || isFighter() || isVeteran());
	}
	
	// Поле для указания аллергии (только если отметили hasAllergies = true)
	public boolean shouldShowAllergiesDetailsField() {
		return Boolean.TRUE.equals(hasAllergies) && isAttendingBanquet() &&
				(isNovice() || isFighter() || isVeteran());
	}
	
	// Поле боулинга (только если на банкете)
	public boolean shouldShowBowlingField() {
		return isAttendingBanquet() && (isNovice() || isFighter() || isVeteran());
	}
	
	// Поле алкоголя для Бойца и Старика (только если на банкете)
	public boolean shouldShowAlcoholPreferencesField() {
		return isAttendingBanquet() && (isFighter() || isVeteran());
	}
	
	// Поле машины для Бойца и Старика
	public boolean shouldShowHasCarField() {
		return isFighter() || isVeteran();
	}
	
	// Поле "с кем сидеть" для Старика (только если на банкете)
	public boolean shouldShowTableCompanionsField() {
		return isVeteran() && isAttendingBanquet();
	}
	
	// Поле "с кем слово" для Старика (только если need_speech = true)
	public boolean shouldShowSpeechCompanionsField() {
		return Boolean.TRUE.equals(needSpeech) && isVeteran();
	}
	
	// Поля выступления для Старика (только если на официальной части)
	public boolean shouldShowPerformanceFields() {
		return isVeteran() && isAttendingOfficialPart();
	}
	
	// Поле "с кем номер" для Старика (только если will_perform = true)
	public boolean shouldShowPerformanceCompanionsField() {
		return Boolean.TRUE.equals(willPerform) && isVeteran() && isAttendingOfficialPart();
	}
	
	// Предупреждение об алкоголе для Новичка
	public boolean shouldShowAlcoholWarning() {
		return isNovice() && isAttendingBanquet() && !isAlcoholAllowed();
	}
	
	// === МЕТОДЫ ДЛЯ ВАЛИДАЦИИ ===
	
	public boolean isGuestValid() {
		return isGuest() && squad != null;
	}
	
	public boolean isNoviceValid() {
		return isNovice() && birthDate != null && eventLocation != null;
	}
	
	public boolean isFighterValid() {
		return isFighter() && eventLocation != null;
	}
	
	public boolean isVeteranValid() {
		return isVeteran() && eventLocation != null;
	}
}