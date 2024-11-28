import React, { useState } from 'react';
import {
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Save as SaveIcon, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { resetPassword } = useAuth();
  // Extract token from query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    // Here you would typically call an API to reset the password
    try {
      await resetPassword(password, token);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
    setIsSuccess(true);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography
            component="h1"
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            mb={3}
          >
            Reset Password
          </Typography>
          {!isSuccess ? (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                startIcon={<SaveIcon />}
              >
                Reset Password
              </Button>
            </Box>
          ) : (
            <Alert severity="success">
              Your password has been successfully reset. Redirecting to login...
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ResetPassword;
