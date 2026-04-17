import type { Memory, MemoryType } from '../lib/memories'
import { TYPE_CONFIG, TypePill } from './TypePill'

const FILTER_ORDER: (MemoryType | 'all')[] = ['all', 'trail', 'summit', 'park', 'beach', 'urban']

interface FilterBarProps {
  activeFilter: MemoryType | 'all'
  onFilterChange: (value: MemoryType | 'all') => void
}

function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters = FILTER_ORDER.filter((f) => f === 'all' || f in TYPE_CONFIG)

  return (
    <div className="grid grid-cols-3 gap-1.5 px-4 py-3 border-b border-gs-border">
      {filters.map((value) => (
        <TypePill
          key={value}
          type={value}
          size="md"
          active={activeFilter === value}
          onClick={() => onFilterChange(value)}
        />
      ))}
    </div>
  )
}

interface MemoryListItemProps {
  memory: Memory
  isSelected: boolean
  isHovered: boolean
  onSelect: (memory: Memory) => void
  onHover: (id: string | null) => void
}

function MemoryListItem({ memory, isSelected, isHovered, onSelect, onHover }: MemoryListItemProps) {
  return (
    <button
      onClick={() => onSelect(memory)}
      onMouseEnter={() => onHover(memory.id)}
      onMouseLeave={() => onHover(null)}
      className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all cursor-pointer group ${
        isSelected
          ? 'bg-gs-subtle border border-gs-border shadow-sm'
          : isHovered
          ? 'bg-gs-soft'
          : 'hover:bg-gs-soft'
      }`}
    >
      <div className={`w-11 h-11 rounded-lg flex-shrink-0 overflow-hidden ${
        memory.imageUrl ? '' : 'bg-gs-subtle flex items-center justify-center text-lg'
      }`}>
        {memory.imageUrl
          ? <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
          : <span>🌿</span>
        }
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-display font-bold text-sm leading-tight truncate transition-colors ${
          isSelected || isHovered ? 'text-gs-deep' : 'text-gs-ink group-hover:text-gs-deep'
        }`}>
          {memory.title}
        </p>
        {memory.location && (
          <p className="font-body text-xs text-gs-muted mt-0.5 truncate">
            📍 {memory.location}
          </p>
        )}
      </div>
      {isSelected && (
        <div className="w-1.5 h-1.5 rounded-full bg-gs-deep flex-shrink-0" />
      )}
    </button>
  )
}

interface SidebarProps {
  memories: Memory[]
  activeFilter: MemoryType | 'all'
  onFilterChange: (value: MemoryType | 'all') => void
  onSelectMemory: (memory: Memory) => void
  selectedId: string | null
  hoveredId: string | null
  onHoverMemory: (id: string | null) => void
}

export default function Sidebar({
  memories,
  activeFilter,
  onFilterChange,
  onSelectMemory,
  selectedId,
  hoveredId,
  onHoverMemory,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex w-72 flex-shrink-0 flex-col overflow-hidden border-r border-gs-border bg-gs-surface">

      <FilterBar activeFilter={activeFilter} onFilterChange={onFilterChange} />

      <div className="flex-1 overflow-y-auto p-2">
        {memories.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-body text-sm text-gs-muted">
              {activeFilter === 'all' ? 'No memories yet' : `No ${activeFilter} memories`}
            </p>
          </div>
        ) : (
          memories.map((memory) => (
            <MemoryListItem
              key={memory.id}
              memory={memory}
              isSelected={selectedId === memory.id}
              isHovered={hoveredId === memory.id}
              onSelect={onSelectMemory}
              onHover={onHoverMemory}
            />
          ))
        )}
      </div>
    </aside>
  )
}
