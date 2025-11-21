package com.api.backend.repository;

import com.api.backend.model.User;
import com.api.backend.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	List<User> findByRole(UserRole role);
	List<User> findByEventLocation(com.api.backend.model.enums.EventLocation eventLocation);
	
	@Query("SELECT u FROM User u WHERE " +
			"LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
			"LOWER(u.surname) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
			"LOWER(u.patronymic) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
	List<User> searchByName(@Param("searchTerm") String searchTerm);
}