import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { InputContainer } from '../common/InputContainer';
import { BaseInputProps } from '../common/types';

export interface ImagePickerValue {
  uri: string;
  width?: number;
  height?: number;
  fileSize?: number;
  fileName?: string;
}

export interface ImagePickerInputProps extends BaseInputProps {
  value?: ImagePickerValue | string | null;
  onChangeImage?: (image: ImagePickerValue | null) => void;
  aspect?: [number, number];
  shape?: 'circle' | 'square' | 'banner';
  maxFileSizeMB?: number;
}

export function ImagePickerInput({
  label = 'Profile image',
  helperText,
  error,
  required,
  optional,
  disabled,
  readOnly,
  value,
  onChangeImage,
  aspect = [1, 1],
  shape = 'square',
  maxFileSizeMB = 5,
  containerStyle,
  testID,
}: ImagePickerInputProps) {
  const colors = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Normalize image uri
  const imageUri = typeof value === 'string' ? value : value?.uri;

  const handleLibraryPick = async () => {
    try {
      setModalOpen(false);
      setLoading(true);

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library in settings to select an image.'
        );
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Check file size limit if available
        if (asset.fileSize && asset.fileSize > maxFileSizeMB * 1024 * 1024) {
          Alert.alert(
            'File Too Large',
            `Selected image is too large. Maximum allowed size is ${maxFileSizeMB} MB.`
          );
          setLoading(false);
          return;
        }

        onChangeImage?.({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
          fileName: asset.fileName || 'image.jpg',
        });
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to pick image from library');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraPick = async () => {
    try {
      setModalOpen(false);
      setLoading(true);

      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow camera access in device settings to take a photo.'
        );
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onChangeImage?.({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
          fileName: asset.fileName || 'photo.jpg',
        });
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to capture photo with camera');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onChangeImage?.(null);
    setModalOpen(false);
  };

  const previewRadius =
    shape === 'circle' ? BorderRadius.full : shape === 'banner' ? BorderRadius.md : BorderRadius.lg;

  const previewDimensions =
    shape === 'circle'
      ? { width: 90, height: 90 }
      : shape === 'banner'
      ? { width: '100%' as any, height: 120 }
      : { width: 110, height: 110 };

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
      <View style={styles.contentWrapper}>
        {imageUri ? (
          <View style={styles.previewContainer}>
            <View
              style={[
                styles.imageFrame,
                previewDimensions,
                {
                  borderRadius: previewRadius,
                  borderColor: colors.border,
                },
              ]}>
              <Image
                source={{ uri: imageUri }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
              {loading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="small" color="#ffffff" />
                </View>
              )}
            </View>

            <View style={styles.actionsCluster}>
              <Pressable
                onPress={() => !disabled && !readOnly && setModalOpen(true)}
                disabled={disabled || readOnly}
                style={({ pressed }) => [
                  styles.actionButton,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                  pressed && { opacity: 0.7 },
                ]}>
                <Ionicons name="camera-outline" size={15} color={colors.text} />
                <Text style={[styles.actionText, { color: colors.text }]}>Change</Text>
              </Pressable>

              <Pressable
                onPress={handleRemove}
                disabled={disabled || readOnly}
                style={({ pressed }) => [
                  styles.actionButton,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                  pressed && { opacity: 0.7 },
                ]}>
                <Ionicons name="trash-outline" size={15} color={colors.error} />
                <Text style={[styles.actionText, { color: colors.error }]}>Remove</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => !disabled && !readOnly && setModalOpen(true)}
            disabled={disabled || readOnly}
            accessibilityRole="button"
            accessibilityLabel="Select image"
            style={({ pressed }) => [
              styles.placeholderDropzone,
              shape === 'circle' && styles.circleDropzone,
              shape === 'banner' && styles.bannerDropzone,
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
                  <Ionicons name="image-outline" size={22} color={colors.primary} />
                </View>
                <Text style={[styles.placeholderTitle, { color: colors.text }]}>
                  Upload {label || 'Image'}
                </Text>
                <Text style={[styles.placeholderSub, { color: colors.textSecondary }]}>
                  PNG, JPG up to {maxFileSizeMB}MB
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {/* Choice Modal */}
      <Modal
        visible={modalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setModalOpen(false)}>
          <View
            style={[
              styles.modalDialog,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}>
            <Text style={[styles.dialogTitle, { color: colors.text }]}>
              {imageUri ? 'Change Photo' : 'Select Photo'}
            </Text>

            <Pressable
              onPress={handleLibraryPick}
              style={({ pressed }) => [
                styles.modalOption,
                pressed && { backgroundColor: colors.backgroundElement },
              ]}>
              <Ionicons name="images-outline" size={20} color={colors.primary} />
              <Text style={[styles.optionText, { color: colors.text }]}>
                Choose from Photo Library
              </Text>
            </Pressable>

            {Platform.OS !== 'web' && (
              <Pressable
                onPress={handleCameraPick}
                style={({ pressed }) => [
                  styles.modalOption,
                  pressed && { backgroundColor: colors.backgroundElement },
                ]}>
                <Ionicons name="camera-outline" size={20} color={colors.primary} />
                <Text style={[styles.optionText, { color: colors.text }]}>Take a Photo</Text>
              </Pressable>
            )}

            {imageUri && (
              <Pressable
                onPress={handleRemove}
                style={({ pressed }) => [
                  styles.modalOption,
                  pressed && { backgroundColor: colors.backgroundElement },
                ]}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
                <Text style={[styles.optionText, { color: colors.error }]}>Remove Photo</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => setModalOpen(false)}
              style={[
                styles.cancelButton,
                { backgroundColor: colors.backgroundElement, borderColor: colors.border },
              ]}>
              <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </InputContainer>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    width: '100%',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  imageFrame: {
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsCluster: {
    gap: Spacing.two,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  placeholderDropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    padding: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    width: '100%',
  },
  circleDropzone: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    padding: Spacing.two,
    minHeight: 100,
  },
  bannerDropzone: {
    minHeight: 120,
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderSub: {
    fontSize: 12,
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
  },
  dialogTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: Spacing.three,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.sm,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: Spacing.two,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
