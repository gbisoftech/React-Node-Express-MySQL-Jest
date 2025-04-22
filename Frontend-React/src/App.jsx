import React from 'react';
import {
  BrowserRouter as Router,
  Routes, Route,
  useLocation, Navigate,
  Outlet
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Header from './components/layout/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage, RegisterPage, HomePage, WelcomePage } from './pages';

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return <Outlet />;
}

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" Component={WelcomePage} />
            <Route path="/login" Component={LoginPage} />
            <Route path="/register" Component={RegisterPage} />
            <Route element={<ProtectedLayout />}>
              <Route path="/home" Component={HomePage} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
