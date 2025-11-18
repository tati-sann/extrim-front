<template>
  <div class="loading-section">
    <NCard title="Анализ текста" class="loading-card">
      <NSpace vertical :size="24" align="center">
        <!-- Анимированный лоадер -->
        <div class="loader-container">
          <div class="pulse-loader"></div>
          <h3>Анализ выполняется...</h3>
          <p>Подключение к нейросетевым модулям</p>
        </div>

        <!-- Прогресс по моделям -->
        <div class="models-progress">
          <div class="progress-steps">
            <!-- Модель 1 -->
            <div class="progress-step" :class="{
              'active': currentStep >= 1,
              'completed': currentStep > 1
            }">
              <div class="step-icon">
                <NIcon v-if="currentStep > 1" color="#10b981" size="20">
                  <CheckmarkCircleOutline />
                </NIcon>
                <div v-else class="step-number">1</div>
              </div>
              <div class="step-content">
                <div class="step-title">Поиск побудительных конструкций</div>
                <div class="step-description">
                  Анализ общего наличия побудительных конструкций в тексте
                </div>
                <div v-if="currentStep === 1" class="step-status">
                  <NSpace :size="8" align="center">
                    <div class="dot-flashing"></div>
                    <span>Выполняется...</span>
                  </NSpace>
                </div>
                <div v-else-if="currentStep > 1" class="step-result">
                  <NTag :type="step1Result > 70 ? 'warning' : 'success'" size="small">
                    Результат: {{ step1Result }}%
                  </NTag>
                  <span v-if="step1Result > 70" class="step-condition">
                    ✓ Условие для продолжения выполнено
                  </span>
                  <span v-else class="step-condition">
                    ⏸ Анализ остановлен - низкий уровень побуждений
                  </span>
                </div>
              </div>
            </div>

            <!-- Модель 2 -->
            <div class="progress-step" :class="{
              'active': currentStep >= 2,
              'completed': currentStep > 2,
              'disabled': step1Result <= 70 && currentStep > 1
            }">
              <div class="step-icon">
                <NIcon v-if="currentStep > 2" color="#10b981" size="20">
                  <CheckmarkCircleOutline />
                </NIcon>
                <div v-else-if="step1Result <= 70 && currentStep > 1" class="step-skipped">
                  <NIcon color="#6b7280">
                    <CloseCircleOutline />
                  </NIcon>
                </div>
                <div v-else class="step-number">2</div>
              </div>
              <div class="step-content">
                <div class="step-title">Поиск побуждений к физическому насилию</div>
                <div class="step-description">
                  Детальный анализ конструкций, побуждающих к физическому насилию
                </div>
                <div v-if="currentStep === 2" class="step-status">
                  <NSpace :size="8" align="center">
                    <div class="dot-flashing"></div>
                    <span>Выполняется...</span>
                  </NSpace>
                </div>
                <div v-else-if="currentStep > 2" class="step-result">
                  <NTag :type="step2Result > 50 ? 'error' : 'warning'" size="small">
                    Результат: {{ step2Result }}%
                  </NTag>
                </div>
                <div v-else-if="step1Result <= 70" class="step-skipped-message">
                  <NAlert type="info" size="small">
                    Модуль не активирован - недостаточный уровень общих побуждений
                  </NAlert>
                </div>
              </div>
            </div>

            <!-- Модель 3 (планируемая) -->
            <div class="progress-step" :class="{
              'disabled': true
            }">
              <div class="step-icon">
                <div class="step-number">3</div>
              </div>
              <div class="step-content">
                <div class="step-title">Классификация целевых групп</div>
                <div class="step-description">
                  Определение социальных групп, против которых направлены побуждения
                </div>
                <div class="step-coming-soon">
                  <NTag type="default" size="small">
                    В разработке
                  </NTag>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Общий прогресс -->
        <div class="overall-progress">
          <NProgress
            type="line"
            :percentage="overallProgress"
            :height="6"
            :border-radius="3"
            :color="overallProgressColor"
          />
          <div class="progress-text">
            Общий прогресс: {{ overallProgress }}%
          </div>
        </div>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NSpace, NIcon, NProgress, NTag, NAlert } from 'naive-ui';
import { CheckmarkCircleOutline, CloseCircleOutline } from '@vicons/ionicons5';

interface Props {
  currentStep: number;
  step1Result: number;
  step2Result: number;
  overallProgress: number;
  overallProgressColor: string;
}

defineProps<Props>();
</script>

<style scoped>
.loading-section {
  width: 100%;
  max-width: 800px;
}

.loading-card {
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.loader-container {
  text-align: center;
  padding: 20px 0;
}

.pulse-loader {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  border: 3px solid #7b61ff;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
  }
}

.models-progress {
  width: 100%;
  max-width: 600px;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-step {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--n-border-color);
  transition: all 0.3s ease;
}

.progress-step.active {
  border-color: #7b61ff;
  background: rgba(123, 97, 255, 0.05);
}

.progress-step.completed {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.progress-step.disabled {
  opacity: 0.6;
  border-color: var(--n-border-color);
  background: var(--n-color-embedded);
}

.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--n-color-embedded);
  border: 2px solid var(--n-border-color);
  flex-shrink: 0;
}

.progress-step.active .step-icon {
  border-color: #7b61ff;
  background: #7b61ff;
  color: white;
}

.progress-step.completed .step-icon {
  border-color: #10b981;
  background: #10b981;
}

.step-number {
  font-weight: 600;
  font-size: 14px;
}

.step-skipped {
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 600;
  color: var(--n-text-color-1);
  margin-bottom: 4px;
}

.step-description {
  font-size: 14px;
  color: var(--n-text-color-2);
  margin-bottom: 8px;
}

.step-status,
.step-result,
.step-coming-soon,
.step-skipped-message {
  margin-top: 8px;
}

.dot-flashing {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #7b61ff;
  animation: dot-flashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}

.dot-flashing::before, .dot-flashing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #7b61ff;
  animation: dot-flashing 1s infinite alternate;
}

.dot-flashing::before {
  left: -12px;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 12px;
  animation-delay: 1s;
}

@keyframes dot-flashing {
  0% {
    background-color: #7b61ff;
  }
  50%, 100% {
    background-color: rgba(123, 97, 255, 0.3);
  }
}

.step-condition {
  font-size: 12px;
  color: var(--n-text-color-3);
  margin-left: 8px;
}

.overall-progress {
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
}

.progress-text {
  text-align: center;
  font-size: 14px;
  color: var(--n-text-color-2);
  margin-top: 8px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .progress-step {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .step-icon {
    align-self: center;
  }
}
</style>
