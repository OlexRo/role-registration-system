package com.api.backend.dto.response;

import lombok.Data;

@Data
public class AuthResponse {
	private String token;
	private String message;
	private String username;
}
