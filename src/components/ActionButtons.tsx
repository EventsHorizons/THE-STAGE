/**
 * @file ActionButtons — "The Stage"
 * @description Floating connect / pass / bookmark controls for the discover card.
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Bookmark, Share2, Zap, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../theme/constants';
import type { TalentSwipeAction } from '../navigation/types';

interface ActionButtonsProps {
  readonly onAction: (action: TalentSwipeAction) => void;
  readonly bookmarkCount?: string;
  readonly shareCount?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAction,
  bookmarkCount = '—',
  shareCount = '—',
}) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={styles.actionCircle}
      onPress={() => onAction('bookmark')}
      accessibilityLabel="Guardar talento"
    >
      <Bookmark size={24} color="#FFF" />
      <Text style={styles.actionLabel}>{bookmarkCount}</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionCircle} accessibilityLabel="Compartir">
      <Share2 size={24} color="#FFF" />
      <Text style={styles.actionLabel}>{shareCount}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.passCircle}
      onPress={() => onAction('pass')}
      accessibilityLabel="Pasar"
    >
      <X size={26} color="#FFF" />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.matchCircleWrapper}
      onPress={() => onAction('like')}
      accessibilityLabel="Conectar"
    >
      <LinearGradient colors={Colors.accentGradient} style={styles.matchCircle}>
        <Zap size={28} color="#FFF" fill="#FFF" />
        <Text style={styles.matchText}>MATCH</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    bottom: 140,
    gap: 16,
    alignItems: 'center',
  },
  actionCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  passCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  actionLabel: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
  },
  matchCircleWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 10,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  matchCircle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchText: {
    color: '#FFF',
    fontSize: 8,
    fontFamily: 'Outfit_800ExtraBold',
    marginTop: -2,
  },
});
