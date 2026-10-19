import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { TextInputField, TextInputFieldProps } from './TextInputField';

export interface EmailInputProps extends Omit<TextInputFieldProps, 'keyboardType' | 'autoCapitalize' | 'autoCorrect'> {
  showDomainSuggestions?: boolean;
  validateOnBlur?: boolean;
}

const COMMON_DOMAINS = ['@gmail.com', '@outlook.com', '@yahoo.com', '@icloud.com'];

export const EmailInput = forwardRef<any, EmailInputProps>(function EmailInput(
  {
    label = 'Email address',
    placeholder = 'alex@example.com',
    value,
    onChangeText,
    error,
    helperText,
    showDomainSuggestions = true,
    validateOnBlur = true,
    onBlur,
    ...rest
  },
  ref
) {
  const colors = useTheme();
  const [internalError, setInternalError] = useState<string | null>(null);

  const validateEmail = (val?: string) => {
    if (!val || val.trim() === '') return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleBlur = (e: any) => {
    if (validateOnBlur && value) {
      setInternalError(validateEmail(value));
    }
    onBlur?.(e);
  };

  const handleDomainPress = (domain: string) => {
    if (!value) return;
    const atIndex = value.indexOf('@');
    const base = atIndex >= 0 ? value.substring(0, atIndex) : value;
    onChangeText?.(base + domain);
    setInternalError(null);
  };

  const showSuggestions = Boolean(
    showDomainSuggestions &&
      value &&
      value.length > 2 &&
      !value.includes('.com') &&
      !value.includes('.org') &&
      !value.includes('.net')
  );

  return (
    <View style={styles.container}>
      <TextInputField
        ref={ref}
        label={label}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => {
          if (internalError) setInternalError(null);
          onChangeText?.(text);
        }}
        onBlur={handleBlur}
        error={error || internalError}
        helperText={helperText}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        leftElement={
          <Ionicons
            name="mail-outline"
            size={18}
            color={colors.textSecondary}
          />
        }
        {...rest}
      />

      {showSuggestions ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionScroll}
          contentContainerStyle={styles.suggestionContent}>
          {COMMON_DOMAINS.map((domain) => (
            <Pressable
              key={domain}
              onPress={() => handleDomainPress(domain)}
              style={({ pressed }) => [
                styles.suggestionChip,
                {
                  backgroundColor: colors.backgroundElement,
                  borderColor: colors.border,
                },
                pressed && { opacity: 0.7 },
              ]}>
              <Text style={[styles.suggestionText, { color: colors.text }]}>{domain}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  suggestionScroll: {
    marginTop: -Spacing.two,
    marginBottom: Spacing.two,
  },
  suggestionContent: {
    paddingHorizontal: 2,
    gap: 6,
    flexDirection: 'row',
  },
  suggestionChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
