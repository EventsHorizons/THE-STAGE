/**
 * @file ArtistProfileScreen — "The Stage"
 * @description Sleek Bento-grid presentation profile displaying metrics, portfolio visual images, and audio waveforms.
 */

import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../theme/constants';
import { BentoCard } from '../components/BentoCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { Artist } from '../types';

interface ArtistProfileScreenProps {
  readonly route: {
    readonly params: {
      readonly artist: Artist;
    };
  };
  readonly navigation: any;
}

export const ArtistProfileScreen: React.FC<ArtistProfileScreenProps> = ({
  route,
  navigation,
}) => {
  const { artist } = route.params;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const sanitizeNumber = (value: unknown): number | undefined =>
    typeof value === 'number' ? value : undefined;

  const sanitizeString = (value: unknown): string =>
    typeof value === 'string' ? value : '';

  const sanitizeSkills = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

  const displayCategory = artist.displayCategory ?? artist.category;
  const rating = sanitizeNumber(artist.technicalStats?.overallRating) ?? 4.9;
  const experienceYears = sanitizeNumber(artist.technicalStats?.experienceYears);
  const heightCm = sanitizeNumber(artist.technicalStats?.heightCm);
  const instrument = sanitizeString(
    artist.technicalStats?.primaryInstrumentOrGenre ?? artist.technicalStats?.instrument,
  );
  const skills = sanitizeSkills(artist.technicalStats?.skills);
  const hasStats = experienceYears !== undefined || heightCm !== undefined || instrument !== '' || skills.length > 0;
  const hasAudioPreview = !!artist.mediaAssets?.some(asset => asset.type === 'audio' || asset.type === 'video');

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
                <Star size={12} color={Colors.primaryAccent} fill={Colors.primaryAccent} />
                <Text style={styles.ratingText}>
                  {rating} (48 Reseñas)
                </Text>
              </View>
            </View>
          </BentoCard>
        )}

        {/* Bento Asymmetric Row */}
        <View style={styles.asymmetricRow}>
          {/* Bento Card 2: Biometrics & Experience */}
          {hasStats && (
            <BentoCard style={styles.statsCard}>
              <Text style={styles.cardTitle}>MÉTRICAS</Text>
              <View style={styles.statList}>
                {heightCm !== undefined && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Altura</Text>
                    <Text style={styles.statValue}>{heightCm} cm</Text>
                  </View>
                )}
                {instrument !== '' && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Instrumento</Text>
                    <Text style={styles.statValue} numberOfLines={1}>{instrument}</Text>
                  </View>
                )}
                {experienceYears !== undefined && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Experiencia</Text>
                    <Text style={styles.statValue}>{experienceYears} años</Text>
                  </View>
                )}
                {skills.length > 0 && (
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Habilidades</Text>
                    <Text style={styles.statValue} numberOfLines={1}>{skills.join(', ')}</Text>
                  </View>
                )}
              </View>
            </BentoCard>
          )}

          {hasAudioPreview ? (
            <BentoCard style={styles.playerCard}>
              <Text style={styles.cardTitle}>PREVIEW AUDIO</Text>
              <Text style={styles.trackTitle} numberOfLines={2}>Capricho Reinterpretation</Text>
              
              <View style={styles.waveformSimulator}>
                {Array.from({ length: 12 }).map((_, idx) => {
                  const heightVal = [12, 28, 45, 18, 38, 50, 22, 42, 30, 26, 16, 32][idx];
                  return (
                    <View
                      key={idx}
                      style={[
                        styles.waveBar,
                        { height: heightVal * 0.6 },
                        isPlaying && idx < 6 ? styles.waveBarActive : null,
                      ]}
                    />
                  );
                })}
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsPlaying(!isPlaying)}
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
          ) : null}
        </View>

        {/* Bento Card 4: Detailed Biography */}
        {artist.bio && (
          <BentoCard style={styles.bioCard}>
            <Text style={styles.cardTitle}>BIOGRAFÍA</Text>
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
            style={styles.primaryActionWrapper}
            onPress={handleCastingRequest}
          >
            <LinearGradient
              colors={Colors.accentGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryActionBtn}
            >
              <Text style={styles.primaryActionText}>Invitar a Casting</Text>
              <Send size={18} color="#FFF" />
            </LinearGradient>
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
    gap: Spacing.md,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: 20,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  portrait: {
    width: 90,
    height: 90,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
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
    color: Colors.text,
    fontSize: 8,
    fontFamily: 'Outfit_700Bold',
    textTransform: 'uppercase',
  },
  headerMeta: {
    flex: 1,
    gap: 4,
  },
  artistName: {
    color: Colors.text,
    fontSize: 24,
    fontFamily: 'Outfit_800ExtraBold',
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 4,
    gap: 6,
  },
  ratingText: {
    color: Colors.text,
    fontSize: 10,
    fontFamily: 'Outfit_600SemiBold',
  },
  asymmetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsCard: {
    width: '48%',
    gap: Spacing.sm,
  },
  cardTitle: {
    color: Colors.primaryAccent,
    fontSize: 10,
    fontFamily: 'Outfit_800ExtraBold',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  statList: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'column',
    gap: 2,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontFamily: 'Outfit_700Bold',
    textTransform: 'uppercase',
  },
  statValue: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
  },
  playerCard: {
    width: '48%',
    gap: Spacing.xs,
  },
  trackTitle: {
    color: Colors.text,
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    marginBottom: 8,
  },
  waveformSimulator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 40,
    marginBottom: 12,
  },
  waveBar: {
    width: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  waveBarActive: {
    backgroundColor: Colors.primaryAccent,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  playText: {
    color: Colors.text,
    fontSize: 10,
    fontFamily: 'Outfit_800ExtraBold',
  },
  bioCard: {
    gap: Spacing.sm,
  },
  bioText: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    lineHeight: 22,
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 8,
    flex: 1,
    minWidth: '45%',
  },
  socialText: {
    color: Colors.text,
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
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
    backgroundColor: 'rgba(9, 9, 10, 0.9)',
  },
  footerContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  secondaryActionBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  primaryActionWrapper: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryActionText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Outfit_700Bold',
  },
});
