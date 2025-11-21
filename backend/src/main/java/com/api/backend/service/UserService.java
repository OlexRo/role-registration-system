package com.api.backend.service;

import com.api.backend.dto.request.UserRequest;
import com.api.backend.dto.response.UserResponse;
import com.api.backend.model.User;
import java.util.List;

public interface UserService {
	List<UserResponse> getAllUsers();
	UserResponse getUserById(Long id);
	UserResponse createUser(UserRequest userRequest);
	UserResponse updateUser(Long id, UserRequest userRequest);
	void deleteUser(Long id);
	List<UserResponse> getUsersByRole(String role);
	List<UserResponse> getUsersByEventLocation(String eventLocation);
	boolean validateUser(User user);
	String getUserValidationErrors(User user);
	List<UserResponse> searchUsersByName(String name);
	void deleteUsers(List<Long> ids);
}