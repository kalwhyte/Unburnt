import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colors, T } from "../../src/constants/theme";

export default function WelcomeScreen() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Welcome</Text>
      <Text style={s.sub}>
        Let's build your quit plan
      </Text>

      <TouchableOpacity
        style={s.button}
        onPress={() => router.push("/(onboarding)/smoking-habits")}
      >
        <Text style={s.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, backgroundColor: colors.bg },
  title: { ...T.h1, color: colors.textPrimary, marginBottom: 16 },
  sub: { ...T.body, color: colors.textMuted, textAlign: 'center', marginBottom: 32 },
  button: { backgroundColor: colors.teal, paddingHorizontal: 24, paddingVertical: 16, borderRadius: 12 },
  buttonText: { ...T.bodyMedium, color: colors.textPrimary },
});