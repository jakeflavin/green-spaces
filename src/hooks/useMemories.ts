import { useState, useEffect } from 'react';
import { subscribeToMemories, type Memory, type MapBounds } from '../lib/memories';

export type { MemoryType } from '../lib/memories';

export function useMemories(bounds: MapBounds | null) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  // Debounce bounds so panning doesn't trigger a new subscription on every pixel
  const [debouncedBounds, setDebouncedBounds] = useState<MapBounds | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedBounds(bounds), 300);
    return () => clearTimeout(timer);
  }, [bounds]);

  useEffect(() => {
    const unsubscribe = subscribeToMemories((liveDocs) => {
      setMemories(liveDocs);
      setLoading(false);
    }, debouncedBounds ?? undefined);
    return unsubscribe;
  }, [debouncedBounds]);

  return { memories, loading };
}
