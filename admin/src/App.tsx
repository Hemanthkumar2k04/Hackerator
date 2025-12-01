import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './components/AdminLogin';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
