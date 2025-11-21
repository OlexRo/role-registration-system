package com.api.backend.dto.response;

import com.api.backend.model.enums.EventLocation;
import com.api.backend.model.enums.Squad;
import com.api.backend.model.enums.UserRole;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserResponse {
	private Long id;
	private String name;
	private String surname;
	private String patronymic;
	private UserRole role;
	private Squad squad;
	private String squadRussianName;
	private Boolean needSpeech;
	private LocalDate birthDate;
	private Boolean alcoholAllowed;
	private EventLocation eventLocation;
	private Boolean attendingBanquet;
	private Boolean attendingOfficialPart;
	private Boolean hasAllergies;
	private String allergies;
	private String foodPreferences;
	private Boolean wantBowling;
	private String alcoholPreferences;
	private Boolean hasCar;
	private String tableCompanions;
	private String speechCompanions;
	private Boolean willPerform;
	private String performanceCompanions;
	private Boolean valid;
	private Boolean showAlcoholWarning;
}