import React, { useRef, useState } from 'react'
import { Animated, Linking, StyleSheet, Text, TouchableOpacity } from 'react-native'

const COFFEE_URL = 'https://buymeacoffee.com/yourusername' // replace with your URL

const COLLAPSED = 56
const EXPANDED = 220

export function BuyMeCoffeeButton() {
  const [expanded, setExpanded] = useState(false)
  const width = useRef(new Animated.Value(COLLAPSED)).current
  const textOpacity = useRef(new Animated.Value(0)).current

  const expand = () => {
    setExpanded(true)
    Animated.parallel([
      Animated.spring(width, { toValue: EXPANDED, useNativeDriver: false, bounciness: 7, speed: 14 }),
      Animated.timing(textOpacity, { toValue: 1, duration: 180, delay: 130, useNativeDriver: false }),
    ]).start()
  }

  const collapse = () => {
    setExpanded(false)
    Animated.parallel([
      Animated.timing(width, { toValue: COLLAPSED, duration: 200, useNativeDriver: false }),
      Animated.timing(textOpacity, { toValue: 0, duration: 100, useNativeDriver: false }),
    ]).start()
  }

  const onPress = () => {
    if (!expanded) {
      expand()
    } else {
      Linking.openURL(COFFEE_URL)
      collapse()
    }
  }

  return (
    <Animated.View style={[styles.fab, { width }]}>
      <TouchableOpacity style={styles.inner} onPress={onPress} activeOpacity={0.85}>
        <Animated.Text style={[styles.label, { opacity: textOpacity }]} numberOfLines={1}>
          Buy me a coffee
        </Animated.Text>
        <Text style={styles.emoji}>☕</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    height: COLLAPSED,
    borderRadius: COLLAPSED / 2,
    backgroundColor: '#FFDD00',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 10,
  },
  inner: {
    width: EXPANDED,
    height: COLLAPSED,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 13,
    gap: 8,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  emoji: {
    fontSize: 26,
    lineHeight: 32,
  },
})
