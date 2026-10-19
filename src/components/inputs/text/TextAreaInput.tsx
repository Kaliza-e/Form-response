import { forwardRef } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Spacing } from '@/constants/theme';

import { TextInputField, TextInputFieldProps } from './TextInputField';

export interface TextAreaInputProps extends TextInputFieldProps {
  minHeight?: number;
}

export const TextAreaInput = forwardRef<any, TextAreaInputProps>(function TextAreaInput(
  {
    label = 'Description',
    placeholder = 'Type your message or description...',
    numberOfLines = 4,
    minHeight = 110,
    clearable = false,
    inputStyle,
    inputContainerStyle,
    ...rest
  },
  ref
) {
  return (
    <TextInputField
      ref={ref}
      label={label}
      placeholder={placeholder}
      multiline
      numberOfLines={numberOfLines}
      clearable={clearable}
      inputContainerStyle={[{ minHeight }, inputContainerStyle]}
      inputStyle={StyleSheet.flatten([styles.textArea, { minHeight: minHeight - Spacing.three * 2 }, inputStyle])}
      {...rest}
    />
  );
});

const styles = StyleSheet.create({
  textArea: {
    textAlignVertical: 'top',
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
});
