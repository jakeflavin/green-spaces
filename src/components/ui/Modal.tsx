import type { ReactNode } from 'react'

interface ModalProps {
  onClose: () => void
  children: ReactNode
}

export default function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-gs-ink/70 dark:bg-gs-night/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full bg-white dark:bg-gs-surface-dark rounded-2xl shadow-modal overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
