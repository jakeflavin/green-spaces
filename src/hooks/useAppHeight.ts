import { useEffect } from 'react'

export function useAppHeight() {
  useEffect(() => {
    function update() {
      // visualViewport.height is the definitive visual viewport height on iOS
      // Safari — it correctly excludes the browser toolbar and safe areas.
      // Falls back to innerHeight on browsers without the Visual Viewport API.
      const h = window.visualViewport?.height ?? window.innerHeight
      document.documentElement.style.setProperty('--app-height', `${h}px`)
    }

    update()

    // visualViewport fires its own resize when the iOS toolbar shows/hides;
    // window resize catches orientation changes and desktop resizing.
    window.visualViewport?.addEventListener('resize', update)
    window.addEventListener('resize', update)

    return () => {
      window.visualViewport?.removeEventListener('resize', update)
      window.removeEventListener('resize', update)
    }
  }, [])
}
