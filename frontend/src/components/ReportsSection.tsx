// components/ReportsSection.tsx с обновленными цветами
'use client';

import { useDownloadReport } from '@/hooks/useReports';

export default function ReportsSection() {
	const downloadReport = useDownloadReport();
	
	const handleDownload = (reportType: string) => {
		downloadReport.mutate(reportType);
	};
	
	const reportButtons = [
		{
			type: 'all',
			label: '📊 Полный отчет',
			description: 'Все пользователи со всеми полями',
			color: 'bg-[#AB80DF] hover:bg-[#5600BE]',
		},
		{
			type: 'guests',
			label: '👥 Гости',
			description: 'Отчет только по гостям',
			color: 'bg-[#AB80DF] hover:bg-[#5600BE]',
		},
		{
			type: 'novices',
			label: '🎓 Новички',
			description: 'Отчет только по новичкам',
			color: 'bg-[#AB80DF] hover:bg-[#5600BE]',
		},
		{
			type: 'fighters',
			label: '⚔️ Бойцы',
			description: 'Отчет только по бойцам',
			color: 'bg-[#AB80DF] hover:bg-[#5600BE]',
		},
		{
			type: 'veterans',
			label: '🧓 Старики',
			description: 'Отчет только по старикам',
			color: 'bg-[#AB80DF] hover:bg-[#5600BE]',
		},
	];
	
	return (
		<div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-200">
			<div className="mb-4">
				<h2 className="text-xl font-bold text-gray-900 mb-2">
					📋 Генерация отчетов
				</h2>
				<p className="text-gray-600">
					Скачайте отчеты в формате Word для анализа данных
				</p>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{reportButtons.map((report) => (
					<button
						key={report.type}
						onClick={() => handleDownload(report.type)}
						disabled={downloadReport.isPending}
						className={`${report.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center justify-center text-center min-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed`}
					>
						<div className="text-2xl mb-2">{report.label.split(' ')[0]}</div>
						<div className="font-semibold text-sm mb-1">
							{report.label.split(' ').slice(1).join(' ')}
						</div>
						<div className="text-xs opacity-90">
							{report.description}
						</div>
						{downloadReport.isPending && downloadReport.variables === report.type && (
							<div className="mt-2">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
							</div>
						)}
					</button>
				))}
				
				<button
					onClick={() => handleDownload('role/FIGHTER')}
					disabled={downloadReport.isPending}
					className="bg-[#AB80DF] hover:bg-[#5600BE] text-white p-4 rounded-lg transition-colors flex flex-col items-center justify-center text-center min-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<div className="text-2xl mb-2">🎯</div>
					<div className="font-semibold text-sm mb-1">
						Отчет по роли
					</div>
					<div className="text-xs opacity-90">
						Через параметр URL
					</div>
				</button>
			</div>
			
			{downloadReport.isError && (
				<div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
					Ошибка при генерации отчета: {downloadReport.error?.message}
				</div>
			)}
		</div>
	);
}