import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Divider, Input, Label, Textarea } from '../components/ui'
import { judgeCriteria } from '../lib/data'
import { api } from '../lib/api'
import { ClipboardList, Gavel, Trophy } from 'lucide-react'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function JudgePortal() {
  const [authed, setAuthed] = useState(false)
  const [judgeId, setJudgeId] = useState('judge-1')
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [teams, setTeams] = useState<any[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string>('')

  const [scores, setScores] = useState({
    commitFrequency: 0,
    codeQuality: 0,
    problemRelevance: 0,
    finalSubmission: 0,
    notes: '',
  })

  const total =
    scores.commitFrequency + scores.codeQuality + scores.problemRelevance + scores.finalSubmission

  const selectedTeam = useMemo(() => teams.find((t) => t.id === selectedTeamId) ?? null, [teams, selectedTeamId])

  async function login() {
    setError(null)
    try {
      await api.judgeLogin({ judgeId, passcode })
      setAuthed(true)
    } catch (e: any) {
      setError(e?.message ?? 'Login failed')
    }
  }

  async function loadTeams() {
    const r = await api.judgeTeams()
    setTeams(r.teams)
    if (!selectedTeamId && r.teams[0]) setSelectedTeamId(r.teams[0].id)
  }

  async function submitScore() {
    if (!selectedTeamId) return
    setError(null)
    try {
      await api.judgeScore({ teamId: selectedTeamId, ...scores })
      setScores((s) => ({ ...s, notes: '' }))
    } catch (e: any) {
      setError(e?.message ?? 'Failed to submit')
    }
  }

  async function loadLeaderboard() {
    const r = await api.leaderboard()
    // reuse teams list view
    setTeams((prev) => {
      const map = new Map(prev.map((t) => [t.id, t]))
      for (const row of r.rows) {
        map.set(row.teamId, { ...(map.get(row.teamId) ?? {}), ...row, id: row.teamId })
      }
      return Array.from(map.values())
    })
  }

  useEffect(() => {
    if (!authed) return
    loadTeams().catch((e) => setError(e?.message ?? 'Failed to load teams'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  function setScore(key: keyof typeof scores, value: number) {
    setScores((s) => ({ ...s, [key]: clamp(value, 0, 25) }))
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Judge Login</h1>
          <p className="mt-1 text-sm text-white/70">Backend-authenticated demo. Passcode default: judge1234</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-[color:var(--hx-cyan)]" /> Sign in
            </CardTitle>
            <CardDescription>Use your judge id + passcode.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Judge ID</Label>
              <Input value={judgeId} onChange={(e) => setJudgeId(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Passcode</Label>
              <Input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} />
            </div>
            <Button size="lg" className="w-full" onClick={login} disabled={!judgeId.trim() || passcode.length < 4}>
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
          <h1 className="text-2xl font-bold tracking-tight">Judge Portal</h1>
          <p className="mt-1 text-sm text-white/70">Score teams and view leaderboard (server-backed).</p>
        </div>
        <Badge variant="soft" className="inline-flex items-center gap-2">
          <ClipboardList className="h-4 w-4" /> Total: {total}/100
        </Badge>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Teams</CardTitle>
            <CardDescription>Select a team to score.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="secondary" onClick={loadTeams}>
                Refresh teams
              </Button>
              <Button variant="secondary" onClick={loadLeaderboard}>
                <Trophy className="h-4 w-4" /> Load leaderboard
              </Button>
            </div>
            <Divider />
            <div className="space-y-2">
              {teams.length === 0 ? (
                <div className="text-sm text-white/70">No teams yet.</div>
              ) : (
                teams.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTeamId(t.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      selectedTeamId === t.id
                        ? 'border-white/20 bg-white/10'
                        : 'border-white/10 bg-[var(--hx-surface)] hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">{t.teamName ?? t.teamName}</div>
                        <div className="text-xs text-white/60">ID: {t.id}</div>
                      </div>
                      <Badge variant={t.paid ? 'default' : 'outline'}>{t.paid ? 'PAID' : 'UNPAID'}</Badge>
                    </div>
                    <div className="mt-2 text-xs text-white/60">
                      PS: {t.problemId ?? t.selection?.problemId ?? '—'} • Avg: {t.avgScore ?? '—'} • Judges:{' '}
                      {t.judgesCount ?? '—'}
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scoring</CardTitle>
            <CardDescription>Selected team: {selectedTeam?.teamName ?? '—'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {judgeCriteria.map((c) => (
                <div key={c.key} className="rounded-2xl border border-white/10 bg-[var(--hx-surface)] p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{c.label}</div>
                    <Badge variant="outline">0–{c.max}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-white/60">{c.description}</div>
                  <div className="mt-3">
                    <Label>Score</Label>
                    <Input
                      type="number"
                      min={0}
                      max={25}
                      value={(scores as any)[c.key]}
                      onChange={(e) => setScore(c.key as any, Number(e.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea rows={4} value={scores.notes} onChange={(e) => setScores((s) => ({ ...s, notes: e.target.value }))} />
            </div>

            {error && (
              <div className="rounded-2xl border border-[color:var(--hx-red)]/30 bg-[color:var(--hx-red)]/10 p-3 text-xs text-white/90">
                {error}
              </div>
            )}

            <Button size="lg" className="w-full" onClick={submitScore} disabled={!selectedTeamId}>
              Submit score
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
