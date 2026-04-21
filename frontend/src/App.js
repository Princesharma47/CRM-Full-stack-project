import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Properties from './pages/Properties';
import Deals from './pages/Deals';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main className="p-6 bg-gray-50 min-h-screen">{children}</main>
  </>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>
          }/>
          <Route path="/leads" element={
            <PrivateRoute><Layout><Leads /></Layout></PrivateRoute>
          }/>
          <Route path="/properties" element={
            <PrivateRoute><Layout><Properties /></Layout></PrivateRoute>
          }/>
          <Route path="/deals" element={
            <PrivateRoute><Layout><Deals /></Layout></PrivateRoute>
          }/>
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
