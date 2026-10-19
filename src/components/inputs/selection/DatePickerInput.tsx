import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { InputBase } from '../common/InputBase';
import { InputContainer } from '../common/InputContainer';
import { BaseInputProps } from '../common/types';

export interface DatePickerInputProps extends BaseInputProps {
  value?: Date | string | null;
  onChangeDate?: (date: Date | null, formattedString: string) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  mode?: 'date' | 'birthDate';
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function DatePickerInput({
  label = 'Date',
  placeholder = 'Select date',
  value,
  onChangeDate,
  helperText,
  error,
  required,
  optional,
  disabled,
  readOnly,
  minDate,
  maxDate,
  mode = 'date',
  containerStyle,
  inputContainerStyle,
  testID,
}: DatePickerInputProps) {
  const colors = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  // Convert input value to Date object safely
  const parsedDate = useMemo(() => {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }, [value]);

  // Calendar view state: month (0-11) and year
  const initialViewDate = parsedDate ?? new Date();
  const [viewYear, setViewYear] = useState(initialViewDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialViewDate.getMonth());

  // Format date display
  const formattedDisplay = useMemo(() => {
    if (!parsedDate) return '';
    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = MONTH_NAMES[parsedDate.getMonth()].substring(0, 3);
    const year = parsedDate.getFullYear();
    return `${month} ${day}, ${year}`;
  }, [parsedDate]);

  // Sync view when modal opens
  const handleOpen = () => {
    if (disabled || readOnly) return;
    const current = parsedDate ?? (mode === 'birthDate' ? new Date(2000, 0, 1) : new Date());
    setViewYear(current.getFullYear());
    setViewMonth(current.getMonth());
    setModalOpen(true);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleYearStep = (direction: -1 | 1) => {
    setViewYear((y) => y + (direction * (mode === 'birthDate' ? 5 : 1)));
  };

  const handleSelectDay = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);

    if (minDate && selected < minDate) return;
    if (maxDate && selected > maxDate) return;

    const isoString = selected.toISOString().split('T')[0];
    onChangeDate?.(selected, isoString);
    setModalOpen(false);
  };

  const handleQuickPreset = (preset: 'today' | 'nextWeek' | 'clear') => {
    if (preset === 'clear') {
      onChangeDate?.(null, '');
      setModalOpen(false);
      return;
    }

    const target = new Date();
    if (preset === 'nextWeek') {
      target.setDate(target.getDate() + 7);
    }

    const isoString = target.toISOString().split('T')[0];
    onChangeDate?.(target, isoString);
    setModalOpen(false);
  };

  // Generate calendar grid days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }
    return cells;
  }, [viewYear, viewMonth]);

  const today = new Date();

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
      <InputBase
        hasError={Boolean(error)}
        disabled={disabled}
        readOnly={readOnly}
        onPress={handleOpen}
        style={inputContainerStyle}
        leftElement={
          <Ionicons
            name="calendar-outline"
            size={18}
            color={colors.textSecondary}
          />
        }
        rightElement={
          parsedDate && !disabled && !readOnly ? (
            <Pressable
              onPress={() => onChangeDate?.(null, '')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear date">
              <Ionicons name="close-circle" size={18} color={colors.placeholder} />
            </Pressable>
          ) : (
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          )
        }>
        <View style={styles.valueRow}>
          {formattedDisplay ? (
            <Text
              style={[
                styles.dateText,
                { color: disabled ? colors.disabledText : colors.text },
              ]}>
              {formattedDisplay}
            </Text>
          ) : (
            <Text style={[styles.placeholderText, { color: colors.placeholder }]}>
              {placeholder}
            </Text>
          )}
        </View>
      </InputBase>

      {/* Interactive Calendar Modal */}
      <Modal
        visible={modalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalOpen(false)}>
          <Pressable
            style={[
              styles.dialogBox,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
            onPress={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <View style={styles.dialogHeader}>
              <Text style={[styles.dialogTitle, { color: colors.text }]}>
                {label ?? 'Select Date'}
              </Text>
              <Pressable onPress={() => setModalOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>

            {/* Month & Year Navigator */}
            <View
              style={[
                styles.navigatorBar,
                { backgroundColor: colors.backgroundElement, borderColor: colors.border },
              ]}>
              <Pressable
                onPress={() => handleYearStep(-1)}
                style={styles.navButton}
                accessibilityLabel="Previous year">
                <Ionicons name="play-back" size={14} color={colors.text} />
              </Pressable>

              <Pressable
                onPress={handlePrevMonth}
                style={styles.navButton}
                accessibilityLabel="Previous month">
                <Ionicons name="chevron-back" size={18} color={colors.text} />
              </Pressable>

              <Text style={[styles.monthYearLabel, { color: colors.text }]}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </Text>

              <Pressable
                onPress={handleNextMonth}
                style={styles.navButton}
                accessibilityLabel="Next month">
                <Ionicons name="chevron-forward" size={18} color={colors.text} />
              </Pressable>

              <Pressable
                onPress={() => handleYearStep(1)}
                style={styles.navButton}
                accessibilityLabel="Next year">
                <Ionicons name="play-forward" size={14} color={colors.text} />
              </Pressable>
            </View>

            {/* Weekday Labels */}
            <View style={styles.weekdaysRow}>
              {WEEK_DAYS.map((day, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.weekdayText,
                    { color: idx === 0 || idx === 6 ? colors.primary : colors.textSecondary },
                  ]}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar Days Grid */}
            <View style={styles.daysGrid}>
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <View key={`empty-${index}`} style={styles.dayCell} />;
                }

                const cellDate = new Date(viewYear, viewMonth, day);
                const isSelected =
                  parsedDate &&
                  parsedDate.getFullYear() === viewYear &&
                  parsedDate.getMonth() === viewMonth &&
                  parsedDate.getDate() === day;

                const isToday =
                  today.getFullYear() === viewYear &&
                  today.getMonth() === viewMonth &&
                  today.getDate() === day;

                const isOutOfRange =
                  Boolean(minDate && cellDate < minDate) ||
                  Boolean(maxDate && cellDate > maxDate);

                return (
                  <Pressable
                    key={`day-${day}`}
                    onPress={() => !isOutOfRange && handleSelectDay(day)}
                    disabled={isOutOfRange}
                    style={({ pressed }) => [
                      styles.dayCell,
                      isSelected && {
                        backgroundColor: colors.primary,
                        borderRadius: BorderRadius.full,
                      },
                      isToday &&
                        !isSelected && {
                          borderColor: colors.primary,
                          borderWidth: 1,
                          borderRadius: BorderRadius.full,
                        },
                      isOutOfRange && styles.outOfRangeDay,
                      pressed && !isOutOfRange && { opacity: 0.7 },
                    ]}>
                    <Text
                      style={[
                        styles.dayText,
                        {
                          color: isSelected
                            ? '#ffffff'
                            : isOutOfRange
                            ? colors.disabledText
                            : colors.text,
                          fontWeight: isSelected || isToday ? '700' : '500',
                        },
                      ]}>
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Quick Presets */}
            <View style={styles.presetsRow}>
              <Pressable
                onPress={() => handleQuickPreset('today')}
                style={({ pressed }) => [
                  styles.presetChip,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                  pressed && { opacity: 0.7 },
                ]}>
                <Text style={[styles.presetText, { color: colors.primary }]}>Today</Text>
              </Pressable>

              {mode !== 'birthDate' ? (
                <Pressable
                  onPress={() => handleQuickPreset('nextWeek')}
                  style={({ pressed }) => [
                    styles.presetChip,
                    { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                    pressed && { opacity: 0.7 },
                  ]}>
                  <Text style={[styles.presetText, { color: colors.primary }]}>+7 Days</Text>
                </Pressable>
              ) : null}

              {parsedDate ? (
                <Pressable
                  onPress={() => handleQuickPreset('clear')}
                  style={({ pressed }) => [
                    styles.presetChip,
                    { backgroundColor: colors.backgroundElement, borderColor: colors.border },
                    pressed && { opacity: 0.7 },
                  ]}>
                  <Text style={[styles.presetText, { color: colors.error }]}>Clear</Text>
                </Pressable>
              ) : null}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </InputContainer>
  );
}

const styles = StyleSheet.create({
  valueRow: {
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  dialogBox: {
    width: '100%',
    maxWidth: 360,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  navigatorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.two,
  },
  navButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthYearLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  weekdayText: {
    width: 38,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: 4,
  },
  dayCell: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
  },
  outOfRangeDay: {
    opacity: 0.3,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
