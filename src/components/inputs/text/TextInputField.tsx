import { forwardRef, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { InputBase } from '../common/InputBase';
import { InputContainer } from '../common/InputContainer';
import { BaseInputProps } from '../common/types';

export type TextInputFieldProps = BaseInputProps &
  Omit<TextInputProps, 'style' | 'accessibilityLabel'> & {
    inputStyle?: StyleProp<TextStyle>;
    clearable?: boolean;
  };

export const TextInputField = forwardRef<any, TextInputFieldProps>(function TextInputField(
  {
    label,
    helperText,
    error,
    required,
    optional,
    disabled,
    readOnly,
    leftElement,
    rightElement,
    containerStyle,
    inputContainerStyle,
    labelStyle,
    helperTextStyle,
    accessibilityLabel,
    testID,
    value,
    onChangeText,
    placeholder,
    clearable = true,
    inputStyle,
    onFocus,
    onBlur,
    maxLength,
    ...rest
  },
  ref
) {
  const colors = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText?.('');
  };

  const showClear = Boolean(clearable && value && value.length > 0 && !disabled && !readOnly);

  return (
    <InputContainer
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      optional={optional}
      disabled={disabled}
      containerStyle={containerStyle}
      labelStyle={labelStyle}
      helperTextStyle={helperTextStyle}
      charCount={typeof value === 'string' ? value.length : undefined}
      maxLength={maxLength}
      testID={testID}>
      <InputBase
        isFocused={isFocused}
        hasError={Boolean(error)}
        disabled={disabled}
        readOnly={readOnly}
        leftElement={leftElement}
        rightElement={rightElement}
        onClear={handleClear}
        showClear={showClear}
        style={inputContainerStyle}>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          editable={!disabled && !readOnly}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          maxLength={maxLength}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{ disabled: !!disabled }}
          style={[
            styles.input,
            { color: disabled ? colors.disabledText : colors.text },
            inputStyle,
          ]}
          {...rest}
        />
      </InputBase>
    </InputContainer>
  );
});

const styles = StyleSheet.create({
  input: {
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 0,
    minHeight: 44,
  },
});
