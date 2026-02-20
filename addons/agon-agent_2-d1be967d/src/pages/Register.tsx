import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Divider, Input, Label } from '../components/ui'
import AnimatedBackground from '../components/AnimatedBackground'
import { type TeamMember } from '../lib/storage'
import { getFee } from '../lib/payment'
import { api } from '../lib/api'
import { Calendar, Users, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const root = useRef<HTMLDivElement | null>(null)
  const [teamName, setTeamName] = useState('')
  const [members, setMembers] = useState<TeamMember[]>(
    [
      { name: '', email: '', contact: '' },
      { name: '', email: '', contact: '' },
    ]
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!root.current) return
    gsap.fromTo('.reg-card', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
  }, [])

  function updateMember(idx: number, patch: Partial<TeamMember>) {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, ...patch } : m)))
  }

  function addMember() {
    setMembers((prev) => (prev.length >= 4 ? prev : [...prev, { name: '', email: '', contact: '' }]))
  }

  function removeMember(idx: number) {
    setMembers((prev) => (prev.length <= 2 ? prev : prev.filter((_, i) => i !== idx)))
  }

  const valid = teamName.trim().length >= 2 && members.length >= 2 && members.every((m) => m.name && m.email)

  async function saveAndContinue() {
    setLoading(true)
    setError(null)
    try {
      await api.teamRegister({ teamName: teamName.trim(), members })
      navigate('/payment')
    } catch (e: any) {
      setError(e?.message ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={root} className="relative">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40">
        <div className="relative">
          <AnimatedBackground />
          <div className="relative mx-auto max-w-4xl px-6 py-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <Badge variant="soft" className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" /> Registration
                </Badge>
                <h1 className="mt-3 text-3xl font-bold tracking-tight">Register your team</h1>
                <p className="mt-1 text-sm text-white/70">Complete profile → payment → problem statement selection.</p>
              </div>
              <Badge variant="outline" className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" /> 10 March 2026
              </Badge>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <Card className="reg-card md:col-span-2">
                <CardHeader>
                  <CardTitle>Team details</CardTitle>
                  <CardDescription>Team size: 2–4. Email required for each member.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label>Team name</Label>
                    <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g., ByteBenders" />
                  </div>

                  <Divider />

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Members</div>
                      <div className="text-xs text-white/60">Add up to 4 members.</div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={addMember} disabled={members.length >= 4}>
                      Add member
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {members.map((m, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold">Member {idx + 1}</div>
                          {members.length > 2 && (
                            <Button variant="ghost" size="sm" onClick={() => removeMember(idx)}>
                              Remove
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

                  <Button size="lg" className="w-full" onClick={saveAndContinue} disabled={!valid || loading}>
                    {loading ? 'Creating team…' : 'Continue to payment'} <ArrowRight className="h-4 w-4" />
                  </Button>

                  {error && (
                    <div className="rounded-2xl border border-[color:var(--hx-red)]/30 bg-[color:var(--hx-red)]/10 p-3 text-xs text-white/90">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-white/60">
                    <Link className="hover:text-white" to="/">
                      Back to landing
                    </Link>
                    <Link className="font-semibold text-white/80 hover:text-white" to="/login">
                      Already registered? Login
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="reg-card">
                <CardHeader>
                  <CardTitle>Fees</CardTitle>
                  <CardDescription>Per person fee depends on tier.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/60">Early bird</div>
                    <div className="text-lg font-bold">₹{getFee('early')}/person</div>
                    <div className="mt-1 text-xs text-white/60">Ends: 28 Feb 2026</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/60">Regular</div>
                    <div className="text-lg font-bold">₹{getFee('regular')}/person</div>
                  </div>
                  <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-[var(--hx-surface)] p-4 text-sm text-white/80">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-[color:var(--hx-green)]" />
                    <div>
                      <div className="font-semibold">Next: Payment verification</div>
                      <div className="text-xs opacity-80">You’ll be able to select a PS only after payment.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
