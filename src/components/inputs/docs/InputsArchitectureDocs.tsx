import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function InputsArchitectureDocs() {
  const colors = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Overview Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}>
        <View style={styles.titleRow}>
          <View style={[styles.badge, { backgroundColor: colors.primaryMuted }]}>
            <Ionicons name="library" size={20} color={colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>Architecture & Guide</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Design system, modular components, and cross-platform standards.
            </Text>
          </View>
        </View>

        <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
          This library is built with strict TypeScript, functional components, and mobile-first ergonomics. All 16 inputs share a unified visual design language while providing specialized functionality for collecting user information.
        </Text>
      </View>

      {/* 16 Inputs Inventory */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          16 Essential Inputs Matrix
        </Text>
        <Text style={[styles.bodyText, { color: colors.textSecondary, marginBottom: Spacing.three }]}>
          14 built with React Native core APIs, 2 leveraging official Expo SDK modules.
        </Text>

        <View style={styles.inventoryList}>
          {COMPONENTS_MATRIX.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.matrixItem,
                { borderBottomColor: colors.border },
                idx === COMPONENTS_MATRIX.length - 1 && { borderBottomWidth: 0 },
              ]}>
              <View style={styles.matrixTop}>
                <Text style={[styles.matrixNumber, { color: colors.textSecondary }]}>
                  {idx + 1}.
                </Text>
                <Text style={[styles.matrixName, { color: colors.primary }]}>
                  {item.name}
                </Text>
                <View
                  style={[
                    styles.tag,
                    {
                      backgroundColor: item.builtin
                        ? colors.backgroundElement
                        : '#F3E8FF',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.tagText,
                      { color: item.builtin ? colors.textSecondary : '#7E22CE' },
                    ]}>
                    {item.dependency}
                  </Text>
                </View>
              </View>

              <Text style={[styles.matrixDesc, { color: colors.textSecondary }]}>
                {item.description}
              </Text>
              <Text style={[styles.matrixFeatures, { color: colors.text }]}>
                Key features: {item.features}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Shared Design Utilities */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Shared Architecture</Text>
        <Text style={[styles.bodyText, { color: colors.textSecondary, marginBottom: Spacing.three }]}>
          Every input is composed of shared primitives to eliminate duplication:
        </Text>

        <DocPrimitiveItem
          name="InputContainer"
          desc="Standardizes outer margins, field wrapper layout, disabled opacity, and coordinates label and helper/error slots."
          colors={colors}
        />
        <DocPrimitiveItem
          name="InputBase"
          desc="Renders the interactive border box, handles focus ring, error border, disabled background, and prefix/suffix icon slots."
          colors={colors}
        />
        <DocPrimitiveItem
          name="InputLabel"
          desc="Standardizes typography, displays required asterisk (*), optional tags, and optional right action buttons."
          colors={colors}
        />
        <DocPrimitiveItem
          name="InputHelperText"
          desc="Displays hints and automatically computes character counters (e.g. 45/200) with overflow warning."
          colors={colors}
        />
        <DocPrimitiveItem
          name="InputError"
          desc="Displays accessible error banner with alert icon and live region announcement for screen readers."
          colors={colors}
        />
        <DocPrimitiveItem
          name="FormField"
          desc="Connects any of the 16 inputs to React Hook Form Controller with zero boilerplate."
          colors={colors}
        />
      </View>

      {/* Mobile UX Best Practices */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Mobile UX Best Practices Implemented
        </Text>

        <BestPracticeItem
          icon="phone-portrait-outline"
          title="Optimal Keyboard Types"
          desc="Fields automatically configure email-address, phone-pad, numeric, decimal-pad, and search return keys."
          colors={colors}
        />
        <BestPracticeItem
          icon="hand-left-outline"
          title="Accessible Touch Targets"
          desc="All interactive elements maintain at least 44x44pt or 48x48pt hit areas with hitSlop paddings."
          colors={colors}
        />
        <BestPracticeItem
          icon="moon-outline"
          title="First-Class Light & Dark Themes"
          desc="Tokens dynamically adjust contrast for borders, backgrounds, text, and active focus rings."
          colors={colors}
        />
        <BestPracticeItem
          icon="shield-checkmark-outline"
          title="Zod Schema Validation"
          desc="Declarative schema validation with real-time feedback and structured error mapping."
          colors={colors}
        />
      </View>
    </ScrollView>
  );
}

function DocPrimitiveItem({
  name,
  desc,
  colors,
}: {
  name: string;
  desc: string;
  colors: any;
}) {
  return (
    <View style={[styles.primitiveItem, { backgroundColor: colors.backgroundElement }]}>
      <Text style={[styles.primitiveName, { color: colors.primary }]}>{name}</Text>
      <Text style={[styles.primitiveDesc, { color: colors.textSecondary }]}>{desc}</Text>
    </View>
  );
}

function BestPracticeItem({
  icon,
  title,
  desc,
  colors,
}: {
  icon: any;
  title: string;
  desc: string;
  colors: any;
}) {
  return (
    <View style={styles.practiceItem}>
      <View style={[styles.practiceIcon, { backgroundColor: colors.primaryMuted }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.practiceContent}>
        <Text style={[styles.practiceTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.practiceDesc, { color: colors.textSecondary }]}>{desc}</Text>
      </View>
    </View>
  );
}

const COMPONENTS_MATRIX = [
  {
    name: 'TextInputField',
    builtin: true,
    dependency: 'Core',
    description: 'Universal text field for names, usernames, and short text.',
    features: 'Clear button (X), prefix/suffix icons, character counter, focus ring.',
  },
  {
    name: 'EmailInput',
    builtin: true,
    dependency: 'Core',
    description: 'Email input with auto-capitalization disabled and email keyboard.',
    features: 'Domain suggestion chips (@gmail.com, etc.), blur validation, mail icon.',
  },
  {
    name: 'PasswordInput',
    builtin: true,
    dependency: 'Core',
    description: 'Secure text entry with eye visibility toggle.',
    features: 'Password strength meter, requirements checklist, lock prefix.',
  },
  {
    name: 'PhoneInput',
    builtin: true,
    dependency: 'Core',
    description: 'Telephone input with dial code selector and auto-formatting.',
    features: 'Flag & country code modal, (XXX) XXX-XXXX formatting, phone keyboard.',
  },
  {
    name: 'TextAreaInput',
    builtin: true,
    dependency: 'Core',
    description: 'Multiline text area for bios, comments, and long descriptions.',
    features: 'Configurable line count, minHeight, character limits, top alignment.',
  },
  {
    name: 'NumberInput',
    builtin: true,
    dependency: 'Core',
    description: 'Numeric input with direct entry and stepper buttons.',
    features: 'Increment/decrement (+/-), min/max clamp, quick increment chips.',
  },
  {
    name: 'CurrencyInput',
    builtin: true,
    dependency: 'Core',
    description: 'Monetary input with formatted thousands and currency code selector.',
    features: 'Currency switcher (USD, EUR, GBP, JPY), raw number callback, prefix.',
  },
  {
    name: 'SelectInput',
    builtin: true,
    dependency: 'Core',
    description: 'Dropdown selector with modal bottom sheet.',
    features: 'Instant search filter, option descriptions, checkmark indicators.',
  },
  {
    name: 'CheckboxInput',
    builtin: true,
    dependency: 'Core',
    description: 'Accessible checkbox with custom checkmark design.',
    features: 'Checked, unchecked, and indeterminate states, title + description.',
  },
  {
    name: 'RadioGroupInput',
    builtin: true,
    dependency: 'Core',
    description: 'Radio buttons for mutually exclusive choices.',
    features: 'Supports vertical list, horizontal row, or interactive selectable cards.',
  },
  {
    name: 'SwitchInput',
    builtin: true,
    dependency: 'Core',
    description: 'Toggle switch for settings and feature flags.',
    features: 'Clear label, description subtext, active/inactive status pill.',
  },
  {
    name: 'DatePickerInput',
    builtin: true,
    dependency: 'Core',
    description: 'Calendar modal date selector with month/year navigation.',
    features: 'Interactive calendar grid, quick presets (Today, +7 Days), min/max limits.',
  },
  {
    name: 'SearchInput',
    builtin: true,
    dependency: 'Core',
    description: 'Search box for products, records, and catalogs.',
    features: 'Search icon, loading spinner, clear button, returnKeyType="search".',
  },
  {
    name: 'OtpInput',
    builtin: true,
    dependency: 'Core',
    description: 'One-time verification code with segmented digit boxes.',
    features: 'Auto-advance focus, backspace navigation, paste support, optional mask.',
  },
  {
    name: 'ImagePickerInput',
    builtin: false,
    dependency: 'expo-image-picker',
    description: 'Photo selection via camera or library with preview thumbnail.',
    features: 'Crop aspect ratio, size limits, avatar circle or banner shapes, clear action.',
  },
  {
    name: 'DocumentPickerInput',
    builtin: false,
    dependency: 'expo-document-picker',
    description: 'Document and file attachment picker.',
    features: 'File size calculation, MIME badge, replace/remove buttons, type filtering.',
  },
];

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: Spacing.six * 2,
  },
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    padding: Spacing.four,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inventoryList: {
    gap: Spacing.two,
  },
  matrixItem: {
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  matrixTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  matrixNumber: {
    fontSize: 13,
    fontWeight: '700',
    width: 22,
  },
  matrixName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  matrixDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 28,
  },
  matrixFeatures: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    marginLeft: 28,
  },
  primitiveItem: {
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  primitiveName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  primitiveDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.three,
  },
  practiceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
    marginTop: 2,
  },
  practiceContent: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  practiceDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
});
