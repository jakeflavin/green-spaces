import Modal from '../ui/Modal'

interface IntroModalProps {
  onClose: () => void
}

export default function IntroModal({ onClose }: IntroModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <div className="w-12 h-12 bg-gs-subtle dark:bg-gs-subtle-dark rounded-2xl flex items-center justify-center text-2xl mb-4">
          🌿
        </div>
        <h2 className="font-display font-bold text-2xl text-gs-ink dark:text-gs-ink-dark leading-tight">
          Green Spaces
        </h2>
        <p className="font-body text-sm text-gs-muted dark:text-gs-muted-dark mt-1 mb-4">
          A community memory map for natural spaces
        </p>
        <p className="font-body text-sm text-gs-ink/80 dark:text-gs-muted-dark leading-relaxed">
          Pin your favourite trails, summits, parks, beaches, and urban green spaces on the world map. Attach a photo and share the story of why this place matters to you.
        </p>
        <p className="font-body text-sm text-gs-ink/80 dark:text-gs-muted-dark leading-relaxed mt-3">
          Contributions are anonymous — no account needed.
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full font-body font-semibold text-sm text-white bg-gs-deep hover:bg-gs-ink dark:hover:bg-gs-soft-dark dark:hover:text-gs-ink-dark px-5 py-3 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          Explore the map →
        </button>
      </div>
    </Modal>
  )
}
