import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import DashboardLayout from "@/components/layout/DashboardLayout"
import DashboardPage from "@/pages/DashboardPage"
import ProjectsPage from "@/pages/ProjectsPage"
import ProjectDetailsPage from "@/pages/ProjectDetailsPage"
import AnalyticsPage from "@/pages/AnalyticsPage"
import ForecastsPage from "@/pages/ForecastsPage"
import SettingsPage from "@/pages/SettingsPage"
import AuthPage from "@/pages/AuthPage"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { Loader2 } from "lucide-react"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  if (!user) return <Navigate to="/auth" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/forecasts" element={<ForecastsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

          </Routes>
        </Router>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
