import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface InputErrorProps {
  error?: string | null;
  style?: TextStyle;
  containerStyle?: ViewStyle;
}

export function InputError({ error, style, containerStyle }: InputErrorProps) {
  const colors = useTheme();

  if (!error) return null;

  return (
    <View
      style={[styles.container, containerStyle]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite">
      <Ionicons
        name="alert-circle"
        size={14}
        color={colors.error}
        style={styles.icon}
      />
      <Text style={[styles.errorText, { color: colors.error }, style]}>
        {error}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.half,
  },
  icon: {
    marginRight: 4,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    flex: 1,
  },
});
