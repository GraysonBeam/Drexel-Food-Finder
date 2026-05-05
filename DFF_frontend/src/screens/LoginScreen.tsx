import React, { useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase'
import { InputField } from '../components/InputField'
import { PrimaryButton } from '../components/PrimaryButton'

export default function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Please enter your email and password.')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) Alert.alert('Login failed', error.message)
  }

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      return Alert.alert('Please fill in all fields.')
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    })
    setLoading(false)
    if (error) Alert.alert('Sign up failed', error.message)
    else Alert.alert('Check your email', 'We sent you a confirmation link.')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <Text style={styles.emoji}>🍕</Text>
            <Text style={styles.title}>Drexel Food Finder</Text>
            <Text style={styles.subtitle}>Discover free food on campus</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {mode === 'signup' && (
              <>
                <InputField
                  label="First Name"
                  placeholder="First name"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
                <InputField
                  label="Last Name"
                  placeholder="Last name"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </>
            )}
            <InputField
              label="Email"
              placeholder="student@drexel.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <InputField
              label="Password"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            {mode === 'login' ? (
              <>
                <PrimaryButton onPress={handleLogin} fullWidth loading={loading}>
                  Log In
                </PrimaryButton>
                <PrimaryButton onPress={() => setMode('signup')} variant="secondary" fullWidth>
                  Create Account
                </PrimaryButton>
              </>
            ) : (
              <>
                <PrimaryButton onPress={handleSignUp} fullWidth loading={loading}>
                  Sign Up
                </PrimaryButton>
                <PrimaryButton onPress={() => setMode('login')} variant="secondary" fullWidth>
                  Back to Log In
                </PrimaryButton>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 32,
  },
  logoArea: { alignItems: 'center', gap: 8 },
  emoji: { fontSize: 56 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
  form: { gap: 16 },
  buttons: { gap: 12 },
})
