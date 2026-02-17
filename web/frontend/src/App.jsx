import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BusRoutes from './pages/BusRoutes'
import RoutesPage from './pages/Routes'
import StopsPage from './pages/Stops'
import Bookings from './pages/Bookings'
import Analytics from './pages/Analytics'
import Users from './pages/Users'
import Layout from './components/Layout'

function App() {
  // Auto-authenticate for development - bypass login
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  useEffect(() => {
    // Set a dummy token for development
    localStorage.setItem('token', 'dev-token-bypass')
    setIsAuthenticated(true)
  }, [])

  const handleLogin = (token) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          } 
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/bus-routes"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <BusRoutes />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/routes"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <RoutesPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/stops"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <StopsPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/bookings"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <Bookings />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/analytics"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <Analytics />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/users"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <Users />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}

export default App
