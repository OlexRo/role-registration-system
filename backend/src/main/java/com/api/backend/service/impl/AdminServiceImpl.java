package com.api.backend.service.impl;

import com.api.backend.config.AdminConfig;
import com.api.backend.dto.request.LoginRequest;
import com.api.backend.dto.response.AuthResponse;
import com.api.backend.model.Admin;
import com.api.backend.repository.AdminRepository;
import com.api.backend.service.AdminService;
import com.api.backend.token.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
	
	private final AdminRepository adminRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final AdminConfig adminConfig;
	
	@Override
	public AuthResponse loginAdmin(LoginRequest loginRequest) {
		Optional<Admin> adminOptional = adminRepository.findByUsername(loginRequest.getUsername());
		if (adminOptional.isEmpty() || !passwordEncoder.matches(loginRequest.getPassword(), adminOptional.get().getPassword())) {
			throw new UsernameNotFoundException("Недействительные данные");
		}
		String token = jwtUtil.generateToken(adminOptional.get().getUsername());
		AuthResponse authResponse = new AuthResponse();
		authResponse.setToken(token);
		authResponse.setMessage("Успешная авторизация");
		authResponse.setUsername(adminOptional.get().getUsername());
		return authResponse;
	}
	
	@Override
	public void createDefaultAdmin() {
		createAdminIfNotExists(
				adminConfig.getDefaultAdmin().getUsername(),
				adminConfig.getDefaultAdmin().getPassword()
		);
		createAdminIfNotExists(
				adminConfig.getSecondAdmin().getUsername(),
				adminConfig.getSecondAdmin().getPassword()
		);
	}
	
	private void createAdminIfNotExists(String username, String password) {
		if (!adminRepository.existsByUsername(username)) {
			Admin admin = new Admin();
			admin.setUsername(username);
			admin.setPassword(passwordEncoder.encode(password));
			adminRepository.save(admin);
			System.out.println("Администратор создан: username=" + username);
		} else {
			System.out.println("Администратор '" + username + "' уже существует");
		}
	}
}