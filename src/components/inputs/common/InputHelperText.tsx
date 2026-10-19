import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface InputHelperTextProps {
  helperText?: string;
  charCount?: number;
  maxLength?: number;
  disabled?: boolean;
  style?: TextStyle;
  containerStyle?: ViewStyle;
}

export function InputHelperText({
  helperText,
  charCount,
  maxLength,
  disabled,
  style,
  containerStyle,
}: InputHelperTextProps) {
  const colors = useTheme();

  const hasHelper = !!helperText;
  const hasCounter = typeof charCount === 'number' && typeof maxLength === 'number';

  if (!hasHelper && !hasCounter) return null;

  return (
    <View style={[styles.container, containerStyle]}>
      {hasHelper ? (
        <Text
          style={[
            styles.helperText,
            { color: disabled ? colors.disabledText : colors.textSecondary },
            style,
          ]}>
          {helperText}
        </Text>
      ) : (
        <View style={styles.spacer} />
      )}

      {hasCounter ? (
        <Text
          style={[
            styles.counter,
            {
              color:
                charCount > maxLength
                  ? colors.error
                  : disabled
                  ? colors.disabledText
                  : colors.textSecondary,
            },
          ]}>
          {charCount}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.half,
    minHeight: 16,
  },
  spacer: {
    flex: 1,
  },
  helperText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  counter: {
    fontSize: 12,
    lineHeight: 16,
    marginLeft: Spacing.two,
    fontWeight: '500',
  },
});
