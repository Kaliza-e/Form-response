import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { CheckboxInput } from '../selection/CheckboxInput';
import { DatePickerInput } from '../selection/DatePickerInput';
import { SelectInput, SelectOption } from '../selection/SelectInput';
import { CameraInput, CameraPhotoValue } from '../specialized/CameraInput';
import { EmailInput } from '../text/EmailInput';
import { PasswordInput } from '../text/PasswordInput';
import { PhoneInput } from '../text/PhoneInput';
import { TextInputField } from '../text/TextInputField';

// Available country options for the select input
const COUNTRY_OPTIONS: SelectOption[] = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'AU', label: 'Australia' },
  { value: 'JP', label: 'Japan' },
  { value: 'BR', label: 'Brazil' },
];

/**
 * RegistrationForm
 * A simple, beginner-friendly form component built using basic React useState.
 * It manages inputs, validates user entries, and logs submitted answers to the console.
 */
export function RegistrationForm() {
  const colors = useTheme();

  // 1. Simple state for each input
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [photo, setPhoto] = useState<CameraPhotoValue | string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // 2. State for validation errors and submission status
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  // 3. Simple validation function
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!email.trim() || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!country) {
      newErrors.country = 'Please select your country';
    }
    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Please select your date of birth';
    }
    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Handle Submit: validates entries and prints answers to console
  const handleSubmit = () => {
    if (!validate()) return;

    const answers = {
      fullName,
      email,
      password,
      phoneNumber,
      country,
      dateOfBirth,
      photo,
      agreeToTerms,
    };

    console.log('\n========================================');
    console.log('📋 FORM SUBMITTED ANSWERS:');
    console.log(JSON.stringify(answers, null, 2));
    console.log('========================================\n');

    setSubmitted(true);
  };

  // 5. Handle Reset: clears all input fields and errors
  const handleReset = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setCountry('');
    setDateOfBirth('');
    setPhoto(null);
    setAgreeToTerms(false);
    setErrors({});
    setSubmitted(false);
  };

  // Quick helper to fill sample data for fast testing
  const handleFillSample = () => {
    setFullName('Alex Rivera');
    setEmail('alex.rivera@example.com');
    setPassword('SecurePass123!');
    setPhoneNumber('(555) 382-9012');
    setCountry('US');
    setDateOfBirth('1996-06-15');
    setAgreeToTerms(true);
    setErrors({});
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={[styles.title, { color: colors.text }]}>Registration Form</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Please fill in your details below.
          </Text>
        </View>

        {/* Quick Sample Button */}
        <Pressable
          onPress={handleFillSample}
          style={({ pressed }) => [
            styles.sampleBtn,
            { backgroundColor: colors.backgroundElement, borderColor: colors.border },
            pressed ? { opacity: 0.7 } : null,
          ]}>
          <Ionicons name="flash-outline" size={13} color={colors.primary} />
          <Text style={[styles.sampleBtnText, { color: colors.primary }]}>Fill Sample</Text>
        </Pressable>
      </View>

      {/* Form Card */}
      <View
        style={[
          styles.formCard,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}>
        {/* 1. Full Name */}
        <TextInputField
          label="Full Name"
          placeholder="e.g. John Doe"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
          }}
          error={errors.fullName}
          required
        />

        {/* 2. Email Address */}
        <EmailInput
          label="Email Address"
          placeholder="e.g. john@example.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
          }}
          error={errors.email}
          required
        />

        {/* 3. Password */}
        <PasswordInput
          label="Password"
          placeholder="Enter password (min 8 chars)"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
          }}
          error={errors.password}
          required
        />

        {/* 4. Phone Number */}
        <PhoneInput
          label="Phone Number"
          placeholder="Phone number"
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
            if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: '' }));
          }}
          error={errors.phoneNumber}
          required
        />

        {/* 5. Country */}
        <SelectInput
          label="Country"
          placeholder="Select country"
          options={COUNTRY_OPTIONS}
          value={country}
          onSelect={(val) => {
            setCountry(val);
            if (errors.country) setErrors((prev) => ({ ...prev, country: '' }));
          }}
          error={errors.country}
          required
        />

        {/* 6. Date of Birth */}
        <DatePickerInput
          label="Date of Birth"
          placeholder="Select date of birth"
          value={dateOfBirth}
          onChangeDate={(_, dateStr) => {
            setDateOfBirth(dateStr);
            if (errors.dateOfBirth) setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
          }}
          error={errors.dateOfBirth}
          required
          mode="birthDate"
        />

        {/* 7. Profile / ID Photo (Camera) */}
        <CameraInput
          label="Profile / ID Photo"
          helperText="Take a photo with your device camera."
          value={photo}
          onChangePhoto={setPhoto}
          error={errors.photo}
        />

        {/* 8. Terms Checkbox */}
        <CheckboxInput
          label="I agree to the Terms of Service & Privacy Policy"
          checked={agreeToTerms}
          onChangeChecked={(checked) => {
            setAgreeToTerms(checked);
            if (errors.agreeToTerms) setErrors((prev) => ({ ...prev, agreeToTerms: '' }));
          }}
          error={errors.agreeToTerms}
          required
        />

        {/* Action Buttons: Reset & Submit */}
        <View style={styles.buttonRow}>
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
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitBtn,
              { backgroundColor: colors.primary },
              pressed ? { opacity: 0.85 } : null,
            ]}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
            <Text style={styles.submitBtnText}>Submit</Text>
          </Pressable>
        </View>
      </View>

      {/* Submission Success Box */}
      {submitted ? (
        <View style={[styles.successBox, { backgroundColor: colors.cardBackground, borderColor: colors.success }]}>
          <Ionicons name="checkmark-circle" size={28} color={colors.success} />
          <View style={styles.successTextContainer}>
            <Text style={[styles.successTitle, { color: colors.text }]}>Form Submitted Successfully!</Text>
            <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
              All answers have been logged to the terminal console.
            </Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 48,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerTextGroup: {
    gap: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
  },
  sampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  sampleBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  resetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 8,
    gap: 6,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
  },
  successTextContainer: {
    flex: 1,
    gap: 2,
  },
  successTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  successSubtitle: {
    fontSize: 12,
  },
});
