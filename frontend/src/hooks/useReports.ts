import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios-config';

export const useDownloadReport = () => {
	return useMutation({
		mutationFn: async (reportType: string) => {
			const response = await api.get(`/reports/${reportType}`, {
				responseType: 'blob', // Важно для скачивания файлов
			});
			return response.data;
		},
		onSuccess: (data, variables) => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			});
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			const filename = `${variables}_report.docx`;
			link.setAttribute('download', filename);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		},
	});
};