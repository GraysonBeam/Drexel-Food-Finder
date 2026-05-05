import React from 'react'
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import type { RootStackParamList } from '../../App'

type Route = RouteProp<RootStackParamList, 'EventDetail'>
type Nav = NativeStackNavigationProp<RootStackParamList, 'EventDetail'>

function DietaryBadges({ isHalal, isVegan, isVegetarian }: { isHalal: boolean; isVegan: boolean; isVegetarian: boolean }) {
  const badges: { label: string; color: string; bg: string }[] = []
  if (isVegan) badges.push({ label: '🌱 Vegan', color: '#166534', bg: '#DCFCE7' })
  else if (isVegetarian) badges.push({ label: '🥗 Vegetarian', color: '#15803D', bg: '#F0FDF4' })
  if (isHalal) badges.push({ label: '☪️ Halal', color: '#1D4ED8', bg: '#DBEAFE' })
  if (badges.length === 0) {
    return (
      <View style={[styles.badge, { backgroundColor: '#FEF9EC' }]}>
        <Text style={[styles.badgeText, { color: '#B45309' }]}>🍕 Free Food</Text>
      </View>
    )
  }
  return (
    <View style={styles.badgeRow}>
      {badges.map((b) => (
        <View key={b.label} style={[styles.badge, { backgroundColor: b.bg }]}>
          <Text style={[styles.badgeText, { color: b.color }]}>{b.label}</Text>
        </View>
      ))}
    </View>
  )
}

export default function EventDetailScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const event = route.params
  const { theme, isDark } = useTheme()
  const dragonLinkColor = isDark ? '#F6A623' : '#0033A0'

  const handleAddToCalendar = () => {
    const parseTime = (raw: string): string | null => {
      const m = raw.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
      if (!m) return null
      let h = parseInt(m[1], 10)
      const min = parseInt(m[2], 10)
      const meridiem = m[3]?.toUpperCase()
      if (meridiem === 'PM' && h !== 12) h += 12
      if (meridiem === 'AM' && h === 12) h = 0
      return `${String(h).padStart(2, '0')}${String(min).padStart(2, '0')}00`
    }

    const parts = ['https://calendar.google.com/calendar/render?action=TEMPLATE']
    parts.push(`&text=${encodeURIComponent(event.title)}`)

    if (event.event_date) {
      const dateStr = event.event_date.replace(/-/g, '')

      if (event.time) {
        // Extract all time tokens from strings like "2:00 PM - 4:00 PM"
        const tokens = [...event.time.matchAll(/(\d{1,2}):(\d{2})\s*(AM|PM)?/gi)]
        const startTime = tokens[0] ? parseTime(tokens[0][0]) : null
        const endTime = tokens[1] ? parseTime(tokens[1][0]) : null

        if (startTime) {
          let endDateStr = dateStr
          let resolvedEnd: string
          if (endTime) {
            resolvedEnd = endTime
          } else {
            // Default: 1 hour after start
            const h = parseInt(startTime.slice(0, 2), 10)
            const m = startTime.slice(2)
            if (h + 1 >= 24) {
              const d = new Date(`${event.event_date}T00:00:00`)
              d.setDate(d.getDate() + 1)
              endDateStr = d.toISOString().split('T')[0].replace(/-/g, '')
            }
            resolvedEnd = `${String((h + 1) % 24).padStart(2, '0')}${m}`
          }
          parts.push(`&dates=${dateStr}T${startTime}/${endDateStr}T${resolvedEnd}`)
        } else {
          // Time string unparseable — fall back to all-day
          const d = new Date(`${event.event_date}T00:00:00`)
          d.setDate(d.getDate() + 1)
          parts.push(`&dates=${dateStr}/${d.toISOString().split('T')[0].replace(/-/g, '')}`)
        }
      } else {
        // No time field — all-day event
        const d = new Date(`${event.event_date}T00:00:00`)
        d.setDate(d.getDate() + 1)
        parts.push(`&dates=${dateStr}/${d.toISOString().split('T')[0].replace(/-/g, '')}`)
      }
    }

    if (event.description) parts.push(`&details=${encodeURIComponent(event.description)}`)
    if (event.location) parts.push(`&location=${encodeURIComponent(event.location)}`)
    Linking.openURL(parts.join(''))
  }

  const handleOpenLink = () => {
    if (event.link) Linking.openURL(event.link)
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Event Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{event.title}</Text>

        <DietaryBadges isHalal={event.is_halal} isVegan={event.is_vegan} isVegetarian={event.is_vegetarian} />

        <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {event.date && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color={theme.iconColor} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>{event.date}</Text>
            </View>
          )}
          {event.time && (
            <View style={[styles.infoRow, (event.date) ? styles.bordered : null, { borderTopColor: theme.border }]}>
              <Ionicons name="time-outline" size={18} color={theme.iconColor} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>{event.time}</Text>
            </View>
          )}
          {event.location && (
            <View style={[styles.infoRow, (event.date || event.time) ? styles.bordered : null, { borderTopColor: theme.border }]}>
              <Ionicons name="location-outline" size={18} color={theme.iconColor} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>{event.location}</Text>
            </View>
          )}
          {event.food_offered && (
            <View style={[styles.infoRow, styles.bordered, { borderTopColor: theme.border }]}>
              <Ionicons name="fast-food-outline" size={18} color={theme.iconColor} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>{event.food_offered}</Text>
            </View>
          )}
        </View>

        {event.description ? (
          <View style={[styles.descCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.descLabel, { color: theme.textMuted }]}>DESCRIPTION</Text>
            <Text style={[styles.descText, { color: theme.textSecondary }]}>{event.description}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.calendarButton} onPress={handleAddToCalendar} activeOpacity={0.8}>
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.calendarButtonText}>Add to Calendar</Text>
        </TouchableOpacity>

        {event.link ? (
          <TouchableOpacity style={[styles.linkButton, { backgroundColor: theme.surface, borderColor: dragonLinkColor }]} onPress={handleOpenLink} activeOpacity={0.8}>
            <Ionicons name="open-outline" size={20} color={dragonLinkColor} />
            <Text style={[styles.linkButtonText, { color: dragonLinkColor }]}>View on DragonLink</Text>
          </TouchableOpacity>
        ) : null}
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
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', lineHeight: 30 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 13, fontWeight: '500' },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  bordered: { borderTopWidth: 1 },
  infoText: { fontSize: 15, flex: 1 },
  descCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    gap: 10,
  },
  descLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  descText: { fontSize: 15, lineHeight: 22 },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0033A0',
    borderRadius: 14,
    paddingVertical: 16,
  },
  calendarButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
  },
  linkButtonText: { fontSize: 16, fontWeight: '600', color: '#0033A0' },
})
