/**
 * @file ProfileSettingsScreen — "The Stage"
 * @description Account, privacy, and premium settings (Profile tab).
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Shield, Bell, CreditCard, LogOut, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing } from '../theme/constants';
import { ProfileHeader } from '../components/ProfileHeader';

const SETTINGS_ROWS = [
  { icon: Shield, label: 'Privacidad y seguridad' },
  { icon: Bell, label: 'Notificaciones' },
  { icon: CreditCard, label: 'Plan premium' },
] as const;

export const ProfileSettingsScreen: React.FC = () => (
  <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Text style={styles.screenTitle}>Mi cuenta</Text>
    <ProfileHeader
      name="Scout Demo"
      roleLabel="Agencia / Scout"
      isValidated
      availabilityLabel="Sesión activa"
    />
    {SETTINGS_ROWS.map(({ icon: Icon, label }) => (
      <TouchableOpacity key={label} style={styles.row} activeOpacity={0.75}>
        <Icon size={20} color={Colors.textMuted} />
        <Text style={styles.rowLabel}>{label}</Text>
        <ChevronRight size={18} color={Colors.textMuted} />
      </TouchableOpacity>
    ))}
    <TouchableOpacity style={[styles.row, styles.logout]}>
      <LogOut size={20} color="#FF6B6B" />
      <Text style={styles.logoutLabel}>Cerrar sesión</Text>
    </TouchableOpacity>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: 56,
    paddingBottom: 120,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 28,
    fontFamily: 'Outfit_800ExtraBold',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rowLabel: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    fontFamily: 'Outfit_600SemiBold',
  },
  logout: {
    marginTop: Spacing.lg,
    borderColor: 'rgba(255,107,107,0.35)',
  },
  logoutLabel: {
    flex: 1,
    color: '#FF6B6B',
    fontSize: 15,
    fontFamily: 'Outfit_600SemiBold',
  },
});
