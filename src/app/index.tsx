import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Other'];
const interests = ['Design', 'Technology', 'Business', 'Lifestyle'];

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  password: string;
  birthDate: string;
  country: string;
  contactMethod: string;
  interests: string[];
  newsletter: boolean;
  bio: string;
};

const initialValues: FormValues = {
  fullName: '',
  email: '',
  phone: '',
  age: '',
  password: '',
  birthDate: '',
  country: '',
  contactMethod: '',
  interests: [],
  newsletter: false,
  bio: '',
};

export default function HomeScreen() {
  const colors = useTheme();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);

  function updateValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleInterest(interest: string) {
    setValues((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  }

  function handleSubmit() {
    console.log('Form submission:', { ...values, age: values.age ? Number(values.age) : '' });
  }

  const inputStyle = [styles.input, { color: colors.text, borderColor: colors.backgroundSelected }];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <View style={styles.header}>
              <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>GET STARTED</Text>
              <Text style={[styles.title, { color: colors.text }]}>Your details</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Fill out the form below. Your answers will be printed to the console when you
                submit.
              </Text>
            </View>

            <View style={styles.field}>
              <FieldLabel label="Full name" required color={colors.text} />
              <TextInput
                accessibilityLabel="Full name"
                autoCapitalize="words"
                autoComplete="name"
                onChangeText={(value) => updateValue('fullName', value)}
                placeholder="Jane Smith"
                placeholderTextColor={colors.textSecondary}
                style={inputStyle}
                value={values.fullName}
              />
            </View>

            <View style={styles.field}>
              <FieldLabel label="Email address" required color={colors.text} />
              <TextInput
                accessibilityLabel="Email address"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={(value) => updateValue('email', value)}
                placeholder="jane@example.com"
                placeholderTextColor={colors.textSecondary}
                style={inputStyle}
                value={values.email}
              />
            </View>

            <View style={styles.field}>
              <FieldLabel label="Phone number" color={colors.text} />
              <TextInput
                accessibilityLabel="Phone number"
                autoComplete="tel"
                keyboardType="phone-pad"
                onChangeText={(value) => updateValue('phone', value)}
                placeholder="+1 555 123 4567"
                placeholderTextColor={colors.textSecondary}
                style={inputStyle}
                value={values.phone}
              />
            </View>

            <View style={styles.field}>
              <FieldLabel label="Age" color={colors.text} />
              <TextInput
                accessibilityLabel="Age"
                keyboardType="number-pad"
                onChangeText={(value) => updateValue('age', value.replace(/[^0-9]/g, ''))}
                placeholder="Enter your age"
                placeholderTextColor={colors.textSecondary}
                style={inputStyle}
                value={values.age}
              />
            </View>

            <View style={styles.field}>
              <FieldLabel label="Password" required color={colors.text} />
              <TextInput
                accessibilityLabel="Password"
                autoCapitalize="none"
                autoComplete="new-password"
                onChangeText={(value) => updateValue('password', value)}
                placeholder="Create a password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                style={inputStyle}
                value={values.password}
              />
            </View>

            <View style={styles.field}>
              <FieldLabel label="Date of birth" color={colors.text} />
              <TextInput
                accessibilityLabel="Date of birth"
                onChangeText={(value) => updateValue('birthDate', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
                style={inputStyle}
                value={values.birthDate}
              />
            </View>

            <View style={styles.field}>
              <FieldLabel label="Country" color={colors.text} />
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: countryPickerOpen }}
                onPress={() => setCountryPickerOpen((open) => !open)}
                style={[styles.select, { borderColor: colors.backgroundSelected }]}>
                <Text
                  style={[
                    styles.selectText,
                    { color: values.country ? colors.text : colors.textSecondary },
                  ]}>
                  {values.country || 'Choose a country'}
                </Text>
                <Text style={[styles.chevron, { color: colors.textSecondary }]}>
                  {countryPickerOpen ? '^' : 'v'}
                </Text>
              </Pressable>
              {countryPickerOpen && (
                <View style={[styles.options, { borderColor: colors.backgroundSelected }]}>
                  {countries.map((country) => (
                    <Pressable
                      accessibilityRole="radio"
                      accessibilityState={{ checked: values.country === country }}
                      key={country}
                      onPress={() => {
                        updateValue('country', country);
                        setCountryPickerOpen(false);
                      }}
                      style={[
                        styles.option,
                        values.country === country && { backgroundColor: colors.backgroundElement },
                      ]}>
                      <Text style={[styles.optionText, { color: colors.text }]}>{country}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.field}>
              <FieldLabel label="Preferred contact method" color={colors.text} />
              {['Email', 'Phone', 'Text message'].map((method) => (
                <ChoiceRow
                  key={method}
                  label={method}
                  selected={values.contactMethod === method}
                  color={colors.text}
                  mutedColor={colors.textSecondary}
                  selectedColor={colors.backgroundSelected}
                  onPress={() => updateValue('contactMethod', method)}
                />
              ))}
            </View>

            <View style={styles.field}>
              <FieldLabel label="Interests" color={colors.text} />
              {interests.map((interest) => (
                <ChoiceRow
                  key={interest}
                  label={interest}
                  selected={values.interests.includes(interest)}
                  color={colors.text}
                  mutedColor={colors.textSecondary}
                  selectedColor={colors.backgroundSelected}
                  onPress={() => toggleInterest(interest)}
                  checkbox
                />
              ))}
            </View>

            <View style={[styles.switchRow, { borderColor: colors.backgroundSelected }]}>
              <View style={styles.switchCopy}>
                <Text style={[styles.label, { color: colors.text }]}>Newsletter</Text>
                <Text style={[styles.helper, { color: colors.textSecondary }]}>
                  Send me occasional updates and news.
                </Text>
              </View>
              <Switch
                accessibilityLabel="Subscribe to newsletter"
                onValueChange={(value) => updateValue('newsletter', value)}
                trackColor={{ false: colors.backgroundSelected, true: '#3767e8' }}
                value={values.newsletter}
              />
            </View>

            <View style={styles.field}>
              <FieldLabel label="About you" color={colors.text} />
              <TextInput
                accessibilityLabel="About you"
                multiline
                onChangeText={(value) => updateValue('bio', value)}
                placeholder="Share a little about yourself..."
                placeholderTextColor={colors.textSecondary}
                style={[inputStyle, styles.textArea]}
                textAlignVertical="top"
                value={values.bio}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleSubmit}
              style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}>
              <Text style={styles.submitText}>Submit form</Text>
            </Pressable>
            <Text style={[styles.footer, { color: colors.textSecondary }]}>
              Check your development console to see the submitted details.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FieldLabel({
  label,
  required = false,
  color,
}: {
  label: string;
  required?: boolean;
  color: string;
}) {
  return (
    <Text style={[styles.label, { color }]}>
      {label}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
}

function ChoiceRow({
  label,
  selected,
  color,
  mutedColor,
  selectedColor,
  onPress,
  checkbox = false,
}: {
  label: string;
  selected: boolean;
  color: string;
  mutedColor: string;
  selectedColor: string;
  onPress: () => void;
  checkbox?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={checkbox ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={styles.choiceRow}>
      <View
        style={[
          checkbox ? styles.checkbox : styles.radio,
          { borderColor: selected ? '#3767e8' : mutedColor },
          selected && { backgroundColor: checkbox ? '#3767e8' : selectedColor },
        ]}>
        {selected && (
          <View
            style={[
              checkbox ? styles.checkboxMark : styles.radioMark,
              checkbox ? styles.checkboxMarkColor : { backgroundColor: '#3767e8' },
            ]}
          />
        )}
      </View>
      <Text style={[styles.choiceText, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
  },
  form: {
    width: '100%',
    maxWidth: 560,
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },
  header: {
    marginBottom: Spacing.two,
    gap: Spacing.two,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  field: {
    gap: Spacing.two,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  required: {
    color: '#d04747',
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 14,
  },
  select: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
  },
  chevron: {
    fontSize: 20,
  },
  options: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  option: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  optionText: {
    fontSize: 15,
  },
  choiceRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioMark: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxMark: {
    width: 5,
    height: 9,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#fff',
    transform: [{ rotate: '45deg' }],
    marginBottom: 2,
  },
  checkboxMarkColor: {
    borderColor: '#fff',
  },
  choiceText: {
    fontSize: 15,
  },
  switchRow: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  switchCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  helper: {
    fontSize: 13,
    lineHeight: 18,
  },
  submitButton: {
    minHeight: 52,
    backgroundColor: '#3767e8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  submitButtonPressed: {
    opacity: 0.82,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginTop: -Spacing.one,
  },
});
