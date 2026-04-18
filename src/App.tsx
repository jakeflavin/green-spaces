import { useState, useMemo, useCallback, useEffect } from 'react'
import { useMemories } from './hooks/useMemories'
import { useSystemTheme } from './hooks/useSystemTheme'
import type { Memory, MemoryType, MapBounds } from './lib/memories'
import { TypePill } from './components/TypePill'
import { TYPE_CONFIG } from './components/typeConfig'
import Header from './components/Header'
import MapView from './components/MapView'
import type { LatLngBounds } from 'leaflet'
import Sidebar from './components/Sidebar'
import BottomSheet from './components/BottomSheet'
import Drawer from './components/Drawer'
import MemoryCard from './components/MemoryCard'
import AddMemoryPanel from './components/AddMemoryPanel'
import IntroModal from './components/IntroModal'
import { useAppHeight } from './hooks/useAppHeight'

type FilterValue = 'all' | MemoryType

const FILTER_ORDER: FilterValue[] = ['all', 'trail', 'summit', 'park', 'beach', 'urban']

export default function App() {
  const { isDark } = useSystemTheme()
  useAppHeight()
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('gs-intro-seen'))
  const [isAddingMemory, setIsAddingMemory] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')
  const [isListOpen, setIsListOpen] = useState(false)
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const { memories, loading } = useMemories(mapBounds)

  const handleBoundsChange = useCallback((b: LatLngBounds) => {
    setMapBounds({
      south: b.getSouth(),
      north: b.getNorth(),
      west: b.getWest(),
      east: b.getEast(),
    })
  }, [])
  const handleHoverMemory = useCallback((id: string | null) => setHoveredId(id), [])

  const filteredMemories = useMemo(
    () => activeFilter === 'all' ? memories : memories.filter((m) => m.type === activeFilter),
    [memories, activeFilter],
  )
  const hasActivePanel = isAddingMemory || selectedMemory !== null
  const mobileSheetOpen = isListOpen || hasActivePanel

  // Keep the theme-color meta tag in sync with the backdrop state so the
  // iOS status bar colour doesn't mismatch when the bottom sheet is open.
  useEffect(() => {
    const lightColor = mobileSheetOpen ? '#3a4d44' : '#4a6358'
    const darkColor  = mobileSheetOpen ? '#1c2722' : '#0f1714'
    const color = isDark ? darkColor : lightColor
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((el) => { el.content = color })
  }, [mobileSheetOpen, isDark])

  function handleSelectMemory(memory: Memory) {
    setSelectedMemory(memory)
    setIsAddingMemory(false)
    setIsListOpen(false)
  }

  function handleAddMemory() {
    setIsListOpen(false)
    setIsAddingMemory(true)
    setSelectedMemory(null)
  }

  function handleCloseIntro() {
    localStorage.setItem('gs-intro-seen', '1')
    setShowIntro(false)
  }

  function handleClosePanel() {
    setSelectedMemory(null)
    setIsAddingMemory(false)
  }

  return (
    <div
      className="fixed inset-x-0 top-0 flex flex-col bg-gs-deep dark:bg-gs-night transition-colors overflow-hidden"
      style={{ height: 'var(--app-height, 100dvh)' }}
    >
      <Header onAddMemory={handleAddMemory} />

      {/* Main content row: sidebar + map + right drawer */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 z-[450] flex items-center justify-center bg-white/85 dark:bg-gs-night/85 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 bg-gs-deep dark:bg-gs-soft-dark rounded-2xl flex items-center justify-center text-xl animate-pulse">
                🌿
              </div>
              <p className="font-display font-bold text-sm text-gs-deep dark:text-gs-ink-dark">Loading memories…</p>
            </div>
          </div>
        )}
        <Sidebar
          memories={filteredMemories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onSelectMemory={handleSelectMemory}
          selectedId={selectedMemory?.id ?? null}
          hoveredId={hoveredId}
          onHoverMemory={handleHoverMemory}
        />
        <MapView
          isDark={isDark}
          memories={filteredMemories}
          onSelectMemory={handleSelectMemory}
          flyTarget={selectedMemory}
          onBoundsChange={handleBoundsChange}
          hoveredId={hoveredId}
          onHoverMemory={handleHoverMemory}
        />
        {/* Desktop right panel — sits alongside the map, no overlay */}
        <Drawer open={hasActivePanel} onClose={handleClosePanel}>
          {selectedMemory && (
            <MemoryCard memory={selectedMemory} />
          )}
          {isAddingMemory && (
            <AddMemoryPanel
              isDark={isDark}
              onSaved={handleClosePanel}
            />
          )}
        </Drawer>
      </div>

      {/* Mobile: floating button to open memory list */}
      {!hasActivePanel && !showIntro && (
        <button
          onClick={() => setIsListOpen(true)}
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-gs-deep dark:bg-gs-soft-dark text-white dark:text-gs-ink-dark px-5 py-3 rounded-full shadow-lg cursor-pointer active:scale-95 transition-transform"
        >
          <span className="font-body text-sm">☰</span>
          <span className="font-body font-semibold text-sm">
            {filteredMemories.length} {filteredMemories.length === 1 ? 'memory' : 'memories'} in view
          </span>
        </button>
      )}

      {/* Mobile: memory list bottom sheet */}
      <BottomSheet open={isListOpen && !hasActivePanel} onClose={() => setIsListOpen(false)}>
        <div className="grid grid-cols-3 gap-1.5 px-3 py-2.5 border-b border-gs-border dark:border-gs-border-dark">
          {FILTER_ORDER.map((type) => (
            <TypePill
              key={type}
              type={type}
              size="md"
              active={activeFilter === type}
              onClick={() => setActiveFilter(type)}
            />
          ))}
        </div>
        <div className="p-2 pb-6">
          {filteredMemories.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-gs-subtle dark:bg-gs-subtle-dark rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🗺️</div>
              <p className="font-display font-bold text-sm text-gs-ink dark:text-gs-ink-dark">
                {memories.length === 0 ? 'No memories yet' : 'None in this area'}
              </p>
              <p className="font-body text-xs text-gs-muted dark:text-gs-muted-dark mt-1 leading-relaxed">
                {memories.length === 0 ? 'Click anywhere on the map to pin your first memory' : 'Pan or zoom out to find more'}
              </p>
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <button
                key={memory.id}
                onClick={() => handleSelectMemory(memory)}
                className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all cursor-pointer group hover:bg-gs-soft dark:hover:bg-gs-soft-dark"
              >
                <div className={`w-11 h-11 rounded-lg flex-shrink-0 overflow-hidden ${
                  memory.imageUrl ? '' : 'bg-gs-subtle dark:bg-gs-subtle-dark flex items-center justify-center text-lg'
                }`}>
                  {memory.imageUrl
                    ? <img src={memory.imageUrl} alt={memory.location ?? TYPE_CONFIG[memory.type].label} className="w-full h-full object-cover" />
                    : <span>🌿</span>
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-sm leading-tight truncate text-gs-ink dark:text-gs-ink-dark group-hover:text-gs-deep dark:group-hover:text-gs-ink-dark transition-colors">
                    {memory.location ?? TYPE_CONFIG[memory.type].label}
                  </p>
                  {memory.location && (
                    <p className="font-body text-xs text-gs-muted dark:text-gs-muted-dark mt-0.5 truncate">📍 {memory.location}</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </BottomSheet>

      {/* Mobile: detail / add-form bottom sheet */}
      <BottomSheet open={hasActivePanel} onClose={handleClosePanel}>
        {selectedMemory && (
          <MemoryCard memory={selectedMemory} />
        )}
        {isAddingMemory && (
          <AddMemoryPanel
            isDark={isDark}
            onSaved={handleClosePanel}
          />
        )}
      </BottomSheet>

      {showIntro && <IntroModal onClose={handleCloseIntro} />}
    </div>
  )
}
