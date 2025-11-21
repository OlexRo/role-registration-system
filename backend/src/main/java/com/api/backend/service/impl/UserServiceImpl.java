package com.api.backend.service.impl;

import com.api.backend.dto.request.UserRequest;
import com.api.backend.dto.response.UserResponse;
import com.api.backend.model.User;
import com.api.backend.model.enums.EventLocation;
import com.api.backend.model.enums.UserRole;
import com.api.backend.repository.UserRepository;
import com.api.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	
	private final UserRepository userRepository;
	
	@Override
	@Transactional(readOnly = true)
	public List<UserResponse> getAllUsers() {
		log.info("Получение всех пользователей");
		return userRepository.findAll().stream()
				.map(this::convertToResponse)
				.collect(Collectors.toList());
	}
	
	@Override
	@Transactional(readOnly = true)
	public UserResponse getUserById(Long id) {
		log.info("Получение пользователя с ID: {}", id);
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Пользователь не найден с ID: " + id));
		return convertToResponse(user);
	}
	
	@Override
	@Transactional
	public UserResponse createUser(UserRequest userRequest) {
		log.info("Создание нового пользователя: {}", userRequest.getName());
		
		User user = convertToEntity(userRequest);
		
		// Валидация запрещенных полей
		validateRoleSpecificFields(user);
		
		// Валидация пользователя
		if (!validateUser(user)) {
			String errors = getUserValidationErrors(user);
			throw new RuntimeException("Ошибка валидации: " + errors);
		}
		
		User savedUser = userRepository.save(user);
		log.info("Пользователь создан с ID: {}", savedUser.getId());
		
		return convertToResponse(savedUser);
	}
	
	@Override
	@Transactional
	public UserResponse updateUser(Long id, UserRequest userRequest) {
		log.info("Обновление пользователя с ID: {}", id);
		
		User existingUser = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Пользователь не найден с ID: " + id));
		
		// Обновляем поля
		updateEntityFromRequest(existingUser, userRequest);
		
		// Валидация запрещенных полей
		validateRoleSpecificFields(existingUser);
		
		// Валидация
		if (!validateUser(existingUser)) {
			String errors = getUserValidationErrors(existingUser);
			throw new RuntimeException("Ошибка валидации: " + errors);
		}
		
		User updatedUser = userRepository.save(existingUser);
		log.info("Пользователь с ID: {} обновлен", id);
		
		return convertToResponse(updatedUser);
	}
	
	@Override
	@Transactional
	public void deleteUser(Long id) {
		log.info("Удаление пользователя с ID: {}", id);
		if (!userRepository.existsById(id)) {
			throw new RuntimeException("Пользователь не найден с ID: " + id);
		}
		userRepository.deleteById(id);
		log.info("Пользователь с ID: {} удален", id);
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<UserResponse> getUsersByRole(String role) {
		log.info("Получение пользователей с ролью: {}", role);
		try {
			UserRole userRole = UserRole.valueOf(role.toUpperCase());
			return userRepository.findByRole(userRole).stream()
					.map(this::convertToResponse)
					.collect(Collectors.toList());
		} catch (IllegalArgumentException e) {
			throw new RuntimeException("Неверная роль: " + role);
		}
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<UserResponse> getUsersByEventLocation(String eventLocation) {
		log.info("Получение пользователей с местом события: {}", eventLocation);
		try {
			EventLocation location = EventLocation.valueOf(eventLocation.toUpperCase());
			return userRepository.findByEventLocation(location).stream()
					.map(this::convertToResponse)
					.collect(Collectors.toList());
		} catch (IllegalArgumentException e) {
			throw new RuntimeException("Неверное место события: " + eventLocation);
		}
	}
	
	@Override
	public boolean validateUser(User user) {
		return switch (user.getRole()) {
			case GUEST -> user.isGuestValid();
			case NOVICE -> user.isNoviceValid();
			case FIGHTER -> user.isFighterValid();
			case VETERAN -> user.isVeteranValid();
		};
	}
	
	@Override
	public String getUserValidationErrors(User user) {
		StringBuilder errors = new StringBuilder();
		
		switch (user.getRole()) {
			case GUEST:
				if (user.getSquad() == null) {
					errors.append("Гость должен указать отряд. ");
				}
				break;
			case NOVICE:
				if (user.getBirthDate() == null) {
					errors.append("Новичок должен указать дату рождения. ");
				}
				if (user.getEventLocation() == null) {
					errors.append("Новичок должен указать место события. ");
				}
				break;
			case FIGHTER:
				if (user.getEventLocation() == null) {
					errors.append("Боец должен указать место события. ");
				}
				break;
			case VETERAN:
				if (user.getEventLocation() == null) {
					errors.append("Старик должен указать место события. ");
				}
				break;
		}
		
		return errors.toString().trim();
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<UserResponse> searchUsersByName(String name) {
		log.info("Поиск пользователей по имени: {}", name);
		
		if (name == null || name.trim().isEmpty()) {
			return getAllUsers();
		}
		
		String searchTerm = name.trim();
		List<User> users = userRepository.searchByName(searchTerm);
		
		return users.stream()
				.map(this::convertToResponse)
				.collect(Collectors.toList());
	}
	
	@Override
	@Transactional
	public void deleteUsers(List<Long> ids) {
		log.info("Массовое удаление пользователей с ID: {}", ids);
		
		if (ids == null || ids.isEmpty()) {
			throw new RuntimeException("Список ID для удаления не может быть пустым");
		}
		
		for (Long id : ids) {
			if (!userRepository.existsById(id)) {
				throw new RuntimeException("Пользователь не найден с ID: " + id);
			}
		}
		
		userRepository.deleteAllById(ids);
		log.info("Удалено {} пользователей", ids.size());
	}
	
	// НОВЫЙ МЕТОД: Валидация запрещенных полей для ролей
	private void validateRoleSpecificFields(User user) {
		switch (user.getRole()) {
			case GUEST:
				if (user.getBirthDate() != null) {
					throw new RuntimeException("Гость не может иметь дату рождения");
				}
				if (user.getEventLocation() != null) {
					throw new RuntimeException("Гость не может указывать место события");
				}
				if (user.getHasAllergies() != null) {
					throw new RuntimeException("Гость не может указывать информацию об аллергии");
				}
				if (user.getAllergies() != null) {
					throw new RuntimeException("Гость не может указывать аллергии");
				}
				if (user.getFoodPreferences() != null) {
					throw new RuntimeException("Гость не может указывать предпочтения в еде");
				}
				if (user.getWantBowling() != null) {
					throw new RuntimeException("Гость не может указывать предпочтения по боулингу");
				}
				if (user.getAlcoholPreferences() != null) {
					throw new RuntimeException("Гость не может указывать предпочтения по алкоголю");
				}
				if (user.getHasCar() != null) {
					throw new RuntimeException("Гость не может указывать наличие машины");
				}
				if (user.getTableCompanions() != null) {
					throw new RuntimeException("Гость не может указывать с кем сидеть");
				}
				if (user.getSpeechCompanions() != null) {
					throw new RuntimeException("Гость не может указывать с кем слово на сцене");
				}
				if (user.getWillPerform() != null) {
					throw new RuntimeException("Гость не может указывать будет ли выступать");
				}
				if (user.getPerformanceCompanions() != null) {
					throw new RuntimeException("Гость не может указывать с кем номер");
				}
				break;
			
			case NOVICE:
				if (user.getSquad() != null) {
					throw new RuntimeException("Новичок не может иметь отряд");
				}
				if (user.getAlcoholPreferences() != null) {
					throw new RuntimeException("Новичок не может указывать предпочтения по алкоголю");
				}
				if (user.getHasCar() != null) {
					throw new RuntimeException("Новичок не может указывать наличие машины");
				}
				if (user.getTableCompanions() != null) {
					throw new RuntimeException("Новичок не может указывать с кем сидеть");
				}
				if (user.getSpeechCompanions() != null) {
					throw new RuntimeException("Новичок не может указывать с кем слово на сцене");
				}
				if (user.getWillPerform() != null) {
					throw new RuntimeException("Новичок не может указывать будет ли выступать");
				}
				if (user.getPerformanceCompanions() != null) {
					throw new RuntimeException("Новичок не может указывать с кем номер");
				}
				break;
			
			case FIGHTER:
				if (user.getSquad() != null) {
					throw new RuntimeException("Боец не может иметь отряд");
				}
				if (user.getBirthDate() != null) {
					throw new RuntimeException("Боец не может иметь дату рождения");
				}
				if (user.getTableCompanions() != null) {
					throw new RuntimeException("Боец не может указывать с кем сидеть");
				}
				if (user.getSpeechCompanions() != null) {
					throw new RuntimeException("Боец не может указывать с кем слово на сцене");
				}
				if (user.getWillPerform() != null) {
					throw new RuntimeException("Боец не может указывать будет ли выступать");
				}
				if (user.getPerformanceCompanions() != null) {
					throw new RuntimeException("Боец не может указывать с кем номер");
				}
				break;
			
			case VETERAN:
				if (user.getSquad() != null) {
					throw new RuntimeException("Старик не может иметь отряд");
				}
				if (user.getBirthDate() != null) {
					throw new RuntimeException("Старик не может иметь дату рождения");
				}
				break;
		}
	}
	
	// Конвертеры
	
	private User convertToEntity(UserRequest request) {
		User user = new User();
		user.setName(request.getName());
		user.setSurname(request.getSurname());
		user.setPatronymic(request.getPatronymic());
		user.setRole(request.getRole());
		user.setSquad(request.getSquad());
		user.setNeedSpeech(request.getNeedSpeech());
		user.setBirthDate(request.getBirthDate());
		user.setEventLocation(request.getEventLocation());
		user.setHasAllergies(request.getHasAllergies());
		user.setAllergies(request.getAllergies());
		user.setFoodPreferences(request.getFoodPreferences());
		user.setWantBowling(request.getWantBowling());
		user.setAlcoholPreferences(request.getAlcoholPreferences());
		user.setHasCar(request.getHasCar());
		user.setTableCompanions(request.getTableCompanions());
		user.setSpeechCompanions(request.getSpeechCompanions());
		user.setWillPerform(request.getWillPerform());
		user.setPerformanceCompanions(request.getPerformanceCompanions());
		
		return user;
	}
	
	private void updateEntityFromRequest(User user, UserRequest request) {
		if (request.getName() != null) user.setName(request.getName());
		if (request.getSurname() != null) user.setSurname(request.getSurname());
		if (request.getPatronymic() != null) user.setPatronymic(request.getPatronymic());
		if (request.getRole() != null) user.setRole(request.getRole());
		if (request.getSquad() != null) user.setSquad(request.getSquad());
		if (request.getNeedSpeech() != null) user.setNeedSpeech(request.getNeedSpeech());
		if (request.getBirthDate() != null) user.setBirthDate(request.getBirthDate());
		if (request.getEventLocation() != null) user.setEventLocation(request.getEventLocation());
		if (request.getHasAllergies() != null) user.setHasAllergies(request.getHasAllergies());
		if (request.getAllergies() != null) user.setAllergies(request.getAllergies());
		if (request.getFoodPreferences() != null) user.setFoodPreferences(request.getFoodPreferences());
		if (request.getWantBowling() != null) user.setWantBowling(request.getWantBowling());
		if (request.getAlcoholPreferences() != null) user.setAlcoholPreferences(request.getAlcoholPreferences());
		if (request.getHasCar() != null) user.setHasCar(request.getHasCar());
		if (request.getTableCompanions() != null) user.setTableCompanions(request.getTableCompanions());
		if (request.getSpeechCompanions() != null) user.setSpeechCompanions(request.getSpeechCompanions());
		if (request.getWillPerform() != null) user.setWillPerform(request.getWillPerform());
		if (request.getPerformanceCompanions() != null) user.setPerformanceCompanions(request.getPerformanceCompanions());
	}
	
	private UserResponse convertToResponse(User user) {
		UserResponse response = new UserResponse();
		response.setId(user.getId());
		response.setName(user.getName());
		response.setSurname(user.getSurname());
		response.setPatronymic(user.getPatronymic());
		response.setRole(user.getRole());
		response.setSquad(user.getSquad());
		response.setSquadRussianName(user.getSquadRussianName());
		response.setNeedSpeech(user.getNeedSpeech());
		response.setBirthDate(user.getBirthDate());
		response.setAlcoholAllowed(user.isAlcoholAllowed());
		response.setEventLocation(user.getEventLocation());
		response.setAttendingBanquet(user.isAttendingBanquet());
		response.setAttendingOfficialPart(user.isAttendingOfficialPart());
		response.setHasAllergies(user.getHasAllergies());
		response.setAllergies(user.getAllergies());
		response.setFoodPreferences(user.getFoodPreferences());
		response.setWantBowling(user.getWantBowling());
		response.setAlcoholPreferences(user.getAlcoholPreferences());
		response.setHasCar(user.getHasCar());
		response.setTableCompanions(user.getTableCompanions());
		response.setSpeechCompanions(user.getSpeechCompanions());
		response.setWillPerform(user.getWillPerform());
		response.setPerformanceCompanions(user.getPerformanceCompanions());
		response.setValid(validateUser(user));
		response.setShowAlcoholWarning(user.shouldShowAlcoholWarning());
		
		return response;
	}
}