import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { CheckboxInput } from '../selection/CheckboxInput';
import { DatePickerInput } from '../selection/DatePickerInput';
import { RadioGroupInput } from '../selection/RadioGroupInput';
import { SelectInput } from '../selection/SelectInput';
import { SwitchInput } from '../selection/SwitchInput';
import { CameraInput } from '../specialized/CameraInput';
import { DocumentPickerInput } from '../specialized/DocumentPickerInput';
import { ImagePickerInput } from '../specialized/ImagePickerInput';
import { OtpInput } from '../specialized/OtpInput';
import { SearchInput } from '../specialized/SearchInput';
import { CurrencyInput } from '../text/CurrencyInput';
import { EmailInput } from '../text/EmailInput';
import { NumberInput } from '../text/NumberInput';
import { PasswordInput } from '../text/PasswordInput';
import { PhoneInput } from '../text/PhoneInput';
import { TextAreaInput } from '../text/TextAreaInput';
import { TextInputField } from '../text/TextInputField';
import { INPUT_REGISTRY } from './inputRegistry';
import { InputShowcaseCard } from './InputShowcaseCard';

export function InputShowcaseCatalog() {
  const colors = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'text' | 'selection' | 'specialized'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Sample static data for dropdown and radio
  const demoSelectOptions = [
    { value: 'frontend', label: 'Frontend Engineer', description: 'React, React Native, TypeScript' },
    { value: 'backend', label: 'Backend Engineer', description: 'Node.js, Go, Python, PostgreSQL' },
    { value: 'fullstack', label: 'Full Stack Engineer', description: 'End-to-end web & mobile systems' },
    { value: 'designer', label: 'Product Designer', description: 'Figma, Design Systems, Mobile UX' },
  ];

  const demoRadioOptions = [
    { value: 'standard', label: 'Standard Delivery', description: '3-5 business days ($4.99)' },
    { value: 'express', label: 'Express Shipping', description: '1-2 business days ($12.99)', badge: 'FAST' },
    { value: 'overnight', label: 'Priority Overnight', description: 'Next day morning delivery ($24.99)' },
  ];

  const filteredComponents = useMemo(() => {
    return INPUT_REGISTRY.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchFilter.trim() === '' ||
        item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchFilter.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchFilter]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View
          style={[
            styles.heroHeader,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}>
          <View style={styles.heroBadgeRow}>
            <View
              style={[
                styles.versionBadge,
                { backgroundColor: colors.primaryMuted },
              ]}>
              <Text style={[styles.versionText, { color: colors.primary }]}>
                Expo SDK 58 • React Native 0.88
              </Text>
            </View>
            <View
              style={[
                styles.countBadge,
                { backgroundColor: colors.backgroundElement },
              ]}>
              <Text style={[styles.countText, { color: colors.textSecondary }]}>
                16 Essential Inputs
              </Text>
            </View>
          </View>

          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Input Elements Library
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Production-ready form components with full visual states, TypeScript typing, validation, and zero boilerplate.
          </Text>

          {/* Quick Stats Grid */}
          <View style={[styles.statsGrid, { backgroundColor: colors.backgroundElement }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>16</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Components</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.success }]}>100%</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cross-Platform</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#8B5CF6' }]}>Strict</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>TypeScript</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>Zod</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Validated</Text>
            </View>
          </View>
        </View>

        {/* Filter & Search Bar */}
        <View style={styles.filterSection}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}>
            <Ionicons name="search" size={16} color={colors.textSecondary} />
            <TextInput
              value={searchFilter}
              onChangeText={setSearchFilter}
              placeholder="Filter 16 input components..."
              placeholderTextColor={colors.placeholder}
              style={[styles.searchInput, { color: colors.text }]}
              clearButtonMode="while-editing"
            />
            {searchFilter.length > 0 ? (
              <Pressable onPress={() => setSearchFilter('')} hitSlop={6}>
                <Ionicons name="close-circle" size={16} color={colors.placeholder} />
              </Pressable>
            ) : null}
          </View>

          {/* Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}>
            {[
              { id: 'all', label: 'All Inputs (16)' },
              { id: 'text', label: 'Text & Personal (7)' },
              { id: 'selection', label: 'Selection (5)' },
              { id: 'specialized', label: 'Specialized (4)' },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id as any)}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.cardBackground,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                    pressed && { opacity: 0.7 },
                  ]}>
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: isSelected ? '#ffffff' : colors.text },
                    ]}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Components List */}
        {filteredComponents.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}>
            <Ionicons name="search-outline" size={36} color={colors.placeholder} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No components found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Try adjusting your search query or category filter.
            </Text>
            <Pressable
              onPress={() => {
                setSearchFilter('');
                setSelectedCategory('all');
              }}
              style={[styles.resetFilterButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.resetFilterText}>Reset Filters</Text>
            </Pressable>
          </View>
        ) : (
          filteredComponents.map((meta) => {
            return (
              <View key={meta.id}>
                {renderCardForComponent(meta, demoSelectOptions, demoRadioOptions)}
              </View>
            );
          })
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function renderCardForComponent(
  meta: any,
  demoSelectOptions: any[],
  demoRadioOptions: any[]
) {
  switch (meta.id) {
    case 'text-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue="Alex Morgan"
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <TextInputField
              label="Full Name"
              placeholder="e.g. Alex Morgan"
              value={currentValue}
              onChangeText={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              clearable
              helperText="Enter your legal first and last name."
            />
          )}
        />
      );

    case 'email-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue="alex@example.com"
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <EmailInput
              label="Email Address"
              placeholder="alex@company.com"
              value={currentValue}
              onChangeText={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              showDomainSuggestions
              validateOnBlur
              helperText="We'll never share your email address."
            />
          )}
        />
      );

    case 'password-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue="Pass123!Secure"
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <PasswordInput
              label="Account Password"
              placeholder="Enter strong password"
              value={currentValue}
              onChangeText={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              showStrengthMeter
              showRequirements
              helperText="Must include uppercase, numbers, and symbols."
            />
          )}
        />
      );

    case 'phone-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue="(555) 234-5678"
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <PhoneInput
              label="Mobile Phone"
              placeholder="(555) 000-0000"
              value={currentValue}
              onChangeText={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              autoFormat
              helperText="Tap country flag to change dial prefix."
            />
          )}
        />
      );

    case 'textarea-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue="Senior React Native engineer specializing in design systems, fluid mobile interactions, and performant cross-platform architectures."
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <TextAreaInput
              label="Professional Summary"
              placeholder="Describe your project or background..."
              value={currentValue}
              onChangeText={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              numberOfLines={4}
              maxLength={250}
              helperText="Brief summary for your profile."
            />
          )}
        />
      );

    case 'number-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue={3}
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <NumberInput
              label="Quantity"
              placeholder="0"
              value={currentValue}
              onChangeNumber={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              min={1}
              max={25}
              step={1}
              quickAddButtons={[1, 5, 10]}
              helperText="Minimum 1 item, maximum 25 items."
            />
          )}
        />
      );

    case 'currency-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue={149.5}
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <CurrencyInput
              label="Item Price"
              value={currentValue}
              onChangeValue={(val) => setCurrentValue(val)}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              allowCurrencySwitch
              helperText="Tap currency symbol to switch between USD, EUR, GBP, JPY."
            />
          )}
        />
      );

    case 'select-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue="frontend"
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <SelectInput
              label="Engineering Specialization"
              placeholder="Select specialization"
              options={demoSelectOptions}
              value={currentValue}
              onSelect={(val) => setCurrentValue(val)}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              searchable
              helperText="Opens responsive bottom sheet with instant search filter."
            />
          )}
        />
      );

    case 'checkbox-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue={true}
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <CheckboxInput
              label="I agree to receive developer release announcements"
              description="We respect your privacy. You can unsubscribe at any time from your account settings."
              checked={Boolean(currentValue)}
              onChangeChecked={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
            />
          )}
        />
      );

    case 'radio-group-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue="express"
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <RadioGroupInput
              label="Shipping Method"
              options={demoRadioOptions}
              value={currentValue}
              onChangeValue={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              layout="cards"
              helperText="Select preferred fulfillment option."
            />
          )}
        />
      );

    case 'switch-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue={true}
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <SwitchInput
              label="Biometric Face ID Login"
              description="Allow quick authentication using your device secure enclave."
              value={Boolean(currentValue)}
              onValueChange={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              activeLabel="Enabled"
              inactiveLabel="Disabled"
            />
          )}
        />
      );

    case 'date-picker-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue={new Date(2026, 9, 20)}
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <DatePickerInput
              label="Project Launch Date"
              placeholder="Select launch target"
              value={currentValue}
              onChangeDate={(d) => setCurrentValue(d)}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              minDate={new Date()}
              helperText="Includes interactive calendar modal, quick presets, and date bounds."
            />
          )}
        />
      );

    case 'search-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue="mobile architecture"
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <SearchInput
              label="Component Search"
              placeholder="Search components, tokens, or props..."
              value={currentValue}
              onChangeText={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              helperText="Features clear button, search icon, and keyboard search action."
            />
          )}
        />
      );

    case 'otp-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue="749215"
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <OtpInput
              label="Two-Factor SMS PIN"
              length={6}
              value={currentValue}
              onChangeOtp={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              helperText="Segmented 6-digit boxes with auto-focus advancing and paste support."
            />
          )}
        />
      );

    case 'image-picker-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue={null}
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <ImagePickerInput
              label="Avatar Photo"
              value={currentValue}
              onChangeImage={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              shape="circle"
              aspect={[1, 1]}
              maxFileSizeMB={5}
              helperText="Select via camera or photo library with preview thumbnail."
            />
          )}
        />
      );

    case 'document-picker-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue={{
            uri: 'file://sample-spec.pdf',
            name: 'Architecture-Specification-v2.pdf',
            size: 2457600,
            mimeType: 'application/pdf',
          }}
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <DocumentPickerInput
              label="Attached Documents"
              value={currentValue}
              onChangeDocument={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              allowedTypes={['application/pdf', 'application/msword']}
              maxFileSizeMB={10}
              helperText="Shows document badge, human-readable file size, and remove/replace actions."
            />
          )}
        />
      );

    case 'camera-input':
      return (
        <InputShowcaseCard
          meta={meta}
          initialValue={null}
          renderInteractive={({
            disabled,
            readOnly,
            hasError,
            errorMessage,
            required,
            currentValue,
            setCurrentValue,
          }) => (
            <CameraInput
              label="Live Photo Capture"
              value={currentValue}
              onChangePhoto={setCurrentValue}
              disabled={disabled}
              readOnly={readOnly}
              error={hasError ? errorMessage : null}
              required={required}
              preferredCamera="front"
              allowsEditing
              helperText="Opens camera with selfie/rear toggle and instant photo capture."
            />
          )}
        />
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: Spacing.six * 2,
  },
  heroHeader: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    padding: Spacing.four,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: Spacing.two,
  },
  versionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.three,
  },
  statsGrid: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  filterSection: {
    gap: Spacing.two,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.two,
    fontSize: 14,
    padding: 0,
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.three,
  },
  resetFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  resetFilterText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});
