/**
 * @file ArtistProfileScreen — "The Stage"
 * @description Sleek Bento-grid presentation profile displaying metrics, portfolio visual images, and audio waveforms.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { 
  MapPin, 
  Star, 
  Play, 
  Pause, 
  Music2, 
  Youtube, 
  Instagram, 
  Globe, 
  Send, 
  MessageSquare 
} from 'lucide-react-native';
import { Colors, Spacing, Typography, Glow, Borders } from '../theme/constants';
import { BentoCard } from '../components/BentoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { Artist } from '../types';
import { MOCK_TALENTS } from '../services/mockData';
import type { TalentDetailScreenProps } from '../navigation/types';
import { useAudioSession } from '../hooks/useMediaCleanup';

export const ArtistProfileScreen: React.FC<TalentDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { artist: paramArtist, profileId } = route.params;
  const artist: Artist =
    paramArtist ?? MOCK_TALENTS.find((t) => t.id === profileId) ?? MOCK_TALENTS[0];
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { play, pause, stop } = useAudioSession(artist.media?.audioUrl);

  useEffect(() => () => stop(), [stop]);

  const handleCastingRequest = () => {
    Alert.alert(
      'Invitación Enviada',
      `Se ha enviado una invitación a ${artist.name} para participar en tu proyecto.`,
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  return (    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Bento Card 1: Artist Portrait Header */}
        {artist.name && (
          <BentoCard style={styles.headerCard}>
            <View style={styles.profileImageWrapper}>
              {artist.avatarUrl && <Image source={{ uri: artist.avatarUrl }} style={styles.portrait} resizeMode="cover" />}
              <View style={styles.availabilityBadge}>
                <View style={[styles.availabilityDot, !artist.availability && { backgroundColor: Colors.textMuted }]} />
                <Text style={styles.availabilityText}>{artist.availability ? 'Disponible' : 'No Disponible'}</Text>
              </View>
            </View>
            <View style={styles.headerMeta}>
              <Text style={styles.artistName}>{artist.name}</Text>
              {artist.location && (
                <View style={styles.locationRow}>
                  <MapPin size={12} color={Colors.textMuted} />
                  <Text style={styles.locationText}>
                    {artist.location.city}, {artist.location.country}
                  </Text>
                </View>
              )}
              <View style={styles.ratingBadge}>
                <Star size={12} color={Colors.accentVinotinto} strokeWidth={1.5} />
                <Text style={styles.ratingText}>
                  {String(
                    (artist.technicalStats as { overallRating?: string | number } | undefined)
                      ?.overallRating ?? '4.9',
                  )}{' '}
                  (48 Reseñas)
                </Text>
              </View>
            </View>
          </BentoCard>
        )}

        {/* Bento Asymmetric Row */}
        <View style={styles.asymmetricRow}>
          {/* Bento Card 2: Biometrics & Experience */}
          {artist.stats && (
            <BentoCard style={styles.statsCard}>
              <Text style={styles.cardTitle}>Métricas</Text>
              <View style={styles.statList}>
                {artist.stats.heightCm && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Altura</Text>
                    <Text style={styles.statValue}>{artist.stats.heightCm} cm</Text>
                  </View>
                )}
                {artist.stats.instrument && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Instrumento</Text>
                    <Text style={styles.statValue} numberOfLines={1}>{artist.stats.instrument}</Text>
                  </View>
                )}
                {artist.stats.experienceYears !== undefined && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Experiencia</Text>
                    <Text style={styles.statValue}>{artist.stats.experienceYears} años</Text>
                  </View>
                )}
              </View>
            </BentoCard>
          )}

          {/* Bento Card 3: Simulated Audio Player */}
          <BentoCard style={styles.playerCard}>
            <Text style={styles.cardTitle}>Preview audio</Text>
            <Text style={styles.trackTitle} numberOfLines={2}>Capricho Reinterpretation</Text>
            
            <View style={styles.waveformSimulator}>
              {Array.from({ length: 12 }).map((_, idx) => {
                const heightVal = [12, 28, 45, 18, 38, 50, 22, 42, 30, 26, 16, 32][idx];
                return (
                  <View
                    key={idx}
                    style={[
                      styles.waveBar,
                      { height: heightVal * 0.5 },
                      isPlaying && idx < 6 ? styles.waveBarActive : null,
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: isPlaying ? '48%' : '0%' },
                ]}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (isPlaying) {
                  pause();
                  setIsPlaying(false);
                } else {
                  play();
                  setIsPlaying(true);
                }
              }}
              style={styles.playButton}
            >
              {isPlaying ? (
                <Pause size={16} color={Colors.text} fill={Colors.text} />
              ) : (
                <Play size={16} color={Colors.text} fill={Colors.text} />
              )}
              <Text style={styles.playText}>{isPlaying ? 'PAUSA' : 'PLAY'}</Text>
            </TouchableOpacity>
          </BentoCard>
        </View>

        {/* Bento Card 4: Detailed Biography */}
        {artist.bio && (
          <BentoCard style={styles.bioCard}>
            <Text style={styles.cardTitle}>Biografía</Text>
            <Text style={styles.bioText}>{artist.bio}</Text>
          </BentoCard>
        )}

        {/* Bento Card 5: Social Badges */}
        <BentoCard style={styles.socialCard}>
          <Text style={styles.cardTitle}>PLATAFORMAS CONECTADAS</Text>
          <View style={styles.socialGrid}>
            <View style={styles.socialBadge}>
              <Music2 size={16} color="#1DB954" />
              <Text style={styles.socialText}>Spotify</Text>
            </View>
            <View style={styles.socialBadge}>
              <Youtube size={16} color="#FF0000" />
              <Text style={styles.socialText}>YouTube</Text>
            </View>
            <View style={styles.socialBadge}>
              <Instagram size={16} color="#E4405F" />
              <Text style={styles.socialText}>Instagram</Text>
            </View>
            <View style={styles.socialBadge}>
              <Globe size={16} color={Colors.textMuted} />
              <Text style={styles.socialText}>Website</Text>
            </View>
          </View>
        </BentoCard>

      </ScrollView>

      {/* Sticky Bottom Modern Bar */}
      <View style={styles.footer}>
        <View style={styles.footerBlur} />
        <View style={styles.footerContent}>
          <TouchableOpacity style={styles.secondaryActionBtn}>
            <MessageSquare size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={handleCastingRequest}
            activeOpacity={0.75}
          >
            <Text style={styles.primaryActionText}>Invitar a casting</Text>
            <Send size={16} color={Colors.textMuted} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    padding: Spacing.md,
    paddingBottom: 150,
    gap: Spacing.lg,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing.lg,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  portrait: {
    width: 90,
    height: 90,
    borderRadius: Borders.radiusMd,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: Colors.surfaceTranslucent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Borders.radiusFull,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    gap: 4,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.verified,
  },
  availabilityText: {
    ...Typography.moduleLabel,
    fontSize: 9,
  },
  headerMeta: {
    flex: 1,
    gap: 4,
  },
  artistName: {
    ...Typography.displayName,
    fontSize: 26,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 4,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderFaint,
    borderRadius: Borders.radiusSm,
  },
  ratingText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  asymmetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  statsCard: {
    width: '48%',
    gap: Spacing.sm,
  },
  cardTitle: {
    ...Typography.moduleLabel,
    marginBottom: Spacing.xs,
  },
  statList: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'column',
    gap: 2,
  },
  statLabel: {
    ...Typography.moduleLabel,
    fontSize: 9,
  },
  statValue: {
    ...Typography.body,
    color: Colors.text,
    fontSize: 15,
  },
  playerCard: {
    width: '48%',
    gap: Spacing.xs,
  },
  trackTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  waveformSimulator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
    height: 36,
    marginBottom: Spacing.sm,
    opacity: 0.55,
  },
  waveBar: {
    width: 2,
    backgroundColor: Colors.border,
    borderRadius: 1,
  },
  waveBarActive: {
    backgroundColor: Colors.accentVinotinto,
  },
  progressTrack: {
    height: 2,
    width: '100%',
    backgroundColor: Colors.borderFaint,
    borderRadius: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: 2,
    backgroundColor: Colors.accentVinotinto,
    borderRadius: 1,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Borders.radiusSm,
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  playText: {
    ...Typography.moduleLabel,
    fontSize: 9,
    color: Colors.textMuted,
  },
  bioCard: {
    gap: Spacing.sm,
  },
  bioText: {
    ...Typography.body,
  },
  socialCard: {
    gap: Spacing.sm,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  socialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Borders.radiusMd,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderFaint,
    gap: 8,
    flex: 1,
    minWidth: '45%',
  },
  socialText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingHorizontal: Spacing.md,
    paddingTop: 10,
  },
  footerBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 11, 11, 0.92)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderFaint,
  },
  footerContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  secondaryActionBtn: {
    width: 52,
    height: 52,
    borderRadius: Borders.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  primaryActionBtn: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: Borders.radiusMd,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.accentBorder,
    backgroundColor: 'rgba(122, 6, 34, 0.06)',
    ...Glow.interactive,
  },
  primaryActionText: {
    ...Typography.moduleLabel,
    color: Colors.text,
    letterSpacing: 1.2,
  },
});
