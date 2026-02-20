import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Badge, Divider } from '../components/ui'
import { loadState, saveState, type TeamMember } from '../lib/storage'
import { Users, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Team() {
  const navigate = useNavigate()
  const initial = useMemo(() => loadState(), [])
  const [teamName, setTeamName] = useState(initial.team?.teamName ?? '')
  const [members, setMembers] = useState<TeamMember[]>(
    initial.team?.members?.length
      ? initial.team.members
      : [
          { name: '', email: '', contact: '' },
          { name: '', email: '', contact: '' },
        ]
  )

  function updateMember(idx: number, patch: Partial<TeamMember>) {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, ...patch } : m)))
  }

  function addMember() {
    setMembers((prev) => (prev.length >= 4 ? prev : [...prev, { name: '', email: '', contact: '' }]))
  }

  function removeMember(idx: number) {
    setMembers((prev) => prev.filter((_, i) => i !== idx))
  }

  const valid = teamName.trim().length >= 2 && members.length >= 2 && members.every((m) => m.name && m.email)

  function save() {
    const state = loadState()
    state.team = { teamName: teamName.trim(), members }
    saveState(state)
    navigate('/select')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Registration</h1>
          <p className="mt-1 text-sm text-white/70">No password. Just enter team details and proceed.</p>
        </div>
        <Badge variant="soft" className="inline-flex items-center gap-2">
          <Users className="h-4 w-4" /> Team size: 2–4
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Profile</CardTitle>
          <CardDescription>Used for dashboard and judging.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Team Name</Label>
            <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g., ByteBenders" />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Members</div>
              <div className="text-xs text-white/60">At least 2 members are required.</div>
            </div>
            <Button variant="secondary" size="sm" onClick={addMember} disabled={members.length >= 4}>
              <Plus className="h-4 w-4" /> Add member
            </Button>
          </div>

          <div className="grid gap-4">
            {members.map((m, idx) => (
              <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">Member {idx + 1}</div>
                  {members.length > 2 && (
                    <Button variant="ghost" size="sm" onClick={() => removeMember(idx)}>
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  )}
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={m.name} onChange={(e) => updateMember(idx, { name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={m.email} onChange={(e) => updateMember(idx, { email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact</Label>
                    <Input value={m.contact} onChange={(e) => updateMember(idx, { contact: e.target.value })} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button size="lg" className="sm:flex-1" onClick={save} disabled={!valid}>
              Save & Continue
            </Button>
            <Link to="/" className="sm:flex-1">
              <Button size="lg" variant="secondary" className="w-full">
                Back to Overview
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
