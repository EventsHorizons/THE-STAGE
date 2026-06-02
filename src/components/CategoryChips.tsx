/**
 * @file CategoryChips — "The Stage"
 * @description Horizontal skill / category tags; styling inherits from parent surfaces.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../theme/constants';

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
    paddingVertical: 2,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chipText: {
    color: Colors.text,
    fontSize: 11,
    fontFamily: 'Outfit_600SemiBold',
  },
});
