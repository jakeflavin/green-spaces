import { useRef, useState } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function BottomSheet({ open, onClose, children }: BottomSheetProps) {
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
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[1100] bg-gs-surface dark:bg-gs-surface-dark rounded-t-2xl shadow-modal flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={dragY > 0 ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gs-border dark:bg-gs-border-dark" />
        </div>
        {/* Scrollable content */}
        <div ref={contentRef} className="overflow-y-auto max-h-[72vh]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {children}
        </div>
      </div>
    </>
  )
}
