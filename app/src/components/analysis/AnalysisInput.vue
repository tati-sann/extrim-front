<template>
  <div class="input-section">
    <NCard title="Анализ текста на побудительные конструкции" class="analysis-card">
      <NSpace vertical :size="24">
        <p class="description">
          Введите текст для анализа на наличие побудительных конструкций и побуждений к насилию
        </p>

        <NInput
          :value="messageText"
          type="textarea"
          placeholder="Введите текст для анализа..."
          :rows="12"
          :resizable="false"
          class="analysis-textarea"
          @update:value="updateMessageText"
        />

        <NSpace vertical :size="16">
          <NSpace justify="center" :size="16">
            <NButton
              type="primary"
              size="large"
              @click="sendMessage('success')"
              :disabled="!messageText.trim()"
              class="analyze-button success-button"
            >
              <template #icon>
                <NIcon>
                  <CheckmarkCircleOutline />
                </NIcon>
              </template>
              Успешный анализ
            </NButton>

            <NButton
              type="warning"
              size="large"
              @click="sendMessage('error')"
              :disabled="!messageText.trim()"
              class="analyze-button error-button"
            >
              <template #icon>
                <NIcon>
                  <WarningOutline />
                </NIcon>
              </template>
              Анализ с ошибкой
            </NButton>
          </NSpace>

          <p class="buttons-description">
            <strong>Успешный анализ</strong> - имитирует корректную работу нейросетевых модулей<br>
            <strong>Анализ с ошибкой</strong> - демонстрирует обработку сбоев в системе
          </p>
        </NSpace>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NSpace, NInput, NButton, NIcon } from 'naive-ui';
import { CheckmarkCircleOutline, WarningOutline } from '@vicons/ionicons5';

interface Props {
  messageText: string;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:messageText': [value: string];
  sendMessage: [type: 'success' | 'error'];
}>();

const updateMessageText = (value: string) => {
  emit('update:messageText', value);
};

const sendMessage = (type: 'success' | 'error') => {
  emit('sendMessage', type);
};
</script>
