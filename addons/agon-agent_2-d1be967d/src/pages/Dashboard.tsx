import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Input, Label, Divider } from '../components/ui'
import { problemStatements } from '../lib/data'
import { fetchCommits } from '../lib/github'
import { formatDateTime, formatDuration, msUntil } from '../lib/time'
import { GitBranch, RefreshCw, Timer, ExternalLink, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Dashboard() {
  const [tick, setTick] = useState(0)
  const [team, setTeam] = useState<any | null>(null)
  const [event, setEvent] = useState<any | null>(null)
  const [repoUrl, setRepoUrl] = useState('')
  const [commitsState, setCommitsState] = useState<{ status: 'idle' | 'syncing' | 'ok' | 'error'; lastSyncAtMs: number | null; commits: any[]; errorMessage?: string }>({
    status: 'idle',
    lastSyncAtMs: null,
    commits: [],
  })

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
        setEvent(r.event)
        setRepoUrl(r.team.repoUrl ?? '')
      })
      .catch(() => {
        if (!mounted) return
        setTeam(null)
      })
    return () => {
      mounted = false
    }
  }, [])

  // const startMs = event?.sprintStartMs ?? null
  const endMs = event?.sprintEndMs ?? null
  const remaining = endMs ? msUntil(endMs) : 0

  const selected = team?.selection?.problemId ? problemStatements.find((p) => p.id === team.selection.problemId) : null

  async function sync() {
    if (!team?.repoUrl) {
      setCommitsState((c) => ({ ...c, status: 'error', errorMessage: 'No repo URL saved' }))
      return
    }
    setCommitsState((c) => ({ ...c, status: 'syncing', errorMessage: undefined }))
    try {
      const commits = await fetchCommits(team.repoUrl, 20)
      setCommitsState({ status: 'ok', lastSyncAtMs: Date.now(), commits })
    } catch (e: any) {
      setCommitsState({ status: 'error', lastSyncAtMs: Date.now(), commits: [], errorMessage: e?.message ?? 'Unknown error' })
    }
  }

  async function saveRepo() {
    if (!repoUrl.trim()) return
    const r = await api.teamRepo({ repoUrl: repoUrl.trim() })
    setTeam(r.team)
  }

  const commits = commitsState.commits
  const lastSync = commitsState.lastSyncAtMs

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sprint Dashboard</h1>
          <p className="mt-1 text-sm text-white/70">Countdown + selected PS + GitHub sync status.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="soft" className="inline-flex items-center gap-2">
            <Timer className="h-4 w-4" /> Remaining: {endMs ? formatDuration(remaining) : 'Not started'}
          </Badge>
          <Button variant="secondary" onClick={sync} disabled={!team?.repoUrl || commitsState.status === 'syncing'}>
            <RefreshCw className={commitsState.status === 'syncing' ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} /> Sync
          </Button>
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Selected Problem Statement</CardTitle>
            <CardDescription>Selection locks 10 minutes after first pick.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!selected ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                No PS selected yet. <Link className="font-semibold text-white underline" to="/select">Select one now</Link>.
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-white/60">{selected.id}</div>
                    <div className="text-sm font-semibold">{selected.title}</div>
                  </div>
                  <Badge variant="outline">{selected.difficulty}</Badge>
                </div>
                <p className="mt-2 text-sm text-white/70">{selected.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <Badge key={t} variant="soft">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Divider />

            <div className="text-xs text-white/60">
              Server event state. <span className="ml-2">(tick {tick})</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GitHub Repository</CardTitle>
            <CardDescription>Used for commit frequency tracking (polled every 5 minutes in the real system).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Repository URL</Label>
              <Input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/owner/repo" />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="sm:flex-1" onClick={saveRepo} disabled={!repoUrl.trim()}>
                Save Repo
              </Button>
              {team?.repoUrl && (
                <a className="sm:flex-1" href={team.repoUrl} target="_blank" rel="noreferrer">
                  <Button className="w-full" variant="secondary">
                    <ExternalLink className="h-4 w-4" /> Open
                  </Button>
                </a>
              )}
            </div>

            <Divider />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Sync status</div>
                <Badge variant={commitsState.status === 'ok' ? 'default' : 'outline'}>
                  {commitsState.status.toUpperCase()}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-white/70">
                Last sync: {lastSync ? new Date(lastSync).toLocaleTimeString() : '—'}
              </div>
              {commitsState.status === 'error' && (
                <div className="mt-2 flex items-start gap-2 rounded-xl border border-[color:var(--hx-red)]/30 bg-[color:var(--hx-red)]/10 p-3 text-xs text-white/90">
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  <div>
                    <div className="font-semibold">GitHub API error</div>
                    <div className="mt-1 opacity-90">{commitsState.errorMessage}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-[color:var(--hx-cyan)]" /> Recent Commits
            </CardTitle>
            <CardDescription>Fetched from GitHub public API (no auth). Private repos may fail.</CardDescription>
          </CardHeader>
          <CardContent>
            {commits.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                No commits to show yet. Save a repo URL and press Sync.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <div className="grid grid-cols-12 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70">
                  <div className="col-span-2">SHA</div>
                  <div className="col-span-6">Message</div>
                  <div className="col-span-2">Author</div>
                  <div className="col-span-2">Time</div>
                </div>
                {commits.map((c) => (
                  <div key={c.sha} className="grid grid-cols-12 px-4 py-3 text-sm odd:bg-white/[0.03]">
                    <div className="col-span-2 font-mono text-xs text-white/80">{c.sha}</div>
                    <div className="col-span-6 text-white/80">{c.message}</div>
                    <div className="col-span-2 text-white/70">{c.author}</div>
                    <div className="col-span-2 text-xs text-white/60">{formatDateTime(c.date)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
