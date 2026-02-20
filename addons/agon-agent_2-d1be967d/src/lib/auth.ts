import { api } from './api'

export type AuthSession = {
  teamName: string
  teamId: string
  paid: boolean
}

const CACHE_KEY = 'hx2_session_cache'

export async function getSession(): Promise<AuthSession | null> {
  try {
    const me = await api.teamMe()
    const session: AuthSession = {
      teamName: me.team.teamName,
      teamId: me.team.id,
      paid: !!me.team.paid,
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(session))
    return session
  } catch {
    return null
  }
}

export function getSessionCached(): AuthSession | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export async function signIn(teamName: string) {
  await api.teamLogin({ teamName })
  await getSession()
}

export async function signOut() {
  try {
    await api.logout()
  } finally {
    localStorage.removeItem(CACHE_KEY)
  }
}

export async function isAuthedTeam() {
  const s = await getSession()
  return !!s
}
