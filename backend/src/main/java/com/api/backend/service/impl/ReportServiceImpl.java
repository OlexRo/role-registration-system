package com.api.backend.service.impl;

import com.api.backend.dto.response.ReportResponse;
import com.api.backend.dto.response.UserResponse;
import com.api.backend.model.enums.UserRole;
import com.api.backend.service.ReportService;
import com.api.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
	
	private final UserService userService;
	
	@Override
	public ReportResponse generateAllUsersReport() {
		log.info("Генерация отчета для всех пользователей");
		List<UserResponse> users = getAllUsersForReport();
		
		try (XWPFDocument document = new XWPFDocument()) {
			// Устанавливаем альбомную ориентацию для общего отчета
			setLandscapeOrientation(document);
			createTitle(document, "ПОЛНЫЙ ОТЧЕТ ПО ВСЕМ ПОЛЬЗОВАТЕЛЯМ");
			createCompleteUsersTable(document, users);
			
			return createReportResponse(document, "complete_users_report");
		} catch (IOException e) {
			log.error("Ошибка при генерации отчета для всех пользователей", e);
			throw new RuntimeException("Ошибка генерации отчета", e);
		}
	}
	
	@Override
	public ReportResponse generateRoleReport(UserRole role) {
		log.info("Генерация отчета для роли: {}", role);
		List<UserResponse> users = userService.getUsersByRole(role.toString());
		
		String roleName = getRoleNameInRussian(role);
		
		try (XWPFDocument document = new XWPFDocument()) {
			// Для отчетов по ролям тоже можно установить альбомную ориентацию, если много колонок
			if (role == UserRole.VETERAN) {
				setLandscapeOrientation(document);
			}
			
			createTitle(document, "ОТЧЕТ: " + roleName.toUpperCase());
			createRoleSpecificTable(document, users, role);
			
			return createReportResponse(document, role.name().toLowerCase() + "_report");
		} catch (IOException e) {
			log.error("Ошибка при генерации отчета для роли: {}", role, e);
			throw new RuntimeException("Ошибка генерации отчета", e);
		}
	}
	
	@Override
	public ReportResponse generateGuestsReport() {
		return generateRoleReport(UserRole.GUEST);
	}
	
	@Override
	public ReportResponse generateNovicesReport() {
		return generateRoleReport(UserRole.NOVICE);
	}
	
	@Override
	public ReportResponse generateFightersReport() {
		return generateRoleReport(UserRole.FIGHTER);
	}
	
	@Override
	public ReportResponse generateVeteransReport() {
		return generateRoleReport(UserRole.VETERAN);
	}
	
	@Override
	public List<UserResponse> getAllUsersForReport() {
		return userService.getAllUsers();
	}
	
	private void setLandscapeOrientation(XWPFDocument document) {
		// Получаем или создаем свойства документа
		CTPageSz pageSize = document.getDocument().getBody().addNewSectPr().addNewPgSz();
		pageSize.setOrient(STPageOrientation.LANDSCAPE);
		pageSize.setW(BigInteger.valueOf(16840));  // Ширина для A4 альбомной
		pageSize.setH(BigInteger.valueOf(11900));  // Высота для A4 альбомной
		
		// Устанавливаем поля страницы
		CTPageMar pageMar = document.getDocument().getBody().getSectPr().addNewPgMar();
		pageMar.setLeft(BigInteger.valueOf(720));   // 0.5 inch
		pageMar.setRight(BigInteger.valueOf(720));  // 0.5 inch
		pageMar.setTop(BigInteger.valueOf(720));    // 0.5 inch
		pageMar.setBottom(BigInteger.valueOf(720)); // 0.5 inch
	}
	
	private void createTitle(XWPFDocument document, String title) {
		XWPFParagraph titleParagraph = document.createParagraph();
		titleParagraph.setAlignment(ParagraphAlignment.CENTER);
		titleParagraph.setSpacingAfter(400);
		
		XWPFRun titleRun = titleParagraph.createRun();
		titleRun.setText(title);
		titleRun.setBold(true);
		titleRun.setFontSize(14);
		titleRun.setFontFamily("Times New Roman");
	}
	
	private void createCompleteUsersTable(XWPFDocument document, List<UserResponse> users) {
		if (users.isEmpty()) {
			createNoDataMessage(document);
			return;
		}
		
		// Создаем таблицу со всеми колонками
		XWPFTable table = document.createTable(1, 21);
		table.setWidth("100%");
		
		// Устанавливаем стиль таблицы для альбомной ориентации
		setupTableStyle(table);
		
		// Заголовки для полного отчета
		String[] headers = {
				"№", "Фамилия", "Имя", "Отчество", "Роль",
				"Отряд", "Дата рожд.", "Место события", "Аллергии",
				"Аллергии дет.", "Предпочт. еда", "Боулинг",
				"Алкоголь", "Машина", "Слово на сцене", "С кем слово",
				"С кем сидеть", "Выступление", "С кем номер",
				"Возрастное огр.", "Валидность"
		};
		
		// Создаем заголовки
		XWPFTableRow headerRow = table.getRow(0);
		headerRow.setHeight(400);
		
		for (int i = 0; i < headers.length; i++) {
			XWPFTableCell cell = headerRow.getCell(i);
			setHeaderCellStyle(cell, headers[i], getCompleteColumnWidth(i));
		}
		
		// Заполняем данными
		int rowNum = 1;
		for (UserResponse user : users) {
			XWPFTableRow row = table.createRow();
			row.setHeight(350);
			
			// Основная информация
			createDataCell(row, 0, String.valueOf(rowNum++), 400);
			createDataCell(row, 1, user.getSurname(), 1200);
			createDataCell(row, 2, user.getName(), 1200);
			createDataCell(row, 3, getSafeValue(user.getPatronymic()), 1200);
			createDataCell(row, 4, getRoleNameInRussian(user.getRole()), 800);
			
			// Информация по ролям
			createDataCell(row, 5, getSafeValue(user.getSquadRussianName()), 800);
			createDataCell(row, 6, getSafeDate(user.getBirthDate()), 900);
			createDataCell(row, 7, getEventLocationInRussian(user.getEventLocation()), 1500);
			
			// Информация о банкете
			createDataCell(row, 8, getBooleanValue(user.getHasAllergies()), 600);
			createDataCell(row, 9, getAllergiesDetails(user), 1200);
			createDataCell(row, 10, getSafeValue(user.getFoodPreferences()), 1200);
			createDataCell(row, 11, getBooleanValue(user.getWantBowling()), 600);
			createDataCell(row, 12, getSafeValue(user.getAlcoholPreferences()), 1200);
			createDataCell(row, 13, getBooleanValue(user.getHasCar()), 600);
			
			// Информация о выступлениях
			createDataCell(row, 14, getBooleanValue(user.getNeedSpeech()), 800);
			createDataCell(row, 15, getSafeValue(user.getSpeechCompanions()), 1200);
			createDataCell(row, 16, getSafeValue(user.getTableCompanions()), 1200);
			createDataCell(row, 17, getBooleanValue(user.getWillPerform()), 800);
			createDataCell(row, 18, getSafeValue(user.getPerformanceCompanions()), 1200);
			
			// Дополнительная информация
			createDataCell(row, 19, user.getShowAlcoholWarning() ? "ДА" : "нет", 800);
			createDataCell(row, 20, getBooleanValue(user.getValid()), 600);
		}
	}
	
	private void createRoleSpecificTable(XWPFDocument document, List<UserResponse> users, UserRole role) {
		if (users.isEmpty()) {
			createNoDataMessage(document);
			return;
		}
		
		switch (role) {
			case GUEST:
				createGuestsTable(document, users);
				break;
			case NOVICE:
				createNovicesTable(document, users);
				break;
			case FIGHTER:
				createFightersTable(document, users);
				break;
			case VETERAN:
				createVeteransTable(document, users);
				break;
		}
	}
	
	private void createGuestsTable(XWPFDocument document, List<UserResponse> users) {
		XWPFTable table = document.createTable(1, 6);
		table.setWidth("100%");
		
		String[] headers = {"№", "Фамилия", "Имя", "Отчество", "Отряд", "Слово на сцене"};
		
		XWPFTableRow headerRow = table.getRow(0);
		for (int i = 0; i < headers.length; i++) {
			setHeaderCellStyle(headerRow.getCell(i), headers[i], getColumnWidth(i));
		}
		
		int rowNum = 1;
		for (UserResponse user : users) {
			XWPFTableRow row = table.createRow();
			createDataCell(row, 0, String.valueOf(rowNum++), 500);
			createDataCell(row, 1, user.getSurname(), 1500);
			createDataCell(row, 2, user.getName(), 1500);
			createDataCell(row, 3, getSafeValue(user.getPatronymic()), 1500);
			createDataCell(row, 4, getSafeValue(user.getSquadRussianName()), 1000);
			createDataCell(row, 5, getBooleanValue(user.getNeedSpeech()), 1200);
		}
	}
	
	private void createNovicesTable(XWPFDocument document, List<UserResponse> users) {
		XWPFTable table = document.createTable(1, 12);
		table.setWidth("100%");
		
		String[] headers = {
				"№", "Фамилия", "Имя", "Отчество", "Дата рождения",
				"Место события", "Аллергии", "Аллергии дет.", "Предпочтения в еде",
				"Боулинг", "Возрастное огр.", "Валидность"
		};
		
		XWPFTableRow headerRow = table.getRow(0);
		for (int i = 0; i < headers.length; i++) {
			setHeaderCellStyle(headerRow.getCell(i), headers[i], getColumnWidth(i));
		}
		
		int rowNum = 1;
		for (UserResponse user : users) {
			XWPFTableRow row = table.createRow();
			createDataCell(row, 0, String.valueOf(rowNum++), 500);
			createDataCell(row, 1, user.getSurname(), 1200);
			createDataCell(row, 2, user.getName(), 1200);
			createDataCell(row, 3, getSafeValue(user.getPatronymic()), 1200);
			createDataCell(row, 4, getSafeDate(user.getBirthDate()), 1200);
			createDataCell(row, 5, getEventLocationInRussian(user.getEventLocation()), 1500);
			createDataCell(row, 6, getBooleanValue(user.getHasAllergies()), 800);
			createDataCell(row, 7, getAllergiesDetails(user), 1500);
			createDataCell(row, 8, getSafeValue(user.getFoodPreferences()), 1500);
			createDataCell(row, 9, getBooleanValue(user.getWantBowling()), 800);
			createDataCell(row, 10, user.getShowAlcoholWarning() ? "ДА" : "нет", 1000);
			createDataCell(row, 11, getBooleanValue(user.getValid()), 800);
		}
	}
	
	private void createFightersTable(XWPFDocument document, List<UserResponse> users) {
		XWPFTable table = document.createTable(1, 13);
		table.setWidth("100%");
		
		String[] headers = {
				"№", "Фамилия", "Имя", "Отчество", "Место события",
				"Аллергии", "Аллергии дет.", "Предпочтения в еде", "Боулинг",
				"Алкоголь", "Машина", "Валидность"
		};
		
		XWPFTableRow headerRow = table.getRow(0);
		for (int i = 0; i < headers.length; i++) {
			setHeaderCellStyle(headerRow.getCell(i), headers[i], getColumnWidth(i));
		}
		
		int rowNum = 1;
		for (UserResponse user : users) {
			XWPFTableRow row = table.createRow();
			createDataCell(row, 0, String.valueOf(rowNum++), 500);
			createDataCell(row, 1, user.getSurname(), 1200);
			createDataCell(row, 2, user.getName(), 1200);
			createDataCell(row, 3, getSafeValue(user.getPatronymic()), 1200);
			createDataCell(row, 4, getEventLocationInRussian(user.getEventLocation()), 1500);
			createDataCell(row, 5, getBooleanValue(user.getHasAllergies()), 800);
			createDataCell(row, 6, getAllergiesDetails(user), 1500);
			createDataCell(row, 7, getSafeValue(user.getFoodPreferences()), 1500);
			createDataCell(row, 8, getBooleanValue(user.getWantBowling()), 800);
			createDataCell(row, 9, getSafeValue(user.getAlcoholPreferences()), 1500);
			createDataCell(row, 10, getBooleanValue(user.getHasCar()), 800);
			createDataCell(row, 11, getBooleanValue(user.getValid()), 800);
		}
	}
	
	private void createVeteransTable(XWPFDocument document, List<UserResponse> users) {
		XWPFTable table = document.createTable(1, 18);
		table.setWidth("100%");
		
		String[] headers = {
				"№", "Фамилия", "Имя", "Отчество", "Место события",
				"Аллергии", "Аллергии дет.", "Предпочтения в еде", "Боулинг", "Алкоголь", "Машина",
				"Слово на сцене", "С кем слово", "С кем сидеть", "Выступление", "С кем номер", "Валидность"
		};
		
		XWPFTableRow headerRow = table.getRow(0);
		for (int i = 0; i < headers.length; i++) {
			setHeaderCellStyle(headerRow.getCell(i), headers[i], getColumnWidth(i));
		}
		
		int rowNum = 1;
		for (UserResponse user : users) {
			XWPFTableRow row = table.createRow();
			createDataCell(row, 0, String.valueOf(rowNum++), 500);
			createDataCell(row, 1, user.getSurname(), 1200);
			createDataCell(row, 2, user.getName(), 1200);
			createDataCell(row, 3, getSafeValue(user.getPatronymic()), 1200);
			createDataCell(row, 4, getEventLocationInRussian(user.getEventLocation()), 1500);
			createDataCell(row, 5, getBooleanValue(user.getHasAllergies()), 800);
			createDataCell(row, 6, getAllergiesDetails(user), 1500);
			createDataCell(row, 7, getSafeValue(user.getFoodPreferences()), 1500);
			createDataCell(row, 8, getBooleanValue(user.getWantBowling()), 800);
			createDataCell(row, 9, getSafeValue(user.getAlcoholPreferences()), 1500);
			createDataCell(row, 10, getBooleanValue(user.getHasCar()), 800);
			createDataCell(row, 11, getBooleanValue(user.getNeedSpeech()), 1000);
			createDataCell(row, 12, getSafeValue(user.getSpeechCompanions()), 1500);
			createDataCell(row, 13, getSafeValue(user.getTableCompanions()), 1500);
			createDataCell(row, 14, getBooleanValue(user.getWillPerform()), 1000);
			createDataCell(row, 15, getSafeValue(user.getPerformanceCompanions()), 1500);
			createDataCell(row, 16, getBooleanValue(user.getValid()), 800);
		}
	}
	
	private void setupTableStyle(XWPFTable table) {
		CTTbl tbl = table.getCTTbl();
		CTTblPr tblPr = tbl.getTblPr() == null ? tbl.addNewTblPr() : tbl.getTblPr();
		CTTblWidth tblWidth = tblPr.addNewTblW();
		tblWidth.setType(STTblWidth.DXA);
		tblWidth.setW(BigInteger.valueOf(15000));
	}
	
	private void setHeaderCellStyle(XWPFTableCell cell, String text, int width) {
		cell.setText(text);
		cell.setColor("D3D3D3"); // Серый фон
		
		// Центрируем текст
		XWPFParagraph paragraph = cell.getParagraphs().get(0);
		paragraph.setAlignment(ParagraphAlignment.CENTER);
		
		// Жирный шрифт
		XWPFRun run = paragraph.getRuns().get(0);
		run.setBold(true);
		run.setFontSize(9);
		run.setFontFamily("Times New Roman");
		
		// Устанавливаем ширину колонки
		CTTblWidth cellWidth = cell.getCTTc().addNewTcPr().addNewTcW();
		cellWidth.setW(BigInteger.valueOf(width));
		cellWidth.setType(STTblWidth.DXA);
	}
	
	private void createDataCell(XWPFTableRow row, int cellIndex, String text, int width) {
		XWPFTableCell cell = row.getCell(cellIndex);
		cell.setText(text != null ? text : "-");
		
		XWPFParagraph paragraph = cell.getParagraphs().get(0);
		paragraph.setAlignment(ParagraphAlignment.CENTER);
		paragraph.setSpacingAfter(0);
		paragraph.setSpacingBefore(0);
		
		XWPFRun run = paragraph.getRuns().get(0);
		run.setFontSize(8);
		run.setFontFamily("Times New Roman");
		
		// Устанавливаем ширину колонки
		CTTblWidth cellWidth = cell.getCTTc().addNewTcPr().addNewTcW();
		cellWidth.setW(BigInteger.valueOf(width));
		cellWidth.setType(STTblWidth.DXA);
	}
	
	private int getCompleteColumnWidth(int columnIndex) {
		return switch (columnIndex) {
			case 0 -> 400;   // №
			case 1, 2, 3 -> 1200; // ФИО
			case 4 -> 800;   // Роль
			case 5 -> 800;   // Отряд
			case 6 -> 900;   // Дата рождения
			case 7 -> 1500;  // Место события
			case 8, 11, 13, 19, 20 -> 600; // Boolean поля
			case 9, 10, 12, 15, 16, 18 -> 1200; // Текстовые поля
			case 14, 17 -> 800; // Выступления
			default -> 1000;
		};
	}
	
	private int getColumnWidth(int columnIndex) {
		return switch (columnIndex) {
			case 0 -> 500;   // №
			case 1, 2, 3 -> 1200; // ФИО
			default -> 1200; // Остальные колонки
		};
	}
	
	// Вспомогательные методы для безопасного получения значений
	private String getSafeValue(String value) {
		return value != null ? value : "-";
	}
	
	private String getSafeDate(java.time.LocalDate date) {
		return date != null ? date.toString() : "-";
	}
	
	private String getAllergiesDetails(UserResponse user) {
		if (Boolean.TRUE.equals(user.getHasAllergies())) {
			return user.getAllergies() != null ? user.getAllergies() : "Есть аллергии";
		}
		return "Нет";
	}
	
	private void createNoDataMessage(XWPFDocument document) {
		XWPFParagraph paragraph = document.createParagraph();
		paragraph.setAlignment(ParagraphAlignment.CENTER);
		
		XWPFRun run = paragraph.createRun();
		run.setText("Нет данных для отображения");
		run.setItalic(true);
		run.setFontSize(12);
		run.setFontFamily("Times New Roman");
	}
	
	private String getRoleNameInRussian(UserRole role) {
		return switch (role) {
			case GUEST -> "Гость";
			case NOVICE -> "Новичок";
			case FIGHTER -> "Боец";
			case VETERAN -> "Старик";
		};
	}
	
	private String getEventLocationInRussian(com.api.backend.model.enums.EventLocation location) {
		if (location == null) return "Не указано";
		return switch (location) {
			case OFFICIAL_PART -> "Официальная часть";
			case BANQUET -> "Банкет";
			case BOTH -> "Официальная часть и банкет";
		};
	}
	
	private String getBooleanValue(Boolean value) {
		if (value == null) return "Нет";
		return value ? "Да" : "Нет";
	}
	
	private ReportResponse createReportResponse(XWPFDocument document, String reportName) throws IOException {
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		document.write(outputStream);
		return new ReportResponse(reportName, outputStream.toByteArray());
	}
}