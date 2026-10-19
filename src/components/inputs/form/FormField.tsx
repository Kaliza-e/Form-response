import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

/**
 * FormField is a simple wrapper for form inputs.
 * It displays a label at the top, the input element in the middle,
 * and an error message at the bottom if validation fails.
 */
export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      {children}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  required: {
    color: '#ef4444',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
});
