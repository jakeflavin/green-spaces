interface DrawerProps {
  open: boolean
  onClose?: () => void
  children: React.ReactNode
}

export default function Drawer({ open, onClose, children }: DrawerProps) {
  return (
    <div
      className={`hidden md:flex flex-col flex-shrink-0 bg-gs-panel dark:bg-gs-surface-dark shadow-sidebar-l dark:shadow-[-4px_0_16px_rgba(0,0,0,0.40)] z-10 overflow-hidden transition-[width] duration-300 ease-out ${
        open ? 'w-80' : 'w-0'
      }`}
    >
      {/* Fixed-width inner container so content doesn't reflow during animation */}
      <div className="w-80 flex-1 overflow-y-auto">
        {children}
      </div>

      {onClose && (
        <div className="w-80 flex-shrink-0">
          <div className="w-[90%] mx-auto border-t border-gs-border dark:border-gs-border-dark" />
          <div className="h-10 flex items-center px-3.5">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gs-muted dark:text-gs-muted-dark hover:text-gs-ink dark:hover:text-gs-ink-dark transition-colors cursor-pointer text-sm"
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
