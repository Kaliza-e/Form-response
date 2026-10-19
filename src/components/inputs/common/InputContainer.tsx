import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';

import { InputError } from './InputError';
import { InputHelperText } from './InputHelperText';
import { InputLabel } from './InputLabel';
import { BaseInputProps } from './types';

export interface InputContainerProps extends BaseInputProps {
  children: ReactNode;
  charCount?: number;
  maxLength?: number;
  rightLabelAction?: ReactNode;
  nativeID?: string;
}

export function InputContainer({
  label,
  helperText,
  error,
  required,
  optional,
  disabled,
  containerStyle,
  labelStyle,
  helperTextStyle,
  children,
  charCount,
  maxLength,
  rightLabelAction,
  nativeID,
}: InputContainerProps) {
  return (
    <View style={[styles.container, disabled && styles.disabledContainer, containerStyle]}>
      {label || rightLabelAction ? (
        <InputLabel
          label={label}
          required={required}
          optional={optional}
          disabled={disabled}
          style={labelStyle as any}
          rightAction={rightLabelAction}
          nativeID={nativeID}
        />
      ) : null}

      {children}

      {error ? (
        <InputError error={error} style={helperTextStyle as any} />
      ) : helperText || (typeof charCount === 'number' && typeof maxLength === 'number') ? (
        <InputHelperText
          helperText={helperText}
          charCount={charCount}
          maxLength={maxLength}
          disabled={disabled}
          style={helperTextStyle as any}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.three,
    width: '100%',
  },
  disabledContainer: {
    opacity: 0.75,
  },
});
