interface HeaderProps {
  memoryCount: number
  onAddMemory: () => void
}

export default function Header({ memoryCount, onAddMemory }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-3 bg-gs-deep flex-shrink-0 border-b border-gs-border/40">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-white/[0.18] rounded-lg flex items-center justify-center text-base flex-shrink-0">
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
          <div className="flex items-center gap-1.5 bg-white/[0.12] border border-white/[0.18] rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
            <span className="font-body font-semibold text-xs text-white/75 uppercase">
              {memoryCount}
              <span className="hidden sm:inline">{memoryCount === 1 ? ' memory' : ' memories'}</span>
            </span>
          </div>
        )}
        <button
          onClick={onAddMemory}
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white rounded-full px-3 py-1.5 transition-all cursor-pointer uppercase"
        >
          <span className="text-xs">📍</span>
          <span className="font-body font-medium text-xs text-gs-deep hidden sm:inline">Pin a memory</span>
        </button>
      </div>
    </header>
  )
}
