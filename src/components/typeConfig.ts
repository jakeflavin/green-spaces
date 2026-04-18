import type { MemoryType } from '../lib/memories'

export const TYPE_CONFIG: Record<MemoryType | 'all', { label: string; emoji: string; bgClass: string; textClass: string }> = {
  all:    { label: 'All',    emoji: '🗺️', bgClass: 'bg-gs-soft',   textClass: 'text-gs-muted' },
  trail:  { label: 'Trail',  emoji: '🥾', bgClass: 'bg-gs-trail',  textClass: 'text-gs-trail-text' },
  summit: { label: 'Summit', emoji: '⛰️', bgClass: 'bg-gs-summit', textClass: 'text-gs-summit-text' },
  park:   { label: 'Park',   emoji: '🌳', bgClass: 'bg-gs-park',   textClass: 'text-gs-park-text' },
  beach:  { label: 'Beach',  emoji: '🌊', bgClass: 'bg-gs-beach',  textClass: 'text-gs-beach-text' },
  urban:  { label: 'Urban',  emoji: '🏙️', bgClass: 'bg-gs-urban',  textClass: 'text-gs-urban-text' },
}
