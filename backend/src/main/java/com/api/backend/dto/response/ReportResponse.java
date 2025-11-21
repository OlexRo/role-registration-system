package com.api.backend.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class ReportResponse {
	private String reportName;
	private byte[] content;
	private String contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
	private String filename;
	
	public ReportResponse(String reportName, byte[] content) {
		this.reportName = reportName;
		this.content = content;
		this.filename = reportName + ".docx";
	}
}