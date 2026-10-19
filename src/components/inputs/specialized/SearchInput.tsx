import { Ionicons } from '@expo/vector-icons';
import { forwardRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { TextInputField, TextInputFieldProps } from '../text/TextInputField';

export interface SearchInputProps extends TextInputFieldProps {
  loading?: boolean;
  onSearchSubmit?: (query: string) => void;
  onClearSearch?: () => void;
}

export const SearchInput = forwardRef<any, SearchInputProps>(function SearchInput(
  {
    placeholder = 'Search by keyword, name, or code...',
    value = '',
    onChangeText,
    loading = false,
    onSearchSubmit,
    onClearSearch,
    clearable = true,
    ...rest
  },
  ref
) {
  const colors = useTheme();

  const handleClear = () => {
    onChangeText?.('');
    onClearSearch?.();
  };

  return (
    <TextInputField
      ref={ref}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      returnKeyType="search"
      onSubmitEditing={() => onSearchSubmit?.(value)}
      clearable={false}
      leftElement={
        <Ionicons
          name="search-outline"
          size={18}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
      }
      rightElement={
        <View style={styles.rightCluster}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : clearable && value && value.length > 0 ? (
            <Pressable
              onPress={handleClear}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={18} color={colors.placeholder} />
            </Pressable>
          ) : null}
        </View>
      }
      {...rest}
    />
  );
});

const styles = StyleSheet.create({
  searchIcon: {
    marginRight: 2,
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Spacing.one,
  },
});
