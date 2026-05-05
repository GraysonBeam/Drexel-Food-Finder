import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ActivityIndicator, View } from 'react-native'
import { AuthProvider, useAuth } from './src/context/AuthContext'
import { ThemeProvider } from './src/context/ThemeContext'
import LoginScreen from './src/screens/LoginScreen'
import FeedScreen from './src/screens/FeedScreen'
import PreferencesScreen from './src/screens/PreferencesScreen'
import EventDetailScreen from './src/screens/EventDetailScreen'

export type RootStackParamList = {
  Login: undefined
  Feed: undefined
  Preferences: undefined
  EventDetail: {
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
}

const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827' }}>
        <ActivityIndicator size="large" color="#0033A0" />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {session ? (
        <>
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="Preferences" component={PreferencesScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ animation: 'slide_from_right' }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
