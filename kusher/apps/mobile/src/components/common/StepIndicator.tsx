import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';

interface StepIndicatorProps {
  current: number;
  total: number;
}

export const StepIndicator = ({ current, total }: StepIndicatorProps) => {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            i <= current ? styles.active : styles.inactive,
            { width: `${100 / total - 2}%` },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row:      { flexDirection: 'row', gap: 4, marginBottom: spacing.xl },
  segment:  { flex: 1, height: 3, borderRadius: radius.full },
  done:     { backgroundColor: colors.teal },
  active:   { backgroundColor: colors.teal },
  inactive: { backgroundColor: colors.border },
})
// const s = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     width: '100%',
//   },
//   step: {
//     height: 4,
//     borderRadius: 2,
//   },
//   activeStep: {
//     backgroundColor: colors.teal,
//   },
//   inactiveStep: {
//     backgroundColor: colors.surfaceAlt,
//   },
// });

// interface StepProps { current: number; total: number }

// export function StepIndicator({ current, total }: StepProps) {
//   return (
//     <View style={si.row}>
//       {Array(total).fill(0).map((_, i) => (
//         <View key={i} style={[si.dot, i === current && si.dotActive, i < current && si.dotDone]} />
//       ))}
//     </View>
//   )
// }

// const si = StyleSheet.create({
//   row: { flexDirection: 'row', gap: 6, justifyContent: 'center', paddingVertical: 16 },
//   dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
//   dotActive: { width: 18, borderRadius: 3, backgroundColor: colors.tealLight },
//   dotDone: { backgroundColor: colors.teal },
// })