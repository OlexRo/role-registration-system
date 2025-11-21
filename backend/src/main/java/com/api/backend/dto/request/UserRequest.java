package com.api.backend.dto.request;

import com.api.backend.model.enums.EventLocation;
import com.api.backend.model.enums.Squad;
import com.api.backend.model.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRequest {
	
	@NotBlank(message = "Имя обязательно")
	private String name;
	
	@NotBlank(message = "Фамилия обязательна")
	private String surname;
	
	private String patronymic;
	
	@NotNull(message = "Роль обязательна")
	private UserRole role;
	
	private Squad squad;
	private Boolean needSpeech;
	private LocalDate birthDate;
	private EventLocation eventLocation;
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
}