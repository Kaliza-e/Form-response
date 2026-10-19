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

export interface CountryCode {
  code: string;
  flag: string;
  dialCode: string;
  name: string;
}

export const POPULAR_COUNTRIES: CountryCode[] = [
  { code: 'US', flag: '🇺🇸', dialCode: '+1', name: 'United States' },
  { code: 'CA', flag: '🇨🇦', dialCode: '+1', name: 'Canada' },
  { code: 'GB', flag: '🇬🇧', dialCode: '+44', name: 'United Kingdom' },
  { code: 'DE', flag: '🇩🇪', dialCode: '+49', name: 'Germany' },
  { code: 'FR', flag: '🇫🇷', dialCode: '+33', name: 'France' },
  { code: 'AU', flag: '🇦🇺', dialCode: '+61', name: 'Australia' },
  { code: 'IN', flag: '🇮🇳', dialCode: '+91', name: 'India' },
  { code: 'JP', flag: '🇯🇵', dialCode: '+81', name: 'Japan' },
  { code: 'BR', flag: '🇧🇷', dialCode: '+55', name: 'Brazil' },
  { code: 'MX', flag: '🇲🇽', dialCode: '+52', name: 'Mexico' },
];

export interface PhoneInputProps extends Omit<TextInputFieldProps, 'keyboardType'> {
  countryCode?: CountryCode;
  onCountryCodeChange?: (country: CountryCode) => void;
  autoFormat?: boolean;
}

export const PhoneInput = forwardRef<any, PhoneInputProps>(function PhoneInput(
  {
    label = 'Phone number',
    placeholder = '(555) 000-0000',
    value = '',
    onChangeText,
    countryCode = POPULAR_COUNTRIES[0],
    onCountryCodeChange,
    autoFormat = true,
    disabled,
    readOnly,
    ...rest
  },
  ref
) {
  const colors = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCode);

  const formatPhoneNumber = (text: string) => {
    if (!autoFormat) return text;
    // Strip non-digits
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return text;

    if (!match[2]) {
      return match[1];
    }
    if (!match[3]) {
      return `(${match[1]}) ${match[2]}`;
    }
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  };

  const handleChangeText = (text: string) => {
    const formatted = formatPhoneNumber(text);
    onChangeText?.(formatted);
  };

  const handleSelectCountry = (country: CountryCode) => {
    setSelectedCountry(country);
    onCountryCodeChange?.(country);
    setModalVisible(false);
  };

  const countryPrefix = (
    <Pressable
      onPress={() => !disabled && !readOnly && setModalVisible(true)}
      disabled={disabled || readOnly}
      style={styles.prefixButton}
      accessibilityRole="button"
      accessibilityLabel={`Country code ${selectedCountry.name} ${selectedCountry.dialCode}`}>
      <Text style={styles.flagText}>{selectedCountry.flag}</Text>
      <Text style={[styles.dialCodeText, { color: colors.text }]}>{selectedCountry.dialCode}</Text>
      <Ionicons name="chevron-down" size={14} color={colors.textSecondary} style={styles.chevron} />
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
    </Pressable>
  );

  return (
    <>
      <TextInputField
        ref={ref}
        label={label}
        placeholder={placeholder}
        value={value}
        onChangeText={handleChangeText}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        disabled={disabled}
        readOnly={readOnly}
        leftElement={countryPrefix}
        maxLength={14}
        {...rest}
      />

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
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Country Code</Text>
              <Pressable onPress={() => setModalVisible(false)} hitSlop={8}>
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>

            <FlatList
              data={POPULAR_COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const isSelected = item.code === selectedCountry.code;
                return (
                  <Pressable
                    onPress={() => handleSelectCountry(item)}
                    style={({ pressed }) => [
                      styles.countryItem,
                      isSelected && { backgroundColor: colors.primaryMuted },
                      pressed && { opacity: 0.7 },
                    ]}>
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <Text style={[styles.countryName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.countryDial, { color: colors.textSecondary }]}>
                      {item.dialCode}
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
  flagText: {
    fontSize: 18,
    marginRight: 4,
  },
  dialCodeText: {
    fontSize: 14,
    fontWeight: '600',
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
    maxWidth: 400,
    maxHeight: 460,
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
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: BorderRadius.sm,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 10,
  },
  countryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  countryDial: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 8,
  },
  selectedCheck: {
    marginLeft: 4,
  },
});
