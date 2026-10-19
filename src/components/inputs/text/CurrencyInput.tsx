import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
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

import { TextInputField, TextInputFieldProps } from './TextInputField';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
}

export const COMMON_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar' },
];

export interface CurrencyInputProps
  extends Omit<TextInputFieldProps, 'value' | 'onChangeText' | 'keyboardType'> {
  value?: number | null;
  onChangeValue?: (val: number | null, formattedText: string) => void;
  currency?: CurrencyConfig;
  onCurrencyChange?: (currency: CurrencyConfig) => void;
  allowCurrencySwitch?: boolean;
}

export const CurrencyInput = forwardRef<any, CurrencyInputProps>(function CurrencyInput(
  {
    label = 'Price',
    placeholder = '0.00',
    value,
    onChangeValue,
    currency = COMMON_CURRENCIES[0],
    onCurrencyChange,
    allowCurrencySwitch = true,
    disabled,
    readOnly,
    ...rest
  },
  ref
) {
  const colors = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyConfig>(currency);

  const formatDisplay = (num?: number | null) => {
    if (num === null || num === undefined) return '';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const [rawText, setRawText] = useState(value != null ? String(value) : '');

  const handleTextChange = (text: string) => {
    // Only allow numbers and one decimal dot
    const clean = text.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : clean;

    setRawText(sanitized);

    if (sanitized === '' || sanitized === '.') {
      onChangeValue?.(null, sanitized);
      return;
    }

    const num = parseFloat(sanitized);
    if (!isNaN(num)) {
      onChangeValue?.(num, sanitized);
    }
  };

  const handleSelectCurrency = (curr: CurrencyConfig) => {
    setSelectedCurrency(curr);
    onCurrencyChange?.(curr);
    setModalVisible(false);
  };

  const currencyPrefix = (
    <Pressable
      onPress={() => allowCurrencySwitch && !disabled && !readOnly && setModalVisible(true)}
      disabled={!allowCurrencySwitch || disabled || readOnly}
      style={styles.prefixButton}
      accessibilityRole="button"
      accessibilityLabel={`Currency ${selectedCurrency.code}`}>
      <Text style={[styles.symbolText, { color: colors.primary }]}>{selectedCurrency.symbol}</Text>
      {allowCurrencySwitch ? (
        <Ionicons name="chevron-down" size={14} color={colors.textSecondary} style={styles.chevron} />
      ) : null}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
    </Pressable>
  );

  return (
    <>
      <TextInputField
        ref={ref}
        label={label}
        placeholder={placeholder}
        value={rawText}
        onChangeText={handleTextChange}
        keyboardType="decimal-pad"
        disabled={disabled}
        readOnly={readOnly}
        leftElement={currencyPrefix}
        clearable
        {...rest}
      />

      {allowCurrencySwitch ? (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Select Currency</Text>
                <Pressable onPress={() => setModalVisible(false)} hitSlop={8}>
                  <Ionicons name="close" size={20} color={colors.text} />
                </Pressable>
              </View>

              <FlatList
                data={COMMON_CURRENCIES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => {
                  const isSelected = item.code === selectedCurrency.code;
                  return (
                    <Pressable
                      onPress={() => handleSelectCurrency(item)}
                      style={({ pressed }) => [
                        styles.currencyItem,
                        isSelected && { backgroundColor: colors.primaryMuted },
                        pressed && { opacity: 0.7 },
                      ]}>
                      <Text style={[styles.itemSymbol, { color: colors.primary }]}>
                        {item.symbol}
                      </Text>
                      <Text style={[styles.itemCode, { color: colors.text }]}>{item.code}</Text>
                      <Text style={[styles.itemName, { color: colors.textSecondary }]}>
                        {item.name}
                      </Text>
                      {isSelected ? (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={colors.primary}
                          style={styles.selectedCheck}
                        />
                      ) : null}
                    </Pressable>
                  );
                }}
              />
            </View>
          </Pressable>
        </Modal>
      ) : null}
    </>
  );
});

const styles = StyleSheet.create({
  prefixButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: Spacing.two,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: '700',
  },
  chevron: {
    marginLeft: 3,
  },
  divider: {
    width: 1,
    height: 20,
    marginLeft: Spacing.two,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
    paddingBottom: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: BorderRadius.sm,
  },
  itemSymbol: {
    fontSize: 18,
    fontWeight: '700',
    width: 40,
  },
  itemCode: {
    fontSize: 14,
    fontWeight: '700',
    width: 50,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
  },
  selectedCheck: {
    marginLeft: 4,
  },
});
