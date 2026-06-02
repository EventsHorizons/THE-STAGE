/**
 * @file useMediaCleanup — release media resources on unmount
 */

import { useEffect, useRef } from 'react';
// useRef also used by useAudioSession below

type CleanupFn = () => void;

/**
 * Register teardown callbacks for audio/video players when a screen unmounts.
 */
export function useMediaCleanup(): {
  registerCleanup: (fn: CleanupFn) => void;
  runCleanup: () => void;
} {
  const cleanups = useRef<CleanupFn[]>([]);

  const registerCleanup = (fn: CleanupFn) => {
    cleanups.current.push(fn);
  };

  const runCleanup = () => {
    cleanups.current.forEach((fn) => {
      try {
        fn();
      } catch {
        /* ignore teardown errors */
      }
    });
    cleanups.current = [];
  };

  useEffect(() => () => runCleanup(), []);

  return { registerCleanup, runCleanup };
}

/**
 * Simulated audio session — replace with expo-av Sound when native player ships.
 */
export function useAudioSession(audioUrl?: string) {
  const { registerCleanup } = useMediaCleanup();
  const playingRef = useRef(false);

  useEffect(() => {
    registerCleanup(() => {
      playingRef.current = false;
    });
  }, [audioUrl, registerCleanup]);

  const play = () => {
    playingRef.current = true;
  };

  const pause = () => {
    playingRef.current = false;
  };

  const stop = () => {
    playingRef.current = false;
  };

  return { play, pause, stop, isActive: () => playingRef.current };
}
