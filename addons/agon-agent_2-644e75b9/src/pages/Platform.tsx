import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Github,
  LayoutGrid,
  Lock,
  RefreshCcw,
  Shield,
  Trophy
} from 'lucide-react'
import { Button, Card, Input, Label, Badge } from '../components/ui'
import { EVENT, PROBLEM_STATEMENTS, type ProblemStatement, JUDGING } from '../lib/data'
import { formatDuration } from '../lib/time'
import { loadJSON, saveJSON } from '../lib/storage'

type Member = { name: string; email: string; contact: string }

type Team = {
  id: string
  teamName: string
  members: Member[]
  createdAt: number
  psId?: string
  psSelectedAt?: number
  lockAt?: number
  repoUrl?: string
}

type Commit = { sha: string; message: string; time: number }

type JudgeScore = {
  teamId: string
  judgeName: string
  commitFrequency: number
  codeQuality: number
  problemRelevance: number
  finalSubmission: number
  createdAt: number
}

const LS = {
  teams: 'hackthonix.teams.v1',
  currentTeamId: 'hackthonix.currentTeamId.v1',
  commits: 'hackthonix.commits.v1',
  scores: 'hackthonix.scores.v1'
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

function difficultyTone(d: ProblemStatement['difficulty']): 'green' | 'amber' | 'rose' {
  if (d === 'Easy') return 'green'
  if (d === 'Medium') return 'amber'
  return 'rose'
}

function clampScore(n: number) {
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(25, Math.round(n)))
}

function avg(nums: number[]) {
  if (!nums.length) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

function TopNav() {
  const location = useLocation()
  const nav = [
    { to: '/platform/team', label: 'Team', icon: Shield },
    { to: '/platform/judge', label: 'Judge', icon: Trophy },
    { to: '/platform/admin', label: 'Admin', icon: LayoutGrid }
  ]
  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/90">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="hidden text-sm text-white/50 sm:block">Demo platform prototype</div>
        </div>
        <div className="flex items-center gap-1">
          {nav.map((n) => {
            const active = location.pathname.startsWith(n.to)
            const Icon = n.icon
            return (
              <Link
                key={n.to}
                to={n.to}
                className={
                  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ring-1 transition ' +
                  (active
                    ? 'bg-white/10 text-white ring-white/15'
                    : 'bg-transparent text-white/70 ring-transparent hover:bg-white/5 hover:text-white')
                }
              >
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            )}
          )}
        </div>
      </div>
    </div>
  )
}

function useStore() {
  const [teams, setTeams] = useState<Team[]>(() => loadJSON(LS.teams, [] as Team[]))
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(() =>
    loadJSON(LS.currentTeamId, null as string | null)
  )
  const [commitsByTeam, setCommitsByTeam] = useState<Record<string, Commit[]>>(() =>
    loadJSON(LS.commits, {} as Record<string, Commit[]>)
  )
  const [scores, setScores] = useState<JudgeScore[]>(() => loadJSON(LS.scores, [] as JudgeScore[]))

  useEffect(() => saveJSON(LS.teams, teams), [teams])
  useEffect(() => saveJSON(LS.currentTeamId, currentTeamId), [currentTeamId])
  useEffect(() => saveJSON(LS.commits, commitsByTeam), [commitsByTeam])
  useEffect(() => saveJSON(LS.scores, scores), [scores])

  return {
    teams,
    setTeams,
    currentTeamId,
    setCurrentTeamId,
    commitsByTeam,
    setCommitsByTeam,
    scores,
    setScores
  }
}

function CountdownCard() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(t)
  }, [])

  const startMs = new Date(EVENT.dateISO).getTime()
  const endMs = startMs + EVENT.sprintHours * 60 * 60 * 1000
  const untilStart = startMs - now
  const untilEnd = endMs - now

  const label = untilStart > 0 ? 'Sprint starts in' : untilEnd > 0 ? 'Sprint ends in' : 'Sprint finished'
  const value = untilStart > 0 ? untilStart : untilEnd > 0 ? untilEnd : 0

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-white/70">{label}</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-white">{formatDuration(value)}</div>
          <div className="mt-2 text-xs text-white/50">
            Branded as {EVENT.sprintHours}-hour sprint • Platform can support up to 24 hours
          </div>
        </div>
        <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
          <Clock className="h-5 w-5 text-white" />
        </div>
      </div>
    </Card>
  )
}

function TeamArea({ store }: { store: ReturnType<typeof useStore> }) {
  const navigate = useNavigate()
  const currentTeam = store.teams.find((t) => t.id === store.currentTeamId) || null

  const [teamName, setTeamName] = useState('')
  const [members, setMembers] = useState<Member[]>([
    { name: '', email: '', contact: '' },
    { name: '', email: '', contact: '' }
  ])

  const [repoUrl, setRepoUrl] = useState('')

  useEffect(() => {
    if (currentTeam) {
      setRepoUrl(currentTeam.repoUrl || '')
    }
  }, [currentTeam?.id])

  const selectedPS = useMemo(() => {
    if (!currentTeam?.psId) return null
    return PROBLEM_STATEMENTS.find((p) => p.id === currentTeam.psId) || null
  }, [currentTeam?.psId])

  const lockRemainingMs = useMemo(() => {
    if (!currentTeam?.lockAt) return null
    return currentTeam.lockAt - Date.now()
  }, [currentTeam?.lockAt, currentTeam?.psId])

  useEffect(() => {
    if (!currentTeam?.lockAt) return
    const t = window.setInterval(() => {
      const remaining = currentTeam.lockAt! - Date.now()
      if (remaining <= 0) {
        store.setTeams((prev) =>
          prev.map((x) => (x.id === currentTeam.id ? { ...x, lockAt: currentTeam.lockAt } : x))
        )
      }
    }, 500)
    return () => window.clearInterval(t)
  }, [currentTeam?.lockAt])

  function createTeam() {
    const cleaned = teamName.trim()
    if (!cleaned) return
    const filtered = members
      .map((m) => ({
        name: m.name.trim(),
        email: m.email.trim(),
        contact: m.contact.trim()
      }))
      .filter((m) => m.name && m.email)

    if (filtered.length < 2 || filtered.length > 4) return

    const t: Team = {
      id: uid('team'),
      teamName: cleaned,
      members: filtered,
      createdAt: Date.now()
    }
    store.setTeams((prev) => [t, ...prev])
    store.setCurrentTeamId(t.id)
    setTeamName('')
    setMembers([
      { name: '', email: '', contact: '' },
      { name: '', email: '', contact: '' }
    ])
    navigate('/platform/team')
  }

  function selectPS(psId: string) {
    if (!currentTeam) return

    const now = Date.now()
    const lockAt = (currentTeam.psSelectedAt ? currentTeam.lockAt : now + 10 * 60 * 1000) || now + 10 * 60 * 1000

    // If already locked, disallow changes
    if (currentTeam.lockAt && now >= currentTeam.lockAt) return

    store.setTeams((prev) =>
      prev.map((t) =>
        t.id === currentTeam.id
          ? {
              ...t,
              psId,
              psSelectedAt: t.psSelectedAt ?? now,
              lockAt: t.lockAt ?? lockAt
            }
          : t
      )
    )
  }

  function submitRepo() {
    if (!currentTeam) return
    const url = repoUrl.trim()
    if (!url) return
    store.setTeams((prev) => prev.map((t) => (t.id === currentTeam.id ? { ...t, repoUrl: url } : t)))
  }

  function simulateSync() {
    if (!currentTeam) return
    if (!currentTeam.repoUrl) return

    // Simulate GitHub polling every 5 minutes by generating 0-2 commits
    const count = Math.random() < 0.35 ? 0 : Math.random() < 0.75 ? 1 : 2
    if (count === 0) return

    const messages = [
      'Fix UI alignment and responsive grid',
      'Add repo validation and status badge',
      'Implement scoring aggregation',
      'Improve accessibility labels',
      'Refactor state management',
      'Add countdown and lock timer'
    ]

    store.setCommitsByTeam((prev) => {
      const existing = prev[currentTeam.id] ?? []
      const next = [...existing]
      for (let i = 0; i < count; i++) {
        next.unshift({
          sha: uid('sha').slice(0, 10),
          message: messages[Math.floor(Math.random() * messages.length)],
          time: Date.now() - Math.floor(Math.random() * 90_000)
        })
      }
      return { ...prev, [currentTeam.id]: next.slice(0, 50) }
    })
  }

  useEffect(() => {
    if (!currentTeam?.repoUrl) return
    const t = window.setInterval(() => simulateSync(), 5 * 60 * 1000)
    return () => window.clearInterval(t)
  }, [currentTeam?.id, currentTeam?.repoUrl])

  const commits = (currentTeam && store.commitsByTeam[currentTeam.id]) || []

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-2xl font-semibold tracking-tight text-white">Team dashboard</div>
              <div className="text-sm text-white/60">Register → select PS → submit repo → keep committing</div>
            </div>
            <CountdownCard />
          </div>

          <div className="mt-6 grid gap-6">
            {!currentTeam ? (
              <Card className="p-6">
                <div className="text-lg font-semibold text-white">Create team login (no password)</div>
                <div className="mt-3 grid gap-4">
                  <div>
                    <Label>Team name</Label>
                    <div className="mt-2">
                      <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g., ByteBuilders" />
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-white">Members (2–4)</div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setMembers((prev) =>
                              prev.length < 4 ? [...prev, { name: '', email: '', contact: '' }] : prev
                            )
                          }
                        >
                          Add member
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMembers((prev) => (prev.length > 2 ? prev.slice(0, -1) : prev))}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      {members.map((m, idx) => (
                        <Card key={idx} className="p-4">
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div>
                              <Label>Name</Label>
                              <div className="mt-2">
                                <Input
                                  value={m.name}
                                  onChange={(e) =>
                                    setMembers((prev) =>
                                      prev.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x))
                                    )
                                  }
                                  placeholder="Full name"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Email</Label>
                              <div className="mt-2">
                                <Input
                                  value={m.email}
                                  onChange={(e) =>
                                    setMembers((prev) =>
                                      prev.map((x, i) => (i === idx ? { ...x, email: e.target.value } : x))
                                    )
                                  }
                                  placeholder="name@domain.com"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Contact</Label>
                              <div className="mt-2">
                                <Input
                                  value={m.contact}
                                  onChange={(e) =>
                                    setMembers((prev) =>
                                      prev.map((x, i) => (i === idx ? { ...x, contact: e.target.value } : x))
                                    )
                                  }
                                  placeholder="Phone"
                                />
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button className="w-full sm:w-auto" onClick={createTeam}>
                      Create & Login
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        if (!store.teams.length) return
                        store.setCurrentTeamId(store.teams[0].id)
                      }}
                      disabled={!store.teams.length}
                    >
                      Quick login (first team)
                    </Button>
                  </div>
                  <div className="text-xs text-white/50">
                    Tip: This demo stores data in your browser (localStorage).
                  </div>
                </div>
              </Card>
            ) : (
              <>
                <Card className="p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-white">{currentTeam.teamName}</div>
                      <div className="mt-1 text-sm text-white/60">
                        Members: {currentTeam.members.map((m) => m.name).join(', ')}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" onClick={() => store.setCurrentTeamId(null)}>
                        Logout
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          store.setTeams((prev) => prev.filter((t) => t.id !== currentTeam.id))
                          store.setCurrentTeamId(null)
                        }}
                      >
                        Delete team
                      </Button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-white">Problem statement</div>
                        {currentTeam.lockAt && Date.now() >= currentTeam.lockAt ? (
                          <Badge tone="rose">
                            <Lock className="h-3.5 w-3.5" /> Locked
                          </Badge>
                        ) : currentTeam.psId ? (
                          <Badge tone="amber">Changeable</Badge>
                        ) : (
                          <Badge tone="neutral">Not selected</Badge>
                        )}
                      </div>
                      {selectedPS ? (
                        <div className="mt-3">
                          <div className="text-base font-semibold text-white">{selectedPS.title}</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge tone={difficultyTone(selectedPS.difficulty)}>{selectedPS.difficulty}</Badge>
                            {selectedPS.tags.map((t) => (
                              <Badge key={t} tone="neutral">
                                {t}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3 text-sm text-white/70">{selectedPS.prompt}</div>

                          <div className="mt-4 text-xs text-white/50">
                            {currentTeam.lockAt && Date.now() < currentTeam.lockAt ? (
                              <span>
                                Selection lock in <span className="font-medium text-white">{formatDuration(lockRemainingMs ?? 0)}</span>
                              </span>
                            ) : (
                              <span>Selection is locked.</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 text-sm text-white/60">
                          Select one problem statement from the grid below.
                        </div>
                      )}
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-white">GitHub repository</div>
                        {currentTeam.repoUrl ? (
                          <Badge tone="green">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Submitted
                          </Badge>
                        ) : (
                          <Badge tone="neutral">Pending</Badge>
                        )}
                      </div>
                      <div className="mt-3 grid gap-2">
                        <Label>Repository URL</Label>
                        <Input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/org/repo" />
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button className="w-full sm:w-auto" onClick={submitRepo} disabled={!repoUrl.trim()}>
                            Submit
                          </Button>
                          <Button
                            variant="secondary"
                            className="w-full sm:w-auto"
                            onClick={() => currentTeam.repoUrl && window.open(currentTeam.repoUrl, '_blank')}
                            disabled={!currentTeam.repoUrl}
                          >
                            <span className="inline-flex items-center gap-2">
                              <Github className="h-4 w-4" /> Open
                            </span>
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-xs text-white/50">Sync every 5 minutes (simulated)</div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={simulateSync}
                            disabled={!currentTeam.repoUrl}
                          >
                            <RefreshCcw className="h-4 w-4" /> Sync now
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-white">Problem statement grid (12)</div>
                      <div className="text-sm text-white/60">Pick one. You have 10 minutes to change after first selection.</div>
                    </div>
                    {currentTeam.lockAt && Date.now() >= currentTeam.lockAt ? (
                      <Badge tone="rose">
                        <Lock className="h-3.5 w-3.5" /> Locked
                      </Badge>
                    ) : (
                      <Badge tone="amber">Unlocked</Badge>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {PROBLEM_STATEMENTS.map((ps) => {
                      const isSelected = currentTeam.psId === ps.id
                      const isLocked = !!currentTeam.lockAt && Date.now() >= currentTeam.lockAt
                      return (
                        <button
                          key={ps.id}
                          onClick={() => selectPS(ps.id)}
                          disabled={!currentTeam || isLocked}
                          className={
                            'group text-left rounded-2xl ring-1 transition p-4 ' +
                            (isSelected
                              ? 'bg-white/10 ring-white/25'
                              : 'bg-white/5 ring-white/10 hover:bg-white/8 hover:ring-white/20') +
                            (isLocked ? ' opacity-70 cursor-not-allowed' : '')
                          }
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-sm font-semibold text-white">{ps.title}</div>
                            <Badge tone={difficultyTone(ps.difficulty)}>{ps.difficulty}</Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {ps.tags.slice(0, 3).map((t) => (
                              <Badge key={t} tone="neutral">
                                {t}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3 text-xs text-white/60 line-clamp-3">{ps.prompt}</div>
                          <div className="mt-3 text-xs text-white/45">
                            {isSelected ? 'Selected' : isLocked ? 'Locked' : 'Select'}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="text-lg font-semibold text-white">Commit history (simulated)</div>
                  <div className="mt-1 text-sm text-white/60">The real platform would use GitHub API v3.</div>
                  <div className="mt-4 grid gap-2">
                    {commits.length ? (
                      commits.slice(0, 12).map((c) => (
                        <div
                          key={c.sha}
                          className="flex items-start justify-between gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10"
                        >
                          <div>
                            <div className="text-sm font-medium text-white">{c.message}</div>
                            <div className="mt-1 text-xs text-white/50">{new Date(c.time).toLocaleTimeString()}</div>
                          </div>
                          <Badge tone="neutral">{c.sha}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-white/60">No commits yet. Submit a repo and click “Sync now”.</div>
                    )}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="grid gap-6">
            <Card className="p-6">
              <div className="text-lg font-semibold text-white">Teams</div>
              <div className="mt-1 text-sm text-white/60">Switch teams to simulate multiple participants.</div>
              <div className="mt-4 grid gap-2">
                {store.teams.length ? (
                  store.teams.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => store.setCurrentTeamId(t.id)}
                      className={
                        'rounded-xl p-3 text-left ring-1 transition ' +
                        (store.currentTeamId === t.id
                          ? 'bg-white/10 ring-white/20'
                          : 'bg-white/5 ring-white/10 hover:bg-white/8 hover:ring-white/20')
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-white">{t.teamName}</div>
                          <div className="mt-1 text-xs text-white/50">{t.members.length} members</div>
                        </div>
                        {t.psId ? <Badge tone="green">PS</Badge> : <Badge tone="neutral">—</Badge>}
                      </div>
                      <div className="mt-2 text-xs text-white/50">
                        {t.repoUrl ? 'Repo submitted' : 'Repo pending'}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-white/60">No teams yet.</div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-lg font-semibold text-white">Scoring snapshot</div>
              <div className="mt-1 text-sm text-white/60">Average across judges.</div>
              <div className="mt-4 grid gap-2">
                {store.teams.slice(0, 6).map((t) => {
                  const s = store.scores.filter((x) => x.teamId === t.id)
                  const totals = s.map((x) => x.commitFrequency + x.codeQuality + x.problemRelevance + x.finalSubmission)
                  const avgTotal = avg(totals)
                  return (
                    <div key={t.id} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium text-white">{t.teamName}</div>
                        <Badge tone={avgTotal >= 80 ? 'green' : avgTotal >= 60 ? 'amber' : 'neutral'}>
                          {avgTotal ? avgTotal.toFixed(1) : '—'} / 100
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-white/50">Judges: {s.length || 0}</div>
                    </div>
                  )
                })}
                {!store.teams.length && <div className="text-sm text-white/60">Create teams to see scores.</div>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function JudgeArea({ store }: { store: ReturnType<typeof useStore> }) {
  const [judgeName, setJudgeName] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  const team = store.teams.find((t) => t.id === selectedTeamId) || null

  const [scores, setScores] = useState({
    commitFrequency: 0,
    codeQuality: 0,
    problemRelevance: 0,
    finalSubmission: 0
  })

  useEffect(() => {
    if (!team) return
    setScores({ commitFrequency: 0, codeQuality: 0, problemRelevance: 0, finalSubmission: 0 })
  }, [team?.id])

  const commits = (team && store.commitsByTeam[team.id]) || []

  function submit() {
    const name = judgeName.trim() || 'Judge'
    if (!team) return
    const entry: JudgeScore = {
      teamId: team.id,
      judgeName: name,
      commitFrequency: clampScore(scores.commitFrequency),
      codeQuality: clampScore(scores.codeQuality),
      problemRelevance: clampScore(scores.problemRelevance),
      finalSubmission: clampScore(scores.finalSubmission),
      createdAt: Date.now()
    }
    store.setScores((prev) => [entry, ...prev])
  }

  const teamScores = store.scores.filter((s) => s.teamId === (team?.id || ''))
  const avgByCriterion = {
    commitFrequency: avg(teamScores.map((s) => s.commitFrequency)),
    codeQuality: avg(teamScores.map((s) => s.codeQuality)),
    problemRelevance: avg(teamScores.map((s) => s.problemRelevance)),
    finalSubmission: avg(teamScores.map((s) => s.finalSubmission))
  }
  const avgTotal =
    avgByCriterion.commitFrequency +
    avgByCriterion.codeQuality +
    avgByCriterion.problemRelevance +
    avgByCriterion.finalSubmission

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="text-lg font-semibold text-white">Judge panel</div>
            <div className="mt-3">
              <Label>Judge name</Label>
              <div className="mt-2">
                <Input value={judgeName} onChange={(e) => setJudgeName(e.target.value)} placeholder="Your name" />
              </div>
            </div>
            <div className="mt-4">
              <Label>Select team</Label>
              <div className="mt-2 grid gap-2">
                {store.teams.length ? (
                  store.teams.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTeamId(t.id)}
                      className={
                        'rounded-xl p-3 text-left ring-1 transition ' +
                        (selectedTeamId === t.id
                          ? 'bg-white/10 ring-white/20'
                          : 'bg-white/5 ring-white/10 hover:bg-white/8 hover:ring-white/20')
                      }
                    >
                      <div className="text-sm font-medium text-white">{t.teamName}</div>
                      <div className="mt-1 text-xs text-white/50">{t.repoUrl ? 'Repo submitted' : 'Repo pending'}</div>
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-white/60">No teams yet.</div>
                )}
              </div>
            </div>
          </Card>

          <Card className="mt-6 p-6">
            <div className="text-lg font-semibold text-white">Criteria</div>
            <div className="mt-3 grid gap-2">
              {JUDGING.map((j) => (
                <div key={j.key} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <div className="text-sm font-medium text-white">{j.title}</div>
                  <div className="mt-1 text-xs text-white/55">{j.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-2xl font-semibold tracking-tight text-white">Score a team</div>
                <div className="text-sm text-white/60">0–25 points per criterion • averaged across judges</div>
              </div>
              {team ? (
                <Badge tone={avgTotal >= 80 ? 'green' : avgTotal >= 60 ? 'amber' : 'neutral'}>
                  Avg total: {avgTotal ? avgTotal.toFixed(1) : '—'} / 100
                </Badge>
              ) : (
                <Badge tone="neutral">Select a team</Badge>
              )}
            </div>

            {!team ? (
              <div className="mt-6 text-sm text-white/60">Choose a team on the left to start scoring.</div>
            ) : (
              <div className="mt-6 grid gap-6">
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-white">{team.teamName}</div>
                      <div className="mt-1 text-sm text-white/60">Members: {team.members.map((m) => m.name).join(', ')}</div>
                      <div className="mt-1 text-sm text-white/60">PS: {team.psId || '—'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/50">Judges scored</div>
                      <div className="mt-1 text-sm font-medium text-white">{teamScores.length}</div>
                    </div>
                  </div>
                </Card>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      { key: 'commitFrequency', label: 'Commit Frequency' },
                      { key: 'codeQuality', label: 'Code Quality' },
                      { key: 'problemRelevance', label: 'Problem Relevance' },
                      { key: 'finalSubmission', label: 'Final Submission' }
                    ] as const
                  ).map((c) => (
                    <Card key={c.key} className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-white">{c.label}</div>
                        <Badge tone="neutral">0–25</Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <input
                          type="range"
                          min={0}
                          max={25}
                          value={scores[c.key]}
                          onChange={(e) => setScores((p) => ({ ...p, [c.key]: Number(e.target.value) }))}
                          className="w-full"
                        />
                        <div className="w-10 text-right text-sm font-semibold text-white">{scores[c.key]}</div>
                      </div>
                      <div className="mt-3 text-xs text-white/55">
                        Average: {avgByCriterion[c.key].toFixed(1)}
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button className="w-full sm:w-auto" onClick={submit}>
                    Submit score
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      store.setScores((prev) => prev.filter((s) => s.teamId !== team.id))
                    }}
                    disabled={!teamScores.length}
                  >
                    Clear scores for this team
                  </Button>
                </div>

                <Card className="p-6">
                  <div className="text-lg font-semibold text-white">Commit history</div>
                  <div className="mt-1 text-sm text-white/60">Used for “Commit Frequency”.</div>
                  <div className="mt-4 grid gap-2">
                    {commits.length ? (
                      commits.slice(0, 12).map((c) => (
                        <div
                          key={c.sha}
                          className="flex items-start justify-between gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10"
                        >
                          <div>
                            <div className="text-sm font-medium text-white">{c.message}</div>
                            <div className="mt-1 text-xs text-white/50">{new Date(c.time).toLocaleString()}</div>
                          </div>
                          <Badge tone="neutral">{c.sha}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-white/60">No commits synced yet.</div>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="text-lg font-semibold text-white">Previous judge submissions</div>
                  <div className="mt-4 grid gap-2">
                    {teamScores.length ? (
                      teamScores.slice(0, 8).map((s) => (
                        <div key={s.createdAt} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-white">{s.judgeName}</div>
                            <Badge tone="neutral">
                              {(s.commitFrequency + s.codeQuality + s.problemRelevance + s.finalSubmission).toFixed(0)} / 100
                            </Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-white/60">
                            <div>Commit: {s.commitFrequency}</div>
                            <div>Quality: {s.codeQuality}</div>
                            <div>Relevance: {s.problemRelevance}</div>
                            <div>Submission: {s.finalSubmission}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-white/60">No judge scores yet.</div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function AdminArea({ store }: { store: ReturnType<typeof useStore> }) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const team = store.teams.find((t) => t.id === selectedTeamId) || null

  const [psTitle, setPsTitle] = useState('')
  const [psPrompt, setPsPrompt] = useState('')
  const [psDifficulty, setPsDifficulty] = useState<ProblemStatement['difficulty']>('Easy')
  const [psTags, setPsTags] = useState('')

  function overrideUnlock() {
    if (!team) return
    store.setTeams((prev) =>
      prev.map((t) => (t.id === team.id ? { ...t, lockAt: Date.now() + 10 * 60 * 1000 } : t))
    )
  }

  function lockNow() {
    if (!team) return
    store.setTeams((prev) => prev.map((t) => (t.id === team.id ? { ...t, lockAt: Date.now() } : t)))
  }

  function onSpotRegistration() {
    const t: Team = {
      id: uid('team'),
      teamName: `Walk-in Team ${store.teams.length + 1}`,
      members: [
        { name: 'Member 1', email: 'm1@example.com', contact: '—' },
        { name: 'Member 2', email: 'm2@example.com', contact: '—' }
      ],
      createdAt: Date.now()
    }
    store.setTeams((prev) => [t, ...prev])
  }

  function addProblemStatement() {
    const title = psTitle.trim()
    const prompt = psPrompt.trim()
    if (!title || !prompt) return

    const tags = psTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const newPS: ProblemStatement = {
      id: uid('ps'),
      title,
      difficulty: psDifficulty,
      tags: tags.length ? tags : ['Custom'],
      prompt
    }

    // Persist into localStorage under separate key so we don't mutate imported constant.
    const key = 'hackthonix.customPS.v1'
    const existing = loadJSON(key, [] as ProblemStatement[])
    saveJSON(key, [newPS, ...existing])

    setPsTitle('')
    setPsPrompt('')
    setPsTags('')
    setPsDifficulty('Easy')

    window.location.reload()
  }

  const customPS = loadJSON('hackthonix.customPS.v1', [] as ProblemStatement[])
  const allPS = [...customPS, ...PROBLEM_STATEMENTS]

  const leaderboard = useMemo(() => {
    const rows = store.teams.map((t) => {
      const s = store.scores.filter((x) => x.teamId === t.id)
      const totals = s.map((x) => x.commitFrequency + x.codeQuality + x.problemRelevance + x.finalSubmission)
      const avgTotal = avg(totals)
      return { team: t, avgTotal, judges: s.length }
    })
    return rows.sort((a, b) => b.avgTotal - a.avgTotal)
  }, [store.teams, store.scores])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="text-lg font-semibold text-white">Admin</div>
            <div className="mt-1 text-sm text-white/60">Manage teams/PS, override locks, declare results.</div>

            <div className="mt-4">
              <Button className="w-full" onClick={onSpotRegistration}>
                On-spot registration
              </Button>
            </div>

            <div className="mt-5">
              <Label>Select team</Label>
              <div className="mt-2 grid gap-2">
                {store.teams.length ? (
                  store.teams.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTeamId(t.id)}
                      className={
                        'rounded-xl p-3 text-left ring-1 transition ' +
                        (selectedTeamId === t.id
                          ? 'bg-white/10 ring-white/20'
                          : 'bg-white/5 ring-white/10 hover:bg-white/8 hover:ring-white/20')
                      }
                    >
                      <div className="text-sm font-medium text-white">{t.teamName}</div>
                      <div className="mt-1 text-xs text-white/50">{t.psId ? 'PS selected' : 'No PS'}</div>
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-white/60">No teams yet.</div>
                )}
              </div>
            </div>
          </Card>

          <Card className="mt-6 p-6">
            <div className="text-lg font-semibold text-white">Add problem statement</div>
            <div className="mt-3 grid gap-3">
              <div>
                <Label>Title</Label>
                <div className="mt-2">
                  <Input value={psTitle} onChange={(e) => setPsTitle(e.target.value)} placeholder="New problem statement" />
                </div>
              </div>
              <div>
                <Label>Prompt</Label>
                <div className="mt-2">
                  <Input value={psPrompt} onChange={(e) => setPsPrompt(e.target.value)} placeholder="What should teams build?" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Difficulty</Label>
                  <div className="mt-2">
                    <select
                      value={psDifficulty}
                      onChange={(e) => setPsDifficulty(e.target.value as ProblemStatement['difficulty'])}
                      className="h-11 w-full rounded-xl bg-white/5 px-3 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-white/25"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Tags (comma separated)</Label>
                  <div className="mt-2">
                    <Input value={psTags} onChange={(e) => setPsTags(e.target.value)} placeholder="e.g., Web, AI, IoT" />
                  </div>
                </div>
              </div>
              <Button onClick={addProblemStatement}>Add</Button>
              <div className="text-xs text-white/50">Custom PS are stored locally for this demo.</div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="text-2xl font-semibold tracking-tight text-white">Operations</div>
            {!team ? (
              <div className="mt-4 text-sm text-white/60">Select a team to override locks and view details.</div>
            ) : (
              <div className="mt-4 grid gap-6">
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-white">{team.teamName}</div>
                      <div className="mt-1 text-sm text-white/60">PS: {team.psId || '—'}</div>
                      <div className="mt-1 text-sm text-white/60">Repo: {team.repoUrl || '—'}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" onClick={overrideUnlock}>
                        Extend unlock (+10m)
                      </Button>
                      <Button variant="danger" size="sm" onClick={lockNow}>
                        Lock now
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-white/50">
                    Lock timestamp: {team.lockAt ? new Date(team.lockAt).toLocaleString() : '—'}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="text-lg font-semibold text-white">Problem statements ({allPS.length})</div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {allPS.map((ps) => (
                      <div key={ps.id} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-sm font-semibold text-white">{ps.title}</div>
                          <Badge tone={difficultyTone(ps.difficulty)}>{ps.difficulty}</Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {ps.tags.slice(0, 4).map((t) => (
                            <Badge key={t} tone="neutral">
                              {t}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-3 text-xs text-white/60">{ps.prompt}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </Card>

          <Card className="mt-6 p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-2xl font-semibold tracking-tight text-white">Leaderboard</div>
                <div className="text-sm text-white/60">Final result declaration (avg across judges).</div>
              </div>
              <Badge tone="amber">Demo</Badge>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3">Judges</th>
                    <th className="px-4 py-3">Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length ? (
                    leaderboard.map((r, idx) => (
                      <tr key={r.team.id} className="border-t border-white/10">
                        <td className="px-4 py-3 text-white/80">#{idx + 1}</td>
                        <td className="px-4 py-3 text-white">{r.team.teamName}</td>
                        <td className="px-4 py-3 text-white/70">{r.judges}</td>
                        <td className="px-4 py-3">
                          <Badge tone={r.avgTotal >= 80 ? 'green' : r.avgTotal >= 60 ? 'amber' : 'neutral'}>
                            {r.avgTotal ? r.avgTotal.toFixed(1) : '—'} / 100
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-6 text-white/60" colSpan={4}>
                        No teams yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function Platform() {
  const store = useStore()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/platform') navigate('/platform/team', { replace: true })
  }, [location.pathname])

  return (
    <div>
      <TopNav />
      <Routes>
        <Route path="team" element={<TeamArea store={store} />} />
        <Route path="judge" element={<JudgeArea store={store} />} />
        <Route path="admin" element={<AdminArea store={store} />} />
      </Routes>
    </div>
  )
}
