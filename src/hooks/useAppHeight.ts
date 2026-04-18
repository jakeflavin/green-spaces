import { useEffect } from 'react'

export function useAppHeight() {
  useEffect(() => {
    function update() {
      document.documentElement.style.setProperty(
        '--app-height',
        `${window.innerHeight}px`,
      )
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
}
