import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Properties from './pages/Properties';
import Deals from './pages/Deals';
import LifeAtAgnayi from './pages/LifeAtAgnayi';

// Wraps protected pages in the sidebar shell
const AppLayout = ({ children }) => (
  <PrivateRoute>
    <Sidebar>{children}</Sidebar>
  </PrivateRoute>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — all share the Sidebar layout */}
          <Route path="/dashboard"  element={<AppLayout><Dashboard  /></AppLayout>} />
          <Route path="/leads"      element={<AppLayout><Leads      /></AppLayout>} />
          <Route path="/properties" element={<AppLayout><Properties /></AppLayout>} />
          <Route path="/deals"      element={<AppLayout><Deals      /></AppLayout>} />
          <Route path="/life-at-agnayi" element={<AppLayout><LifeAtAgnayi /></AppLayout>} />

          {/* Catch-all → dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
