import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { authService } from './auth.service'

export interface ApiResponse<T = any> {
    data: T
    message?: string
    status: number
}

class ApiService {
    private instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        withCredentials: true,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    constructor() {
        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => config,
            (error: AxiosError) => Promise.reject(error)
        )

        // Response interceptor
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

                // Если ошибка 401 и это не запрос refresh и мы еще не повторяли запрос
                if (error.response?.status === 401 &&
                    !originalRequest.url?.includes('/auth/refresh') &&
                    !originalRequest._retry) {

                    originalRequest._retry = true

                    try {
                        console.log('🔄 [API] Attempting token refresh...')
                        await authService.refreshTokens()

                        // Повторяем оригинальный запрос с новым токеном
                        return this.instance(originalRequest)
                    } catch (refreshError) {
                        console.error('❌ [API] Token refresh failed:', refreshError)
                        // Если refresh не удался, делаем logout
                        await authService.logout()
                        window.location.href = '/login'

                        return Promise.reject(refreshError)
                    }
                }

                console.error('❌ [API Response Error]', {
                    url: error.config?.url,
                    method: error.config?.method,
                    status: error.response?.status,
                    data: error.response?.data
                })

                return Promise.reject(error)
            }
        )
    }

    // Методы для HTTP запросов
    async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
        const response = await this.instance.get(url, { params })

        return this.transformResponse(response)
    }

    async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response = await this.instance.post(url, data)

        return this.transformResponse(response)
    }

    async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response = await this.instance.put(url, data)

        return this.transformResponse(response)
    }

    async delete<T>(url: string): Promise<ApiResponse<T>> {
        const response = await this.instance.delete(url)

        return this.transformResponse(response)
    }

    private transformResponse<T>(response: AxiosResponse): ApiResponse<T> {
        return {
            data: response.data,
            message: response.data?.message,
            status: response.status
        }
    }
}

export const apiService = new ApiService()
