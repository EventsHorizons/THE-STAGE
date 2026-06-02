/**
 * @file CategoryChips — hairline tags
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../theme/constants';

interface CategoryChipsProps {
  readonly items: readonly string[];
  readonly maxVisible?: number;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  items,
  maxVisible = 6,
}) => {
  const visible = items.slice(0, maxVisible);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {visible.map((label) => (
        <View key={label} style={styles.chip}>
          <Text style={styles.chipText}>{label}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  chipText: {
    ...Typography.caption,
    fontSize: 11,
    letterSpacing: 0.4,
    color: Colors.textMuted,
  },
});
