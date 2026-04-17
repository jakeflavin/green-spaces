import { useState, useEffect } from 'react';
import { subscribeToMemories, type Memory } from '../lib/memories';

export type { MemoryType } from '../lib/memories';

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMemories((liveDocs) => {
      setMemories(liveDocs);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { memories, loading };
}
