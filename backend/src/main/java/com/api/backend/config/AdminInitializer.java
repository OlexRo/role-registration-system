package com.api.backend.config;

import com.api.backend.service.AdminService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminInitializer {
	
	@Bean
	public CommandLineRunner createDefaultAdmin(AdminService adminService) {
		return args -> {
			adminService.createDefaultAdmin();
		};
	}
}