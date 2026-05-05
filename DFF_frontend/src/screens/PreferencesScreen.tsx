import React, { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { getPreferences, updatePreference } from '../lib/preferences'
import { registerForPushNotifications, unregisterFromPushNotifications } from '../lib/notifications'
import { ToggleRow } from '../components/ToggleRow'
import { PrimaryButton } from '../components/PrimaryButton'

type Prefs = {
  first_name: string
  last_name: string
  notifications: boolean
  vegetarian: boolean
  vegan: boolean
  halal: boolean
}

export default function PreferencesScreen() {
  const navigation = useNavigation()
  const { session, userId } = useAuth()
  const { theme, isDark, setLightMode } = useTheme()
  const [prefs, setPrefs] = useState<Prefs | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    getPreferences(userId).then((data) => {
      if (data) setPrefs(data as Prefs)
      setLoading(false)
    })
  }, [userId])

  const toggle = async (field: 'notifications' | 'vegetarian' | 'vegan' | 'halal', value: boolean) => {
    if (!userId || !prefs) return
    setSaving(field)
    setPrefs((p) => p ? { ...p, [field]: value } : p)

    if (field === 'notifications') {
      if (value) await registerForPushNotifications(userId)
      else await unregisterFromPushNotifications(userId)
    }

    const ok = await updatePreference(userId, field, value)
    if (!ok) {
      setPrefs((p) => p ? { ...p, [field]: !value } : p)
      Alert.alert('Error', 'Could not save preference.')
    }
    setSaving(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <ActivityIndicator style={{ marginTop: 60 }} size="large" color="#0033A0" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.backButtonBg }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Preferences</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info */}
        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.sectionHeader, { backgroundColor: theme.sectionHeaderBg, borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>USER INFO</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Name</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{prefs?.first_name} {prefs?.last_name}</Text>
          </View>
          <View style={[styles.infoRow, styles.borderTop, { borderTopColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Email</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{session?.user?.email}</Text>
          </View>
        </View>

        {/* Dietary Preferences */}
        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.sectionHeader, { backgroundColor: theme.sectionHeaderBg, borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>DIETARY PREFERENCES</Text>
          </View>
          <ToggleRow
            label="Vegetarian"
            value={prefs?.vegetarian ?? true}
            onValueChange={(v) => toggle('vegetarian', v)}
            disabled={saving === 'vegetarian'}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <ToggleRow
            label="Vegan"
            value={prefs?.vegan ?? true}
            onValueChange={(v) => toggle('vegan', v)}
            disabled={saving === 'vegan'}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <ToggleRow
            label="Halal"
            value={prefs?.halal ?? true}
            onValueChange={(v) => toggle('halal', v)}
            disabled={saving === 'halal'}
          />
        </View>

        {/* Appearance */}
        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.sectionHeader, { backgroundColor: theme.sectionHeaderBg, borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>APPEARANCE</Text>
          </View>
          <ToggleRow
            label="Light Mode"
            description="Switch to light theme"
            value={!isDark}
            onValueChange={(v) => setLightMode(v)}
          />
        </View>

        {/* Notifications */}
        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.sectionHeader, { backgroundColor: theme.sectionHeaderBg, borderBottomColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>NOTIFICATIONS</Text>
          </View>
          <ToggleRow
            label="Push Notifications"
            description="Get notified about new events"
            value={prefs?.notifications ?? false}
            onValueChange={(v) => toggle('notifications', v)}
            disabled={saving === 'notifications'}
          />
        </View>

        {/* Log Out */}
        <View style={styles.logoutArea}>
          <PrimaryButton onPress={handleLogout} variant="destructive" fullWidth>
            Log Out
          </PrimaryButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  content: { padding: 16, gap: 20, paddingBottom: 40 },
  section: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  infoRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  borderTop: {
    borderTopWidth: 1,
  },
  infoLabel: { fontSize: 12, marginBottom: 2 },
  infoValue: { fontSize: 16 },
  divider: { height: 1, marginHorizontal: 20 },
  logoutArea: { paddingTop: 4 },
})
