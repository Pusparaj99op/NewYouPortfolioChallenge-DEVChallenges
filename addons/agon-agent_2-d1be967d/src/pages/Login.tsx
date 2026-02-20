import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import gsap from 'gsap'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '../components/ui'
import AnimatedBackground from '../components/AnimatedBackground'
import { signIn } from '../lib/auth'
import { ShieldCheck } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const root = useRef<HTMLDivElement | null>(null)
  const [teamName, setTeamName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    const t = teamName.trim()
    if (!t) return
    setLoading(true)
    setError(null)
    try {
      await signIn(t)
      navigate('/dashboard')
    } catch (e: any) {
      setError(e?.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!root.current) return
    gsap.fromTo(root.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
  }, [])

  return (
    <div ref={root} className="relative">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40">
        <div className="relative">
          <AnimatedBackground />
          <div className="relative mx-auto max-w-2xl px-6 py-14">
            <div className="mb-6">
              <Badge variant="soft" className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Team access
              </Badge>
              <h1 className="mt-3 text-3xl font-bold tracking-tight">Login</h1>
              <p className="mt-1 text-sm text-white/70">Passwordless demo login with team name.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Team Login</CardTitle>
                <CardDescription>Enter your team name to continue.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Team name</Label>
                  <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g., ByteBenders" />
                </div>
                <Button size="lg" className="w-full" onClick={submit} disabled={!teamName.trim()}>
                  {loading ? 'Signing in…' : 'Continue'}
                </Button>
                {error && (
                  <div className="rounded-2xl border border-[color:var(--hx-red)]/30 bg-[color:var(--hx-red)]/10 p-3 text-xs text-white/90">
                    {error}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-white/60">
                  <Link className="font-semibold text-white/80 hover:text-white" to="/register">
                    New team? Register
                  </Link>
                  <Link className="hover:text-white" to="/">
                    Back to landing
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
