export type ApiError = { error: any }

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    credentials: 'include',
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error?.error ?? data?.error ?? 'Request failed')
  return data as T
}

export const api = {
  health: () => request<{ ok: true }>('/api/health'),
  event: () => request<any>('/api/event'),

  logout: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),

  teamRegister: (payload: { teamName: string; members: Array<{ name: string; email: string; contact?: string }> }) =>
    request<{ ok: true; team: any }>('/api/auth/team/register', { method: 'POST', body: JSON.stringify(payload) }),
  teamLogin: (payload: { teamName: string }) =>
    request<{ ok: true; team: any }>('/api/auth/team/login', { method: 'POST', body: JSON.stringify(payload) }),
  teamMe: () => request<{ team: any; event: any }>('/api/team/me'),
  teamPay: (payload: { tier: 'early' | 'regular'; method: 'UPI' | 'Card' | 'NetBanking' }) =>
    request<{ ok: true; team: any }>('/api/team/pay', { method: 'POST', body: JSON.stringify(payload) }),
  teamSelect: (payload: { problemId: string }) =>
    request<{ ok: true; team: any }>('/api/team/select', { method: 'POST', body: JSON.stringify(payload) }),
  teamRepo: (payload: { repoUrl: string }) =>
    request<{ ok: true; team: any }>('/api/team/repo', { method: 'POST', body: JSON.stringify(payload) }),

  judgeLogin: (payload: { judgeId: string; passcode: string }) =>
    request<{ ok: true }>('/api/auth/judge/login', { method: 'POST', body: JSON.stringify(payload) }),
  judgeTeams: () => request<{ teams: any[] }>('/api/judge/teams'),
  judgeScore: (payload: {
    teamId: string
    commitFrequency: number
    codeQuality: number
    problemRelevance: number
    finalSubmission: number
    notes: string
  }) => request<{ ok: true; score: any }>('/api/judge/score', { method: 'POST', body: JSON.stringify(payload) }),
  leaderboard: () => request<{ rows: any[] }>('/api/judge/leaderboard'),

  adminLogin: (payload: { passcode: string }) =>
    request<{ ok: true }>('/api/auth/admin/login', { method: 'POST', body: JSON.stringify(payload) }),
  adminTeams: () => request<{ teams: any[] }>('/api/admin/teams'),
  adminStart: (payload: { hours: number }) =>
    request<{ ok: true; event: any }>('/api/admin/event/start', { method: 'POST', body: JSON.stringify(payload) }),
  adminStop: () => request<{ ok: true; event: any }>('/api/admin/event/stop', { method: 'POST' }),
  adminRegistration: (payload: { open: boolean }) =>
    request<{ ok: true; event: any }>('/api/admin/event/registration', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
