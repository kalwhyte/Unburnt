import React from 'react'
import { View, StyleSheet, ViewStyle, StatusBar, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../../constants/theme'

interface ScreenProps {
  children: React.ReactNode
  style?: ViewStyle
  backgroundColor?: string
  unsafe?: boolean
}

export default function Screen({ 
  children, 
  style, 
  backgroundColor = colors.bg,
  unsafe = false 
}: ScreenProps) {
  const insets = useSafeAreaInsets()

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor,
          paddingTop: unsafe ? 0 : insets.top,
          paddingBottom: unsafe ? 0 : insets.bottom,
        },
        style
      ]}
    >
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} 
        backgroundColor={backgroundColor}
      />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
