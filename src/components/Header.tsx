interface HeaderProps {
  memoryCount: number
  onAddMemory: () => void
}

export default function Header({ memoryCount, onAddMemory }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-3 bg-gs-deep dark:bg-gs-night flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-white/[0.18] dark:bg-gs-soft-dark rounded-lg flex items-center justify-center text-base flex-shrink-0">
          🌿
        </div>
        <div className="hidden sm:flex flex-col">
          <h1 className="font-display font-extrabold text-[22px] text-white leading-none tracking-[-0.03em]">
            Green Spaces
          </h1>
          <p className="font-body text-[11px] text-white/45 mt-1 leading-none tracking-[0.01em]">
            Map the places that made you love the planet
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {memoryCount > 0 && (
          <div className="flex items-center gap-1.5 bg-white/[0.12] dark:bg-gs-soft-dark border border-white/[0.18] dark:border-gs-border-dark rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 dark:bg-gs-muted-dark flex-shrink-0" />
            <span className="font-body font-semibold text-xs text-white/75 dark:text-gs-muted-dark uppercase">
              {memoryCount} {memoryCount === 1 ? ' memory' : ' memories'}
            </span>
          </div>
        )}
        <button
          onClick={onAddMemory}
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white dark:bg-gs-ink-dark dark:hover:bg-white rounded-full px-3 py-1.5 transition-all cursor-pointer uppercase"
        >
          <span className="text-xs">📍</span>
          <span className="font-body font-medium text-xs text-gs-deep sm:inline">Pin a memory</span>
        </button>
      </div>
    </header>
  )
}
