import React from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext'

interface Props {
  label: string
  description?: string
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
}

export function ToggleRow({ label, description, value, onValueChange, disabled }: Props) {
  const { theme } = useTheme()

  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        {description && <Text style={[styles.description, { color: theme.textMuted }]}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: theme.border, true: '#FFC72C' }}
        thumbColor="#fff"
        ios_backgroundColor={theme.border}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  textBlock: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    marginTop: 2,
  },
})
