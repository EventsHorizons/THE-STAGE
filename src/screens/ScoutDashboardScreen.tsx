/**
 * @file ScoutDashboardScreen — "The Stage"
 * @description Discovery dashboard with search, filters, and talent grid.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Search, SlidersHorizontal, Star, MapPin, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Typography, Glow, Borders } from '../theme/constants';
import { useNavigation } from '@react-navigation/native';
import { ArtistProfile } from '../types';
import { useTalentSearch } from '../hooks/useTalentSearch';
import type { DiscoverTabNavigationProp } from '../navigation/types';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - Spacing.md * 3) / 2;

const FILTER_OPTIONS = [
  { label: 'Todos', value: 'all' },
  { label: 'Disponibles', value: 'available' },
  { label: 'Músicos', value: 'musician' },
  { label: 'Actores', value: 'actor' },
  { label: 'Artistas', value: 'artist' },
];

export const ScoutDashboardScreen: React.FC = () => {
  const navigation = useNavigation<DiscoverTabNavigationProp>();

  const onSelectArtist = (artist: ArtistProfile) => {
    navigation.navigate('TalentDetail', {
      profileId: artist.id,
      artist,
      fromTab: 'Explore',
    });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'musician' | 'actor' | 'artist'>('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const { filteredTalent } = useTalentSearch({
    query: searchQuery,
    category: activeFilter,
    onlyAvailable: onlyAvailable,
  });

  const renderTalentCard = ({ item }: { item: ArtistProfile }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9}
      onPress={() => onSelectArtist(item)}
    >
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.avatarUrl }} style={styles.cardImage} />
        <View style={[styles.statusDot, item.availability ? styles.statusOnline : styles.statusOffline]} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardRole} numberOfLines={1}>{item.category}</Text>
        <View style={styles.cardMetrics}>
          <View style={styles.metricItem}>
            <Star size={10} color={Colors.primaryAccent} fill={Colors.primaryAccent} />
            <Text style={styles.metricText}>{item.technicalStats?.overallRating || '5.0'}</Text>
          </View>
          <View style={styles.metricItem}>
            <MapPin size={10} color={Colors.textMuted} />
            <Text style={styles.metricText}>{item.location?.city || 'Global'}</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.cardTag}>
            <Text style={styles.cardTagText}>
              {item.technicalStats?.skills[0] || 'Talent'}
            </Text>
          </View>
          <View style={styles.actionBtn}>
            <ChevronRight size={14} color={Colors.text} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar Talento</Text>
        <View style={styles.searchBarContainer}>
          <Search size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Músicos, bailarines, vocalistas..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.filterBtn}
            onPress={() => setOnlyAvailable(!onlyAvailable)}
          >
            <SlidersHorizontal 
              size={18} 
              color={onlyAvailable ? Colors.primaryAccent : Colors.text} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChips}
        >
          {FILTER_OPTIONS.map(filter => (
            <TouchableOpacity
              key={filter.value}
              onPress={() => {
                if (filter.value === 'available') {
                  setOnlyAvailable(!onlyAvailable);
                } else {
                  setActiveFilter(filter.value as any);
                }
              }}
              style={styles.chipWrapper}
            >
              <View
                style={[
                  styles.chip,
                  (activeFilter === filter.value ||
                    (filter.value === 'available' && onlyAvailable)) &&
                    styles.chipActive,
                ]}
              >
                <Text
                  style={
                    activeFilter === filter.value ||
                    (filter.value === 'available' && onlyAvailable)
                      ? styles.chipTextActive
                      : styles.chipText
                  }
                >
                  {filter.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredTalent}
        renderItem={renderTalentCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron talentos.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.displayName,
    fontSize: 28,
    marginBottom: Spacing.md,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceTranslucent,
    borderRadius: Borders.radiusMd,
    paddingHorizontal: Spacing.md,
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    height: '100%',
  },
  filterBtn: {
    padding: 8,
    marginLeft: 4,
  },
  filterWrapper: {
    marginBottom: Spacing.sm,
  },
  filterChips: {
    paddingHorizontal: Spacing.md,
    gap: 10,
  },
  chipWrapper: {
    borderRadius: Borders.radiusFull,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: Borders.radiusFull,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  chipActive: {
    borderColor: Colors.accentBorder,
    backgroundColor: 'rgba(122, 6, 34, 0.08)',
    ...Glow.interactive,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textFaint,
    fontSize: 12,
  },
  chipTextActive: {
    ...Typography.caption,
    color: Colors.text,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  gridContent: {
    padding: Spacing.md,
    paddingBottom: 120,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  card: {
    width: COLUMN_WIDTH,
    backgroundColor: Colors.surfaceTranslucent,
    borderRadius: Borders.radiusMd,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderFaint,
  },
  cardImageContainer: {
    width: '100%',
    height: COLUMN_WIDTH * 1.2,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  statusDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  statusOnline: {
    backgroundColor: Colors.verified,
  },
  statusOffline: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardInfo: {
    padding: 12,
    gap: 4,
  },
  cardName: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.text,
  },
  cardRole: {
    ...Typography.caption,
    color: Colors.accentVinotintoSoft,
  },
  cardMetrics: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontFamily: 'Outfit_600SemiBold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardTag: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  cardTagText: {
    color: Colors.text,
    fontSize: 10,
    fontFamily: 'Outfit_600SemiBold',
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
  },
});
