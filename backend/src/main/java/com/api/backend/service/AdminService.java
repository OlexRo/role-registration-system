package com.api.backend.service;

import com.api.backend.dto.request.LoginRequest;
import com.api.backend.dto.response.AuthResponse;

public interface AdminService {
	AuthResponse loginAdmin(LoginRequest loginRequest);
	void createDefaultAdmin();
}