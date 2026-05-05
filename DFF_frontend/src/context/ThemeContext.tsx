import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = '@dff_light_mode'

export const DARK = {
  bg: '#111827',
  surface: '#1F2937',
  border: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  headerBg: '#1F2937',
  sectionHeaderBg: '#111827',
  segmentBg: '#374151',
  segmentActive: '#4B5563',
  iconColor: '#9CA3AF',
  backButtonBg: '#374151',
}

export const LIGHT = {
  bg: '#F9FAFB',
  surface: '#ffffff',
  border: '#E5E7EB',
  text: '#111827',
  textSecondary: '#374151',
  textMuted: '#6B7280',
  headerBg: '#ffffff',
  sectionHeaderBg: '#F9FAFB',
  segmentBg: '#F3F4F6',
  segmentActive: '#ffffff',
  iconColor: '#6B7280',
  backButtonBg: '#F3F4F6',
}

export type Theme = typeof DARK

type ThemeContextType = {
  theme: Theme
  isDark: boolean
  setLightMode: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DARK,
  isDark: true,
  setLightMode: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === 'true') setIsDark(false)
    })
  }, [])

  const setLightMode = (isLight: boolean) => {
    setIsDark(!isLight)
    AsyncStorage.setItem(STORAGE_KEY, isLight ? 'true' : 'false')
  }

  return (
    <ThemeContext.Provider value={{ theme: isDark ? DARK : LIGHT, isDark, setLightMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
