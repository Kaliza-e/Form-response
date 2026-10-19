import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface InputBaseProps {
  children: ReactNode;
  isFocused?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  onClear?: () => void;
  showClear?: boolean;
  style?: StyleProp<ViewStyle>;
  multiline?: boolean;
  minHeight?: number;
  onPress?: () => void;
}

export function InputBase({
  children,
  isFocused,
  hasError,
  disabled,
  readOnly,
  leftElement,
  rightElement,
  onClear,
  showClear,
  style,
  multiline,
  minHeight,
  onPress,
}: InputBaseProps) {
  const colors = useTheme();

  // Dynamic border & background colors based on state
  let borderColor: string = colors.border;
  let backgroundColor: string = colors.inputBackground;

  if (disabled) {
    backgroundColor = colors.disabled;
    borderColor = colors.border;
  } else if (hasError) {
    borderColor = colors.borderError;
  } else if (isFocused) {
    borderColor = colors.borderFocused;
  }

  const containerContent = (
    <View
      style={[
        styles.box,
        {
          borderColor,
          backgroundColor,
          minHeight: minHeight ?? (multiline ? 100 : 48),
        },
        isFocused && styles.boxFocused,
        hasError && styles.boxError,
        multiline && styles.boxMultiline,
        style,
      ]}>
      {leftElement && <View style={styles.leftContainer}>{leftElement}</View>}

      <View style={styles.innerContent}>{children}</View>

      {showClear && !disabled && !readOnly && onClear && (
        <Pressable
          onPress={onClear}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear input"
          style={styles.clearButton}>
          <Ionicons
            name="close-circle"
            size={18}
            color={colors.placeholder}
          />
        </Pressable>
      )}

      {rightElement && <View style={styles.rightContainer}>{rightElement}</View>}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <Pressable onPress={onPress} disabled={disabled} style={styles.pressableWrapper}>
        {containerContent}
      </Pressable>
    );
  }

  return containerContent;
}

const styles = StyleSheet.create({
  pressableWrapper: {
    width: '100%',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.three,
    width: '100%',
  },
  boxFocused: {
    borderWidth: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  boxError: {
    borderWidth: 2,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 1,
  },
  boxMultiline: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.two,
  },
  innerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  leftContainer: {
    marginRight: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    marginLeft: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    padding: 2,
    marginLeft: Spacing.one,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
