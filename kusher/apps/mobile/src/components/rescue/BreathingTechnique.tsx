import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Easing } from 'react-native'
import { colors, T } from '../../constants/theme'

interface Props {
  name: string
  description: string
  active?: boolean
}

export function BreathingTechnique({ name, description, active }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale')

  useEffect(() => {
    if (!active) return

    const runAnimation = () => {
      // Inhale: 4s
      setPhase('Inhale')
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 4000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          // Hold: 7s
          setPhase('Hold')
          setTimeout(() => {
            // Exhale: 8s
            setPhase('Exhale')
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 8000,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) runAnimation()
            })
          }, 7000)
        }
      })
    }

    runAnimation()
    return () => scaleAnim.stopAnimation()
  }, [active])

  return (
    <View style={[s.card, active && s.cardActive]}>
      <View style={s.content}>
        <View>
          <Text style={s.name}>{name}</Text>
          <Text style={s.desc}>{description}</Text>
        </View>
        {active && (
          <View style={s.visualizerContainer}>
            <Animated.View 
              style={[
                s.circle, 
                { transform: [{ scale: scaleAnim }] }
              ]} 
            />
          </View>
        )}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginVertical: 8 },
  cardActive: { backgroundColor: colors.tealLight },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  desc: { ...T.body, color: colors.textDim, marginTop: 4 },
  visualizerContainer: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.teal },
})