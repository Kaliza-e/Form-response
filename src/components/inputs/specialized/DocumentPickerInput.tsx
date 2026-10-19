import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { InputContainer } from '../common/InputContainer';
import { BaseInputProps } from '../common/types';

export interface DocumentFile {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface DocumentPickerInputProps extends BaseInputProps {
  value?: DocumentFile | null;
  onChangeDocument?: (doc: DocumentFile | null) => void;
  allowedTypes?: string[];
  maxFileSizeMB?: number;
}

export function DocumentPickerInput({
  label = 'Attachment',
  helperText,
  error,
  required,
  optional,
  disabled,
  readOnly,
  value,
  onChangeDocument,
  allowedTypes = ['*/*'],
  maxFileSizeMB = 10,
  containerStyle,
  testID,
}: DocumentPickerInputProps) {
  const colors = useTheme();
  const [loading, setLoading] = useState(false);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handlePickDocument = async () => {
    if (disabled || readOnly) return;

    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        if (file.size && file.size > maxFileSizeMB * 1024 * 1024) {
          Alert.alert(
            'File Too Large',
            `Selected document exceeds the maximum limit of ${maxFileSizeMB} MB.`
          );
          setLoading(false);
          return;
        }

        onChangeDocument?.({
          uri: file.uri,
          name: file.name,
          size: file.size,
          mimeType: file.mimeType,
        });
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to select document');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onChangeDocument?.(null);
  };

  const getFileExtension = (name: string) => {
    const parts = name.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'DOC';
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
      {value ? (
        <View
          style={[
            styles.selectedCard,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
            },
          ]}>
          <View
            style={[
              styles.fileIconBadge,
              { backgroundColor: colors.primaryMuted },
            ]}>
            <Ionicons name="document-text" size={24} color={colors.primary} />
            <Text style={[styles.extBadgeText, { color: colors.primary }]}>
              {getFileExtension(value.name)}
            </Text>
          </View>

          <View style={styles.fileInfo}>
            <Text
              style={[
                styles.fileName,
                { color: disabled ? colors.disabledText : colors.text },
              ]}
              numberOfLines={1}>
              {value.name}
            </Text>
            {typeof value.size === 'number' && (
              <Text style={[styles.fileSize, { color: colors.textSecondary }]}>
                {formatFileSize(value.size)}
              </Text>
            )}
          </View>

          {!disabled && !readOnly ? (
            <View style={styles.actionRow}>
              <Pressable
                onPress={handlePickDocument}
                hitSlop={8}
                style={styles.actionIcon}
                accessibilityLabel="Replace document">
                <Ionicons name="swap-horizontal" size={20} color={colors.textSecondary} />
              </Pressable>
              <Pressable
                onPress={handleRemove}
                hitSlop={8}
                style={styles.actionIcon}
                accessibilityLabel="Remove document">
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : (
        <Pressable
          onPress={handlePickDocument}
          disabled={disabled || readOnly}
          accessibilityRole="button"
          accessibilityLabel="Upload document"
          style={({ pressed }) => [
            styles.dropzone,
            {
              backgroundColor: colors.inputBackground,
              borderColor: error ? colors.error : colors.border,
            },
            pressed && !disabled && !readOnly && { opacity: 0.7 },
          ]}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <View
                style={[
                  styles.uploadIconCircle,
                  { backgroundColor: colors.backgroundElement },
                ]}>
                <Ionicons name="cloud-upload-outline" size={22} color={colors.primary} />
              </View>
              <Text style={[styles.dropzoneTitle, { color: colors.text }]}>
                Choose document to attach
              </Text>
              <Text style={[styles.dropzoneSub, { color: colors.textSecondary }]}>
                PDF, Word, or text files up to {maxFileSizeMB}MB
              </Text>
            </>
          )}
        </Pressable>
      )}
    </InputContainer>
  );
}

const styles = StyleSheet.create({
  dropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    padding: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
    width: '100%',
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dropzoneTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  dropzoneSub: {
    fontSize: 12,
    marginTop: 2,
  },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    width: '100%',
  },
  fileIconBadge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.three,
  },
  extBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: -2,
  },
  fileInfo: {
    flex: 1,
    marginRight: Spacing.two,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
  },
  fileSize: {
    fontSize: 12,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    padding: 6,
  },
});
