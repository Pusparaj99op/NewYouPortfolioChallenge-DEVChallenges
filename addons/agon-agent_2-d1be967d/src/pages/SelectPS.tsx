import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Input, Divider } from '../components/ui'
import { eventInfo, problemStatements } from '../lib/data'
import { formatDuration, msUntil } from '../lib/time'
import { Search, Lock, TimerReset } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function SelectPS() {
  const [q, setQ] = useState('')
  const [, setTick] = useState(0)
  const [team, setTeam] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedId = team?.selection?.problemId ?? null
  const selectedAt = team?.selection?.selectedAtMs ?? null
  const lockMs = eventInfo.lockMinutes * 60 * 1000

  useEffect(() => {
    const t = window.setInterval(() => setTick((x) => x + 1), 1000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    let mounted = true
    api.teamMe()
      .then((r) => {
        if (!mounted) return
        setTeam(r.team)
      })
      .catch((e) => {
        if (!mounted) return
        setError(e?.message ?? 'Please login first')
      })
    return () => {
      mounted = false
    }
  }, [])

  const remaining = selectedAt ? msUntil(selectedAt + lockMs) : 0
  const isLocked = team?.selection ? remaining === 0 : false

  const filtered = problemStatements.filter((p) => {
    const hay = `${p.id} ${p.title} ${p.tags.join(' ')}`.toLowerCase()
    return hay.includes(q.toLowerCase())
  })

  const selected = selectedId ? problemStatements.find((p) => p.id === selectedId) : null

  async function choose(id: string) {
    setError(null)
    try {
      const r = await api.teamSelect({ problemId: id })
      setTeam(r.team)
    } catch (e: any) {
      setError(e?.message ?? 'Selection failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Problem Statement Selection</h1>
          <p className="mt-1 text-sm text-white/70">Pick one PS. You can change within 10 minutes, then it locks.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selected && (
            <Badge variant={isLocked ? 'outline' : 'soft'} className="inline-flex items-center gap-2">
              {isLocked ? <Lock className="h-4 w-4" /> : <TimerReset className="h-4 w-4" />}
              {isLocked ? 'Selection locked' : `Change window: ${formatDuration(remaining)}`}
            </Badge>
          )}
          <Link to="/dashboard">
            <Button variant="secondary">Go to Dashboard</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Browse (12)</CardTitle>
          <CardDescription>Difficulty + tags help you pick a good fit for the sprint.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, id, tag…" />
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Link to="/payment">
                <Button variant="ghost">Payment</Button>
              </Link>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-[color:var(--hx-red)]/30 bg-[color:var(--hx-red)]/10 p-3 text-xs text-white/90">
              {error}
            </div>
          )}

          <Divider />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const active = p.id === selectedId
              return (
                <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-white/60">{p.id}</div>
                      <div className="text-sm font-semibold">{p.title}</div>
                    </div>
                    <Badge variant="outline">{p.difficulty}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-white/70">{p.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <Badge key={t} variant="soft">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      variant={active ? 'secondary' : 'primary'}
                      disabled={!team?.paid || (isLocked && !active)}
                      onClick={() => choose(p.id)}
                    >
                      {active ? 'Selected' : !team?.paid ? 'Pay to unlock' : isLocked ? 'Locked' : 'Select'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
