<template>
  <div class="result-section">
    <NCard title="Результат анализа" class="result-card">
      <NSpace vertical :size="24">
        <NAlert type="success" title="Анализ завершен">
          Текст успешно проанализирован нейросетевыми модулями
        </NAlert>

        <!-- Блок с анализируемым текстом -->
        <NCard title="Анализируемый текст" size="small" class="text-preview-card">
          <div class="text-preview">
            <p class="original-text">{{ analyzedText }}</p>
          </div>
        </NCard>

        <div class="analysis-results">
          <h3>Результаты анализа нейросетевыми модулями:</h3>

          <NSpace vertical :size="20">
            <!-- Модуль 1: Наличие побуждений -->
            <NCard title="Модуль 1: Наличие побудительных конструкций" size="small" class="module-card">
              <NSpace vertical :size="12">
                <div class="module-result">
                  <div class="module-header">
                    <span class="module-name">Обнаружено побуждений:</span>
                    <NTag :type="analysisResult.urgeDetection.score > 50 ? 'warning' : 'success'">
                      {{ analysisResult.urgeDetection.score }}%
                    </NTag>
                  </div>
                  <NProgress
                    :percentage="analysisResult.urgeDetection.score"
                    :height="10"
                    :border-radius="4"
                    :color="getUrgeProgressColor(analysisResult.urgeDetection.score)"
                  />
                  <p class="module-description">{{ analysisResult.urgeDetection.description }}</p>
                  <div class="module-details">
                    <strong>Детали:</strong>
                    <ul>
                      <li v-for="(detail, index) in analysisResult.urgeDetection.details" :key="index">
                        {{ detail }}
                      </li>
                    </ul>
                  </div>
                </div>
              </NSpace>
            </NCard>

            <!-- Модуль 2: Побуждения к насилию -->
            <NCard
              title="Модуль 2: Побуждения к физическому насилию"
              size="small"
              class="module-card"
              v-if="analysisResult.violenceUrge.score > 0"
            >
              <NSpace vertical :size="12">
                <div class="module-result">
                  <div class="module-header">
                    <span class="module-name">Обнаружено побуждений к насилию:</span>
                    <NTag :type="analysisResult.violenceUrge.score > 30 ? 'error' : 'warning'">
                      {{ analysisResult.violenceUrge.score }}%
                    </NTag>
                  </div>
                  <NProgress
                    :percentage="analysisResult.violenceUrge.score"
                    :height="10"
                    :border-radius="4"
                    :color="getViolenceProgressColor(analysisResult.violenceUrge.score)"
                  />
                  <p class="module-description">{{ analysisResult.violenceUrge.description }}</p>
                  <div class="module-details">
                    <strong>Детали:</strong>
                    <ul>
                      <li v-for="(detail, index) in analysisResult.violenceUrge.details" :key="index">
                        {{ detail }}
                      </li>
                    </ul>
                  </div>
                </div>
              </NSpace>
            </NCard>

            <!-- Сообщение если модуль 2 не активирован -->
            <NCard
              v-else
              title="Модуль 2: Побуждения к физическому насилию"
              size="small"
              class="module-card disabled"
            >
              <NAlert type="info">
                Модуль не был активирован, так как уровень общих побуждений недостаточен для детального анализа (требуется >70%)
              </NAlert>
            </NCard>
          </NSpace>

          <div class="final-verdict">
            <NAlert
              :type="analysisResult.finalVerdict.isDangerous ? 'error' : analysisResult.finalVerdict.requiresAttention ? 'warning' : 'success'"
              :title="analysisResult.finalVerdict.title"
            >
              {{ analysisResult.finalVerdict.description }}
            </NAlert>
          </div>

          <div class="analysis-summary">
            <h4>Сводка анализа:</h4>
            <NSpace vertical :size="8">
              <div class="summary-item">
                <NIcon :color="analysisResult.urgeDetection.score > 50 ? '#f59e0b' : '#10b981'">
                  <CheckmarkCircleOutline v-if="analysisResult.urgeDetection.score <= 50" />
                  <WarningOutline v-else />
                </NIcon>
                <span>Модуль побуждений: {{ analysisResult.urgeDetection.score }}%</span>
              </div>
              <div class="summary-item">
                <NIcon :color="analysisResult.violenceUrge.score > 30 ? '#ef4444' : analysisResult.violenceUrge.score > 0 ? '#f59e0b' : '#10b981'">
                  <CheckmarkCircleOutline v-if="analysisResult.violenceUrge.score === 0" />
                  <WarningOutline v-else-if="analysisResult.violenceUrge.score <= 30" />
                  <CloseCircleOutline v-else />
                </NIcon>
                <span>Модуль насилия: {{ analysisResult.violenceUrge.score > 0 ? analysisResult.violenceUrge.score + '%' : 'не активирован' }}</span>
              </div>
            </NSpace>
          </div>
        </div>

        <NSpace justify="center">
          <NButton
            type="primary"
            @click="$emit('reset')"
            class="new-analysis-button"
          >
            <template #icon>
              <NIcon>
                <RefreshOutline />
              </NIcon>
            </template>
            Новый анализ
          </NButton>

          <NButton
            @click="$emit('download')"
            type="info"
            class="download-button"
          >
            <template #icon>
              <NIcon>
                <DownloadOutline />
              </NIcon>
            </template>
            Скачать отчет
          </NButton>
        </NSpace>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import {
  NCard,
  NSpace,
  NAlert,
  NProgress,
  NTag,
  NIcon,
  NButton
} from 'naive-ui';
import {
  CheckmarkCircleOutline,
  WarningOutline,
  CloseCircleOutline,
  RefreshOutline,
  DownloadOutline
} from '@vicons/ionicons5';
import type { AnalysisResult } from '@/types/analysis';
import { analysisHelpers } from '@/utils/analysisHelpers';

interface Props {
  analysisResult: AnalysisResult;
  analyzedText: string;
}

defineProps<Props>();

defineEmits<{
  reset: [];
  download: [];
}>();

const { getUrgeProgressColor, getViolenceProgressColor } = analysisHelpers;
</script>

<style scoped>
.result-section {
  width: 100%;
  max-width: 800px;
}

.text-preview-card {
  margin-bottom: 16px;
}

.text-preview {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  background: var(--n-color-embedded);
  border-radius: 4px;
}

.original-text {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.5;
}

.analysis-results h3 {
  margin: 0 0 16px 0;
  color: var(--n-text-color-1);
}

.module-card {
  transition: all 0.3s ease;
}

.module-card.disabled {
  opacity: 0.7;
}

.module-card.disabled .n-card__content {
  opacity: 0.7;
}

.module-result {
  width: 100%;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.module-name {
  font-weight: 600;
  color: var(--n-text-color-1);
}

.module-description {
  margin: 8px 0;
  color: var(--n-text-color-2);
  font-size: 14px;
}

.module-details {
  margin-top: 12px;
}

.module-details ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.module-details li {
  margin-bottom: 4px;
  color: var(--n-text-color-2);
  font-size: 14px;
}

.final-verdict {
  margin: 24px 0;
}

.analysis-summary {
  padding: 16px;
  background: var(--n-color-embedded);
  border-radius: 8px;
  margin: 16px 0;
}

.analysis-summary h4 {
  margin: 0 0 12px 0;
  color: var(--n-text-color-1);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.summary-item span {
  color: var(--n-text-color-1);
  font-size: 14px;
}

.new-analysis-button,
.download-button {
  min-width: 140px;
}

@media (max-width: 768px) {
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .new-analysis-button,
  .download-button {
    min-width: 120px;
  }
}
</style>
