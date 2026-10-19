import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { InputContainer } from '../common/InputContainer';
import { BaseInputProps } from '../common/types';

export interface OtpInputProps extends BaseInputProps {
  length?: number;
  value?: string;
  onChangeOtp?: (otp: string) => void;
  onComplete?: (otp: string) => void;
  mask?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  label = 'Verification code',
  helperText,
  error,
  required,
  optional,
  disabled,
  readOnly,
  length = 6,
  value = '',
  onChangeOtp,
  onComplete,
  mask = false,
  autoFocus = false,
  containerStyle,
  testID,
}: OtpInputProps) {
  const colors = useTheme();
  const inputRefs = useRef<Array<any>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(autoFocus ? 0 : null);

  // Array of digits
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (value.length === length) {
      onComplete?.(value);
    }
  }, [value, length, onComplete]);

  const handleDigitChange = (text: string, index: number) => {
    if (disabled || readOnly) return;

    // Handle paste of multiple characters
    const clean = text.replace(/[^0-9]/g, '');
    if (clean.length > 1) {
      const pasted = clean.slice(0, length);
      onChangeOtp?.(pasted);
      const nextIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const currentDigits = [...digits];
    currentDigits[index] = clean;
    const newOtp = currentDigits.join('');
    onChangeOtp?.(newOtp);

    // If a digit was entered, advance focus to next box
    if (clean && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (disabled || readOnly) return;

    if (e.nativeEvent?.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move back to previous box and clear it
        const currentDigits = [...digits];
        currentDigits[index - 1] = '';
        onChangeOtp?.(currentDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const focusInput = (index: number) => {
    if (!disabled && !readOnly) {
      inputRefs.current[index]?.focus();
    }
  };

  return (
    <InputContainer
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      optional={optional}
      disabled={disabled}
      containerStyle={containerStyle}
      testID={testID}>
      <View style={styles.boxesRow}>
        {digits.map((digit, index) => {
          const isFocused = focusedIndex === index;
          const isFilled = Boolean(digit);

          let borderColor: string = colors.border;
          let backgroundColor: string = colors.inputBackground;

          if (disabled) {
            backgroundColor = colors.disabled;
          } else if (error) {
            borderColor = colors.error;
          } else if (isFocused) {
            borderColor = colors.primary;
          } else if (isFilled) {
            borderColor = colors.borderFocused;
          }

          return (
            <Pressable
              key={index}
              onPress={() => focusInput(index)}
              style={({ pressed }) => [
                styles.box,
                {
                  borderColor,
                  backgroundColor,
                },
                isFocused && styles.boxFocused,
                error && styles.boxError,
                pressed && !disabled && !readOnly && { opacity: 0.8 },
              ]}>
              <TextInput
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={mask && digit ? '•' : digit}
                onChangeText={(text) => handleDigitChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                keyboardType="number-pad"
                maxLength={length}
                editable={!disabled && !readOnly}
                selectTextOnFocus
                style={[
                  styles.boxInput,
                  { color: disabled ? colors.disabledText : colors.text },
                ]}
                accessibilityLabel={`Verification digit ${index + 1} of ${length}`}
              />
            </Pressable>
          );
        })}
      </View>
    </InputContainer>
  );
}

const styles = StyleSheet.create({
  boxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: Spacing.one,
  },
  box: {
    width: 46,
    height: 52,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxFocused: {
    borderWidth: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  boxError: {
    borderWidth: 2,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  boxInput: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    padding: 0,
  },
});
