import './App.css'
import Navbar from './components/Navbar'
import { Home } from './pages/Home'
import { Intermediate } from './pages/Intermediate'
import { Workspace } from './pages/Workspace'
import Saved from './pages/saved'
import Landing from './pages/Landing'
import ProtectedRoute from './components/ProtectedRoute'
import { ThemeProvider } from './contexts/theme-context'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/intermediate"
              element={
                <ProtectedRoute>
                  <Intermediate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/final"
              element={
                <ProtectedRoute>
                  <Workspace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <Saved />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
