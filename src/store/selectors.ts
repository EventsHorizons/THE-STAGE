/**
 * @file Store selectors with shallow compare — The Stage
 */

import { useShallow } from 'zustand/react/shallow';
import {
  useStageStore,
  selectApplySwipe,
  selectDiscoverFeed,
  selectFeedHead,
  selectFeedLoading,
  selectFeedNext,
  selectLoadFeed,
  selectRecentMatch,
} from './useStageStore';

export function useDiscoverFeedState() {
  return useStageStore(
    useShallow((s) => ({
      feed: selectDiscoverFeed(s),
      current: selectFeedHead(s),
      next: selectFeedNext(s),
      isLoading: selectFeedLoading(s),
      loadTalentFeed: selectLoadFeed(s),
      applySwipe: selectApplySwipe(s),
      recentMatch: selectRecentMatch(s),
    })),
  );
}
