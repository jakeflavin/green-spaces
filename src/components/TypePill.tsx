import type { MemoryType } from '../lib/memories'

export const TYPE_CONFIG: Record<MemoryType | 'all', { label: string; emoji: string; bgClass: string; textClass: string }> = {
  all:    { label: 'All',    emoji: '🗺️', bgClass: 'bg-gs-soft',   textClass: 'text-gs-muted' },
  trail:  { label: 'Trail',  emoji: '🥾', bgClass: 'bg-gs-trail',  textClass: 'text-gs-trail-text' },
  summit: { label: 'Summit', emoji: '⛰️', bgClass: 'bg-gs-summit', textClass: 'text-gs-summit-text' },
  park:   { label: 'Park',   emoji: '🌳', bgClass: 'bg-gs-park',   textClass: 'text-gs-park-text' },
  beach:  { label: 'Beach',  emoji: '🌊', bgClass: 'bg-gs-beach',  textClass: 'text-gs-beach-text' },
  urban:  { label: 'Urban',  emoji: '🏙️', bgClass: 'bg-gs-urban',  textClass: 'text-gs-urban-text' },
}

interface TypePillProps {
  type: MemoryType | 'all'
  size: 'sm' | 'md'
  active?: boolean
  onClick?: () => void
}

export function TypePill({ type, size, active = false, onClick }: TypePillProps) {
  const { label, emoji, bgClass, textClass } = TYPE_CONFIG[type]

  if (size === 'sm') {
    return (
      <span className={`${bgClass} ${textClass} inline-flex items-center gap-1 font-body font-semibold text-[10px] px-2 py-0.5 rounded-full`}>
        <span aria-hidden="true">{emoji}</span>
        <span>{label}</span>
      </span>
    )
  }

  // size === 'md'
  const activeClasses = 'bg-gs-deep text-white/90 shadow-sm'
  const inactiveClasses = 'bg-gs-soft text-gs-muted hover:bg-gs-subtle hover:text-gs-deep'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 w-full justify-center cursor-pointer font-body font-medium text-[11px] px-2.5 py-1 rounded-full transition-all ${active ? activeClasses : inactiveClasses}`}
    >
      <span aria-hidden="true">{emoji}</span>
      <span>{label}</span>
    </button>
  )
}
