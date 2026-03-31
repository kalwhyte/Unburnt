import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { radius, colors, T } from '../../constants/theme'

interface SOSProps { onPress: () => void }

export function CravingSOS({ onPress }: SOSProps) {
  return (
    <View style={sos.banner}>
      <View>
        <Text style={sos.title}>Craving right now?</Text>
        <Text style={sos.sub}>Tap for instant rescue</Text>
      </View>
      <TouchableOpacity style={sos.btn} onPress={onPress}>
        <Text style={sos.btnText}>SOS</Text>
      </TouchableOpacity>
    </View>
  )
}

const sos = StyleSheet.create({
  banner: { backgroundColor: colors.dangerBg, borderWidth: 0.5, borderColor: colors.dangerBorder, borderRadius: radius.md, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...T.bodyMedium, color: colors.danger },
  sub: { ...T.caption, color: '#6a4050', marginTop: 2 },
  btn: { backgroundColor: '#6b2040', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  btnText: { ...T.captionMedium, color: '#f0a0b0' },
})