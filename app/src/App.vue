<template>
  <NConfigProvider
    class="h-full"
    :key="themeKey"
    :theme="isDarkTheme ? darkTheme : null"
    :theme-overrides="isDarkTheme ? darkThemeOverrides : lightThemeOverrides"
  >
    <NGlobalStyle />

    <div class="layout" :class="{ 'light-theme': !isDarkTheme }">
        <AppHeader
          @showLogin="showLoginPopup = true"
          :is-dark-theme="isDarkTheme"
          @toggle-theme="toggleTheme"
        />

        <div class="content">
          <AnalysisInput
            v-if="!analysisResult && !analysisError && !sending"
            :message-text="messageText"
            @sendMessage="handleSendMessage"
          />

          <AnalysisLoader
            v-else-if="sending"
            :currentStep="currentStep"
            :step1Result="step1Result"
            :step2Result="step2Result"
            :overallProgress="overallProgress"
            :overallProgressColor="overallProgressColor"
          />

          <AnalysisResult
            v-else-if="analysisResult"
            :analysisResult="analysisResult"
            :analyzedText="analyzedText"
            @reset="resetAnalysis"
            @download="downloadReport"
          />

          <AnalysisError
            v-else-if="analysisError"
            :analysisError="analysisError"
            :analyzedText="analyzedText"
            @retry="retryAnalysis"
            @reset="resetAnalysis"
          />
        </div>

    </div>

    <LoginPopup
      v-model:show="showLoginPopup"
      @submit="handleLoginSubmit"
      @cancel="handleLoginCancel"
      @success="handleLoginSuccess"
    />
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NConfigProvider, NLayout, NLayoutContent, NGlobalStyle } from 'naive-ui';
import { darkTheme } from 'naive-ui';
import { darkThemeOverrides, lightThemeOverrides } from "@/theme/theme.ts";

// Компоненты
import AppHeader from '@/components/layout/AppHeader.vue';
import AnalysisInput from '@/components/analysis/AnalysisInput.vue';
import AnalysisLoader from '@/components/analysis/AnalysisLoader.vue';
import AnalysisResult from '@/components/analysis/AnalysisResult.vue';
import AnalysisError from '@/components/analysis/AnalysisError.vue';
import LoginPopup from "@/components/common/LoginPopup.vue";

// Композиции
import { useTheme } from '@/composables/useTheme';
import { useAnalysis } from '@/composables/useAnalysis';
import { useAuth } from "@/composables/useAuth.ts";
import { ref } from "vue";

const { isDarkTheme, toggleTheme, themeKey } = useTheme();
const { user, isAuthenticated, loading, login, logout, fetchProfile } = useAuth();
const {
  messageText,
  sending,
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
} = useAnalysis();

const showLoginPopup = ref(false);

const handleSendMessage = (type: 'success' | 'error', text: string) => {
  messageText.value = text;
  sendMessage(type);
};

const handleLoginSubmit = async (loginData: { email: string; password: string }) => {
  try {
    await login(loginData.email, loginData.password);
    showLoginPopup.value = false;
  } catch (error) {
    console.error('Login error:', error);
  }
};

const handleLoginSuccess = (userData: { id: string; email: string }) => {
  console.log('Пользователь успешно вошел:', userData);
};

const handleLoginCancel = () => {
  console.log('Логин отменен');
};
</script>

<style scoped>
.layout {
  width: 100%;
  max-height: 100%;
  min-height: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: max-content auto;
  grid-template-columns: 1fr;
}

.content {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  justify-items: center;
}


</style>
