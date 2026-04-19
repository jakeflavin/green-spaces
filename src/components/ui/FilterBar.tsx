import type { MemoryType, FilterValue } from '../../types/memory'
import { TypePill } from './TypePill'

const FILTER_ORDER: (MemoryType | 'all')[] = ['all', 'trail', 'summit', 'park', 'beach', 'urban']

interface FilterBarProps {
  activeFilter: FilterValue
  onFilterChange: (value: FilterValue) => void
  className?: string
}

export function FilterBar({ activeFilter, onFilterChange, className = 'grid grid-cols-3 gap-1.5 px-3 py-5' }: FilterBarProps) {
  return (
    <div className={className}>
      {FILTER_ORDER.map((value) => (
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
