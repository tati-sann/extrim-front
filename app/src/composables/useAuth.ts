import { ref, computed, onMounted } from 'vue'
import { authService, type UserProfile, type LoginData } from '@/services/auth.service'

export const useAuth = () => {
  const user = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  // Проверяем аутентификацию при загрузке
  onMounted(async () => {
    try {
      // Просто проверяем, авторизован ли пользователь
      const isAuth = await authService.checkAuth()

      if (isAuth) {
        // Если авторизован, загружаем профиль
        await fetchProfile()
      }
    } catch {
      // В случае ошибки считаем, что пользователь не авторизован
      user.value = null
    }
  })

  /**
   * Логин пользователя
   */
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const loginData: LoginData = { email, password }
      const response = await authService.login(loginData)

      user.value = response.user

      return response
    } catch (err: any) {
      error.value = err.message
      user.value = null
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Выход пользователя
   */
  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      await authService.logout()
      user.value = null
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Загрузка профиля пользователя
   */
  const fetchProfile = async () => {
    loading.value = true
    error.value = null

    try {
      const profile = await authService.getProfile()

      user.value = profile

      return profile
    } catch (err: any) {
      error.value = err.message
      user.value = null
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Проверка аутентификации
   */
  const checkAuth = async (): Promise<boolean> => {
    try {
      return await authService.checkAuth()
    } catch {
      user.value = null

      return false
    }
  }

  /**
   * Очистка ошибки
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Обновление данных пользователя (только локально)
   */
  const updateUser = (updates: Partial<UserProfile>) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
    }
  }

  return {
    // State
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isAuthenticated,

    // Actions
    login,
    logout,
    fetchProfile,
    checkAuth,
    clearError,
    updateUser
  }
}

export type UseAuthReturn = ReturnType<typeof useAuth>
