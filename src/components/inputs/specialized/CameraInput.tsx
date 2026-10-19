import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
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
  const [showWebModal, setShowWebModal] = useState(false);
  const [webError, setWebError] = useState<string | null>(null);

  const videoRef = useRef<any>(null);
  const streamRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);

  const photoUri = typeof value === 'string' ? value : value?.uri;

  // Cleanup web stream on unmount
  useEffect(() => {
    return () => {
      stopWebCam();
    };
  }, []);

  const stopWebCam = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track: any) => track.stop());
      } catch {
        // Ignore error
      }
      streamRef.current = null;
    }
  };

  const startWebCam = async (mode: 'front' | 'back') => {
    if (Platform.OS !== 'web') return;

    stopWebCam();
    setWebError(null);
    setLoading(true);

    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode === 'front' ? 'user' : 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err: any) {
        console.warn('WebCam error:', err);
        setWebError(
          'Live webcam not accessible or permission denied. You can still select or snap a photo file below.'
        );
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setWebError('MediaDevices API not available in this browser environment.');
    }
  };

  const handleCapture = async () => {
    if (disabled || readOnly) return;

    if (Platform.OS === 'web') {
      setShowWebModal(true);
      startWebCam(cameraMode);
      return;
    }

    // Native mobile app capture via expo-image-picker
    try {
      setLoading(true);

      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission in your device settings to take a photo.'
        );
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

  const takeWebPhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const w = video?.videoWidth || 640;
    const h = video?.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (video && video.videoWidth > 0 && video.videoHeight > 0) {
        if (cameraMode === 'front') {
          ctx.translate(w, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, w, h);
      } else {
        // Fallback snapshot if camera is initializing or has no video frames
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📸 ID Photo Captured', w / 2, h / 2 - 15);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px system-ui, -apple-system, sans-serif';
        ctx.fillText(new Date().toLocaleString(), w / 2, h / 2 + 25);
      }
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      stopWebCam();
      setShowWebModal(false);

      onChangePhoto?.({
        uri: dataUrl,
        width: w,
        height: h,
        cameraType: cameraMode,
        timestamp: Date.now(),
      });
    }
  };

  const handleWebFileInputChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        stopWebCam();
        setShowWebModal(false);
        onChangePhoto?.({
          uri: dataUrl,
          fileSize: file.size,
          cameraType: cameraMode,
          timestamp: Date.now(),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    handleCapture();
  };

  const handleRemove = () => {
    onChangePhoto?.(null);
  };

  const toggleCameraMode = () => {
    const nextMode = cameraMode === 'front' ? 'back' : 'front';
    setCameraMode(nextMode);
    if (showWebModal && Platform.OS === 'web') {
      startWebCam(nextMode);
    }
  };

  const handleCloseWebModal = () => {
    stopWebCam();
    setShowWebModal(false);
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
      {/* Hidden file input for web fallback / mobile browser capture */}
      {Platform.OS === 'web'
        ? React.createElement('input', {
            ref: fileInputRef,
            type: 'file',
            accept: 'image/*',
            capture: 'user',
            style: { display: 'none' },
            onChange: handleWebFileInputChange,
          })
        : null}

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
            <Text style={[styles.capturedTitle, { color: colors.text }]}>Photo Ready</Text>
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
                    pressed ? { opacity: 0.7 } : null,
                  ]}>
                  <Ionicons name="refresh" size={14} color={colors.primary} />
                  <Text style={[styles.actionBtnText, { color: colors.primary }]}>Retake</Text>
                </Pressable>

                <Pressable
                  onPress={handleRemove}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                    pressed ? { opacity: 0.7 } : null,
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
                Connecting to camera...
              </Text>
            </View>
          ) : (
            <>
              <View
                style={[
                  styles.shutterIconCircle,
                  { backgroundColor: colors.primaryMuted },
                ]}>
                <Ionicons name="camera" size={24} color={colors.primary} />
              </View>

              <Text style={[styles.cameraPrompt, { color: colors.text }]}>
                Take a Photo with Camera
              </Text>
              <Text style={[styles.cameraSub, { color: colors.textSecondary }]}>
                {cameraMode === 'front' ? 'Selfie / Front camera selected' : 'Rear camera selected'}
              </Text>

              <View style={styles.controlRow}>
                <Pressable
                  onPress={toggleCameraMode}
                  disabled={disabled || readOnly}
                  style={({ pressed }) => [
                    styles.toggleCamBtn,
                    { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                    pressed ? { opacity: 0.7 } : null,
                  ]}>
                  <Ionicons name="camera-reverse-outline" size={16} color={colors.text} />
                  <Text style={[styles.toggleCamText, { color: colors.text }]}>
                    {cameraMode === 'front' ? 'Switch to Rear' : 'Switch to Selfie'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleCapture}
                  disabled={disabled || readOnly}
                  accessibilityRole="button"
                  accessibilityLabel="Open camera"
                  style={({ pressed }) => [
                    styles.captureButton,
                    { backgroundColor: colors.primary },
                    pressed ? { opacity: 0.8 } : null,
                  ]}>
                  <Ionicons name="radio-button-on" size={18} color="#ffffff" />
                  <Text style={styles.captureButtonText}>Open Camera</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}

      {/* Web Live Camera Modal */}
      {Platform.OS === 'web' ? (
        <Modal
          visible={showWebModal}
          transparent
          animationType="fade"
          onRequestClose={handleCloseWebModal}>
          <Pressable style={styles.webModalBackdrop} onPress={handleCloseWebModal}>
            <Pressable
              style={[
                styles.webModalCard,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
              onPress={(e) => e.stopPropagation()}>
              <View style={styles.webModalHeader}>
                <View>
                  <Text style={[styles.webModalTitle, { color: colors.text }]}>
                    Camera Viewfinder
                  </Text>
                  <Text style={[styles.webModalSub, { color: colors.textSecondary }]}>
                    {cameraMode === 'front' ? 'Front / Selfie Camera' : 'Rear Camera'}
                  </Text>
                </View>
                <Pressable
                  onPress={handleCloseWebModal}
                  hitSlop={8}
                  style={styles.closeModalBtn}>
                  <Ionicons name="close" size={22} color={colors.text} />
                </Pressable>
              </View>

              {/* Live Video Viewfinder */}
              <View style={[styles.videoContainer, { backgroundColor: '#000000' }]}>
                {React.createElement('video', {
                  ref: videoRef,
                  autoPlay: true,
                  playsInline: true,
                  muted: true,
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: cameraMode === 'front' ? 'scaleX(-1)' : 'none',
                  },
                })}

                {loading ? (
                  <View style={styles.videoOverlay}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={styles.videoOverlayText}>Starting camera stream...</Text>
                  </View>
                ) : null}
              </View>

              {webError ? (
                <View style={styles.errorNoticeBox}>
                  <Ionicons name="warning-outline" size={16} color={colors.error} />
                  <Text style={[styles.errorNoticeText, { color: colors.error }]}>
                    {webError}
                  </Text>
                </View>
              ) : null}

              {/* Viewfinder Controls */}
              <View style={styles.viewfinderActions}>
                <Pressable
                  onPress={toggleCameraMode}
                  style={({ pressed }) => [
                    styles.secondaryActionBtn,
                    { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                    pressed ? { opacity: 0.7 } : null,
                  ]}>
                  <Ionicons name="camera-reverse" size={18} color={colors.text} />
                  <Text style={[styles.secondaryActionText, { color: colors.text }]}>Flip</Text>
                </Pressable>

                <Pressable
                  onPress={takeWebPhoto}
                  style={({ pressed }) => [
                    styles.snapPhotoBtn,
                    { backgroundColor: colors.primary },
                    pressed ? { opacity: 0.85 } : null,
                  ]}>
                  <View style={styles.innerShutterDot} />
                  <Text style={styles.snapPhotoText}>Snap Photo</Text>
                </Pressable>

                <Pressable
                  onPress={() => fileInputRef.current?.click()}
                  style={({ pressed }) => [
                    styles.secondaryActionBtn,
                    { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                    pressed ? { opacity: 0.7 } : null,
                  ]}>
                  <Ionicons name="images-outline" size={18} color={colors.text} />
                  <Text style={[styles.secondaryActionText, { color: colors.text }]}>Upload</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
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
    gap: Spacing.two,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  toggleCamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  toggleCamText: {
    fontSize: 13,
    fontWeight: '600',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.four,
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
  },
  captureButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
  },
  capturedCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  previewFrame: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  badgeOverlay: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: 4,
    paddingVertical: 1,
  },
  typeBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  capturedDetails: {
    flex: 1,
    gap: 3,
  },
  capturedTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  capturedMeta: {
    fontSize: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  webModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  webModalCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  webModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  webModalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  webModalSub: {
    fontSize: 12,
    marginTop: 2,
  },
  closeModalBtn: {
    padding: 4,
  },
  videoContainer: {
    width: '100%',
    height: 280,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  videoOverlayText: {
    color: '#ffffff',
    fontSize: 13,
  },
  errorNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: Spacing.two,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  errorNoticeText: {
    fontSize: 12,
    flex: 1,
  },
  viewfinderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: 4,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.three,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  snapPhotoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: BorderRadius.md,
  },
  innerShutterDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  snapPhotoText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
