import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'

interface Props {
  title: string
  location: string | null
  date: string | null
  time: string | null
  foodOffered: string | null
  isHalal: boolean
  isVegan: boolean
  isVegetarian: boolean
  onPress?: () => void
}

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

export function EventCard({ title, location, date, time, foodOffered, isHalal, isVegan, isVegetarian, onPress }: Props) {
  const { theme } = useTheme()
  const dateTime = [date, time].filter(Boolean).join(', ')

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{title}</Text>
      </View>

      <DietaryBadges isHalal={isHalal} isVegan={isVegan} isVegetarian={isVegetarian} />

      {location && (
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color={theme.iconColor} />
          <Text style={[styles.detail, { color: theme.textSecondary }]} numberOfLines={1}>{location}</Text>
        </View>
      )}

      {dateTime ? (
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={16} color={theme.iconColor} />
          <Text style={[styles.detail, { color: theme.textSecondary }]}>{dateTime}</Text>
        </View>
      ) : null}

      {foodOffered && (
        <Text style={[styles.description, { color: theme.textMuted }]} numberOfLines={2}>{foodOffered}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detail: {
    fontSize: 14,
    flex: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
})
