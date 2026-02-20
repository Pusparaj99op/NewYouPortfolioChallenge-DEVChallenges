import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Badge } from './ui'
import { cn } from '../lib/utils'
import { Code2, Gavel, LayoutDashboard, Shield, Sparkles, LogOut, LogIn, Moon, Sun } from 'lucide-react'
import { getSession, getSessionCached, signOut } from '../lib/auth'
import { getInitialTheme, toggleTheme, type ThemeMode } from '../lib/theme'

const nav = [
  { to: '/', label: 'Landing', icon: Sparkles },
  { to: '/overview', label: 'Overview', icon: Sparkles },
  { to: '/register', label: 'Register', icon: Code2 },
  { to: '/payment', label: 'Payment', icon: LayoutDashboard },
  { to: '/login', label: 'Login', icon: Code2 },
  { to: '/team', label: 'Team', icon: Code2 },
  { to: '/select', label: 'Select PS', icon: LayoutDashboard },
  { to: '/dashboard', label: 'Sprint Dashboard', icon: LayoutDashboard },
  { to: '/judge', label: 'Judge', icon: Gavel },
  { to: '/admin', label: 'Admin', icon: Shield },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [session, setSession] = useState(() => getSessionCached())
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme())

  useEffect(() => {
    let mounted = true
    getSession()
      .then((s) => {
        if (!mounted) return
        setSession(s)
      })
      .catch(() => {
        if (!mounted) return
        setSession(null)
      })
    return () => {
      mounted = false
    }
  }, [location.pathname])

  return (
    <div className="min-h-dvh bg-[var(--hx-bg)] text-[color:var(--hx-text)]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--hx-purple)]/18 blur-3xl" />
        <div className="absolute -bottom-40 left-10 h-[520px] w-[520px] rounded-full bg-[color:var(--hx-cyan)]/12 blur-3xl" />
        <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[color:var(--hx-purple)]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:18px_18px] opacity-40" />
      </div>

      <header className="sticky top-0 z-30 border-b border-[var(--hx-border)] bg-[color:var(--hx-bg)]/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--hx-surface)] border border-[var(--hx-border)]">
              <Sparkles className="h-5 w-5 text-[color:var(--hx-cyan)]" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight">HACKTHONIX 2.0</span>
                <Badge variant="soft">Ship before Sunset</Badge>
              </div>
              <p className="text-xs text-[color:var(--hx-muted2)]">Coding Club • KDK College of Engineering, Nagpur</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const next = toggleTheme()
                setTheme(next)
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2 text-xs font-semibold text-[color:var(--hx-muted)] hover:bg-white/10"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>

            {session ? (
              <button
                onClick={async () => {
                  await signOut()
                  setSession(null)
                  if (location.pathname === '/dashboard') navigate('/login')
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2 text-xs font-semibold text-[color:var(--hx-muted)] hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" /> {session.teamName}
              </button>
            ) : (
              <NavLink
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--hx-border)] bg-[var(--hx-surface)] px-3 py-2 text-xs font-semibold text-[color:var(--hx-muted)] hover:bg-white/10"
              >
                <LogIn className="h-4 w-4" /> Team login
              </NavLink>
            )}

            <a
              href="https://instagram.com/codingclub_kdk"
              target="_blank"
              rel="noreferrer"
              className="hidden text-xs font-semibold text-[color:var(--hx-muted)] hover:text-[color:var(--hx-text)] sm:inline"
            >
              @codingclub_kdk
            </a>
          </div>
        </div>

        <nav className="mx-auto max-w-6xl px-2 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {nav.map((n) => {
              const Icon = n.icon
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[color:var(--hx-muted)] hover:bg-white/10 hover:text-[color:var(--hx-text)]',
                      isActive && 'bg-white/10 text-[color:var(--hx-text)]'
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </NavLink>
              )
            })}
          </div>
        </nav>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="relative border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Coding Club, KDKCE • Demo platform UI built with Vite + React.
          </p>
          <div className="flex items-center gap-2">
            <a
              className="font-semibold text-white/70 hover:text-white"
              href="http://www.kdkce.edu.in"
              target="_blank"
              rel="noreferrer"
            >
              www.kdkce.edu.in
            </a>
            <span className="text-white/30">•</span>
            <span className="inline-flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> Role-based demo
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
