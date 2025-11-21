package com.api.backend.controller;

import com.api.backend.dto.request.LoginRequest;
import com.api.backend.dto.response.AuthResponse;
import com.api.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
	
	private final AdminService adminService;
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> loginAdmin(
		@Valid
		@RequestBody LoginRequest loginRequest
	) {
		AuthResponse authResponse = adminService.loginAdmin(loginRequest);
		return ResponseEntity.ok(authResponse);
	}
}
