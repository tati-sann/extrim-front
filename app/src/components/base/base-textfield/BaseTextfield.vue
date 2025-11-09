<template>
  <label class="block text-sm font-medium text-gray-700 mb-1">
    {{ label }}
    <input
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="inputClasses"
      @blur="handleBlur"
      @input="handleInput"
    />
    <div v-if="errorMessage" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: 'Input Text Label',
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
  errorMessage: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': [event: Event]
  'input': [value: string]
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value)
  }
})

const inputClasses = computed(() => [
  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150',
  props.disabled
    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
    : props.errorMessage
      ? 'border-red-300 text-red-900 placeholder-red-300'
      : 'border-gray-300 text-gray-900 placeholder-gray-400'
])

const handleBlur = (event: Event) => {
  emit('blur', event)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('input', target.value)
}
</script>
