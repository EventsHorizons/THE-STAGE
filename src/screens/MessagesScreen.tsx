/**
 * @file MessagesScreen — The Stage
 * @description Placeholder screen for talent conversations and inbox.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageCircle, Mail } from 'lucide-react-native';
import { Colors, Spacing } from '../theme/constants';

export const MessagesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <MessageCircle size={72} color={Colors.primaryAccent} />
      <Text style={styles.title}>Mensajes</Text>
      <Text style={styles.description}>
        Aquí estarán tus conversaciones con scouts, artistas y grupos.
      </Text>
      <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
        <Mail size={18} color={Colors.background} />
        <Text style={styles.ctaText}>Ver bandeja</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaText: {
    marginLeft: 8,
    color: Colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
