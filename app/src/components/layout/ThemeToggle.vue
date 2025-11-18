<template>
  <NButton
    quaternary
    @click="$emit('toggleTheme')"
    class="theme-toggle"
  >
    <template #icon>
      <NIcon>
        <SunnyOutline v-if="isDarkTheme" />
        <MoonOutline v-else />
      </NIcon>
    </template>
  </NButton>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';
import { SunnyOutline, MoonOutline } from '@vicons/ionicons5';

interface Props {
  isDarkTheme: boolean;
}

defineProps<Props>();

defineEmits<{
  toggleTheme: [];
}>();
</script>
