import { useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge, Button, Card, CardContent } from '../components/ui'
import AnimatedBackground from '../components/AnimatedBackground'
import { eventInfo, judgeCriteria, prizes } from '../lib/data'
import { Calendar, Clock, MapPin, Users, Sparkles, GitBranch, ShieldCheck, Trophy, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

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

export default function Landing() {
  const navigate = useNavigate()
  const root = useRef<HTMLDivElement | null>(null)
  const prefersReduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => {
    if (!root.current || prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-badge',
        { y: 12, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
      )
      gsap.fromTo(
        '.hero-title',
        { y: 18, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out', delay: 0.1 }
      )
      gsap.fromTo(
        '.hero-sub',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.2 }
      )
      gsap.fromTo(
        '.hero-cta',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.35 }
      )

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%' },
          }
        )
      })
    }, root)

    return () => ctx.revert()
  }, [prefersReduced])

  return (
    <div ref={root} className="relative">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40">
        <div className="relative min-h-[520px]">
          <AnimatedBackground />
          <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-16">
            <div className="max-w-2xl">
              <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80">
                <Sparkles className="h-4 w-4 text-cyan-200" />
                Presented by Coding Club, KDKCE • <span className="text-white/60">Autonomous | NAAC & NBA</span>
              </div>

              <h1 className="hero-title mt-5 text-4xl font-extrabold tracking-tight md:text-6xl">
                HACKTHONIX <span className="text-white/60">2.0</span>
                <span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-200 to-indigo-200 bg-clip-text text-transparent">
                  Ship before Sunset
                </span>
              </h1>

              <p className="hero-sub mt-4 text-base text-white/75 md:text-lg">
                A 10-hour innovation sprint where teams build from zero and ship a working prototype before the day ends.
              </p>

              <div className="hero-cta mt-7 flex flex-col gap-2 sm:flex-row">
                <Button size="lg" onClick={() => navigate('/register')}>
                  Register now <ArrowRight className="h-4 w-4" />
                </Button>
                <Link to="/login">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Team login
                  </Button>
                </Link>
                <a href="http://www.kdkce.edu.in" target="_blank" rel="noreferrer" className="sm:ml-2">
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto">
                    Visit website
                  </Button>
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Stat icon={Calendar} label="Date" value={eventInfo.date} />
                <Stat icon={Clock} label="Reporting" value={eventInfo.reportingTime} />
                <Stat icon={MapPin} label="Venue" value={eventInfo.venue} />
                <Stat icon={Users} label="Team size" value="2–4 members" />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="soft">12 problem statements</Badge>
                <Badge variant="soft">10-minute PS lock</Badge>
                <Badge variant="soft">GitHub sync cadence</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <Card className="reveal">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                <GitBranch className="h-5 w-5 text-cyan-200" />
              </div>
              <div>
                <div className="text-sm font-semibold">Commit tracking</div>
                <div className="text-xs text-white/60">Commit frequency matters. Keep shipping.</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/75">
              Teams submit a GitHub repo URL. The platform polls activity every 5 minutes (demo uses manual sync).
            </p>
          </CardContent>
        </Card>

        <Card className="reveal">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                <ShieldCheck className="h-5 w-5 text-fuchsia-200" />
              </div>
              <div>
                <div className="text-sm font-semibold">Clear scoring</div>
                <div className="text-xs text-white/60">4 criteria • 0–25 each</div>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-sm text-white/75">
              {judgeCriteria.map((c) => (
                <div key={c.key} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <span>{c.label}</span>
                  <span className="text-xs text-white/60">/ {c.max}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="reveal">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                <Trophy className="h-5 w-5 text-amber-200" />
              </div>
              <div>
                <div className="text-sm font-semibold">Prize pool</div>
                <div className="text-xs text-white/60">Win cash + recognition</div>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {prizes.map((p) => (
                <div key={p.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <span className="text-sm text-white/80">{p.label}</span>
                  <span className="text-sm font-semibold">₹{p.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="reveal mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-cyan-200" /> Ready to sprint?
            </div>
            <p className="mt-1 text-sm text-white/70">
              Register your team, complete payment, then select your problem statement.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button size="lg" onClick={() => navigate('/register')}>
              Start registration
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/select')}>
              View PS grid
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-10 text-xs text-white/50">
        Note: This is a frontend demo in Vite. Payment is simulated (no real money charged).
      </div>
    </div>
  )
}
