import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Divider, Input, Label } from '../components/ui'
import AnimatedBackground from '../components/AnimatedBackground'
import { api } from '../lib/api'
import { getFee, type FeeTier } from '../lib/payment'
import { CreditCard, QrCode, ShieldCheck, CheckCircle2, ArrowRight, Receipt } from 'lucide-react'

export default function Payment() {
  const navigate = useNavigate()
  const root = useRef<HTMLDivElement | null>(null)
  const [team, setTeam] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [tier, setTier] = useState<FeeTier>('early')
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI')
  const [upi, setUpi] = useState('')

  const membersCount = team?.members?.length ?? 0
  const teamName = team?.teamName ?? ''
  const amount = getFee(tier) * membersCount

  const receipt = team?.payment ?? null

  useEffect(() => {
    if (!root.current) return
    gsap.fromTo('.pay-card', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
  }, [])

  useEffect(() => {
    let mounted = true
    api.teamMe()
      .then((r) => {
        if (!mounted) return
        setTeam(r.team)
      })
      .catch((e) => {
        if (!mounted) return
        setError(e?.message ?? 'Please login / register first')
      })
    return () => {
      mounted = false
    }
  }, [])

  async function pay() {
    if (!team || membersCount < 2) return
    if (method === 'UPI' && upi.trim().length < 6) return
    setLoading(true)
    setError(null)
    try {
      const r = await api.teamPay({ tier, method })
      setTeam(r.team)
      navigate('/dashboard')
    } catch (e: any) {
      setError(e?.message ?? 'Payment failed')
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
                  <ShieldCheck className="h-4 w-4" /> Payment (Simulated)
                </Badge>
                <h1 className="mt-3 text-3xl font-bold tracking-tight">Complete payment</h1>
                <p className="mt-1 text-sm text-white/70">This demo simulates payment and generates a local receipt.</p>
              </div>
              <Badge variant="outline" className="inline-flex items-center gap-2">
                <Receipt className="h-4 w-4" /> Total: ₹{amount.toLocaleString('en-IN')}
              </Badge>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <Card className="pay-card md:col-span-2">
                <CardHeader>
                  <CardTitle>Payment details</CardTitle>
                  <CardDescription>Choose tier and method.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => setTier('early')}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        tier === 'early' ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs text-white/60">Early bird</div>
                      <div className="mt-1 text-lg font-bold">₹{getFee('early')}/person</div>
                      <div className="mt-1 text-xs text-white/60">Ends 28 Feb 2026</div>
                    </button>
                    <button
                      onClick={() => setTier('regular')}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        tier === 'regular'
                          ? 'border-fuchsia-300/40 bg-fuchsia-300/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs text-white/60">Regular</div>
                      <div className="mt-1 text-lg font-bold">₹{getFee('regular')}/person</div>
                      <div className="mt-1 text-xs text-white/60">Standard fee</div>
                    </button>
                  </div>

                  <Divider />

                  <div className="grid gap-3 sm:grid-cols-3">
                    <button
                      onClick={() => setMethod('UPI')}
                      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                        method === 'UPI' ? 'border-white/20 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <QrCode className="h-4 w-4" /> UPI
                    </button>
                    <button
                      onClick={() => setMethod('Card')}
                      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                        method === 'Card' ? 'border-white/20 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" /> Card
                    </button>
                    <button
                      onClick={() => setMethod('NetBanking')}
                      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                        method === 'NetBanking' ? 'border-white/20 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" /> NetBanking
                    </button>
                  </div>

                  {method === 'UPI' && (
                    <div className="space-y-2">
                      <Label>UPI ID</Label>
                      <Input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="name@bank" />
                      <div className="text-xs text-white/50">Demo only: any value works (min 6 chars).</div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/60">Team</div>
                        <div className="text-sm font-semibold">{teamName || '—'}</div>
                        <div className="mt-1 text-xs text-white/60">Members</div>
                        <div className="text-sm font-semibold">{membersCount || '—'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white/60">Payable</div>
                        <div className="text-2xl font-extrabold">₹{amount.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={pay}
                    disabled={
                      loading || !teamName || membersCount < 2 || (method === 'UPI' && upi.trim().length < 6) || !!receipt
                    }
                  >
                    {receipt ? 'Paid' : loading ? 'Processing…' : 'Pay & Verify'} <ArrowRight className="h-4 w-4" />
                  </Button>

                  {error && (
                    <div className="rounded-2xl border border-[color:var(--hx-red)]/30 bg-[color:var(--hx-red)]/10 p-3 text-xs text-white/90">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-white/60">
                    <Link className="hover:text-white" to="/register">
                      Back to registration
                    </Link>
                    <Link className="hover:text-white" to="/login">
                      Skip to login
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="pay-card">
                <CardHeader>
                  <CardTitle>Receipt</CardTitle>
                  <CardDescription>Stored locally in this demo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!receipt ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                      No receipt yet. Complete payment to unlock PS selection.
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[color:var(--hx-green)]/20 bg-[color:var(--hx-green)]/10 p-4 text-sm text-white/90">
                      <div className="flex items-center gap-2 font-semibold">
                        <CheckCircle2 className="h-4 w-4 text-[color:var(--hx-green)]" /> Payment verified
                      </div>
                      <div className="mt-2 space-y-1 text-xs opacity-90">
                        <div>
                          <span className="text-white/70">Receipt:</span> {receipt.receiptId}
                        </div>
                        <div>
                          <span className="text-white/70">Amount:</span> ₹{receipt.amount.toLocaleString('en-IN')}
                        </div>
                        <div>
                          <span className="text-white/70">Method:</span> {receipt.method}
                        </div>
                        <div>
                          <span className="text-white/70">Paid at:</span> {new Date(receipt.paidAtIso).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
                    Demo backend: payment verification is simulated server-side. For production, integrate Razorpay/Stripe and
                    verify signatures server-side.
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
