package com.api.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.admin")
public class AdminConfig {
	
	private DefaultAdmin defaultAdmin = new DefaultAdmin();
	private SecondAdmin secondAdmin = new SecondAdmin();
	
	@Data
	public static class DefaultAdmin {
		private String username;
		private String password;
	}
	
	@Data
	public static class SecondAdmin {
		private String username;
		private String password;
	}
	
	@Data
	public static class AdminUser {
		private String username;
		private String password;
	}
}