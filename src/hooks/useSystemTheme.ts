import { useEffect, useState } from 'react'

function prefersDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useSystemTheme() {
  const [isDark, setIsDark] = useState(() => prefersDarkMode())

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = (nextIsDark: boolean) => {
      document.documentElement.classList.toggle('dark', nextIsDark)
      setIsDark(nextIsDark)
    }

    applyTheme(mediaQuery.matches)

    const onChange = (event: MediaQueryListEvent) => applyTheme(event.matches)
    mediaQuery.addEventListener('change', onChange)

    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  return { isDark }
}
