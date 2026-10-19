import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { InputError } from '../common/InputError';
import { InputHelperText } from '../common/InputHelperText';
import { BaseInputProps } from '../common/types';

export interface CheckboxInputProps extends BaseInputProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChangeChecked?: (checked: boolean) => void;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CheckboxInput({
  label,
  description,
  checked = false,
  indeterminate = false,
  onChangeChecked,
  helperText,
  error,
  disabled,
  readOnly,
  required,
  containerStyle,
  size = 'md',
  accessibilityLabel,
  testID,
}: CheckboxInputProps) {
  const colors = useTheme();

  const handleToggle = () => {
    if (disabled || readOnly) return;
    onChangeChecked?.(!checked);
  };

  const boxSize = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 15;

  let boxBg: string = 'transparent';
  let borderColor: string = colors.border;

  if (disabled) {
    boxBg = checked ? colors.disabledText : colors.disabled;
    borderColor = colors.border;
  } else if (error) {
    borderColor = colors.error;
    if (checked || indeterminate) boxBg = colors.error;
  } else if (checked || indeterminate) {
    boxBg = colors.primary;
    borderColor = colors.primary;
  }

  return (
    <View style={[styles.wrapper, containerStyle]} testID={testID}>
      <Pressable
        onPress={handleToggle}
        disabled={disabled || readOnly}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: indeterminate ? 'mixed' : checked,
          disabled: !!disabled,
        }}
        accessibilityLabel={accessibilityLabel ?? label}
        style={({ pressed }) => [
          styles.touchable,
          pressed && !disabled && !readOnly && { opacity: 0.7 },
        ]}>
        <View
          style={[
            styles.checkboxBox,
            {
              width: boxSize,
              height: boxSize,
              borderRadius: BorderRadius.xs,
              backgroundColor: boxBg,
              borderColor,
            },
          ]}>
          {indeterminate ? (
            <Ionicons name="remove" size={iconSize} color="#ffffff" />
          ) : checked ? (
            <Ionicons name="checkmark" size={iconSize} color="#ffffff" />
          ) : null}
        </View>

        {(label || description) ? (
          <View style={styles.textContainer}>
            {label ? (
              <View style={styles.labelRow}>
                <Text
                  style={[
                    styles.labelText,
                    { color: disabled ? colors.disabledText : colors.text },
                  ]}>
                  {label}
                </Text>
                {required ? (
                  <Text style={[styles.requiredAsterisk, { color: colors.error }]}>*</Text>
                ) : null}
              </View>
            ) : null}

            {description ? (
              <Text
                style={[
                  styles.descriptionText,
                  { color: disabled ? colors.disabledText : colors.textSecondary },
                ]}>
                {description}
              </Text>
            ) : null}
          </View>
        ) : null}
      </Pressable>

      {error ? (
        <InputError error={error} containerStyle={styles.helperIndent} />
      ) : helperText ? (
        <InputHelperText helperText={helperText} disabled={disabled} containerStyle={styles.helperIndent} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.two,
    width: '100%',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 44,
    paddingVertical: 4,
  },
  checkboxBox: {
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginRight: Spacing.two,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  requiredAsterisk: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 2,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  helperIndent: {
    paddingLeft: Spacing.four + 6,
  },
});
