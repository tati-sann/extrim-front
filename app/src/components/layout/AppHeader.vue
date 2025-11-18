<template>
  <NLayoutHeader bordered class="header">
    <div class="header-content">
      <div class="logo">
        <h2>Анализатор контента</h2>
      </div>

      <NSpace align="center" :size="16" class="header-actions">
        <ThemeToggle
          :is-dark-theme="isDarkTheme"
          @toggle-theme="$emit('toggleTheme')"
        />

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
            @click="$emit('showLogin')"
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
</template>

<script setup lang="ts">
import { NLayoutHeader, NSpace, NButton, NIcon } from 'naive-ui';
import { PersonOutline, LogOutOutline } from '@vicons/ionicons5';
import ThemeToggle from './ThemeToggle.vue';
import { useAuth } from '@/composables/useAuth';

interface Props {
  isDarkTheme: boolean;
}

defineProps<Props>();

defineEmits<{
  showLogin: [];
  toggleTheme: [];
}>();

const { user, isAuthenticated, loading, logout } = useAuth();

const handleLogout = async () => {
  try {
    await logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<style scoped>
/* Стили без изменений */
.header {
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h2 {
  margin: 0;
  color: var(--n-text-color);
  font-size: 20px;
  font-weight: 600;
}

.header-actions {
  margin-left: auto;
}

.user-info {
  color: var(--n-text-color);
  font-size: 14px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .header {
    padding: 0 16px;
    height: 56px;
  }

  .logo h2 {
    font-size: 18px;
  }

  .header-actions {
    gap: 12px;
  }

  .user-info {
    display: none;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0 12px;
  }

  .logo h2 {
    font-size: 16px;
  }

  .login-button span,
  .logout-button span {
    display: none;
  }
}
</style>
