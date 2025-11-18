import type { AnalysisResult } from '@/types/analysis';
import { analysisHelpers } from '@/utils/analysisHelpers';

export const analysisService = {
  simulateAnalysisProgress(
    type: 'success' | 'error',
    currentStep: { value: number },
    step1Result: { value: number },
    step2Result: { value: number },
    stepInterval: { value: NodeJS.Timeout | null }
  ) {
    let step = 0;

    stepInterval.value = setInterval(() => {
      step++;

      switch (step) {
        case 1:
          currentStep.value = 0;
          break;
        case 2:
          currentStep.value = 1;
          break;
        case 4:
          step1Result.value = type === 'success'
            ? Math.min(95, Math.floor(Math.random() * 40) + 60)
            : 30;
          break;
        case 5:
          if (step1Result.value > 70) {
            currentStep.value = 2;
          } else {
            currentStep.value = 3;
          }
          break;
        case 7:
          if (step1Result.value > 70) {
            step2Result.value = type === 'success'
              ? Math.min(90, Math.floor(Math.random() * 50) + 30)
              : 20;
          }
          currentStep.value = 3;
          break;
        case 8:
          if (stepInterval.value) {
            clearInterval(stepInterval.value);
            stepInterval.value = null;
          }
          break;
      }
    }, 800);
  },

  mockContentAnalysisSuccess(
    text: string,
    urgeScore: number,
    violenceScore: number
  ): Promise<AnalysisResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isDangerous = violenceScore > 50;
        const requiresAttention = urgeScore > 60 || violenceScore > 30;

        resolve({
          urgeDetection: {
            score: urgeScore,
            description: analysisHelpers.getUrgeDescription(urgeScore),
            details: analysisHelpers.generateUrgeDetails(text, urgeScore)
          },
          violenceUrge: {
            score: violenceScore,
            description: analysisHelpers.getViolenceDescription(violenceScore),
            details: urgeScore > 70
              ? analysisHelpers.generateViolenceDetails(text, violenceScore)
              : ['Модуль не активирован - недостаточный уровень общих побуждений']
          },
          finalVerdict: {
            isDangerous,
            requiresAttention,
            title: analysisHelpers.getVerdictTitle(isDangerous, requiresAttention),
            description: analysisHelpers.getVerdictDescription(isDangerous, requiresAttention, urgeScore, violenceScore)
          }
        });
      }, 500);
    });
  },

  mockContentAnalysisWithError(text: string): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Ошибка соединения с сервером анализа. Попробуйте позже.'));
      }, 2000);
    });
  }
};
