import { apiService } from './api.service'

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  user: {
    id: string
    email: string
  }
}

export interface UserProfile {
  id: string
  email: string
  name?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthError {
  message: string
  status?: number
  code?: string
}

class AuthService {
  /**
   * Логин пользователя
   */
  async login(loginData: LoginData): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/login', loginData)

    return response.data
  }

  /**
   * Выход пользователя
   */
  async logout(): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>('/auth/logout')

    return response.data
  }

  /**
   * Обновление токенов
   */
  async refreshTokens(): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>('/auth/refresh')

    return response.data
  }

  /**
   * Получение профиля пользователя
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiService.get<UserProfile>('/auth/profile')

    return response.data
  }

  /**
   * Проверка аутентификации
   */
  async checkAuth(): Promise<boolean> {
    try {
      await this.getProfile()

      return true
    } catch (error: any) {
      return false
    }
  }

  /**
   * Валидация email
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(email)
  }

  /**
   * Валидация пароля
   */
  isValidPassword(password: string): boolean {
    return password.length >= 6
  }
}

export const authService = new AuthService()
