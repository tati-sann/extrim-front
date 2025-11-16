<template>
  <NModal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="Вход в систему"
    positive-text="Войти"
    negative-text="Отмена"
    @positive-click="handlePositiveClick"
    @negative-click="handleCancel"
    :loading="loading"
  >
    <NForm
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="top"
      class="login-form"
      @submit.prevent="handleSubmit"
    >
      <NFormItem label="Email" path="email">
        <NInput
          v-model:value="formValue.email"
          placeholder="Введите ваш email"
          @keydown.enter="handleSubmit"
        />
      </NFormItem>

      <NFormItem label="Пароль" path="password">
        <NInput
          v-model:value="formValue.password"
          type="password"
          placeholder="Введите ваш пароль"
          show-password-on="click"
          @keydown.enter="handleSubmit"
        />
      </NFormItem>

      <!--      <n-space vertical :size="16">-->
      <!--        <n-button-->
      <!--          text-->
      <!--          tag="a"-->
      <!--          type="primary"-->
      <!--          class="forgot-password"-->
      <!--          @click="handleForgotPassword"-->
      <!--        >-->
      <!--          Забыли пароль?-->
      <!--        </n-button>-->
      <!--      </n-space>-->
    </NForm>
  </NModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  NModal,
  NForm,
  NFormItem,
  NInput,
  type FormInst,
  type FormRules,
} from 'naive-ui'

interface LoginForm {
  email: string
  password: string
}

interface Emits {
  (e: 'submit', data: { email: string; password: string; }): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const showModal = defineModel<boolean>('show', {
  required: true
})

const loading = ref(false)
const rememberMe = ref(false)
const formRef = ref<FormInst | null>(null)

const formValue = reactive<LoginForm>({
  email: '',
  password: ''
})

const rules: FormRules = {
  email: [
    {
      required: true,
      message: 'Введите email',
      trigger: ['input', 'blur']
    },
    {
      type: 'email',
      message: 'Введите корректный email',
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      message: 'Введите пароль',
      trigger: ['input', 'blur']
    },
    {
      min: 6,
      message: 'Пароль должен содержать минимум 6 символов',
      trigger: ['input', 'blur']
    }
  ]
}

const handleSubmit = async (): Promise<void> => {
  const isValid = await validateForm()

  if (!isValid) return

  loading.value = true

  try {
    emit('submit', {
      email: formValue.email,
      password: formValue.password,
    })
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// Валидация формы
const validateForm = (): Promise<boolean> => new Promise((resolve) => {
  formRef.value?.validate((errors) => {
    if (errors) {
      resolve(false)

      return
    }
    resolve(true)
  })
})

// Обработчик кнопки "Войти" в модалке
const handlePositiveClick = (): Promise<boolean> => new Promise(async (resolve) => {
  await handleSubmit()
  resolve(false)
})

// Отмена
const handleCancel = () => {
  emit('cancel')
  resetForm()
  showModal.value = false
}

// Сброс формы
const resetForm = () => {
  formValue.email = ''
  formValue.password = ''
  rememberMe.value = false
}

defineExpose({
  resetForm
})
</script>

