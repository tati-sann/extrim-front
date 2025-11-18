import { ref, computed } from 'vue';

export const useTheme = () => {
  const isDarkTheme = ref(true);

  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value;
  };

  const themeKey = computed(() => isDarkTheme.value ? 'dark' : 'light');

  return {
    isDarkTheme,
    toggleTheme,
    themeKey
  };
};
