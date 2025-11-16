<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import {
  NButton,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NSpace,
  NIcon,
  NConfigProvider,
  darkTheme,
  NGlobalStyle,
} from 'naive-ui'
import { PersonOutline, MoonOutline, SunnyOutline, LogOutOutline } from '@vicons/ionicons5'
import LoginPopup from "@/components/LoginPopup.vue";
import {useAuth} from "@/composables/useAuth.ts";
import {darkThemeOverrides, lightThemeOverrides} from "@/theme/theme.ts";

const showLoginPopup = ref(false)
const isDarkTheme = ref(true)

const { user, isAuthenticated, loading, login, logout, fetchProfile } = useAuth()

onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchProfile()
  }
})

const handleLoginSubmit = async (loginData: {
  email: string;
  password: string;
}) => {
  try {
    await login(loginData.email, loginData.password)
    showLoginPopup.value = false
  } catch (error: any) {
  } finally {
  }
}

const handleLoginSuccess = (userData: { id: string; email: string }) => {
  console.log('Пользователь успешно вошел:', userData)
  // Дополнительные действия после успешного входа
}

const handleLoginCancel = () => {
  console.log('Логин отменен')
}

const handleLogout = async () => {
  try {
    await logout()
  } catch (error: any) {
  } finally {
  }
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
}

const themeKey = computed(() => isDarkTheme.value ? 'dark' : 'light')

</script>

<template>
  <NConfigProvider
    :key="themeKey"
    :theme="isDarkTheme ? darkTheme : null"
    :theme-overrides="isDarkTheme ? darkThemeOverrides : lightThemeOverrides"
  >
    <NGlobalStyle />

    <NLayout class="layout" :class="{ 'light-theme': !isDarkTheme }">
      <NLayoutHeader bordered class="header">
        <div class="header-content">
          <div class="logo">
            <h2>Мое Приложение</h2>
          </div>

          <NSpace align="center" :size="16">
            <NButton
              quaternary
              @click="toggleTheme"
              class="theme-toggle"
            >
              <template #icon>
                <NIcon>
                  <SunnyOutline v-if="isDarkTheme" />
                  <MoonOutline v-else />
                </NIcon>
              </template>
            </NButton>

            <template v-if="isAuthenticated">
              <NSpace align="center" :size="8">
                <span class="user-info">
                  {{ user?.email }}
                </span>
                <NButton
                  quaternary
                  @click="handleLogout"
                  :loading="loading"
                  class="logout-button"
                >
                  <template #icon>
                    <NIcon>
                      <LogOutOutline />
                    </NIcon>
                  </template>
                  Выйти
                </NButton>
              </NSpace>
            </template>

            <template v-else>
              <NButton
                type="primary"
                @click="showLoginPopup = true"
                class="login-button"
              >
                <template #icon>
                  <NIcon>
                    <PersonOutline />
                  </NIcon>
                </template>
                Войти
              </NButton>
            </template>
          </NSpace>
        </div>
      </NLayoutHeader>

      <NLayoutContent class="content">
        <div class="content-inner">
          <template v-if="isAuthenticated">
            <h1>Добро пожаловать, {{ user?.email }}!</h1>
            <p>Вы успешно вошли в систему</p>

            <NSpace vertical :size="24" style="margin-top: 32px;">
              <n-card title="Информация о пользователе" class="demo-card">
                <NSpace vertical :size="12">
                  <div class="user-detail">
                    <strong>ID:</strong> {{ user?.id }}
                  </div>
                  <div class="user-detail">
                    <strong>Email:</strong> {{ user?.email }}
                  </div>
                  <div class="user-detail" v-if="user?.name">
                    <strong>Имя:</strong> {{ user.name }}
                  </div>
                  <div class="user-detail" v-if="user?.role">
                    <strong>Роль:</strong> {{ user.role }}
                  </div>
                </NSpace>
              </n-card>
            </NSpace>
          </template>

          <template v-else>
            <h1>Добро пожаловать!</h1>
            <p>{{ isDarkTheme ? 'Темная тема с фиолетовыми акцентами' : 'Светлая тема с мягкими тонами' }}</p>
            <p>Войдите в систему, чтобы получить доступ к функциям приложения</p>

            <NSpace vertical :size="24" style="margin-top: 32px;">
              <NSpace :size="16">
                <NButton type="primary">Основная кнопка</NButton>
                <NButton type="info">Инфо кнопка</NButton>
                <NButton type="success">Успех</NButton>
                <NButton type="warning">Предупреждение</NButton>
                <NButton type="error">Ошибка</NButton>
              </NSpace>

              <div class="demo-cards">
                <n-card title="Пример карточки" class="demo-card">
                  <template #header-extra>
                    <NButton quaternary size="small">
                      Действие
                    </NButton>
                  </template>
                  <p>Эта карточка использует кастомизированную тему с мягкими цветами</p>
                  <p>Фон не слепит глаза, все оттенки приятные и комфортные</p>
                </n-card>

                <n-card title="Еще одна карточка" class="demo-card">
                  <p>Все элементы наследуют фиолетовые акценты и мягкие тона</p>
                  <NSpace :size="8" style="margin-top: 12px;">
                    <n-tag type="primary">Фиолетовый</n-tag>
                    <n-tag type="info">Инфо</n-tag>
                    <n-tag type="success">Успех</n-tag>
                  </NSpace>
                </n-card>
              </div>
            </NSpace>
          </template>

          <!-- Демо контент для прокрутки -->
          <div class="demo-content">
            <p>Прокрутите вниз, чтобы увидеть фиксированный header</p>
            <div style="height: 800px; display: flex; align-items: center; justify-content: center;">
              <p>Мягкие тона не утомляют глаза при длительной работе</p>
            </div>
          </div>
        </div>
      </NLayoutContent>
    </NLayout>

    <LoginPopup
      v-model:show="showLoginPopup"
      @submit="handleLoginSubmit"
      @cancel="handleLoginCancel"
      @success="handleLoginSuccess"
    />

  </NConfigProvider>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  transition: all 0.3s ease;
}

.layout.light-theme {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.light-theme .header {
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(123, 97, 255, 0.1);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo h2 {
  margin: 0;
  background: linear-gradient(135deg, #7b61ff 0%, #a892fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 24px;
}

.login-button, .logout-button {
  font-weight: 600;
}

.user-info {
  color: var(--n-text-color-base);
  font-size: 14px;
  font-weight: 500;
}

.theme-toggle {
  border-radius: 8px;
}

.content {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}

.content-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.content-inner h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #7b61ff 0%, #a892fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.light-theme .content-inner p {
  color: #64748b;
}

.user-detail {
  padding: 8px 0;
  border-bottom: 1px solid var(--n-divider-color);
}

.user-detail:last-child {
  border-bottom: none;
}

.demo-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.demo-card {
  transition: all 0.3s ease;
}

.demo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(123, 97, 255, 0.1) !important;
}

.demo-content {
  background: var(--n-color-embedded);
  border-radius: 12px;
  padding: 32px;
  border: 1px solid var(--n-border-color);
  text-align: center;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .logo h2 {
    font-size: 20px;
  }

  .login-button, .logout-button {
    padding: 0 16px;
    height: 36px;
    font-size: 14px;
  }

  .user-info {
    font-size: 12px;
  }

  .content-inner {
    padding: 24px 16px;
  }

  .content-inner h1 {
    font-size: 2rem;
  }

  .demo-cards {
    grid-template-columns: 1fr;
  }
}
</style>
