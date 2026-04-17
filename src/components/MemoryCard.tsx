import type { Memory } from '../lib/memories'
import { TypePill } from './TypePill'

interface MemoryCardProps {
  memory: Memory
  compact?: boolean
}

export default function MemoryCard({ memory, compact = false }: MemoryCardProps) {
  if (compact) {
    return (
      <div className="flex gap-3 p-3 bg-white font-body">
        {memory.imageUrl && (
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="min-w-0">
          <TypePill type={memory.type} size="sm" />
          <p className="font-display font-bold text-sm text-gs-ink mt-1 leading-tight">
            {memory.title}
          </p>
        </div>
      </div>
    )
  }

  const formattedDate = memory.date
    ? new Date(memory.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="font-body bg-white">
      {memory.imageUrl && (
        <img
          src={memory.imageUrl}
          alt={memory.title}
          className="w-full h-52 object-cover"
        />
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 flex-wrap">
          <TypePill type={memory.type} size="sm" />
          {formattedDate && (
            <span className="font-body text-xs text-gs-muted">{formattedDate}</span>
          )}
        </div>
        <h2 className="font-display font-bold text-2xl text-gs-ink mt-2 leading-tight">
          {memory.title}
        </h2>
        {memory.location && (
          <p className="font-body text-sm text-gs-muted mt-1">📍 {memory.location}</p>
        )}
        <p className="font-body text-sm text-gs-ink/80 leading-relaxed mt-3">{memory.story}</p>
        {memory.author && (
          <div className="mt-4 pt-4 border-t border-gs-border flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gs-subtle flex items-center justify-center text-xs">
              👤
            </div>
            <span className="font-body text-xs text-gs-muted">{memory.author}</span>
          </div>
        )}
      </div>
    </div>
  )
}
