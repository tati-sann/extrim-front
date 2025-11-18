import { ref, computed } from 'vue';
import type { AnalysisResult, AnalysisProgress } from '@/types/analysis';
import { analysisService } from '@/services/analysisService';
import { reportGenerator } from '@/utils/reportGenerator';

export const useAnalysis = () => {
  const messageText = ref('');
  const sending = ref(false);
  const analysisType = ref<'success' | 'error' | null>(null);
  const analysisResult = ref<AnalysisResult | null>(null);
  const analysisError = ref<string | null>(null);
  const analyzedText = ref('');

  // Прогресс анализа
  const currentStep = ref(0);
  const step1Result = ref(0);
  const step2Result = ref(0);
  const stepInterval = ref<NodeJS.Timeout | null>(null);

  const overallProgress = computed(() => {
    if (currentStep.value === 0) return 0;

    if (currentStep.value === 1) return 33;

    if (currentStep.value === 2) return 66;

    return 100;
  });

  const overallProgressColor = computed(() => {
    const progress = overallProgress.value;

    if (progress < 33) return '#3b82f6';

    if (progress < 66) return '#8b5cf6';

    return '#10b981';
  });

  const sendMessage = async (type: 'success' | 'error') => {
    if (!messageText.value.trim()) return;

    sending.value = true;
    analysisType.value = type;
    analysisResult.value = null;
    analysisError.value = null;
    analyzedText.value = messageText.value;
    currentStep.value = 0;
    step1Result.value = 0;
    step2Result.value = 0;

    analysisService.simulateAnalysisProgress(
      type,
      currentStep,
      step1Result,
      step2Result,
      stepInterval
    );

    try {
      if (type === 'error') {
        await analysisService.mockContentAnalysisWithError(messageText.value);
      } else {
        const result = await analysisService.mockContentAnalysisSuccess(
          messageText.value,
          step1Result.value,
          step2Result.value
        );

        analysisResult.value = result;
      }
    } catch (error: any) {
      analysisError.value = error.message;
    } finally {
      if (stepInterval.value) {
        clearInterval(stepInterval.value);
        stepInterval.value = null;
      }
      sending.value = false;
    }
  };

  const resetAnalysis = () => {
    analysisResult.value = null;
    analysisError.value = null;
    analysisType.value = null;
    messageText.value = '';
    analyzedText.value = '';
    currentStep.value = 0;
    step1Result.value = 0;
    step2Result.value = 0;
  };

  const retryAnalysis = () => {
    analysisError.value = null;

    if (analysisType.value) {
      sendMessage(analysisType.value);
    }
  };

  const downloadReport = () => {
    if (!analysisResult.value || !analyzedText.value) return;
    reportGenerator.downloadReport(analysisResult.value, analyzedText.value);
  };

  return {
    messageText,
    sending,
    analysisType,
    analysisResult,
    analysisError,
    analyzedText,
    currentStep,
    step1Result,
    step2Result,
    overallProgress,
    overallProgressColor,
    sendMessage,
    resetAnalysis,
    retryAnalysis,
    downloadReport
  };
};
