import express from 'express'
import cookie from 'cookie'
import { nanoid } from 'nanoid'
import { z } from 'zod'

const app = express()
app.use(express.json({ limit: '1mb' }))

type Role = 'team' | 'judge' | 'admin'

type TeamMember = { name: string; email: string; contact?: string }

type Team = {
  id: string
  teamName: string
  members: TeamMember[]
  createdAtMs: number
  paid: boolean
  payment?: {
    receiptId: string
    tier: 'early' | 'regular'
    amount: number
    method: 'UPI' | 'Card' | 'NetBanking'
    paidAtIso: string
  }
  selection?: {
    problemId: string
    selectedAtMs: number
    lockedAtMs: number
  }
  repoUrl?: string
}

type JudgeScore = {
  teamId: string
  judgeId: string
  commitFrequency: number
  codeQuality: number
  problemRelevance: number
  finalSubmission: number
  notes: string
  createdAtMs: number
}

type EventState = {
  sprintStartMs: number | null
  sprintEndMs: number | null
  registrationOpen: boolean
}

const db = {
  sessions: new Map<string, { role: Role; teamId?: string; judgeId?: string; createdAtMs: number }>(),
  teams: new Map<string, Team>(),
  scores: [] as JudgeScore[],
  event: {
    sprintStartMs: null,
    sprintEndMs: null,
    registrationOpen: true,
  } as EventState,
}

const COOKIE_NAME = 'hx2_session'

function getSession(req: express.Request) {
  const raw = req.headers.cookie
  if (!raw) return null
  const parsed = cookie.parse(raw)
  const sid = parsed[COOKIE_NAME]
  if (!sid) return null
  return { sid, data: db.sessions.get(sid) ?? null }
}

function setSession(res: express.Response, role: Role, data: { teamId?: string; judgeId?: string }) {
  const sid = nanoid(24)
  db.sessions.set(sid, { role, ...data, createdAtMs: Date.now() })
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(COOKIE_NAME, sid, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  )
}

function clearSession(res: express.Response) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(COOKIE_NAME, '', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  )
}

function requireRole(role: Role) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const s = getSession(req)
    if (!s?.data) return res.status(401).json({ error: 'Not authenticated' })
    if (s.data.role !== role) return res.status(403).json({ error: 'Forbidden' })
    ;(req as any).session = s
    next()
  }
}

// ---- Schemas ----
const memberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  contact: z.string().optional().default(''),
})

const registerSchema = z.object({
  teamName: z.string().min(2),
  members: z.array(memberSchema).min(2).max(4),
})

const loginTeamSchema = z.object({
  teamName: z.string().min(2),
})

const paymentSchema = z.object({
  tier: z.enum(['early', 'regular']),
  method: z.enum(['UPI', 'Card', 'NetBanking']),
})

const selectSchema = z.object({
  problemId: z.string().min(1),
})

const repoSchema = z.object({
  repoUrl: z.string().url(),
})

const judgeLoginSchema = z.object({
  judgeId: z.string().min(2),
  passcode: z.string().min(4),
})

const scoreSchema = z.object({
  teamId: z.string().min(1),
  commitFrequency: z.number().min(0).max(25),
  codeQuality: z.number().min(0).max(25),
  problemRelevance: z.number().min(0).max(25),
  finalSubmission: z.number().min(0).max(25),
  notes: z.string().max(2000).default(''),
})

const adminLoginSchema = z.object({
  passcode: z.string().min(4),
})

// ---- Helpers ----
function feePerPerson(tier: 'early' | 'regular') {
  return tier === 'early' ? 110 : 150
}

function computeAmount(tier: 'early' | 'regular', membersCount: number) {
  return feePerPerson(tier) * membersCount
}

// ---- Routes ----
app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.get('/api/event', (_req, res) => res.json(db.event))

app.post('/api/auth/logout', (_req, res) => {
  clearSession(res)
  res.json({ ok: true })
})

app.post('/api/auth/team/register', (req, res) => {
  if (!db.event.registrationOpen) return res.status(403).json({ error: 'Registration closed' })
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const id = nanoid(10)
  const team: Team = {
    id,
    teamName: parsed.data.teamName,
    members: parsed.data.members,
    createdAtMs: Date.now(),
    paid: false,
  }
  db.teams.set(id, team)
  setSession(res, 'team', { teamId: id })
  res.json({ ok: true, team })
})

app.post('/api/auth/team/login', (req, res) => {
  const parsed = loginTeamSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const team = Array.from(db.teams.values()).find(
    (t) => t.teamName.toLowerCase() === parsed.data.teamName.toLowerCase()
  )
  if (!team) return res.status(404).json({ error: 'Team not found. Register first.' })

  setSession(res, 'team', { teamId: team.id })
  res.json({ ok: true, team })
})

app.get('/api/team/me', requireRole('team'), (req, res) => {
  const sid = (req as any).session.data as any
  const teamId = sid.teamId as string
  const team = db.teams.get(teamId)
  if (!team) return res.status(404).json({ error: 'Team not found' })
  res.json({ team, event: db.event })
})

app.post('/api/team/pay', requireRole('team'), (req, res) => {
  const parsed = paymentSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const sid = (req as any).session.data as any
  const team = db.teams.get(sid.teamId)
  if (!team) return res.status(404).json({ error: 'Team not found' })

  const receiptId = `HX2-${nanoid(8).toUpperCase()}`
  const amount = computeAmount(parsed.data.tier, team.members.length)

  team.paid = true
  team.payment = {
    receiptId,
    tier: parsed.data.tier,
    amount,
    method: parsed.data.method,
    paidAtIso: new Date().toISOString(),
  }

  db.teams.set(team.id, team)
  res.json({ ok: true, team })
})

app.post('/api/team/select', requireRole('team'), (req, res) => {
  const parsed = selectSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const sid = (req as any).session.data as any
  const team = db.teams.get(sid.teamId)
  if (!team) return res.status(404).json({ error: 'Team not found' })
  if (!team.paid) return res.status(403).json({ error: 'Payment required before selecting a problem statement' })

  const now = Date.now()
  const lockMinutes = 10

  if (!team.selection) {
    team.selection = {
      problemId: parsed.data.problemId,
      selectedAtMs: now,
      lockedAtMs: now + lockMinutes * 60 * 1000,
    }
    db.teams.set(team.id, team)
    return res.json({ ok: true, team })
  }

  if (now > team.selection.lockedAtMs) {
    return res.status(403).json({ error: 'Selection locked' })
  }

  team.selection.problemId = parsed.data.problemId
  db.teams.set(team.id, team)
  res.json({ ok: true, team })
})

app.post('/api/team/repo', requireRole('team'), (req, res) => {
  const parsed = repoSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const sid = (req as any).session.data as any
  const team = db.teams.get(sid.teamId)
  if (!team) return res.status(404).json({ error: 'Team not found' })
  if (!team.paid) return res.status(403).json({ error: 'Payment required' })

  team.repoUrl = parsed.data.repoUrl
  db.teams.set(team.id, team)
  res.json({ ok: true, team })
})

// Judge auth (demo passcode)
app.post('/api/auth/judge/login', (req, res) => {
  const parsed = judgeLoginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  if (parsed.data.passcode !== (process.env.JUDGE_PASSCODE ?? 'judge1234')) {
    return res.status(401).json({ error: 'Invalid judge passcode' })
  }
  setSession(res, 'judge', { judgeId: parsed.data.judgeId })
  res.json({ ok: true })
})

app.get('/api/judge/teams', requireRole('judge'), (_req, res) => {
  const teams = Array.from(db.teams.values())
  res.json({ teams })
})

app.post('/api/judge/score', requireRole('judge'), (req, res) => {
  const parsed = scoreSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const s = getSession(req)
  const judgeId = s?.data?.judgeId ?? 'judge'

  const score: JudgeScore = {
    ...parsed.data,
    judgeId,
    createdAtMs: Date.now(),
  }
  db.scores.push(score)
  res.json({ ok: true, score })
})

app.get('/api/judge/leaderboard', requireRole('judge'), (_req, res) => {
  // average by team
  const byTeam = new Map<string, { sum: number; count: number }>()
  for (const s of db.scores) {
    const total = s.commitFrequency + s.codeQuality + s.problemRelevance + s.finalSubmission
    const cur = byTeam.get(s.teamId) ?? { sum: 0, count: 0 }
    cur.sum += total
    cur.count += 1
    byTeam.set(s.teamId, cur)
  }

  const rows = Array.from(db.teams.values()).map((t) => {
    const agg = byTeam.get(t.id)
    const avg = agg ? agg.sum / agg.count : 0
    return {
      teamId: t.id,
      teamName: t.teamName,
      paid: t.paid,
      problemId: t.selection?.problemId ?? null,
      repoUrl: t.repoUrl ?? null,
      avgScore: Number(avg.toFixed(2)),
      judgesCount: agg?.count ?? 0,
    }
  })

  rows.sort((a, b) => b.avgScore - a.avgScore)
  res.json({ rows })
})

// Admin auth (demo passcode)
app.post('/api/auth/admin/login', (req, res) => {
  const parsed = adminLoginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  if (parsed.data.passcode !== (process.env.ADMIN_PASSCODE ?? 'admin1234')) {
    return res.status(401).json({ error: 'Invalid admin passcode' })
  }
  setSession(res, 'admin', {})
  res.json({ ok: true })
})

app.get('/api/admin/teams', requireRole('admin'), (_req, res) => {
  res.json({ teams: Array.from(db.teams.values()) })
})

app.post('/api/admin/event/start', requireRole('admin'), (req, res) => {
  const schema = z.object({ hours: z.number().min(1).max(24) })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const now = Date.now()
  db.event.sprintStartMs = now
  db.event.sprintEndMs = now + parsed.data.hours * 60 * 60 * 1000
  res.json({ ok: true, event: db.event })
})

app.post('/api/admin/event/stop', requireRole('admin'), (_req, res) => {
  db.event.sprintEndMs = Date.now()
  res.json({ ok: true, event: db.event })
})

app.post('/api/admin/event/registration', requireRole('admin'), (req, res) => {
  const schema = z.object({ open: z.boolean() })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  db.event.registrationOpen = parsed.data.open
  res.json({ ok: true, event: db.event })
})

const port = Number(process.env.PORT ?? 8787)
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[hx2-api] listening on http://localhost:${port}`)
})
