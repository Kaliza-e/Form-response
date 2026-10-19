import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { InputError } from '../common/InputError';
import { InputHelperText } from '../common/InputHelperText';
import { BaseInputProps } from '../common/types';

export interface SwitchInputProps extends BaseInputProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  description?: string;
  showStatusLabel?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function SwitchInput({
  label,
  description,
  value = false,
  onValueChange,
  showStatusLabel = true,
  activeLabel = 'Enabled',
  inactiveLabel = 'Disabled',
  helperText,
  error,
  required,
  disabled,
  readOnly,
  containerStyle,
  accessibilityLabel,
  testID,
}: SwitchInputProps) {
  const colors = useTheme();

  const handleToggle = () => {
    if (disabled || readOnly) return;
    onValueChange?.(!value);
  };

  return (
    <View style={[styles.wrapper, containerStyle]} testID={testID}>
      <Pressable
        onPress={handleToggle}
        disabled={disabled || readOnly}
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled: !!disabled }}
        accessibilityLabel={accessibilityLabel ?? label}
        style={({ pressed }) => [
          styles.row,
          pressed && !disabled && !readOnly && { opacity: 0.8 },
        ]}>
        <View style={styles.textContainer}>
          {label ? (
            <View style={styles.labelRow}>
              <Text
                style={[
                  styles.label,
                  { color: disabled ? colors.disabledText : colors.text },
                ]}>
                {label}
              </Text>
              {required && (
                <Text style={[styles.requiredAsterisk, { color: colors.error }]}>*</Text>
              )}
            </View>
          ) : null}

          {description ? (
            <Text
              style={[
                styles.description,
                { color: disabled ? colors.disabledText : colors.textSecondary },
              ]}>
              {description}
            </Text>
          ) : null}
        </View>

        <View style={styles.switchCol}>
          <Switch
            value={value}
            onValueChange={onValueChange}
            disabled={disabled || readOnly}
            trackColor={{
              false: colors.border,
              true: colors.primary,
            }}
            thumbColor={
              Platform.OS === 'android'
                ? value
                  ? '#ffffff'
                  : colors.backgroundElement
                : '#ffffff'
            }
            ios_backgroundColor={colors.border}
          />
          {showStatusLabel && (
            <Text
              style={[
                styles.statusLabel,
                {
                  color: disabled
                    ? colors.disabledText
                    : value
                    ? colors.primary
                    : colors.textSecondary,
                },
              ]}>
              {value ? activeLabel : inactiveLabel}
            </Text>
          )}
        </View>
      </Pressable>

      {error ? (
        <InputError error={error} />
      ) : helperText ? (
        <InputHelperText helperText={helperText} disabled={disabled} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.three,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.three,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  requiredAsterisk: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  switchCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
