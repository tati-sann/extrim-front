<template>
  <div class="error-section">
    <NCard title="Ошибка анализа" class="error-card">
      <NSpace vertical :size="24">
        <NAlert type="error" title="Анализ не завершен">
          {{ analysisError }}
        </NAlert>

        <!-- Показываем текст даже при ошибке -->
        <NCard
          title="Анализируемый текст"
          size="small"
          class="text-preview-card"
          v-if="analyzedText"
        >
          <div class="text-preview">
            <p class="original-text">{{ analyzedText }}</p>
          </div>
        </NCard>

        <div class="error-details">
          <h4>Статус модулей:</h4>
          <NSpace vertical :size="12">
            <div class="module-status">
              <NIcon color="#10b981">
                <CheckmarkCircleOutline />
              </NIcon>
              <span>Модуль определения побуждений: <strong>Готов</strong></span>
            </div>
            <div class="module-status">
              <NIcon color="#10b981">
                <CheckmarkCircleOutline />
              </NIcon>
              <span>Модуль определения побуждений к насилию: <strong>Готов</strong></span>
            </div>
            <div class="module-status error">
              <NIcon color="#ef4444">
                <CloseCircleOutline />
              </NIcon>
              <span>Система анализа: <strong>Ошибка соединения</strong></span>
            </div>
          </NSpace>
        </div>

        <p class="error-description">
          Произошла ошибка при анализе текста. Попробуйте отправить запрос еще раз.
        </p>

        <NSpace justify="center">
          <NButton
            type="primary"
            @click="$emit('retry')"
            class="retry-button"
          >
            <template #icon>
              <NIcon>
                <RefreshOutline />
              </NIcon>
            </template>
            Попробовать снова
          </NButton>

          <NButton
            @click="$emit('reset')"
            class="cancel-button"
          >
            Отменить
          </NButton>
        </NSpace>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NSpace, NAlert, NIcon, NButton } from 'naive-ui';
import { CheckmarkCircleOutline, CloseCircleOutline, RefreshOutline } from '@vicons/ionicons5';

interface Props {
  analysisError: string;
  analyzedText: string;
}

defineProps<Props>();

defineEmits<{
  retry: [];
  reset: [];
}>();
</script>

<style scoped>
.error-section {
  width: 100%;
  max-width: 600px;
}

.text-preview-card {
  margin-bottom: 16px;
}

.text-preview {
  max-height: 150px;
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

.error-details {
  padding: 16px;
  background: var(--n-color-embedded);
  border-radius: 8px;
}

.error-details h4 {
  margin: 0 0 12px 0;
  color: var(--n-text-color-1);
}

.module-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.module-status.error {
  color: #ef4444;
}

.module-status span {
  color: var(--n-text-color-1);
  font-size: 14px;
}

.error-description {
  text-align: center;
  color: var(--n-text-color-2);
  margin: 0;
}

.retry-button,
.cancel-button {
  min-width: 140px;
}

@media (max-width: 768px) {
  .retry-button,
  .cancel-button {
    min-width: 120px;
  }
}
</style>
