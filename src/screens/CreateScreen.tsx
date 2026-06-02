/**
 * @file CreateScreen — The Stage
 * @description Placeholder screen for project creation and casting briefs.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import { Colors, Spacing } from '../theme/constants';

export const CreateScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <PlusCircle size={72} color={Colors.primaryAccent} />
      <Text style={styles.title}>Lanza un nuevo proyecto</Text>
      <Text style={styles.description}>
        Crea convocatorias, briefings y casting calls para tu próximo espectáculo.
      </Text>
      <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
        <Text style={styles.ctaText}>Crear proyecto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
  },
  title: {
    marginTop: Spacing.md,
    fontSize: 24,
    color: Colors.text,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    marginTop: Spacing.sm,
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primaryAccent,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  ctaText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
  },
});
