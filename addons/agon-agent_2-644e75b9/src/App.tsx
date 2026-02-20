import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Platform from './pages/Platform'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-slate-950 text-white">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/platform/*" element={<Platform />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-3xl px-4 py-20">
                <div className="text-3xl font-semibold tracking-tight">Page not found</div>
                <div className="mt-2 text-white/70">The page you’re looking for doesn’t exist.</div>
                <a
                  href="/"
                  className="mt-6 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-950"
                >
                  Go home
                </a>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
