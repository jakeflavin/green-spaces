import type { Memory } from '../lib/memories'
import MemoryCard from './MemoryCard'

interface MemoryDetailOverlayProps {
  memory: Memory
  onClose: () => void
}

export default function MemoryDetailOverlay({ memory, onClose }: MemoryDetailOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-0 sm:p-6 bg-gs-ink/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative bg-white sm:rounded-2xl max-w-lg w-full max-h-[100dvh] sm:max-h-[85vh] overflow-y-auto shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-gs-soft hover:bg-gs-subtle border border-gs-border rounded-full flex items-center justify-center text-gs-muted hover:text-gs-ink transition-all cursor-pointer text-sm font-body font-medium"
          aria-label="Close"
        >
          ✕
        </button>
        <MemoryCard memory={memory} />
      </div>
    </div>
  )
}
