package com.api.backend.controller;

import com.api.backend.dto.response.ReportResponse;
import com.api.backend.model.enums.UserRole;
import com.api.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
	
	private final ReportService reportService;
	
	@GetMapping("/all")
	public ResponseEntity<byte[]> generateAllUsersReport() {
		ReportResponse report = reportService.generateAllUsersReport();
		return buildResponseEntity(report);
	}
	
	@GetMapping("/role/{role}")
	public ResponseEntity<byte[]> generateRoleReport(@PathVariable String role) {
		try {
			UserRole userRole = UserRole.valueOf(role.toUpperCase());
			ReportResponse report = reportService.generateRoleReport(userRole);
			return buildResponseEntity(report);
		} catch (IllegalArgumentException e) {
			throw new RuntimeException("Неверная роль: " + role);
		}
	}
	
	@GetMapping("/guests")
	public ResponseEntity<byte[]> generateGuestsReport() {
		ReportResponse report = reportService.generateGuestsReport();
		return buildResponseEntity(report);
	}
	
	@GetMapping("/novices")
	public ResponseEntity<byte[]> generateNovicesReport() {
		ReportResponse report = reportService.generateNovicesReport();
		return buildResponseEntity(report);
	}
	
	@GetMapping("/fighters")
	public ResponseEntity<byte[]> generateFightersReport() {
		ReportResponse report = reportService.generateFightersReport();
		return buildResponseEntity(report);
	}
	
	@GetMapping("/veterans")
	public ResponseEntity<byte[]> generateVeteransReport() {
		ReportResponse report = reportService.generateVeteransReport();
		return buildResponseEntity(report);
	}
	
	private ResponseEntity<byte[]> buildResponseEntity(ReportResponse report) {
		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + report.getFilename() + "\"")
				.body(report.getContent());
	}
}