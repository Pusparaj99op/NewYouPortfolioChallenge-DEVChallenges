import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSessionCached, getSession } from '../lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from './ui'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'authed' | 'nope'>(() =>
    getSessionCached() ? 'authed' : 'loading'
  )

  useEffect(() => {
    let mounted = true
    getSession()
      .then((s) => {
        if (!mounted) return
        setStatus(s ? 'authed' : 'nope')
      })
      .catch(() => {
        if (!mounted) return
        setStatus('nope')
      })
    return () => {
      mounted = false
    }
  }, [])

  if (status === 'loading') {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Checking session…</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-white/70">Please wait.</CardContent>
      </Card>
    )
  }

  if (status === 'nope') return <Navigate to="/login" replace />
  return <>{children}</>
}
