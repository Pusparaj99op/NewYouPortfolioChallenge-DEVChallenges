import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import Overview from './pages/Overview'
import Team from './pages/Team'
import SelectPS from './pages/SelectPS'
import Dashboard from './pages/Dashboard'
import Judge from './pages/Judge'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Payment from './pages/Payment'
import ProtectedRoute from './components/ProtectedRoute'
import JudgePortal from './pages/JudgePortal'
import AdminPortal from './pages/AdminPortal'

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/team" element={<Team />} />
          <Route path="/select" element={<SelectPS />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/judge" element={<Judge />} />
          <Route path="/judge-portal" element={<JudgePortal />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-portal" element={<AdminPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}
