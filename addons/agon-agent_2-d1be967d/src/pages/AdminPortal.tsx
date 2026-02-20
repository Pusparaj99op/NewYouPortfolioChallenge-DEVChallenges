import { useEffect, useState } from 'react'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Divider, Input, Label } from '../components/ui'
import { api } from '../lib/api'
import { Shield, Play, Square, Users } from 'lucide-react'

export default function AdminPortal() {
  const [authed, setAuthed] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [event, setEvent] = useState<any | null>(null)
  const [hours, setHours] = useState(10)
  const [teams, setTeams] = useState<any[]>([])

  async function login() {
    setError(null)
    try {
      await api.adminLogin({ passcode })
      setAuthed(true)
    } catch (e: any) {
      setError(e?.message ?? 'Login failed')
    }
  }

  async function refresh() {
    const e = await api.event()
    setEvent(e)
    const t = await api.adminTeams()
    setTeams(t.teams)
  }

  async function start() {
    const r = await api.adminStart({ hours })
    setEvent(r.event)
  }

  async function stop() {
    const r = await api.adminStop()
    setEvent(r.event)
  }

  async function toggleReg(open: boolean) {
    const r = await api.adminRegistration({ open })
    setEvent(r.event)
  }

  useEffect(() => {
    if (!authed) return
    refresh().catch((e) => setError(e?.message ?? 'Failed to load'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  if (!authed) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Login</h1>
          <p className="mt-1 text-sm text-white/70">Backend-authenticated demo. Passcode default: admin1234</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[color:var(--hx-purple)]" /> Sign in
            </CardTitle>
            <CardDescription>Enter admin passcode.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Passcode</Label>
              <Input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} />
            </div>
            <Button size="lg" className="w-full" onClick={login} disabled={passcode.length < 4}>
              Login
            </Button>
            {error && (
              <div className="rounded-2xl border border-[color:var(--hx-red)]/30 bg-[color:var(--hx-red)]/10 p-3 text-xs text-white/90">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
          <p className="mt-1 text-sm text-white/70">Control sprint and registration (server-backed).</p>
        </div>
        <Badge variant="soft" className="inline-flex items-center gap-2">
          <Shield className="h-4 w-4" /> Role: Admin
        </Badge>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event controls</CardTitle>
            <CardDescription>Start/stop sprint and open/close registration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[var(--hx-surface)] p-4 text-sm text-white/80">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Registration</span>
                <span className="font-semibold">{event?.registrationOpen ? 'OPEN' : 'CLOSED'}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <Button variant="secondary" onClick={() => toggleReg(true)}>
                  Open
                </Button>
                <Button variant="secondary" onClick={() => toggleReg(false)}>
                  Close
                </Button>
              </div>
            </div>

            <Divider />

            <div className="space-y-2">
              <Label>Sprint duration (hours)</Label>
              <Input type="number" min={1} max={24} value={hours} onChange={(e) => setHours(Number(e.target.value))} />
              <div className="text-xs text-white/60">Supports 1–24 hours.</div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={start}>
                <Play className="h-4 w-4" /> Start sprint
              </Button>
              <Button variant="secondary" onClick={stop}>
                <Square className="h-4 w-4" /> Stop sprint
              </Button>
              <Button variant="secondary" onClick={refresh}>
                Refresh
              </Button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[var(--hx-surface)] p-4 text-xs text-white/70">
              <div>Start: {event?.sprintStartMs ? new Date(event.sprintStartMs).toLocaleString() : '—'}</div>
              <div>End: {event?.sprintEndMs ? new Date(event.sprintEndMs).toLocaleString() : '—'}</div>
            </div>

            {error && (
              <div className="rounded-2xl border border-[color:var(--hx-red)]/30 bg-[color:var(--hx-red)]/10 p-3 text-xs text-white/90">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[color:var(--hx-cyan)]" /> Teams
            </CardTitle>
            <CardDescription>Server list (in-memory demo DB).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-white/60">Total: {teams.length}</div>
            <Divider />
            <div className="space-y-2">
              {teams.length === 0 ? (
                <div className="text-sm text-white/70">No teams yet.</div>
              ) : (
                teams.map((t) => (
                  <div key={t.id} className="rounded-2xl border border-white/10 bg-[var(--hx-surface)] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">{t.teamName}</div>
                      <Badge variant={t.paid ? 'default' : 'outline'}>{t.paid ? 'PAID' : 'UNPAID'}</Badge>
                    </div>
                    <div className="mt-2 text-xs text-white/60">
                      Members: {t.members.length} • PS: {t.selection?.problemId ?? '—'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
