import { useState, useMemo, useRef, useCallback } from 'react'
import { useMemories } from './hooks/useMemories'
import type { Memory, MemoryType } from './lib/memories'
import { TypePill } from './components/TypePill'
import Header from './components/Header'
import MapView, { type LatLngBounds } from './components/MapView'
import Sidebar from './components/Sidebar'
import MemoryDetailOverlay from './components/MemoryDetailOverlay'
import AddMemoryModal from './components/AddMemoryModal'
import './App.css'

type FilterValue = 'all' | MemoryType

const FILTER_ORDER: FilterValue[] = ['all', 'trail', 'summit', 'park', 'beach', 'urban']

function BottomSheet({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const [dragY, setDragY] = useState(0)
  const startYRef = useRef(0)
  const isDraggingRef = useRef(false)
  const contentRef = useRef<HTMLDivElement>(null)

  function onTouchStart(e: React.TouchEvent) {
    if ((contentRef.current?.scrollTop ?? 0) > 5) return
    startYRef.current = e.touches[0].clientY
    isDraggingRef.current = true
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!isDraggingRef.current) return
    const delta = e.touches[0].clientY - startYRef.current
    if (delta > 0) setDragY(delta)
  }

  function onTouchEnd() {
    if (isDraggingRef.current && dragY > 80) onClose()
    isDraggingRef.current = false
    setDragY(0)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-[999] bg-gs-ink/50 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[1100] bg-gs-surface rounded-t-2xl shadow-modal flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={dragY > 0 ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gs-border" />
        </div>
        {/* Scrollable content */}
        <div ref={contentRef} className="overflow-y-auto max-h-[72vh]">
          {children}
        </div>
      </div>
    </>
  )
}

export default function App() {
  const { memories, loading } = useMemories()
  const [isAddingMemory, setIsAddingMemory] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')
  const [isListOpen, setIsListOpen] = useState(false)
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const handleBoundsChange = useCallback((b: LatLngBounds) => setMapBounds(b), [])
  const handleHoverMemory = useCallback((id: string | null) => setHoveredId(id), [])

  const filteredMemories = useMemo(
    () => activeFilter === 'all' ? memories : memories.filter((m) => m.type === activeFilter),
    [memories, activeFilter],
  )

  const visibleMemories = useMemo(
    () => mapBounds ? filteredMemories.filter((m) => mapBounds.contains([m.lat, m.lng])) : filteredMemories,
    [filteredMemories, mapBounds],
  )

  function handleSelectMemory(memory: Memory) {
    setSelectedMemory(memory)
    setIsAddingMemory(false)
    setIsListOpen(false)
  }

  function handleAddMemory() {
    setIsAddingMemory(true)
    setSelectedMemory(null)
  }

  return (
    <div className="flex flex-col h-screen bg-gs-deep">
      <Header memoryCount={memories.length} onAddMemory={handleAddMemory} />
      <div className="flex-1 flex overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 z-[450] flex items-center justify-center bg-white/85 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 bg-gs-deep rounded-2xl flex items-center justify-center text-xl animate-pulse">
                🌿
              </div>
              <p className="font-display font-bold text-sm text-gs-deep">Loading memories…</p>
            </div>
          </div>
        )}
        <Sidebar
          memories={visibleMemories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onSelectMemory={handleSelectMemory}
          selectedId={selectedMemory?.id ?? null}
          hoveredId={hoveredId}
          onHoverMemory={handleHoverMemory}
        />
        <MapView
          memories={filteredMemories}
          onSelectMemory={handleSelectMemory}
          flyTarget={selectedMemory}
          onBoundsChange={handleBoundsChange}
          hoveredId={hoveredId}
          onHoverMemory={handleHoverMemory}
        />
      </div>

      {/* Mobile: floating button to open sheet */}
      <button
        onClick={() => setIsListOpen(true)}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-gs-deep text-white px-5 py-3 rounded-full shadow-lg cursor-pointer active:scale-95 transition-transform"
      >
        <span className="font-body text-sm">☰</span>
        <span className="font-body font-semibold text-sm">
          {visibleMemories.length} {visibleMemories.length === 1 ? 'memory' : 'memories'} in view
        </span>
      </button>

      {/* Mobile: bottom sheet */}
      <BottomSheet open={isListOpen} onClose={() => setIsListOpen(false)}>
        {/* Filter pills */}
        <div className="grid grid-cols-3 gap-1.5 px-3 py-2.5 border-b border-gs-border">
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
        {/* Memory list */}
        <div className="p-2 pb-6">
          {visibleMemories.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-gs-subtle rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🗺️</div>
              <p className="font-display font-bold text-sm text-gs-ink">
                {memories.length === 0 ? 'No memories yet' : 'None in this area'}
              </p>
              <p className="font-body text-xs text-gs-muted mt-1 leading-relaxed">
                {memories.length === 0 ? 'Click anywhere on the map to pin your first memory' : 'Pan or zoom out to find more'}
              </p>
            </div>
          ) : (
            visibleMemories.map((memory) => (
              <button
                key={memory.id}
                onClick={() => handleSelectMemory(memory)}
                className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all cursor-pointer group hover:bg-gs-soft"
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
                  <p className="font-display font-bold text-sm leading-tight truncate text-gs-ink group-hover:text-gs-deep transition-colors">
                    {memory.title}
                  </p>
                  {memory.location && (
                    <p className="font-body text-xs text-gs-muted mt-0.5 truncate">📍 {memory.location}</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </BottomSheet>

      {selectedMemory && (
        <MemoryDetailOverlay
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}
      {isAddingMemory && (
        <AddMemoryModal
          onClose={() => setIsAddingMemory(false)}
          onSaved={() => setIsAddingMemory(false)}
        />
      )}
    </div>
  )
}
