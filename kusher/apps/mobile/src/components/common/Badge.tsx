import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, T, radius, spacing } from '../../constants/theme';

interface BadgeProps {
  label: string | number;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'teal';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
  },
});

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { bg: colors.tealBg, border: colors.tealDark, text: colors.tealLight };
      case 'danger':
        return { bg: colors.dangerBg, border: colors.dangerBorder, text: colors.danger };
      case 'warning':
        return { bg: '#3a2a0d', border: '#664d03', text: '#ffc107' };
      case 'teal':
        return { bg: colors.tealBg, border: colors.tealDark, text: colors.tealLight };
      default:
        return { bg: colors.surface, border: colors.border, text: colors.textSecondary };
    }
  };

  const { bg, border, text } = getVariantStyles();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor: border,
          paddingVertical: size === 'sm' ? 2 : spacing.xs,
          paddingHorizontal: size === 'sm' ? spacing.xs : spacing.sm,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: text,
            fontSize: size === 'sm' ? 10 : 12,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};