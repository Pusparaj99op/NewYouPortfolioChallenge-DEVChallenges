import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Divider } from '../components/ui'
import { eventInfo, judgeCriteria, prizes } from '../lib/data'
import { Calendar, Clock, MapPin, Users, Trophy, GitBranch, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
        <Icon className="h-5 w-5 text-cyan-200" />
      </div>
      <div>
        <div className="text-xs text-white/60">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  )
}

export default function Overview() {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 md:grid-cols-2 md:items-stretch">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl md:text-2xl">10-Hour Innovation Sprint</CardTitle>
                <CardDescription>Build from Zero • Ship before Sunset • Outperform the Rest</CardDescription>
              </div>
              <Badge>HACKTHONIX 2.0</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/80">
              Presented by <span className="font-semibold">Coding Club, K.D.K. College of Engineering, Nagpur</span>{' '}
              (Autonomous Institute | Accredited by NAAC and NBA).
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Stat icon={Calendar} label="Date" value={eventInfo.date} />
              <Stat icon={Clock} label="Reporting Time" value={eventInfo.reportingTime} />
              <Stat icon={MapPin} label="Venue" value={eventInfo.venue} />
              <Stat icon={Users} label="Audience" value={eventInfo.audience} />
            </div>

            <Divider />

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="soft">Team size: 2–4</Badge>
              <Badge variant="soft">12 problem statements</Badge>
              <Badge variant="soft">Selection lock: 10 minutes</Badge>
              <Badge variant="soft">GitHub sync: every 5 minutes</Badge>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link to="/team" className="sm:flex-1">
                <Button className="w-full" size="lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/select" className="sm:flex-1">
                <Button className="w-full" size="lg" variant="secondary">
                  Browse Problem Statements
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Prize Pool</CardTitle>
            <CardDescription>Compete for cash prizes and bragging rights.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {prizes.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                      <Trophy className="h-5 w-5 text-fuchsia-200" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{p.label}</div>
                      <div className="text-xs text-white/60">Cash prize</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold">₹{p.amount.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <Divider />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Registration Fees</div>
              <div className="mt-2 grid gap-2 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <span>Early Bird</span>
                  <span className="font-semibold">₹110 / person</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Regular</span>
                  <span className="font-semibold">₹150 / person</span>
                </div>
                <div className="text-xs text-white/60">Early bird ends: 28 February 2026</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-cyan-200" /> Platform Workflow (Participants)
            </CardTitle>
            <CardDescription>Streamlined team login, selection lock, GitHub tracking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/80">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <span className="font-semibold">Register & Login</span> with Team Name and member details — no password.
              </li>
              <li>
                <span className="font-semibold">Select one Problem Statement</span> from a grid. You can change within{' '}
                <span className="font-semibold">10 minutes</span>, then it locks.
              </li>
              <li>
                <span className="font-semibold">Submit GitHub repo URL</span>. Commits are checked every{' '}
                <span className="font-semibold">5 minutes</span>.
              </li>
              <li>
                Use the <span className="font-semibold">Sprint Dashboard</span> for countdown, PS, and sync status.
              </li>
            </ol>
            <div className="pt-2">
              <Link to="/dashboard">
                <Button variant="secondary">Open Sprint Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-fuchsia-200" /> Judging Criteria
            </CardTitle>
            <CardDescription>0–25 points each, averaged across judges.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              {judgeCriteria.map((c) => (
                <div key={c.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{c.label}</div>
                    <Badge variant="outline">0–{c.max}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-white/70">{c.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Rounds & Structure</CardTitle>
            <CardDescription>Two-round format designed for rapid prototyping and clear storytelling.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Round 1</div>
              <div className="mt-1 text-sm text-white/70">Actual Prototype Development (Simulated 10-hour sprint)</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Round 2</div>
              <div className="mt-1 text-sm text-white/70">Problem Statement Presentation</div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
