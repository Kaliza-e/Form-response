import { InputComponentMeta } from '../common/types';

export const INPUT_REGISTRY: InputComponentMeta[] = [
  // 1. TextInputField
  {
    id: 'text-input',
    name: 'TextInputField',
    category: 'text',
    categoryLabel: 'Text & Personal',
    description: 'Standard single-line text input for names, usernames, titles, and short text.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { TextInputField } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [name, setName] = useState('');

  return (
    <TextInputField
      label="Full Name"
      placeholder="e.g. Alex Morgan"
      value={name}
      onChangeText={setName}
      required
      clearable
      helperText="Enter your legal first and last name."
    />
  );
}`,
    propsList: [
      { name: 'label', type: 'string', description: 'Label displayed above input' },
      { name: 'value', type: 'string', description: 'Current text value' },
      { name: 'onChangeText', type: '(text: string) => void', description: 'Callback when text changes' },
      { name: 'clearable', type: 'boolean', default: 'true', description: 'Shows clear (X) icon when value exists' },
      { name: 'required', type: 'boolean', default: 'false', description: 'Shows red asterisk (*)' },
      { name: 'error', type: 'string | null', description: 'Displays validation error and red border' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables user interaction' },
    ],
  },

  // 2. EmailInput
  {
    id: 'email-input',
    name: 'EmailInput',
    category: 'text',
    categoryLabel: 'Text & Personal',
    description: 'Email address input with email keyboard, email icon prefix, domain suggestion chips, and validation.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { EmailInput } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [email, setEmail] = useState('');

  return (
    <EmailInput
      label="Work Email"
      placeholder="you@company.com"
      value={email}
      onChangeText={setEmail}
      required
      showDomainSuggestions
      validateOnBlur
    />
  );
}`,
    propsList: [
      { name: 'value', type: 'string', description: 'Current email string' },
      { name: 'onChangeText', type: '(email: string) => void', description: 'Callback on email update' },
      { name: 'showDomainSuggestions', type: 'boolean', default: 'true', description: 'Shows @gmail.com, @outlook.com quick chips' },
      { name: 'validateOnBlur', type: 'boolean', default: 'true', description: 'Validates RFC email format on blur' },
    ],
  },

  // 3. PasswordInput
  {
    id: 'password-input',
    name: 'PasswordInput',
    category: 'text',
    categoryLabel: 'Text & Personal',
    description: 'Secure text entry with eye toggle button, password strength indicator, and security criteria.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { PasswordInput } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [password, setPassword] = useState('');

  return (
    <PasswordInput
      label="Account Password"
      placeholder="Minimum 8 characters"
      value={password}
      onChangeText={setPassword}
      showStrengthMeter
      showRequirements
      required
    />
  );
}`,
    propsList: [
      { name: 'value', type: 'string', description: 'Password string value' },
      { name: 'showStrengthMeter', type: 'boolean', default: 'false', description: 'Displays colored 4-stage strength bar' },
      { name: 'showRequirements', type: 'boolean', default: 'false', description: 'Displays requirement checklist items' },
    ],
  },

  // 4. PhoneInput
  {
    id: 'phone-input',
    name: 'PhoneInput',
    category: 'text',
    categoryLabel: 'Text & Personal',
    description: 'Phone number input with country code modal selector, auto-formatting, and phone keyboard.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { PhoneInput, POPULAR_COUNTRIES } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(POPULAR_COUNTRIES[0]);

  return (
    <PhoneInput
      label="Mobile Number"
      value={phone}
      onChangeText={setPhone}
      countryCode={country}
      onCountryCodeChange={setCountry}
      autoFormat
    />
  );
}`,
    propsList: [
      { name: 'value', type: 'string', description: 'Phone number string' },
      { name: 'countryCode', type: 'CountryCode', description: 'Selected country with dial code and flag' },
      { name: 'autoFormat', type: 'boolean', default: 'true', description: 'Formats input as (XXX) XXX-XXXX' },
    ],
  },

  // 5. TextAreaInput
  {
    id: 'textarea-input',
    name: 'TextAreaInput',
    category: 'text',
    categoryLabel: 'Text & Personal',
    description: 'Multiline text area for bios, comments, messages, and shipping addresses with live character counter.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { TextAreaInput } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [bio, setBio] = useState('');

  return (
    <TextAreaInput
      label="Bio / Notes"
      placeholder="Tell us about yourself..."
      value={bio}
      onChangeText={setBio}
      numberOfLines={4}
      maxLength={300}
      minHeight={120}
    />
  );
}`,
    propsList: [
      { name: 'numberOfLines', type: 'number', default: '4', description: 'Initial line count' },
      { name: 'minHeight', type: 'number', default: '110', description: 'Minimum height in points' },
      { name: 'maxLength', type: 'number', description: 'Limits characters and displays counter' },
    ],
  },

  // 6. NumberInput
  {
    id: 'number-input',
    name: 'NumberInput',
    category: 'text',
    categoryLabel: 'Text & Personal',
    description: 'Numeric input with direct entry, stepper buttons (+/-), min/max clamping, and quick increment chips.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { NumberInput } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [quantity, setQuantity] = useState<number | null>(1);

  return (
    <NumberInput
      label="Ticket Quantity"
      value={quantity}
      onChangeNumber={setQuantity}
      min={1}
      max={20}
      step={1}
      quickAddButtons={[1, 5, 10]}
      showSteppers
    />
  );
}`,
    propsList: [
      { name: 'value', type: 'number | null', description: 'Current numeric value' },
      { name: 'min', type: 'number', description: 'Minimum allowed value' },
      { name: 'max', type: 'number', description: 'Maximum allowed value' },
      { name: 'step', type: 'number', default: '1', description: 'Step increment for stepper buttons' },
      { name: 'quickAddButtons', type: 'number[]', description: 'Array of quick-add chip increments' },
    ],
  },

  // 7. CurrencyInput
  {
    id: 'currency-input',
    name: 'CurrencyInput',
    category: 'text',
    categoryLabel: 'Text & Personal',
    description: 'Currency input with symbol prefix, thousands separators, currency switcher modal, and raw numeric callback.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { CurrencyInput, COMMON_CURRENCIES } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [price, setPrice] = useState<number | null>(49.99);

  return (
    <CurrencyInput
      label="Listing Price"
      value={price}
      onChangeValue={(num, formatted) => setPrice(num)}
      currency={COMMON_CURRENCIES[0]}
      allowCurrencySwitch
    />
  );
}`,
    propsList: [
      { name: 'value', type: 'number | null', description: 'Numeric monetary amount' },
      { name: 'currency', type: 'CurrencyConfig', description: 'Currency symbol and code (USD, EUR, GBP, etc.)' },
      { name: 'allowCurrencySwitch', type: 'boolean', default: 'true', description: 'Enables currency selection modal' },
    ],
  },

  // 8. SelectInput
  {
    id: 'select-input',
    name: 'SelectInput',
    category: 'selection',
    categoryLabel: 'Selection',
    description: 'Dropdown selector with modal bottom sheet, search filter for long lists, option descriptions, and checkmarks.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { SelectInput } from '@/components/inputs';
import { useState } from 'react';

const ROLES = [
  { value: 'dev', label: 'Developer', description: 'Frontend, backend, or full-stack' },
  { value: 'des', label: 'Designer', description: 'UI, UX, or product design' },
  { value: 'pm', label: 'Product Manager', description: 'Product roadmap and planning' },
];

export function Example() {
  const [role, setRole] = useState('dev');

  return (
    <SelectInput
      label="Primary Role"
      options={ROLES}
      value={role}
      onSelect={(val) => setRole(val)}
      searchable
    />
  );
}`,
    propsList: [
      { name: 'options', type: 'SelectOption<T>[]', description: 'List of choices with label and value' },
      { name: 'value', type: 'T | null', description: 'Currently selected value' },
      { name: 'onSelect', type: '(val: T) => void', description: 'Callback when option is tapped' },
      { name: 'searchable', type: 'boolean', default: 'true', description: 'Enables search filter box in bottom sheet' },
    ],
  },

  // 9. CheckboxInput
  {
    id: 'checkbox-input',
    name: 'CheckboxInput',
    category: 'selection',
    categoryLabel: 'Selection',
    description: 'Custom accessible checkbox with checked, unchecked, and indeterminate states, supporting title and description.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { CheckboxInput } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <CheckboxInput
      label="Subscribe to product updates"
      description="Receive weekly release notes and feature announcements."
      checked={subscribed}
      onChangeChecked={setSubscribed}
    />
  );
}`,
    propsList: [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Whether the checkbox is checked' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows horizontal line for partial selection' },
      { name: 'onChangeChecked', type: '(checked: boolean) => void', description: 'Toggle callback' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control dimensions' },
    ],
  },

  // 10. RadioGroupInput
  {
    id: 'radio-group-input',
    name: 'RadioGroupInput',
    category: 'selection',
    categoryLabel: 'Selection',
    description: 'Radio group for mutually exclusive options supporting vertical rows, horizontal items, or interactive cards.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { RadioGroupInput } from '@/components/inputs';
import { useState } from 'react';

const PLANS = [
  { value: 'monthly', label: 'Monthly Plan', description: '$9.99/mo billed monthly' },
  { value: 'annual', label: 'Annual Plan', description: '$99/yr (Save 20%)', badge: 'POPULAR' },
];

export function Example() {
  const [plan, setPlan] = useState('annual');

  return (
    <RadioGroupInput
      label="Subscription Tier"
      options={PLANS}
      value={plan}
      onChangeValue={setPlan}
      layout="cards"
    />
  );
}`,
    propsList: [
      { name: 'options', type: 'RadioOption<T>[]', description: 'Choices array with label, desc, and optional badge' },
      { name: 'value', type: 'T | null', description: 'Selected option value' },
      { name: 'layout', type: "'vertical' | 'horizontal' | 'cards'", default: "'vertical'", description: 'Display layout style' },
    ],
  },

  // 11. SwitchInput
  {
    id: 'switch-input',
    name: 'SwitchInput',
    category: 'selection',
    categoryLabel: 'Selection',
    description: 'Toggle switch for boolean settings with label, subtext description, and live status badge.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { SwitchInput } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <SwitchInput
      label="Push Notifications"
      description="Receive instant alerts on critical order updates."
      value={pushEnabled}
      onValueChange={setPushEnabled}
      activeLabel="Enabled"
      inactiveLabel="Disabled"
    />
  );
}`,
    propsList: [
      { name: 'value', type: 'boolean', default: 'false', description: 'Current toggle state' },
      { name: 'onValueChange', type: '(val: boolean) => void', description: 'Toggle callback' },
      { name: 'showStatusLabel', type: 'boolean', default: 'true', description: 'Displays Enabled/Disabled badge below switch' },
    ],
  },

  // 12. DatePickerInput
  {
    id: 'date-picker-input',
    name: 'DatePickerInput',
    category: 'selection',
    categoryLabel: 'Selection',
    description: 'Cross-platform date picker with interactive calendar dialog, month/year navigation, quick presets, and formatting.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { DatePickerInput } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <DatePickerInput
      label="Appointment Date"
      value={date}
      onChangeDate={(d, formatted) => setDate(d)}
      minDate={new Date()}
      placeholder="Select an appointment date"
    />
  );
}`,
    propsList: [
      { name: 'value', type: 'Date | string | null', description: 'Date object or ISO date string' },
      { name: 'onChangeDate', type: '(date: Date | null, formatted: string) => void', description: 'Selection callback' },
      { name: 'minDate', type: 'Date', description: 'Earliest allowed date' },
      { name: 'maxDate', type: 'Date', description: 'Latest allowed date' },
      { name: 'mode', type: "'date' | 'birthDate'", default: "'date'", description: 'Presets view year for DOB selection' },
    ],
  },

  // 13. SearchInput
  {
    id: 'search-input',
    name: 'SearchInput',
    category: 'specialized',
    categoryLabel: 'Specialized',
    description: 'Search field with magnifying glass icon, activity loading indicator, clear button, and return-key submit handler.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { SearchInput } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <SearchInput
      placeholder="Search catalog by title..."
      value={query}
      onChangeText={setQuery}
      loading={loading}
      onSearchSubmit={(val) => console.log('Searching for:', val)}
    />
  );
}`,
    propsList: [
      { name: 'value', type: 'string', description: 'Current search query' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Displays spinning activity indicator' },
      { name: 'onSearchSubmit', type: '(query: string) => void', description: 'Called on keyboard search button' },
    ],
  },

  // 14. OtpInput
  {
    id: 'otp-input',
    name: 'OtpInput',
    category: 'specialized',
    categoryLabel: 'Specialized',
    description: 'One-time verification code input with segmented digit boxes, auto-focus next, backspace support, and paste distribution.',
    dependency: 'core',
    dependencyLabel: 'React Native Core',
    builtin: true,
    codeExample: `import { OtpInput } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [code, setCode] = useState('');

  return (
    <OtpInput
      label="Enter 6-digit SMS Code"
      length={6}
      value={code}
      onChangeOtp={setCode}
      onComplete={(fullCode) => console.log('Verification code ready:', fullCode)}
      helperText="Enter the code sent to your phone number."
    />
  );
}`,
    propsList: [
      { name: 'length', type: 'number', default: '6', description: 'Number of digit boxes (typically 4 or 6)' },
      { name: 'value', type: 'string', description: 'Current code string' },
      { name: 'onChangeOtp', type: '(otp: string) => void', description: 'Callback on each digit change' },
      { name: 'onComplete', type: '(otp: string) => void', description: 'Triggered automatically when all digits are filled' },
      { name: 'mask', type: 'boolean', default: 'false', description: 'Masks digits with bullets for sensitive PINs' },
    ],
  },

  // 15. ImagePickerInput
  {
    id: 'image-picker-input',
    name: 'ImagePickerInput',
    category: 'specialized',
    categoryLabel: 'Specialized',
    description: 'Image selection component powered by expo-image-picker with camera/gallery choice, thumbnail preview, and file checks.',
    dependency: 'expo-image-picker',
    dependencyLabel: 'Expo: expo-image-picker',
    builtin: false,
    codeExample: `import { ImagePickerInput, ImagePickerValue } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [image, setImage] = useState<ImagePickerValue | null>(null);

  return (
    <ImagePickerInput
      label="Profile Picture"
      value={image}
      onChangeImage={setImage}
      shape="circle"
      aspect={[1, 1]}
      maxFileSizeMB={5}
    />
  );
}`,
    propsList: [
      { name: 'value', type: 'ImagePickerValue | string | null', description: 'Selected image metadata or URI' },
      { name: 'onChangeImage', type: '(img: ImagePickerValue | null) => void', description: 'Callback with image URI and dimensions' },
      { name: 'shape', type: "'circle' | 'square' | 'banner'", default: "'square'", description: 'Preview frame shape' },
      { name: 'aspect', type: '[number, number]', default: '[1, 1]', description: 'Crop aspect ratio' },
      { name: 'maxFileSizeMB', type: 'number', default: '5', description: 'File size threshold' },
    ],
  },

  // 16. DocumentPickerInput
  {
    id: 'document-picker-input',
    name: 'DocumentPickerInput',
    category: 'specialized',
    categoryLabel: 'Specialized',
    description: 'Document and file attachment picker powered by expo-document-picker with file size calculation, type badges, and clear actions.',
    dependency: 'expo-document-picker',
    dependencyLabel: 'Expo: expo-document-picker',
    builtin: false,
    codeExample: `import { DocumentPickerInput, DocumentFile } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [doc, setDoc] = useState<DocumentFile | null>(null);

  return (
    <DocumentPickerInput
      label="Upload Resume (PDF)"
      value={doc}
      onChangeDocument={setDoc}
      allowedTypes={['application/pdf']}
      maxFileSizeMB={10}
      helperText="Accepted formats: PDF up to 10MB."
    />
  );
}`,
    propsList: [
      { name: 'value', type: 'DocumentFile | null', description: 'Selected file object with name, size, uri' },
      { name: 'onChangeDocument', type: '(file: DocumentFile | null) => void', description: 'Callback when file is selected or removed' },
      { name: 'allowedTypes', type: 'string[]', default: "['*/*']", description: 'MIME types allowed for selection' },
      { name: 'maxFileSizeMB', type: 'number', default: '10', description: 'Maximum file size in MB' },
    ],
  },

  // 17. CameraInput
  {
    id: 'camera-input',
    name: 'CameraInput',
    category: 'specialized',
    categoryLabel: 'Specialized',
    description: 'Live camera capture input using expo-image-picker with front/rear switch, instant photo capture, preview, and retake actions.',
    dependency: 'expo-image-picker',
    dependencyLabel: 'Expo: expo-image-picker',
    builtin: false,
    codeExample: `import { CameraInput, CameraPhotoValue } from '@/components/inputs';
import { useState } from 'react';

export function Example() {
  const [photo, setPhoto] = useState<CameraPhotoValue | null>(null);

  return (
    <CameraInput
      label="Identity Verification Selfie"
      value={photo}
      onChangePhoto={setPhoto}
      preferredCamera="front"
      allowsEditing
      aspect={[1, 1]}
      helperText="Take a clear selfie facing the camera."
    />
  );
}`,
    propsList: [
      { name: 'value', type: 'CameraPhotoValue | string | null', description: 'Captured photo URI and metadata' },
      { name: 'onChangePhoto', type: '(photo: CameraPhotoValue | null) => void', description: 'Callback when photo is captured' },
      { name: 'preferredCamera', type: "'front' | 'back'", default: "'front'", description: 'Preferred camera orientation' },
      { name: 'allowsEditing', type: 'boolean', default: 'true', description: 'Allow cropping after capture' },
      { name: 'aspect', type: '[number, number]', default: '[1, 1]', description: 'Crop aspect ratio' },
    ],
  },
];
