import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './styles/theme.css'
import './styles/global.css'
import logo from './assets/logo-hospital-jerez.png'
import Navigation from './components/Navigation'
import UserList from './components/Users/UserList'
import ResidentList from './components/Residents/ResidentList'
import MenuCalendar from './components/Menus/MenuCalendar'
import AttendanceControl from './components/Attendance/AttendanceControl'
import Communications from './components/Communications/Communications'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import { AuthProvider, useAuth } from './context/AuthContext'
import UserNav from './components/Auth/UserNav'
import ServerStatus from './components/ServerStatus/ServerStatus'

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <ServerStatus />
          <img src={logo} className="app-logo" alt="San Juan Grande logo" />
          {isAuthenticated && (
            <>
              <UserNav />
            </>
          )}
        </header>
        {isAuthenticated && <Navigation />}
        <div className="watermark"></div>
        <main>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            <Route path="/usuarios" element={<PrivateRoute><UserList /></PrivateRoute>} />
            <Route path="/residentes" element={<PrivateRoute><ResidentList /></PrivateRoute>} />
            <Route path="/menus" element={<PrivateRoute><MenuCalendar /></PrivateRoute>} />
            <Route path="/asistencia" element={<PrivateRoute><AttendanceControl /></PrivateRoute>} />
            <Route path="/comunicaciones" element={<PrivateRoute><Communications /></PrivateRoute>} />
            <Route path="/" element={
              <PrivateRoute>
                <div className="welcome">Bienvenido a San Juan Grande</div>
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
