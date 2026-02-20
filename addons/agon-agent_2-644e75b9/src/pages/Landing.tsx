import { CalendarDays, Clock, MapPin, Trophy, Users, ArrowRight, ShieldCheck, Github } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Card, Badge } from '../components/ui'
import { EVENT, JUDGING } from '../lib/data'
import { formatDateTime } from '../lib/time'

function Prize({ label, amount }: { label: string; amount: number }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-white/70">{label}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-white">
            ₹{amount.toLocaleString('en-IN')}
          </div>
        </div>
        <Trophy className="h-5 w-5 text-amber-300" />
      </div>
    </Card>
  )
}

export default function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt="Hackathon"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="flex flex-col gap-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">10-hour innovation sprint</Badge>
              <Badge tone="neutral">Ship before sunset</Badge>
              <Badge tone="green">Teams: 2–4</Badge>
            </div>

            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {EVENT.name}
                </h1>
                <p className="mt-4 text-white/75">
                  Presented by <span className="font-medium text-white">{EVENT.org}</span>{' '}
                  <span className="text-white/60">{EVENT.accreditation}</span>
                </p>
                <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75">
                  Build from zero, ship before sunset, and outperform the rest. Register your team, select a problem statement
                  from the grid, submit your GitHub repository, and keep shipping commits.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button as-child={undefined} className="w-full sm:w-auto" onClick={() => {}}>
                    <Link to="/platform" className="inline-flex items-center justify-center gap-2">
                      Open Demo Platform <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="secondary" className="w-full sm:w-auto" onClick={() => window.open(EVENT.links.website, '_blank')}>
                    Visit Website
                  </Button>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <CalendarDays className="h-4 w-4" /> Date
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">{formatDateTime(EVENT.dateISO)}</div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Clock className="h-4 w-4" /> Reporting
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">{EVENT.reportingTime}</div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <MapPin className="h-4 w-4" /> Venue
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">{EVENT.venue}</div>
                  </Card>
                </div>
              </div>

              <Card className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/70">Prize pool</div>
                    <div className="mt-1 text-xl font-semibold text-white">Win big. Ship bigger.</div>
                  </div>
                  <Badge tone="amber">₹22,500 total</Badge>
                </div>
                <div className="mt-5 grid gap-3">
                  {EVENT.prizes.map((p) => (
                    <Prize key={p.label} label={p.label} amount={p.amount} />
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Users className="h-4 w-4" /> Early bird
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">₹{EVENT.earlyBirdFee}/person</div>
                    <div className="mt-1 text-xs text-white/50">Ends 28 Feb 2026</div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Users className="h-4 w-4" /> Regular
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">₹{EVENT.regularFee}/person</div>
                    <div className="mt-1 text-xs text-white/50">After early bird</div>
                  </Card>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => window.open(EVENT.links.instagram, '_blank')}>
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> @codingclub_kdk
                    </span>
                  </Button>
                  <Button variant="ghost" onClick={() => window.open('https://github.com', '_blank')}>
                    <span className="inline-flex items-center gap-2">
                      <Github className="h-4 w-4" /> GitHub
                    </span>
                  </Button>
                </div>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <div className="text-lg font-semibold text-white">Schedule & structure</div>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  <li>Round 1: Actual prototype development (simulated 10-hour sprint)</li>
                  <li>Round 2: Problem statement presentation</li>
                  <li>Problem statements: 12 options displayed in a grid</li>
                  <li>Selection window: 10 minutes to change, then locked</li>
                </ul>
              </Card>
              <Card className="p-6">
                <div className="text-lg font-semibold text-white">Judging criteria (0–25 each)</div>
                <div className="mt-3 grid gap-2">
                  {JUDGING.map((j) => (
                    <div key={j.key} className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">{j.title}</div>
                        <div className="text-xs text-white/55">{j.desc}</div>
                      </div>
                      <Badge tone="neutral">0–25</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6">
            <div className="text-lg font-semibold text-white">Participant workflow</div>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-white/75">
              <li>Register team (no password) with members.</li>
              <li>Select 1 problem statement from the grid.</li>
              <li>Submit GitHub repository URL.</li>
              <li>Platform syncs commits every 5 minutes.</li>
            </ol>
          </Card>
          <Card className="p-6 lg:col-span-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-lg font-semibold text-white">Try the demo platform</div>
                <div className="text-sm text-white/65">
                  This is a front-end prototype that simulates the platform requirements.
                </div>
              </div>
              <Button>
                <Link to="/platform" className="inline-flex items-center gap-2">
                  Launch Platform <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Card className="p-4">
                <div className="text-sm font-medium text-white">Team</div>
                <div className="mt-1 text-xs text-white/60">Register, select PS, submit repo.</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm font-medium text-white">Judge</div>
                <div className="mt-1 text-xs text-white/60">Score teams, view commit history.</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm font-medium text-white">Admin</div>
                <div className="mt-1 text-xs text-white/60">Manage teams/PS, override locks.</div>
              </Card>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
