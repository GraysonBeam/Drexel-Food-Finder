import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

type Variant = 'primary' | 'secondary' | 'outline' | 'destructive'

interface Props {
  children: string
  onPress?: () => void
  variant?: Variant
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
}

export function PrimaryButton({
  children,
  onPress,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  loading = false,
}: Props) {
  if (variant === 'primary') {
    return (
      <LinearGradient
        colors={['#0033A0', '#002b85']}
        style={[styles.base, fullWidth && styles.fullWidth, disabled && styles.disabled]}
      >
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled || loading}
          style={styles.inner}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.primaryText}>{children}</Text>
          }
        </TouchableOpacity>
      </LinearGradient>
    )
  }

  const variantStyle = {
    secondary: styles.secondary,
    outline: styles.outline,
    destructive: styles.destructive,
  }[variant]

  const textStyle = {
    secondary: styles.secondaryText,
    outline: styles.outlineText,
    destructive: styles.destructiveText,
  }[variant]

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.base, variantStyle, fullWidth && styles.fullWidth, disabled && styles.disabled]}
    >
      {loading
        ? <ActivityIndicator color="#0033A0" />
        : <Text style={textStyle}>{children}</Text>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  inner: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondary: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  outline: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  destructive: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
})
