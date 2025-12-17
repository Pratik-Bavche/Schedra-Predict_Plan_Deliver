import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "@/components/layout/DashboardLayout"
import DashboardPage from "@/pages/DashboardPage"
import ProjectsPage from "@/pages/ProjectsPage"
import ProjectDetailsPage from "@/pages/ProjectDetailsPage"
import AnalyticsPage from "@/pages/AnalyticsPage"
import ForecastsPage from "@/pages/ForecastsPage"
import SettingsPage from "@/pages/SettingsPage"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/forecasts" element={<ForecastsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
