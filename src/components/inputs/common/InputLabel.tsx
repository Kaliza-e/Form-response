import { ReactNode } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface InputLabelProps {
  label?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  rightAction?: ReactNode;
  nativeID?: string;
}

export function InputLabel({
  label,
  required,
  optional,
  disabled,
  style,
  containerStyle,
  rightAction,
  nativeID,
}: InputLabelProps) {
  const colors = useTheme();

  if (!label && !rightAction) return null;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <View style={styles.labelRow}>
          <Text
            nativeID={nativeID}
            style={[
              styles.label,
              { color: disabled ? colors.disabledText : colors.text },
              style,
            ]}>
            {label}
          </Text>
          {required ? (
            <Text style={[styles.requiredAsterisk, { color: colors.error }]}>*</Text>
          ) : null}
          {optional ? (
            <Text style={[styles.optionalTag, { color: colors.textSecondary }]}>
              (optional)
            </Text>
          ) : null}
        </View>
      ) : null}

      {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.one * 1.5,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  requiredAsterisk: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 2,
  },
  optionalTag: {
    fontSize: 12,
    fontWeight: '400',
    marginLeft: 4,
  },
  rightAction: {
    marginLeft: 'auto',
  },
});
