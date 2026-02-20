import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Input, Label, Textarea, Divider } from '../components/ui'
import { judgeCriteria } from '../lib/data'
import { clearState, loadState, saveState } from '../lib/storage'
import { CheckCircle2, ClipboardList, RotateCcw } from 'lucide-react'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function Judge() {
  const initial = useMemo(() => loadState(), [])
  const [scores, setScores] = useState(initial.judgeScore)

  const total = scores.commitFrequency + scores.codeQuality + scores.problemRelevance + scores.finalSubmission

  function set(key: keyof typeof scores, value: number) {
    setScores((s) => ({ ...s, [key]: clamp(value, 0, 25) }))
  }

  function save() {
    const s = loadState()
    s.judgeScore = scores
    saveState(s)
    window.location.reload()
  }

  function resetAll() {
    clearState()
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Judge Panel (Demo)</h1>
          <p className="mt-1 text-sm text-white/70">Score a team 0–25 per criterion. Stored locally for this demo.</p>
        </div>
        <Badge variant="soft" className="inline-flex items-center gap-2">
          <ClipboardList className="h-4 w-4" /> Total: {total}/100
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Snapshot</CardTitle>
          <CardDescription>In the real platform, judges see all teams, repos, and commit history.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">Team</div>
            <div className="text-sm font-semibold">{initial.team?.teamName ?? '—'}</div>
            <div className="mt-2 text-xs text-white/60">Repo</div>
            <div className="text-sm text-white/80 break-all">{initial.repo?.repoUrl ?? '—'}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">Selected PS</div>
            <div className="text-sm font-semibold">{initial.selection.selectedProblemId ?? '—'}</div>
            <div className="mt-2 text-xs text-white/60">Last sync</div>
            <div className="text-sm text-white/80">
              {initial.commits.lastSyncAtMs ? new Date(initial.commits.lastSyncAtMs).toLocaleString() : '—'}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scoring</CardTitle>
          <CardDescription>{judgeCriteria.map((c) => c.label).join(' • ')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {judgeCriteria.map((c) => (
              <div key={c.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
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
                    value={scores[c.key]}
                    onChange={(e) => set(c.key, Number(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              rows={4}
              value={scores.notes}
              onChange={(e) => setScores((s) => ({ ...s, notes: e.target.value }))}
              placeholder="Strengths, risks, what to improve…"
            />
          </div>

          <Divider />

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button size="lg" className="sm:flex-1" onClick={save}>
              <CheckCircle2 className="h-4 w-4" /> Save score
            </Button>
            <Button size="lg" variant="secondary" className="sm:flex-1" onClick={resetAll}>
              <RotateCcw className="h-4 w-4" /> Reset demo data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
