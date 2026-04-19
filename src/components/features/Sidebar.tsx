import { useState } from 'react'
import type { Memory, FilterValue } from '../../types/memory'
import { FilterBar } from '../ui/FilterBar'
import { MemoryListItem } from '../ui/MemoryListItem'

interface SidebarProps {
  memories: Memory[]
  activeFilter: FilterValue
  onFilterChange: (value: FilterValue) => void
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
                onSelect={onSelectMemory}
                isSelected={selectedId === memory.id}
                isHovered={hoveredId === memory.id}
                onHover={onHoverMemory}
              />
            ))
          )}
        </div>
      </div>

      <div className="w-[90%] mx-auto border-t border-gs-border dark:border-gs-border-dark" />
      <div className="w-72 flex-shrink-0 h-10 flex items-center justify-center px-3.5">
        <p className={`font-body text-xs text-gs-muted dark:text-gs-muted-dark transition-opacity duration-200 ${
          collapsed ? 'opacity-0' : 'opacity-100'
        }`}>
          made with ❤ by jake flavin
        </p>
      </div>
      <button
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute bottom-1 right-1 w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer group"
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
