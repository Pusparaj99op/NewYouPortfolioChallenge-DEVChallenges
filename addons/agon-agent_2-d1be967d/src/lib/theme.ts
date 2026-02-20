export type ThemeMode = 'dark' | 'light'

const KEY = 'hx2_theme'

export function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem(KEY)
  if (saved === 'light' || saved === 'dark') return saved
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)')?.matches
  return prefersLight ? 'light' : 'dark'
}

export function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode
  localStorage.setItem(KEY, mode)
}

export function toggleTheme(): ThemeMode {
  const current = (document.documentElement.dataset.theme as ThemeMode) || 'dark'
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  return next
}
