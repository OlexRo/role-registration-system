package com.api.backend.service;

import com.api.backend.dto.response.ReportResponse;
import com.api.backend.dto.response.UserResponse;
import com.api.backend.model.enums.UserRole;
import java.util.List;

public interface ReportService {
	ReportResponse generateAllUsersReport();
	ReportResponse generateRoleReport(UserRole role);
	ReportResponse generateGuestsReport();
	ReportResponse generateNovicesReport();
	ReportResponse generateFightersReport();
	ReportResponse generateVeteransReport();
	List<UserResponse> getAllUsersForReport();
}