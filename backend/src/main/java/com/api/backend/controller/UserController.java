package com.api.backend.controller;

import com.api.backend.dto.request.UserRequest;
import com.api.backend.dto.response.UserResponse;
import com.api.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
	
	private final UserService userService;
	
	@GetMapping
	public ResponseEntity<List<UserResponse>> getAllUsers() {
		return ResponseEntity.ok(userService.getAllUsers());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
		return ResponseEntity.ok(userService.getUserById(id));
	}
	
	@PostMapping
	public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest userRequest) {
		return ResponseEntity.ok(userService.createUser(userRequest));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<UserResponse> updateUser(
			@PathVariable Long id,
			@Valid @RequestBody UserRequest userRequest) {
		return ResponseEntity.ok(userService.updateUser(id, userRequest));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
		userService.deleteUser(id);
		return ResponseEntity.ok().build();
	}
	
	@GetMapping("/role/{role}")
	public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable String role) {
		return ResponseEntity.ok(userService.getUsersByRole(role));
	}
	
	@GetMapping("/location/{eventLocation}")
	public ResponseEntity<List<UserResponse>> getUsersByEventLocation(@PathVariable String eventLocation) {
		return ResponseEntity.ok(userService.getUsersByEventLocation(eventLocation));
	}
	
	@GetMapping("/search")
	public ResponseEntity<List<UserResponse>> searchUsersByName(
			@RequestParam String name) {
		return ResponseEntity.ok(userService.searchUsersByName(name));
	}
	
	// Новый метод для массового удаления
	@DeleteMapping("/batch")
	public ResponseEntity<Void> deleteUsers(@RequestBody List<Long> ids) {
		userService.deleteUsers(ids);
		return ResponseEntity.ok().build();
	}
}