import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Input, Label, Divider } from '../components/ui'
import { problemStatements } from '../lib/data'
import { clearState, loadState, saveState } from '../lib/storage'
import { LockOpen, Shield, UserPlus, Trash2 } from 'lucide-react'

export default function Admin() {
  const initial = useMemo(() => loadState(), [])
  const [teamName, setTeamName] = useState(initial.team?.teamName ?? '')

  function unlockSelection() {
    const s = loadState()
    s.selection.locked = false
    saveState(s)
    window.location.reload()
  }

  function clearAll() {
    clearState()
    localStorage.removeItem('hackthonix2_sprintStartMs')
    window.location.reload()
  }

  function quickTeam() {
    const s = loadState()
    s.team = {
      teamName: teamName.trim() || 'On-Spot Team',
      members: [
        { name: 'Member 1', email: 'm1@example.com', contact: '9999999999' },
        { name: 'Member 2', email: 'm2@example.com', contact: '9999999999' },
      ],
    }
    saveState(s)
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Console (Demo)</h1>
          <p className="mt-1 text-sm text-white/70">Override locks, on-spot registration, and reset data.</p>
        </div>
        <Badge variant="soft" className="inline-flex items-center gap-2">
          <Shield className="h-4 w-4" /> Role: Admin
        </Badge>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overrides</CardTitle>
            <CardDescription>In production: RBAC + audit logs. Here: local-only actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Selection lock</div>
              <div className="mt-1 text-xs text-white/60">Current: {initial.selection.locked ? 'LOCKED' : 'UNLOCKED'}</div>
              <div className="mt-3">
                <Button variant="secondary" onClick={unlockSelection}>
                  <LockOpen className="h-4 w-4" /> Unlock selection
                </Button>
              </div>
            </div>

            <Divider />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Reset demo data</div>
              <div className="mt-1 text-xs text-white/60">Clears team, selection, repo, commits, and judge score.</div>
              <div className="mt-3">
                <Button variant="danger" onClick={clearAll}>
                  <Trash2 className="h-4 w-4" /> Clear all
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>On-Spot Registration</CardTitle>
            <CardDescription>Create a quick team profile for walk-ins.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Team name</Label>
              <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="On-Spot Team" />
            </div>
            <Button onClick={quickTeam}>
              <UserPlus className="h-4 w-4" /> Create team
            </Button>
            <Divider />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              <div className="font-semibold text-white">Problem Statements</div>
              <div className="mt-2 grid gap-2">
                {problemStatements.slice(0, 6).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="text-xs text-white/60">{p.id}</span>
                    <span className="text-xs">{p.title}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-white/50">(Showing 6 of 12)</div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
