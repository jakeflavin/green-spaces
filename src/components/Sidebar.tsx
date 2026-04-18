import { useState } from 'react'
import type { Memory, MemoryType } from '../lib/memories'
import { TypePill } from './TypePill'
import { TYPE_CONFIG } from './typeConfig'

const FILTER_ORDER: (MemoryType | 'all')[] = ['all', 'trail', 'summit', 'park', 'beach', 'urban']

interface FilterBarProps {
  activeFilter: MemoryType | 'all'
  onFilterChange: (value: MemoryType | 'all') => void
}

function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters = FILTER_ORDER.filter((f) => f === 'all' || f in TYPE_CONFIG)

  return (
    <div className="grid grid-cols-3 gap-1.5 px-3 py-5">
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
          ? <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover" />
          : <span>🌿</span>
        }
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-display font-bold text-sm leading-tight truncate transition-colors ${
          isSelected || isHovered
            ? 'text-gs-deep dark:text-gs-ink-dark'
            : 'text-gs-ink dark:text-gs-ink-dark group-hover:text-gs-deep dark:group-hover:text-gs-ink-dark'
        }`}>
          {memory.title}
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
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`hidden md:flex flex-shrink-0 flex-col overflow-hidden relative bg-gs-panel dark:bg-gs-surface-dark shadow-sidebar-r dark:shadow-[4px_0_16px_rgba(0,0,0,0.40)] z-10 transition-[width] duration-300 ease-out ${
        collapsed ? 'w-12' : 'w-72'
      }`}
    >
      {/* Content — fades out when collapsed so nothing is visible in the narrow strip */}
      <div className={`w-72 flex-1 flex flex-col overflow-hidden min-h-0 transition-opacity duration-200 ${
        collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <FilterBar activeFilter={activeFilter} onFilterChange={onFilterChange} />
        <div className="w-[90%] mx-auto border-t border-gs-border dark:border-gs-border-dark" />
        <div className="flex-1 overflow-y-auto p-2">
          {memories.length === 0 ? (
            <div className="p-6 text-center">
              <p className="font-body text-sm text-gs-muted dark:text-gs-muted-dark">
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
      </div>

      {/* Footer — credit text (hidden when collapsed) + collapse button (always visible) */}
      <div className="w-[90%] mx-auto border-t border-gs-border dark:border-gs-border-dark" />
      <div className="w-72 flex-shrink-0 flex items-center pl-3.5 pr-12 py-3">
        <p className={`font-body text-xs text-gs-muted dark:text-gs-muted-dark transition-opacity duration-200 ${
          collapsed ? 'opacity-0' : 'opacity-100'
        }`}>
          made with ❤️ by jake flavin
        </p>
      </div>
      {/* Button pinned to bottom-right of the aside — stays within w-12 when collapsed */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gs-soft dark:hover:bg-gs-soft-dark transition-colors cursor-pointer group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-gs-muted dark:text-gs-muted-dark group-hover:text-gs-ink dark:group-hover:text-gs-ink-dark transition-all duration-300 ${
            collapsed ? 'rotate-0' : 'rotate-180'
          }`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </aside>
  )
}
