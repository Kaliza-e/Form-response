import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { InputBase } from '../common/InputBase';
import { InputContainer } from '../common/InputContainer';
import { BaseInputProps } from '../common/types';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectInputProps<T = string> extends BaseInputProps {
  options: SelectOption<T>[];
  value?: T | null;
  onSelect?: (value: T, option: SelectOption<T>) => void;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
}

export function SelectInput<T = string>({
  label,
  helperText,
  error,
  required,
  optional,
  disabled,
  readOnly,
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  searchable = true,
  clearable = true,
  containerStyle,
  inputContainerStyle,
  leftElement,
  testID,
}: SelectInputProps<T>) {
  const colors = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchQuery.trim()
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelect = (option: SelectOption<T>) => {
    if (option.disabled) return;
    onSelect?.(option.value, option);
    setModalOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    if (disabled || readOnly) return;
    if (options.length > 0) {
      onSelect?.(undefined as any, undefined as any);
    }
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
      <InputBase
        hasError={Boolean(error)}
        disabled={disabled}
        readOnly={readOnly}
        leftElement={leftElement}
        onPress={() => !disabled && !readOnly && setModalOpen(true)}
        style={inputContainerStyle}
        rightElement={
          <View style={styles.rightIcons}>
            {clearable && selectedOption && !disabled && !readOnly ? (
              <Pressable
                onPress={handleClear}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Clear selection"
                style={styles.iconButton}>
                <Ionicons name="close-circle" size={18} color={colors.placeholder} />
              </Pressable>
            ) : null}
            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
          </View>
        }>
        <View style={styles.valueRow}>
          {selectedOption ? (
            <View style={styles.selectedContent}>
              {selectedOption.icon && <View style={styles.optionIcon}>{selectedOption.icon}</View>}
              <Text
                style={[
                  styles.selectedText,
                  { color: disabled ? colors.disabledText : colors.text },
                ]}
                numberOfLines={1}>
                {selectedOption.label}
              </Text>
            </View>
          ) : (
            <Text style={[styles.placeholderText, { color: colors.placeholder }]}>
              {placeholder}
            </Text>
          )}
        </View>
      </InputBase>

      <Modal
        visible={modalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setModalOpen(false);
          setSearchQuery('');
        }}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => {
            setModalOpen(false);
            setSearchQuery('');
          }}>
          <Pressable
            style={[
              styles.sheetContainer,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
            onPress={(e) => e.stopPropagation()}>
            {/* Sheet Handle */}
            <View style={styles.handleBar}>
              <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            </View>

            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>
                {label ?? 'Select an option'}
              </Text>
              <Pressable
                onPress={() => {
                  setModalOpen(false);
                  setSearchQuery('');
                }}
                hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>

            {/* Search filter if enabled */}
            {searchable && options.length > 5 && (
              <View
                style={[
                  styles.searchBox,
                  { backgroundColor: colors.inputBackground, borderColor: colors.border },
                ]}>
                <Ionicons name="search" size={16} color={colors.placeholder} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search options..."
                  placeholderTextColor={colors.placeholder}
                  style={[styles.searchInput, { color: colors.text }]}
                  clearButtonMode="while-editing"
                />
              </View>
            )}

            {/* Options list */}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) => String(item.value ?? index)}
              style={styles.optionsList}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No options found
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    disabled={item.disabled}
                    style={({ pressed }) => [
                      styles.optionItem,
                      isSelected && { backgroundColor: colors.primaryMuted },
                      item.disabled && styles.disabledOption,
                      pressed && !item.disabled && { opacity: 0.7 },
                    ]}>
                    {item.icon && <View style={styles.optionIcon}>{item.icon}</View>}
                    <View style={styles.optionDetails}>
                      <Text
                        style={[
                          styles.optionLabel,
                          {
                            color: item.disabled
                              ? colors.disabledText
                              : isSelected
                              ? colors.primary
                              : colors.text,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}>
                        {item.label}
                      </Text>
                      {item.description && (
                        <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                          {item.description}
                        </Text>
                      )}
                    </View>

                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={colors.primary}
                        style={styles.checkIcon}
                      />
                    )}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </InputContainer>
  );
}

const styles = StyleSheet.create({
  valueRow: {
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  selectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 15,
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 15,
  },
  optionIcon: {
    marginRight: 8,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    maxHeight: '80%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: BorderRadius.full,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.three,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    marginBottom: Spacing.two,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.two,
    fontSize: 14,
    padding: 0,
  },
  optionsList: {
    maxHeight: 380,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: BorderRadius.md,
    marginBottom: 4,
  },
  disabledOption: {
    opacity: 0.4,
  },
  optionDetails: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
  },
  optionDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  checkIcon: {
    marginLeft: 8,
  },
  emptyContainer: {
    paddingVertical: Spacing.six,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
