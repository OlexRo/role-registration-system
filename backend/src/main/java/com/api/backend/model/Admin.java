package com.api.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin implements UserDetails {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true, nullable = false)
	@NotBlank(message = "Имя администратора не может быть пустым")
	@Size(min = 3, max = 50, message = "Имя администратора должно содержать от 3 до 50 символов")
	private String username;
	
	@Column(nullable = false)
	@NotBlank(message = "Пароль не может быть пустым")
	@Size(min = 6, message = "Пароль должен содержать минимум 6 символов")
	private String password;
	
	// Возвращаем права доступа (роли) пользователя
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Collections.emptyList();
	}
	
	// Учетная запись не просрочена
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	
	// Учетная запись не заблокирована
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	
	// Пароль не просрочен
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	
	// Учетная запись активна
	@Override
	public boolean isEnabled() {
		return true;
	}
}