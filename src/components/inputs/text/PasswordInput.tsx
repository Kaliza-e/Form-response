import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { TextInputField, TextInputFieldProps } from './TextInputField';

export interface PasswordInputProps extends Omit<TextInputFieldProps, 'secureTextEntry'> {
  showStrengthMeter?: boolean;
  showRequirements?: boolean;
}

export const PasswordInput = forwardRef<any, PasswordInputProps>(function PasswordInput(
  {
    label = 'Password',
    placeholder = 'Enter password',
    value = '',
    showStrengthMeter = false,
    showRequirements = false,
    ...rest
  },
  ref
) {
  const colors = useTheme();
  const [isSecure, setIsSecure] = useState(true);

  // Password strength calculation
  const lengthValid = (value?.length ?? 0) >= 8;
  const uppercaseValid = /[A-Z]/.test(value ?? '');
  const numberValid = /[0-9]/.test(value ?? '');
  const specialValid = /[^A-Za-z0-9]/.test(value ?? '');

  const score = [lengthValid, uppercaseValid, numberValid, specialValid].filter(Boolean).length;

  let strengthLabel = 'Very Weak';
  let strengthColor: string = colors.error;

  if (score === 2) {
    strengthLabel = 'Fair';
    strengthColor = colors.warning;
  } else if (score === 3) {
    strengthLabel = 'Good';
    strengthColor = '#3B82F6';
  } else if (score === 4) {
    strengthLabel = 'Strong';
    strengthColor = colors.success;
  }

  return (
    <View style={styles.container}>
      <TextInputField
        ref={ref}
        label={label}
        placeholder={placeholder}
        value={value}
        secureTextEntry={isSecure}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
        clearable={false}
        leftElement={
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={colors.textSecondary}
          />
        }
        rightElement={
          <Pressable
            onPress={() => setIsSecure(!isSecure)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
            style={styles.eyeButton}>
            <Ionicons
              name={isSecure ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        }
        {...rest}
      />

      {showStrengthMeter && value && value.length > 0 ? (
        <View style={styles.strengthContainer}>
          <View style={styles.barsRow}>
            {[1, 2, 3, 4].map((step) => (
              <View
                key={step}
                style={[
                  styles.bar,
                  {
                    backgroundColor:
                      step <= score ? strengthColor : colors.backgroundElement,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.strengthText, { color: strengthColor }]}>
            Strength: {strengthLabel}
          </Text>
        </View>
      ) : null}

      {showRequirements && value && value.length > 0 && score < 4 ? (
        <View style={[styles.requirementsBox, { backgroundColor: colors.backgroundElement }]}>
          <RequirementItem met={lengthValid} text="At least 8 characters" color={colors.textSecondary} successColor={colors.success} />
          <RequirementItem met={uppercaseValid} text="At least 1 uppercase letter" color={colors.textSecondary} successColor={colors.success} />
          <RequirementItem met={numberValid} text="At least 1 number" color={colors.textSecondary} successColor={colors.success} />
          <RequirementItem met={specialValid} text="At least 1 symbol" color={colors.textSecondary} successColor={colors.success} />
        </View>
      ) : null}
    </View>
  );
});

function RequirementItem({
  met,
  text,
  color,
  successColor,
}: {
  met: boolean;
  text: string;
  color: string;
  successColor: string;
}) {
  return (
    <View style={styles.reqRow}>
      <Ionicons
        name={met ? 'checkmark-circle' : 'ellipse-outline'}
        size={14}
        color={met ? successColor : color}
        style={styles.reqIcon}
      />
      <Text style={[styles.reqText, { color: met ? successColor : color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  eyeButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  strengthContainer: {
    marginTop: -Spacing.two,
    marginBottom: Spacing.two,
    paddingHorizontal: 2,
  },
  barsRow: {
    flexDirection: 'row',
    gap: 6,
    height: 4,
    marginBottom: 6,
  },
  bar: {
    flex: 1,
    borderRadius: BorderRadius.full,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requirementsBox: {
    padding: Spacing.two,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.two,
    gap: 4,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reqIcon: {
    marginRight: 6,
  },
  reqText: {
    fontSize: 12,
  },
});
