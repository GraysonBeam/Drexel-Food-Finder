import React, { useCallback, useEffect, useState } from 'react'
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'
import { BuyMeCoffeeButton } from '../components/BuyMeCoffeeButton'
import { EventCard } from '../components/EventCard'
import { SegmentedControl } from '../components/SegmentedControl'
import { getPreferences } from '../lib/preferences'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import type { RootStackParamList } from '../../App'

type Event = {
  id: string
  title: string
  date: string | null
  time: string | null
  location: string | null
  description: string | null
  food_offered: string | null
  link: string | null
  event_date: string | null
  is_halal: boolean
  is_vegan: boolean
  is_vegetarian: boolean
  created_at: string
}

type Prefs = {
  vegetarian: boolean
  vegan: boolean
  halal: boolean
}

type Nav = NativeStackNavigationProp<RootStackParamList, 'Feed'>

function applyDietaryFilter(events: Event[], prefs: Prefs | null): Event[] {
  if (!prefs) return events
  return events.filter((e) => {
    // Untagged events (pizza, generic food, etc.) only show when all prefs are on —
    // i.e. the user hasn't narrowed their filter away from the default "show everything" state.
    if (!e.is_vegan && !e.is_vegetarian && !e.is_halal) {
      return prefs.vegan && prefs.vegetarian && prefs.halal
    }
    if (prefs.vegan && e.is_vegan) return true
    if (prefs.vegetarian && e.is_vegetarian) return true
    if (prefs.halal && e.is_halal) return true
    return false
  })
}

export default function FeedScreen() {
  const navigation = useNavigation<Nav>()
  const { userId } = useAuth()
  const { theme } = useTheme()
  const [events, setEvents] = useState<Event[]>([])
  const [prefs, setPrefs] = useState<Prefs | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'soonest'>('newest')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchEvents = useCallback(async (sort: 'newest' | 'soonest') => {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('events')
      .select('id, title, date, time, location, description, food_offered, link, event_date, is_halal, is_vegan, is_vegetarian, created_at')
      .gte('event_date', today)
      .order(sort === 'soonest' ? 'event_date' : 'created_at', { ascending: sort === 'soonest' })
    if (error) console.error('fetchEvents error:', error)
    setEvents((data as Event[]) ?? [])
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchEvents(sortBy).finally(() => setLoading(false))
  }, [sortBy, fetchEvents])

  useFocusEffect(
    useCallback(() => {
      if (!userId) return
      getPreferences(userId).then((data) => {
        if (data) setPrefs({ vegetarian: data.vegetarian, vegan: data.vegan, halal: data.halal })
      })
    }, [userId])
  )

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchEvents(sortBy)
    setRefreshing(false)
  }

  const filteredEvents = applyDietaryFilter(events, prefs)

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Free Food Events</Text>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.surface }]}
          onPress={() => navigation.navigate('Preferences')}
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle-outline" size={26} color={theme.iconColor} />
        </TouchableOpacity>
      </View>

      <View style={[styles.sortBar, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <Text style={[styles.sortLabel, { color: theme.text }]}>Sort By</Text>
        <SegmentedControl
          options={[
            { value: 'newest', label: 'Recently Added' },
            { value: 'soonest', label: 'Soonest' },
          ]}
          value={sortBy}
          onChange={(v) => setSortBy(v as 'newest' | 'soonest')}
        />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0033A0" />
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0033A0" />}
          renderItem={({ item }) => (
            <EventCard
              title={item.title}
              location={item.location}
              date={item.date}
              time={item.time}
              foodOffered={item.food_offered}
              isHalal={item.is_halal}
              isVegan={item.is_vegan}
              isVegetarian={item.is_vegetarian}
              onPress={() => navigation.navigate('EventDetail', item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>😢</Text>
              <Text style={[styles.emptyText, { color: theme.text }]}>No free food events right now</Text>
              <Text style={[styles.emptySubtext, { color: theme.textMuted }]}>Pull down to refresh</Text>
            </View>
          }
        />
      )}
      <BuyMeCoffeeButton />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: '600' },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  sortLabel: { fontSize: 15, fontWeight: '600' },
  list: { padding: 16, paddingBottom: 100 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', marginTop: 80, gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 17, fontWeight: '600' },
  emptySubtext: { fontSize: 14 },
})
