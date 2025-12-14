import './App.css';
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/Landing';
import { HomePage } from './pages/Home';
import { TemplatesPage } from './pages/Templates';
import { AuthPage } from './pages/Auth';
import { WorkspacePage } from './pages/Workspace';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/workspace/:projectId" element={<WorkspacePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
