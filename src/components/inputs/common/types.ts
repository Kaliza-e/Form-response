import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type InputCategory = 'text' | 'selection' | 'specialized';

export type DependencyType = 'core' | 'expo-image-picker' | 'expo-document-picker';

export interface BaseInputProps {
  /** Label displayed above the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message displayed below the input; triggers invalid state */
  error?: string | null;
  /** Whether the field is required (displays asterisk) */
  required?: boolean;
  /** Displays an '(Optional)' tag when true */
  optional?: boolean;
  /** Disables user interaction and styles component accordingly */
  disabled?: boolean;
  /** Prevents editing while maintaining enabled visual appearance where appropriate */
  readOnly?: boolean;
  /** Left-side prefix element (icon, text, or custom component) */
  leftElement?: ReactNode;
  /** Right-side suffix element (icon, button, or custom component) */
  rightElement?: ReactNode;
  /** Style for outer container */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style for the input wrapper box */
  inputContainerStyle?: StyleProp<ViewStyle>;
  /** Style for label */
  labelStyle?: StyleProp<TextStyle>;
  /** Style for helper / error text */
  helperTextStyle?: StyleProp<TextStyle>;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Test identifier */
  testID?: string;
}

export interface InputComponentMeta {
  id: string;
  name: string;
  category: InputCategory;
  categoryLabel: string;
  description: string;
  dependency: DependencyType;
  dependencyLabel: string;
  builtin: boolean;
  codeExample: string;
  propsList: { name: string; type: string; default?: string; description: string }[];
}
