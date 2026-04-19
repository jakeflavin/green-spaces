import type { Memory } from '../../types/memory'
import { TypePill } from '../ui/TypePill'
import { TYPE_CONFIG } from '../theme/typeConfig'

const URL_REGEX = /(https?:\/\/[^\s]+)/g

function StoryText({ text }: { text: string }) {
  const parts = text.split(URL_REGEX)
  return (
    <>
      {parts.map((part, i) =>
        URL_REGEX.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gs-deep dark:text-gs-deep-dark underline underline-offset-2 break-all"
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
    </>
  )
}

interface MemoryCardProps {
  memory: Memory
  compact?: boolean
}

export default function MemoryCard({ memory, compact = false }: MemoryCardProps) {
  if (compact) {
    return (
      <div className="flex gap-2 p-2.5 bg-white dark:bg-gs-surface-dark font-body w-[220px]">
        {memory.imageUrl && (
          <img
            src={memory.imageUrl}
            alt={memory.location ?? TYPE_CONFIG[memory.type].label}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex mb-1">
            <TypePill type={memory.type} size="sm" />
          </div>
          <p className="m-0 font-display font-bold text-sm text-gs-ink dark:text-gs-ink-dark leading-tight line-clamp-3">
            {memory.location ?? TYPE_CONFIG[memory.type].label}
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
    <div className="font-body pt-4">
      {memory.imageUrl && (
        <div className="flex items-center justify-center">
          <img
            src={memory.imageUrl}
            alt={memory.location ?? TYPE_CONFIG[memory.type].label}
            className="w-[90%] h-52 object-cover rounded-md"
          />
        </div>
      )}
              <div className="p-5">
                  <div className="flex items-center gap-2 flex-wrap">
                      <TypePill type={memory.type} size="sm"/>
                      {formattedDate && (
                          <span
                              className="font-body text-xs text-gs-muted dark:text-gs-muted-dark">{formattedDate}</span>
                      )}
                  </div>
                  <h2 className="font-display font-bold text-2xl text-gs-ink dark:text-gs-ink-dark mt-2 leading-tight">
                      {memory.location ?? TYPE_CONFIG[memory.type].label}
                  </h2>
                  <p className="font-body text-sm text-gs-ink/80 dark:text-gs-muted-dark leading-relaxed mt-3"><StoryText text={memory.story} /></p>
                  {memory.author && (
                      <div
                          className="mt-4 pt-4 flex items-center gap-2">
                          <div
                              className="w-6 h-6 rounded-full bg-gs-subtle dark:bg-gs-subtle-dark flex items-center justify-center text-xs">
                              👤
                          </div>
                          <span
                              className="font-body text-xs text-gs-muted dark:text-gs-muted-dark">{memory.author}</span>
                      </div>
                  )}
              </div>
          </div>
      )
      }
