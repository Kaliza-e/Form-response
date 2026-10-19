import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { z } from 'zod';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { FormField } from '../form/FormField';
import { CheckboxInput } from '../selection/CheckboxInput';
import { DatePickerInput } from '../selection/DatePickerInput';
import { SelectInput, SelectOption } from '../selection/SelectInput';
import { CameraInput } from '../specialized/CameraInput';
import { EmailInput } from '../text/EmailInput';
import { PasswordInput } from '../text/PasswordInput';
import { PhoneInput } from '../text/PhoneInput';
import { TextInputField } from '../text/TextInputField';

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must include at least 1 uppercase letter')
    .regex(/[0-9]/, 'Password must include at least 1 number'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  country: z.string().min(1, 'Please select your country'),
  dateOfBirth: z.string().min(1, 'Please select your date of birth'),
  photo: z.any().optional(),
  agreeToTerms: z.literal(true, {
    message: 'You must agree to the Terms of Service to continue',
  }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const COUNTRY_OPTIONS: SelectOption[] = [
  { value: 'US', label: 'United States', description: 'North America' },
  { value: 'CA', label: 'Canada', description: 'North America' },
  { value: 'GB', label: 'United Kingdom', description: 'Europe' },
  { value: 'DE', label: 'Germany', description: 'Europe' },
  { value: 'FR', label: 'France', description: 'Europe' },
  { value: 'AU', label: 'Australia', description: 'Oceania' },
  { value: 'JP', label: 'Japan', description: 'Asia' },
  { value: 'SG', label: 'Singapore', description: 'Asia' },
  { value: 'BR', label: 'Brazil', description: 'South America' },
];

export function RegistrationFormDemo() {
  const colors = useTheme();
  const [submittedData, setSubmittedData] = useState<RegistrationFormData | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [revealSummaryPassword, setRevealSummaryPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      country: '',
      dateOfBirth: '',
      photo: null,
      agreeToTerms: false as any,
    },
    mode: 'onTouched',
  });

  const onSubmit = (data: RegistrationFormData) => {
    // Print whole answers in terminal console as requested
    console.log('\n========================================');
    console.log('📋 FORM SUBMITTED ANSWERS:');
    console.log(JSON.stringify(data, null, 2));
    console.log('========================================\n');

    setSubmittedData(data);
    setRevealSummaryPassword(false);
    setShowSummaryModal(true);
  };

  const handleFillSampleData = () => {
    reset({
      fullName: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      password: 'SecurePassword123!',
      phoneNumber: '(555) 382-9012',
      country: 'US',
      dateOfBirth: '1996-06-15',
      photo: null,
      agreeToTerms: true,
    });
    showToast('Sample data filled!');
  };

  const handleReset = () => {
    reset({
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      country: '',
      dateOfBirth: '',
      photo: null,
      agreeToTerms: false as any,
    });
    setSubmittedData(null);
    setShowSummaryModal(false);
    setRevealSummaryPassword(false);
    showToast('Form reset!');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Simple Toast */}
        {toastMessage ? (
          <View style={[styles.toastBanner, { backgroundColor: colors.primary }]}>
            <Ionicons name="information-circle" size={16} color="#ffffff" />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        ) : null}

        {/* Clean, Simple Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View>
              <Text style={[styles.formTitle, { color: colors.text }]}>Registration Form</Text>
              <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
                Please fill in your details below.
              </Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                onPress={handleFillSampleData}
                style={({ pressed }) => [
                  styles.headerBtn,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                  pressed ? { opacity: 0.7 } : null,
                ]}>
                <Ionicons name="flash-outline" size={13} color={colors.primary} />
                <Text style={[styles.headerBtnText, { color: colors.primary }]}>Fill Sample</Text>
              </Pressable>
              <Pressable
                onPress={handleReset}
                style={({ pressed }) => [
                  styles.headerBtn,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                  pressed ? { opacity: 0.7 } : null,
                ]}>
                <Ionicons name="refresh-outline" size={13} color={colors.textSecondary} />
                <Text style={[styles.headerBtnText, { color: colors.textSecondary }]}>Reset</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Form Fields Container */}
        <View
          style={[
            styles.fieldsContainer,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}>
          {/* 1. Full Name */}
          <FormField
            name="fullName"
            control={control}
            render={({ value, onChange, onBlur, error }) => (
              <TextInputField
                label="Full Name"
                placeholder="e.g. John Doe"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error}
                required
                autoCapitalize="words"
                autoComplete="name"
                leftElement={
                  <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
                }
              />
            )}
          />

          {/* 2. Email Address */}
          <FormField
            name="email"
            control={control}
            render={({ value, onChange, onBlur, error }) => (
              <EmailInput
                label="Email Address"
                placeholder="e.g. john@example.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error}
                required
                showDomainSuggestions
              />
            )}
          />

          {/* 3. Password - Masked */}
          <FormField
            name="password"
            control={control}
            render={({ value, onChange, onBlur, error }) => (
              <PasswordInput
                label="Password"
                placeholder="Enter password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error}
                required
                showStrengthMeter
                showRequirements
              />
            )}
          />

          {/* 4. Phone Number */}
          <FormField
            name="phoneNumber"
            control={control}
            render={({ value, onChange, onBlur, error }) => (
              <PhoneInput
                label="Phone Number"
                placeholder="Phone number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error}
                required
              />
            )}
          />

          {/* 5. Country */}
          <FormField
            name="country"
            control={control}
            render={({ value, onChange, error }) => (
              <SelectInput
                label="Country"
                placeholder="Select country"
                options={COUNTRY_OPTIONS}
                value={value}
                onSelect={(val) => onChange(val)}
                error={error}
                required
                searchable
                leftElement={
                  <Ionicons name="globe-outline" size={18} color={colors.textSecondary} />
                }
              />
            )}
          />

          {/* 6. Date of Birth */}
          <FormField
            name="dateOfBirth"
            control={control}
            render={({ value, onChange, error }) => (
              <DatePickerInput
                label="Date of Birth"
                placeholder="Select date of birth"
                value={value}
                onChangeDate={(_, formatted) => onChange(formatted)}
                error={error}
                required
                mode="birthDate"
                maxDate={new Date()}
              />
            )}
          />

          {/* 7. Camera Photo Capture */}
          <FormField
            name="photo"
            control={control}
            render={({ value, onChange, error }) => (
              <CameraInput
                label="Profile / ID Photo"
                helperText="Take a photo with your device camera."
                value={value}
                onChangePhoto={onChange}
                error={error}
                preferredCamera="front"
                allowsEditing
              />
            )}
          />

          {/* 8. Terms Checkbox */}
          <FormField
            name="agreeToTerms"
            control={control}
            render={({ value, onChange, error }) => (
              <CheckboxInput
                label="I agree to the Terms of Service & Privacy Policy"
                description="Confirm you agree to our standard terms."
                checked={Boolean(value)}
                onChangeChecked={onChange}
                error={error}
                required
              />
            )}
          />

          {/* Action Buttons: Reset & Submit */}
          <View style={styles.actionButtonsRow}>
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => [
                styles.resetBtn,
                { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                pressed ? { opacity: 0.7 } : null,
              ]}>
              <Ionicons name="refresh-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.resetBtnText, { color: colors.textSecondary }]}>Reset</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.submitBtn,
                { backgroundColor: colors.primary },
                pressed ? { opacity: 0.8 } : null,
                isSubmitting ? { opacity: 0.6 } : null,
              ]}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Submission Summary Modal */}
        <Modal
          visible={showSummaryModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSummaryModal(false)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowSummaryModal(false)}>
            <Pressable
              style={[
                styles.summaryCard,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
              onPress={(e) => e.stopPropagation()}>
              <View style={styles.summaryHeader}>
                <Ionicons name="checkmark-circle" size={44} color={colors.success} />
                <Text style={[styles.summaryTitle, { color: colors.text }]}>Form Submitted!</Text>
                <Text style={[styles.summarySubtitle, { color: colors.textSecondary }]}>
                  All answers have been verified and printed to the terminal console.
                </Text>
              </View>

              <View style={[styles.summaryList, { backgroundColor: colors.backgroundElement }]}>
                {/* Photo thumbnail */}
                {submittedData?.photo ? (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Photo</Text>
                    <Image
                      source={{ uri: submittedData.photo.uri || submittedData.photo }}
                      style={styles.summaryPhotoThumb}
                      contentFit="cover"
                    />
                  </View>
                ) : null}

                <SummaryRow label="Full Name" value={submittedData?.fullName} colors={colors} />
                <SummaryRow label="Email" value={submittedData?.email} colors={colors} />

                {/* Password masked by default */}
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Password</Text>
                  <View style={styles.passwordSummaryBlock}>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>
                      {revealSummaryPassword
                        ? submittedData?.password
                        : '••••••••••••'}
                    </Text>
                    <Pressable
                      onPress={() => setRevealSummaryPassword(!revealSummaryPassword)}
                      hitSlop={6}
                      style={styles.summaryEyeButton}>
                      <Ionicons
                        name={revealSummaryPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={14}
                        color={colors.primary}
                      />
                      <Text style={[styles.summaryEyeText, { color: colors.primary }]}>
                        {revealSummaryPassword ? 'Hide' : 'Show'}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <SummaryRow label="Phone" value={submittedData?.phoneNumber} colors={colors} />
                <SummaryRow
                  label="Country"
                  value={
                    COUNTRY_OPTIONS.find((c) => c.value === submittedData?.country)?.label ||
                    submittedData?.country
                  }
                  colors={colors}
                />
                <SummaryRow label="Date of Birth" value={submittedData?.dateOfBirth} colors={colors} />
                <SummaryRow
                  label="Terms Agreed"
                  value={submittedData?.agreeToTerms ? 'Yes' : 'No'}
                  colors={colors}
                />
              </View>

              {/* Modal Buttons */}
              <View style={styles.modalActionButtonsRow}>
                <Pressable
                  onPress={handleReset}
                  style={({ pressed }) => [
                    styles.modalResetBtn,
                    { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                    pressed ? { opacity: 0.7 } : null,
                  ]}>
                  <Ionicons name="refresh" size={15} color={colors.textSecondary} />
                  <Text style={[styles.modalResetText, { color: colors.textSecondary }]}>Reset</Text>
                </Pressable>

                <Pressable
                  onPress={() => setShowSummaryModal(false)}
                  style={[styles.closeSummaryBtn, { backgroundColor: colors.primary }]}>
                  <Text style={styles.closeSummaryText}>Done</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SummaryRow({
  label,
  value,
  colors,
}: {
  label: string;
  value?: string;
  colors: any;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: colors.text }]}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: Spacing.six * 2,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.md,
    gap: Spacing.two,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  header: {
    paddingVertical: Spacing.two,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  headerBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fieldsContainer: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  resetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  resetBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  summaryCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.five,
    gap: Spacing.four,
  },
  summaryHeader: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  summarySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  summaryList: {
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150,150,150,0.15)',
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  summaryPhotoThumb: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  passwordSummaryBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryEyeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  summaryEyeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalActionButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  modalResetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  modalResetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  closeSummaryBtn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: BorderRadius.md,
  },
  closeSummaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
