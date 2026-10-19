import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

export interface CameraPhotoValue {
  uri: string;
  width?: number;
  height?: number;
  fileSize?: number;
  cameraType?: 'front' | 'back';
  timestamp?: number;
}

export interface CameraInputProps extends BaseInputProps {
  value?: CameraPhotoValue | string | null;
  onChangePhoto?: (photo: CameraPhotoValue | null) => void;
  preferredCamera?: 'front' | 'back';
  allowsEditing?: boolean;
  aspect?: [number, number];
}

export function CameraInput({
  label = 'Camera photo',
  helperText,
  error,
  required,
  optional,
  disabled,
  readOnly,
  value,
  onChangePhoto,
  preferredCamera = 'front',
  allowsEditing = true,
  aspect = [1, 1],
  containerStyle,
  testID,
}: CameraInputProps) {
  const colors = useTheme();
  const [loading, setLoading] = useState(false);
  const [cameraMode, setCameraMode] = useState<'front' | 'back'>(preferredCamera);

  const photoUri = typeof value === 'string' ? value : value?.uri;

  const handleCapture = async () => {
    if (disabled || readOnly) return;

    try {
      setLoading(true);

      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission in your device settings to take a photo.'
        );
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing,
        aspect,
        quality: 0.85,
        cameraType:
          cameraMode === 'front'
            ? ImagePicker.CameraType.front
            : ImagePicker.CameraType.back,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onChangePhoto?.({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
          cameraType: cameraMode,
          timestamp: Date.now(),
        });
      }
    } catch (err: any) {
      Alert.alert('Camera Error', err?.message || 'Failed to capture photo with camera.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    handleCapture();
  };

  const handleRemove = () => {
    onChangePhoto?.(null);
  };

  const toggleCameraMode = () => {
    setCameraMode((prev) => (prev === 'front' ? 'back' : 'front'));
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
      {photoUri ? (
        <View
          style={[
            styles.capturedCard,
            { backgroundColor: colors.inputBackground, borderColor: colors.border },
          ]}>
          <View
            style={[
              styles.previewFrame,
              { borderColor: colors.border },
            ]}>
            <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
            <View style={styles.badgeOverlay}>
              <View style={[styles.typeBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <Ionicons name="camera" size={12} color="#ffffff" />
                <Text style={styles.typeBadgeText}>Captured</Text>
              </View>
            </View>
          </View>

          <View style={styles.capturedDetails}>
            <Text style={[styles.capturedTitle, { color: colors.text }]}>Photo Captured</Text>
            <Text style={[styles.capturedMeta, { color: colors.textSecondary }]}>
              {cameraMode === 'front' ? 'Front / Selfie Camera' : 'Rear Camera'}
            </Text>

            {!disabled && !readOnly ? (
              <View style={styles.actionButtonsRow}>
                <Pressable
                  onPress={handleRetake}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                    pressed && { opacity: 0.7 },
                  ]}>
                  <Ionicons name="refresh" size={14} color={colors.primary} />
                  <Text style={[styles.actionBtnText, { color: colors.primary }]}>Retake</Text>
                </Pressable>

                <Pressable
                  onPress={handleRemove}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                    pressed && { opacity: 0.7 },
                  ]}>
                  <Ionicons name="trash-outline" size={14} color={colors.error} />
                  <Text style={[styles.actionBtnText, { color: colors.error }]}>Remove</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.cameraDropzone,
            {
              backgroundColor: colors.inputBackground,
              borderColor: error ? colors.error : colors.border,
            },
          ]}>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Opening camera...
              </Text>
            </View>
          ) : (
            <>
              <View
                style={[
                  styles.shutterIconCircle,
                  { backgroundColor: colors.primaryMuted },
                ]}>
                <Ionicons name="camera" size={26} color={colors.primary} />
              </View>

              <Text style={[styles.cameraPrompt, { color: colors.text }]}>
                Take a Photo with Camera
              </Text>
              <Text style={[styles.cameraSub, { color: colors.textSecondary }]}>
                {cameraMode === 'front' ? 'Selfie / Front camera selected' : 'Rear camera selected'}
              </Text>

              <View style={styles.controlRow}>
                {Platform.OS !== 'web' ? (
                  <Pressable
                    onPress={toggleCameraMode}
                    disabled={disabled || readOnly}
                    style={({ pressed }) => [
                      styles.toggleCamBtn,
                      { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                      pressed && { opacity: 0.7 },
                    ]}>
                    <Ionicons name="camera-reverse-outline" size={16} color={colors.text} />
                    <Text style={[styles.toggleCamText, { color: colors.text }]}>
                      Switch to {cameraMode === 'front' ? 'Rear' : 'Front'}
                    </Text>
                  </Pressable>
                ) : null}

                <Pressable
                  onPress={handleCapture}
                  disabled={disabled || readOnly}
                  accessibilityRole="button"
                  accessibilityLabel="Open camera"
                  style={({ pressed }) => [
                    styles.captureButton,
                    { backgroundColor: colors.primary },
                    pressed && { opacity: 0.8 },
                  ]}>
                  <Ionicons name="radio-button-on" size={18} color="#ffffff" />
                  <Text style={styles.captureButtonText}>Open Camera</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}
    </InputContainer>
  );
}

const styles = StyleSheet.create({
  cameraDropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    padding: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 140,
  },
  shutterIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cameraPrompt: {
    fontSize: 15,
    fontWeight: '700',
  },
  cameraSub: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: Spacing.three,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  toggleCamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  toggleCamText: {
    fontSize: 12,
    fontWeight: '600',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  captureButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
  },
  capturedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    width: '100%',
    gap: Spacing.three,
  },
  previewFrame: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  badgeOverlay: {
    position: 'absolute',
    bottom: 4,
    left: 4,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  typeBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  capturedDetails: {
    flex: 1,
  },
  capturedTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  capturedMeta: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: Spacing.two,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
