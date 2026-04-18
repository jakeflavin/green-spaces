interface DrawerProps {
  open: boolean
  children: React.ReactNode
}

export default function Drawer({ open, children }: DrawerProps) {
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
    </div>
  )
}
