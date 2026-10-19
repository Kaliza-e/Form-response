import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ReactNode, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { InputComponentMeta } from '../common/types';

export interface InputShowcaseCardProps {
  meta: InputComponentMeta;
  renderInteractive: (state: {
    disabled: boolean;
    readOnly: boolean;
    hasError: boolean;
    errorMessage: string;
    required: boolean;
    currentValue: any;
    setCurrentValue: (val: any) => void;
  }) => ReactNode;
  initialValue: any;
}

export function InputShowcaseCard({
  meta,
  renderInteractive,
  initialValue,
}: InputShowcaseCardProps) {
  const colors = useTheme();

  // Active view tab: 'preview' | 'code' | 'props'
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'props'>('preview');

  // Interactive sandbox state modifiers
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [required, setRequired] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [copied, setCopied] = useState(false);
  const [showRawPassword, setShowRawPassword] = useState(false);

  const errorMessage = hasError ? 'This field has a validation error.' : '';

  const handleCopyCode = async () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(meta.codeExample);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setCurrentValue(initialValue);
    setDisabled(false);
    setReadOnly(false);
    setHasError(false);
    setRequired(false);
  };

  const formatValueDisplay = (val: any): string => {
    if (val === null || val === undefined) return 'null';
    if (typeof val === 'string') return `"${val}"`;
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    if (typeof val === 'number') return String(val);
    if (val instanceof Date) return val.toISOString();
    if (typeof val === 'object') {
      try {
        return JSON.stringify(val, null, 2);
      } catch {
        return String(val);
      }
    }
    return String(val);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
      ]}>
      {/* Top Header */}
      <View style={styles.cardHeader}>
        <View style={styles.titleArea}>
          <Text style={[styles.componentName, { color: colors.text }]}>{meta.name}</Text>
          <Text style={[styles.componentDesc, { color: colors.textSecondary }]}>
            {meta.description}
          </Text>
        </View>

        <View style={styles.badgeRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: colors.primaryMuted },
            ]}>
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {meta.categoryLabel}
            </Text>
          </View>

          <View
            style={[
              styles.dependencyBadge,
              {
                backgroundColor: meta.builtin
                  ? colors.backgroundElement
                  : '#F3E8FF',
              },
            ]}>
            <Ionicons
              name={meta.builtin ? 'cube-outline' : 'download-outline'}
              size={12}
              color={meta.builtin ? colors.textSecondary : '#7E22CE'}
              style={styles.depIcon}
            />
            <Text
              style={[
                styles.dependencyText,
                { color: meta.builtin ? colors.textSecondary : '#7E22CE' },
              ]}>
              {meta.dependencyLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs navigation */}
      <View style={[styles.tabsBar, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => setActiveTab('preview')}
          style={[styles.tabButton, activeTab === 'preview' && styles.activeTabButton]}>
          <Ionicons
            name="play-circle-outline"
            size={16}
            color={activeTab === 'preview' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'preview' ? colors.primary : colors.textSecondary,
                fontWeight: activeTab === 'preview' ? '700' : '500',
              },
            ]}>
            Sandbox
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('code')}
          style={[styles.tabButton, activeTab === 'code' && styles.activeTabButton]}>
          <Ionicons
            name="code-slash-outline"
            size={16}
            color={activeTab === 'code' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'code' ? colors.primary : colors.textSecondary,
                fontWeight: activeTab === 'code' ? '700' : '500',
              },
            ]}>
            TypeScript
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('props')}
          style={[styles.tabButton, activeTab === 'props' && styles.activeTabButton]}>
          <Ionicons
            name="list-outline"
            size={16}
            color={activeTab === 'props' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'props' ? colors.primary : colors.textSecondary,
                fontWeight: activeTab === 'props' ? '700' : '500',
              },
            ]}>
            Props ({meta.propsList.length})
          </Text>
        </Pressable>
      </View>

      {/* Tab 1: Live Interactive Sandbox */}
      {activeTab === 'preview' && (
        <View style={styles.sandboxContent}>
          {/* State Toggles Bar */}
          <View style={styles.stateTogglesRow}>
            <Text style={[styles.stateLabel, { color: colors.textSecondary }]}>States:</Text>

            <Pressable
              onPress={() => setRequired(!required)}
              style={({ pressed }) => [
                styles.stateChip,
                {
                  backgroundColor: required ? colors.primaryMuted : colors.backgroundElement,
                  borderColor: required ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.7 },
              ]}>
              <Text
                style={[
                  styles.stateChipText,
                  { color: required ? colors.primary : colors.text },
                ]}>
                {required ? 'Required ✓' : 'Required'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setHasError(!hasError)}
              style={({ pressed }) => [
                styles.stateChip,
                {
                  backgroundColor: hasError ? colors.errorBackground : colors.backgroundElement,
                  borderColor: hasError ? colors.error : colors.border,
                },
                pressed && { opacity: 0.7 },
              ]}>
              <Text
                style={[
                  styles.stateChipText,
                  { color: hasError ? colors.error : colors.text },
                ]}>
                {hasError ? 'Error State ✓' : 'Error'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setDisabled(!disabled)}
              style={({ pressed }) => [
                styles.stateChip,
                {
                  backgroundColor: disabled ? colors.backgroundSelected : colors.backgroundElement,
                  borderColor: disabled ? colors.text : colors.border,
                },
                pressed && { opacity: 0.7 },
              ]}>
              <Text
                style={[
                  styles.stateChipText,
                  { color: disabled ? colors.text : colors.text },
                ]}>
                {disabled ? 'Disabled ✓' : 'Disabled'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setReadOnly(!readOnly)}
              style={({ pressed }) => [
                styles.stateChip,
                {
                  backgroundColor: readOnly ? colors.backgroundSelected : colors.backgroundElement,
                  borderColor: readOnly ? colors.text : colors.border,
                },
                pressed && { opacity: 0.7 },
              ]}>
              <Text
                style={[
                  styles.stateChipText,
                  { color: readOnly ? colors.text : colors.text },
                ]}>
                {readOnly ? 'Read-Only ✓' : 'Read-Only'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleReset}
              style={({ pressed }) => [
                styles.resetChip,
                { backgroundColor: colors.backgroundElement },
                pressed && { opacity: 0.7 },
              ]}>
              <Ionicons name="refresh" size={13} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Interactive Input Rendering */}
          <View style={styles.interactiveArea}>
            {renderInteractive({
              disabled,
              readOnly,
              hasError,
              errorMessage,
              required,
              currentValue,
              setCurrentValue,
            })}
          </View>

          {/* Live Value Inspector */}
          <View
            style={[
              styles.inspectorBox,
              { backgroundColor: colors.inputBackground, borderColor: colors.border },
            ]}>
            <View style={styles.inspectorHeader}>
              <View style={styles.inspectorTitleRow}>
                <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.inspectorTitle, { color: colors.textSecondary }]}>
                  Value Inspector ({typeof currentValue})
                </Text>
                {meta.id === 'password-input' ? (
                  <Pressable
                    onPress={() => setShowRawPassword(!showRawPassword)}
                    style={styles.maskToggleBtn}
                    hitSlop={6}>
                    <Ionicons
                      name={showRawPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={13}
                      color={colors.primary}
                    />
                    <Text style={[styles.maskToggleText, { color: colors.primary }]}>
                      {showRawPassword ? 'Hide' : 'Reveal'}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
              {typeof currentValue === 'string' ? (
                <Text style={[styles.lenBadge, { color: colors.textSecondary }]}>
                  {currentValue.length} chars
                </Text>
              ) : null}
            </View>

            <Text
              style={[styles.valueCode, { color: colors.primary }]}
              numberOfLines={4}
              selectable>
              {meta.id === 'password-input' && !showRawPassword
                ? `"${'•'.repeat(Math.min(currentValue?.length || 8, 16))}"`
                : formatValueDisplay(currentValue)}
            </Text>
          </View>
        </View>
      )}

      {/* Tab 2: TypeScript Code Snippet */}
      {activeTab === 'code' && (
        <View style={styles.codeTabContent}>
          <View style={styles.codeHeader}>
            <Text style={[styles.codeHeaderTitle, { color: colors.textSecondary }]}>
              Component Usage
            </Text>
            <Pressable
              onPress={handleCopyCode}
              style={({ pressed }) => [
                styles.copyButton,
                { backgroundColor: copied ? colors.successBackground : colors.backgroundElement },
                pressed && { opacity: 0.7 },
              ]}>
              <Ionicons
                name={copied ? 'checkmark' : 'copy-outline'}
                size={14}
                color={copied ? colors.success : colors.text}
              />
              <Text
                style={[
                  styles.copyButtonText,
                  { color: copied ? colors.success : colors.text },
                ]}>
                {copied ? 'Copied!' : 'Copy Code'}
              </Text>
            </Pressable>
          </View>

          <View style={[styles.codeBox, { backgroundColor: '#0F172A' }]}>
            <Text style={styles.codeSnippetText} selectable>
              {meta.codeExample}
            </Text>
          </View>
        </View>
      )}

      {/* Tab 3: Props & Configuration */}
      {activeTab === 'props' && (
        <View style={styles.propsTabContent}>
          {meta.propsList.map((p, idx) => (
            <View
              key={idx}
              style={[
                styles.propRow,
                { borderBottomColor: colors.border },
                idx === meta.propsList.length - 1 && { borderBottomWidth: 0 },
              ]}>
              <View style={styles.propHeaderRow}>
                <Text style={[styles.propName, { color: colors.primary }]}>{p.name}</Text>
                <Text style={[styles.propType, { color: colors.textSecondary }]}>
                  {p.type}
                </Text>
                {p.default ? (
                  <Text style={[styles.propDefault, { color: colors.warning }]}>
                    ={p.default}
                  </Text>
                ) : null}
              </View>
              <Text style={[styles.propDescription, { color: colors.textSecondary }]}>
                {p.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.four,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: Spacing.four,
    paddingBottom: Spacing.three,
  },
  titleArea: {
    marginBottom: Spacing.two,
  },
  componentName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  componentDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dependencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  depIcon: {
    marginRight: 4,
  },
  dependencyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabsBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.two,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 13,
  },
  sandboxContent: {
    padding: Spacing.four,
  },
  stateTogglesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.three,
  },
  stateLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 2,
  },
  stateChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  stateChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  resetChip: {
    padding: 6,
    borderRadius: BorderRadius.xs,
  },
  interactiveArea: {
    marginBottom: Spacing.two,
  },
  inspectorBox: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.three,
    marginTop: Spacing.one,
  },
  inspectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inspectorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  maskToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginLeft: 6,
  },
  maskToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  inspectorTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lenBadge: {
    fontSize: 11,
  },
  valueCode: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontSize: 13,
    fontWeight: '600',
  },
  codeTabContent: {
    padding: Spacing.four,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  codeHeaderTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  codeBox: {
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
  },
  codeSnippetText: {
    color: '#E2E8F0',
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontSize: 12,
    lineHeight: 18,
  },
  propsTabContent: {
    padding: Spacing.four,
  },
  propRow: {
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  propHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  propName: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  propType: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  propDefault: {
    fontSize: 12,
    fontWeight: '600',
  },
  propDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
});
