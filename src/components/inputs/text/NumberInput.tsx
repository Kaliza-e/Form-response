import { Ionicons } from '@expo/vector-icons';
import { forwardRef } from 'react';
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

export interface NumberInputProps
  extends Omit<TextInputFieldProps, 'value' | 'onChangeText' | 'keyboardType'> {
  value?: number | null;
  onChangeNumber?: (val: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  showSteppers?: boolean;
  quickAddButtons?: number[];
}

export const NumberInput = forwardRef<any, NumberInputProps>(function NumberInput(
  {
    label = 'Quantity',
    placeholder = '0',
    value,
    onChangeNumber,
    min,
    max,
    step = 1,
    showSteppers = true,
    quickAddButtons,
    disabled,
    readOnly,
    ...rest
  },
  ref
) {
  const colors = useTheme();

  const handleTextChange = (text: string) => {
    if (text === '') {
      onChangeNumber?.(null);
      return;
    }
    const clean = text.replace(/[^0-9.-]/g, '');
    const num = Number(clean);
    if (!isNaN(num)) {
      if (typeof min === 'number' && num < min) {
        onChangeNumber?.(min);
      } else if (typeof max === 'number' && num > max) {
        onChangeNumber?.(max);
      } else {
        onChangeNumber?.(num);
      }
    }
  };

  const handleStep = (direction: 'up' | 'down', customStep?: number) => {
    if (disabled || readOnly) return;
    const current = typeof value === 'number' ? value : min ?? 0;
    const amount = customStep ?? step;
    let next = direction === 'up' ? current + amount : current - amount;

    if (typeof min === 'number' && next < min) next = min;
    if (typeof max === 'number' && next > max) next = max;

    onChangeNumber?.(next);
  };

  const isMinReached = typeof min === 'number' && typeof value === 'number' && value <= min;
  const isMaxReached = typeof max === 'number' && typeof value === 'number' && value >= max;

  const steppers = showSteppers ? (
    <View style={styles.steppersRow}>
      <Pressable
        onPress={() => handleStep('down')}
        disabled={disabled || readOnly || isMinReached}
        accessibilityRole="button"
        accessibilityLabel="Decrease number"
        style={({ pressed }) => [
          styles.stepperButton,
          {
            backgroundColor: colors.backgroundElement,
            borderColor: colors.border,
            opacity: disabled || readOnly || isMinReached ? 0.4 : pressed ? 0.7 : 1,
          },
        ]}>
        <Ionicons name="remove" size={16} color={colors.text} />
      </Pressable>

      <Pressable
        onPress={() => handleStep('up')}
        disabled={disabled || readOnly || isMaxReached}
        accessibilityRole="button"
        accessibilityLabel="Increase number"
        style={({ pressed }) => [
          styles.stepperButton,
          {
            backgroundColor: colors.backgroundElement,
            borderColor: colors.border,
            opacity: disabled || readOnly || isMaxReached ? 0.4 : pressed ? 0.7 : 1,
          },
        ]}>
        <Ionicons name="add" size={16} color={colors.text} />
      </Pressable>
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <TextInputField
        ref={ref}
        label={label}
        placeholder={placeholder}
        value={typeof value === 'number' ? String(value) : ''}
        onChangeText={handleTextChange}
        keyboardType="numeric"
        disabled={disabled}
        readOnly={readOnly}
        rightElement={steppers}
        clearable={false}
        {...rest}
      />

      {quickAddButtons && quickAddButtons.length > 0 && !disabled && !readOnly ? (
        <View style={styles.quickAddRow}>
          {quickAddButtons.map((amount) => (
            <Pressable
              key={amount}
              onPress={() => handleStep('up', amount)}
              style={({ pressed }) => [
                styles.quickChip,
                { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                pressed && { opacity: 0.7 },
              ]}>
              <Text style={[styles.quickChipText, { color: colors.primary }]}>+{amount}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  steppersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 2,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAddRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: -Spacing.two,
    marginBottom: Spacing.two,
    paddingHorizontal: 2,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
