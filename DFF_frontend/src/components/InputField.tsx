import React from 'react'
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native'

interface Props extends TextInputProps {
  label?: string
}

export function InputField({ label, ...props }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111827',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
  },
})
