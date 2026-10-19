import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { InputContainer } from '../common/InputContainer';
import { BaseInputProps } from '../common/types';

export interface RadioOption<T = string> {
  value: T;
  label: string;
  description?: string;
  badge?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupInputProps<T = string> extends BaseInputProps {
  options: RadioOption<T>[];
  value?: T | null;
  onChangeValue?: (value: T) => void;
  layout?: 'vertical' | 'horizontal' | 'cards';
}

export function RadioGroupInput<T = string>({
  label,
  helperText,
  error,
  required,
  optional,
  disabled,
  readOnly,
  options,
  value,
  onChangeValue,
  layout = 'vertical',
  containerStyle,
  testID,
}: RadioGroupInputProps<T>) {
  const colors = useTheme();

  const handleSelect = (optValue: T, optDisabled?: boolean) => {
    if (disabled || readOnly || optDisabled) return;
    onChangeValue?.(optValue);
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
      <View
        accessibilityRole="radiogroup"
        style={[
          styles.groupContainer,
          layout === 'horizontal' && styles.horizontalGroup,
          layout === 'cards' && styles.cardsGroup,
        ]}>
        {options.map((opt) => {
          const isSelected = opt.value === value;
          const isOptionDisabled = disabled || opt.disabled;

          if (layout === 'cards') {
            return (
              <Pressable
                key={String(opt.value)}
                onPress={() => handleSelect(opt.value, opt.disabled)}
                disabled={isOptionDisabled || readOnly}
                accessibilityRole="radio"
                accessibilityState={{
                  selected: isSelected,
                  disabled: !!isOptionDisabled,
                }}
                style={({ pressed }) => [
                  styles.cardOption,
                  {
                    backgroundColor: isSelected
                      ? colors.primaryMuted
                      : colors.inputBackground,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                  isOptionDisabled && styles.disabledOption,
                  pressed && !isOptionDisabled && { opacity: 0.8 },
                ]}>
                <View style={styles.cardHeader}>
                  {opt.icon && <View style={styles.cardIcon}>{opt.icon}</View>}
                  <Text
                    style={[
                      styles.cardLabel,
                      {
                        color: isOptionDisabled
                          ? colors.disabledText
                          : isSelected
                          ? colors.primary
                          : colors.text,
                        fontWeight: isSelected ? '700' : '600',
                      },
                    ]}>
                    {opt.label}
                  </Text>
                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: 'transparent',
                      },
                    ]}>
                    {isSelected && (
                      <View
                        style={[
                          styles.radioDot,
                          { backgroundColor: colors.primary },
                        ]}
                      />
                    )}
                  </View>
                </View>

                {opt.description && (
                  <Text
                    style={[
                      styles.cardDesc,
                      { color: isOptionDisabled ? colors.disabledText : colors.textSecondary },
                    ]}>
                    {opt.description}
                  </Text>
                )}
              </Pressable>
            );
          }

          return (
            <Pressable
              key={String(opt.value)}
              onPress={() => handleSelect(opt.value, opt.disabled)}
              disabled={isOptionDisabled || readOnly}
              accessibilityRole="radio"
              accessibilityState={{
                selected: isSelected,
                disabled: !!isOptionDisabled,
              }}
              style={({ pressed }) => [
                styles.optionRow,
                layout === 'horizontal' && styles.horizontalOption,
                isOptionDisabled && styles.disabledOption,
                pressed && !isOptionDisabled && { opacity: 0.7 },
              ]}>
              <View
                style={[
                  styles.radioCircle,
                  {
                    borderColor: isSelected
                      ? colors.primary
                      : error
                      ? colors.error
                      : colors.border,
                    backgroundColor: 'transparent',
                  },
                ]}>
                {isSelected && (
                  <View
                    style={[
                      styles.radioDot,
                      { backgroundColor: isOptionDisabled ? colors.disabledText : colors.primary },
                    ]}
                  />
                )}
              </View>

              <View style={styles.optionContent}>
                <View style={styles.labelBadgeRow}>
                  {opt.icon && <View style={styles.optionIcon}>{opt.icon}</View>}
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: isOptionDisabled
                          ? colors.disabledText
                          : isSelected
                          ? colors.text
                          : colors.text,
                        fontWeight: isSelected ? '600' : '500',
                      },
                    ]}>
                    {opt.label}
                  </Text>
                  {opt.badge && (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: colors.backgroundElement },
                      ]}>
                      <Text style={[styles.badgeText, { color: colors.primary }]}>
                        {opt.badge}
                      </Text>
                    </View>
                  )}
                </View>

                {opt.description && (
                  <Text
                    style={[
                      styles.optionDesc,
                      { color: isOptionDisabled ? colors.disabledText : colors.textSecondary },
                    ]}>
                    {opt.description}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </InputContainer>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    gap: Spacing.two,
  },
  horizontalGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  cardsGroup: {
    gap: Spacing.two,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 40,
    paddingVertical: 4,
  },
  horizontalOption: {
    marginRight: Spacing.two,
  },
  disabledOption: {
    opacity: 0.5,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.two,
    marginTop: 2,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionContent: {
    flex: 1,
  },
  labelBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 6,
  },
  optionLabel: {
    fontSize: 15,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  optionDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  cardOption: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 8,
  },
  cardLabel: {
    flex: 1,
    fontSize: 15,
  },
  cardDesc: {
    fontSize: 12,
    marginTop: 4,
  },
});
