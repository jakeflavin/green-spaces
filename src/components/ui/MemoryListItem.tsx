import type { Memory } from '../../types/memory'
import { TYPE_CONFIG } from '../theme/typeConfig'

interface MemoryListItemProps {
  memory: Memory
  onSelect: (memory: Memory) => void
  isSelected?: boolean
  isHovered?: boolean
  onHover?: (id: string | null) => void
}

export function MemoryListItem({
  memory,
  onSelect,
  isSelected = false,
  isHovered = false,
  onHover,
}: MemoryListItemProps) {
  return (
    <button
      onClick={() => onSelect(memory)}
      onMouseEnter={onHover ? () => onHover(memory.id) : undefined}
      onMouseLeave={onHover ? () => onHover(null) : undefined}
      className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all cursor-pointer group ${
        isSelected
          ? 'bg-gs-deep/[0.18] dark:bg-gs-subtle-dark border border-gs-deep/[0.22] dark:border-gs-border-dark shadow-sm'
          : isHovered
          ? 'bg-gs-deep/[0.10] dark:bg-gs-soft-dark'
          : 'hover:bg-gs-deep/[0.10] dark:hover:bg-gs-soft-dark'
      }`}
    >
      <div className={`w-11 h-11 rounded-md flex-shrink-0 overflow-hidden ${
        memory.imageUrl ? '' : 'bg-gs-subtle dark:bg-gs-subtle-dark flex items-center justify-center text-lg'
      }`}>
        {memory.imageUrl
          ? <img src={memory.imageUrl} alt={memory.location ?? TYPE_CONFIG[memory.type].label} className="w-full h-full object-cover" />
          : <span>🌿</span>
        }
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-display font-bold text-sm leading-tight truncate transition-colors ${
          isSelected || isHovered
            ? 'text-gs-deep dark:text-gs-ink-dark'
            : 'text-gs-ink dark:text-gs-ink-dark group-hover:text-gs-deep dark:group-hover:text-gs-ink-dark'
        }`}>
          {memory.location ?? TYPE_CONFIG[memory.type].label}
        </p>
        {memory.location && (
          <p className="font-body text-xs text-gs-muted dark:text-gs-muted-dark mt-0.5 truncate">
            📍 {memory.location}
          </p>
        )}
      </div>
      {isSelected && (
        <div className="w-1.5 h-1.5 rounded-full bg-gs-deep dark:bg-gs-ink-dark flex-shrink-0" />
      )}
    </button>
  )
}
