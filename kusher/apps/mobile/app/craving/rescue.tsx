import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colors, T } from "../../src/constants/theme";

export default function RescueScreen() {
  return (
    <View style={s.container}>
      <Text style={s.title}>
        Craving in Progress
      </Text>

      <TouchableOpacity
        style={[s.button, { backgroundColor: colors.teal, marginBottom: 16 }]}
        onPress={() => router.push("/craving/breathing")}
      >
        <Text style={s.buttonText}>Start Breathing</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.button, { backgroundColor: colors.tealDark }]}
        onPress={() => router.push("/craving/result")}
      >
        <Text style={s.buttonText}>I Beat It</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, backgroundColor: colors.bg },
  title: { ...T.h1, color: colors.textPrimary, marginBottom: 16 },
  button: { width: '100%', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { ...T.bodyMedium, color: colors.textPrimary },
});