import type { MemoryType } from '../lib/memories'
import { TYPE_CONFIG } from './typeConfig'

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
  const activeClasses = 'bg-gs-deep dark:bg-gs-deep text-white dark:text-white shadow-sm'
  const inactiveClasses = 'bg-gs-soft dark:bg-gs-soft-dark text-gs-muted dark:text-gs-muted-dark hover:bg-gs-subtle dark:hover:bg-gs-subtle-dark hover:text-gs-deep dark:hover:text-gs-ink-dark'

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
