import type { GlobalThemeOverrides } from "naive-ui";

const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#7b61ff',
    primaryColorHover: '#8d75ff',
    primaryColorPressed: '#6b51ef',
    primaryColorSuppl: '#7b61ff',

    bodyColor: '#0f0f23',
    cardColor: '#1a1a2e',
    modalColor: '#1a1a2e',
    popoverColor: '#1a1a2e',

    textColorBase: '#e2e8f0',
    textColor1: '#f7fafc',
    textColor2: '#e2e8f0',
    textColor3: '#cbd5e0',

    borderColor: '#374151',
    dividerColor: '#2d3748'
  },
}

const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#7b61ff',
    primaryColorHover: '#8d75ff',
    primaryColorPressed: '#6b51ef',
    primaryColorSuppl: '#7b61ff',
  },
}

export { lightThemeOverrides, darkThemeOverrides };
