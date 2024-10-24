import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import theme from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ActivateAccount from './pages/ActivateAccount';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserManagement from './pages/UserManagement';
import DICOMVault from './pages/DICOMVault';
import RadiologyWorkspace from './pages/RadiologyWorkSpace';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import { CornerstoneProvider } from './contexts/CornerstoneContext';
import AIAssist from './pages/AIAssist';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CornerstoneProvider>
          <Router>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <NavBar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/activate" element={<ActivateAccount />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <PrivateRoute>
                        <UserManagement />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dicom-viewer"
                    element={
                      <PrivateRoute>
                        <DICOMVault />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/radiologist-corner"
                    element={
                      <PrivateRoute>
                        <RadiologyWorkspace />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/ai-assist"
                    element={
                      <PrivateRoute>
                        <AIAssist />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </CornerstoneProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
