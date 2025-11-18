import type { AnalysisResult } from '@/types/analysis.ts';

export const reportGenerator = {
  downloadReport(analysisResult: AnalysisResult, analyzedText: string) {
    const report = `ОТЧЕТ АНАЛИЗА ТЕКСТА\n\n` +
      `Текст: ${analyzedText}\n\n` +
      `РЕЗУЛЬТАТЫ АНАЛИЗА:\n\n` +
      `МОДУЛЬ 1 - Определение побуждений:\n` +
      `- Уровень побуждений: ${analysisResult.urgeDetection.score}%\n` +
      `- Описание: ${analysisResult.urgeDetection.description}\n\n` +
      `МОДУЛЬ 2 - Определение побуждений к насилию:\n` +
      `- Уровень насилия: ${analysisResult.violenceUrge.score}%\n` +
      `- Описание: ${analysisResult.violenceUrge.description}\n\n` +
      `ВЕРДИКТ: ${analysisResult.finalVerdict.title}\n` +
      `ОПИСАНИЕ: ${analysisResult.finalVerdict.description}\n\n` +
      `Сгенерировано: ${new Date().toLocaleString()}`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `анализ_текста_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
