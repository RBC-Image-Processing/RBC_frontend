import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Modal,
  IconButton,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
  animation: `${fadeIn} 0.3s ease-out`,
}));

const SuccessIcon = styled(CheckCircle)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.success.main,
  marginBottom: theme.spacing(2),
}));

const ActivateAccount: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { login } = useAuth();
    const {loading, activateAccount} = useUser();
  const navigate = useNavigate();

  // Extract token from query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    try {
      // Here you would typically make an API call to update the password
      await activateAccount(password, token)
    } catch (error) {
      console.error('Error activating account:', error);
    }
    // For this example, we'll just simulate a successful password update
    setIsModalOpen(true);
  };

  const handleModalClose = async() => {

    setIsModalOpen(false);
    // Simulate logging in with the new password
    if (await login('user@example.com', 'password')) {
      navigate('/dashboard');
    }
  };

  const calculatePasswordStrength = (password: string) => {
    // This is a simple password strength calculation
    // In a real application, you'd want a more sophisticated algorithm
    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = 0;
    if (length > 7) strength += 25;
    if (hasUppercase) strength += 25;
    if (hasLowercase) strength += 25;
    if (hasNumbers) strength += 12.5;
    if (hasSpecialChars) strength += 12.5;

    return Math.min(100, strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography
            component="h1"
            variant="h5"
            gutterBottom
            fontWeight="bold"
            textAlign="center"
          >
            Activate Your Account
          </Typography>
          <Typography variant="body1" gutterBottom textAlign="center">
            Please set a new password for your account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={handlePasswordChange}
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
            <LinearProgress
              variant="determinate"
              value={passwordStrength}
              sx={{ mt: 1, mb: 2 }}
              color={
                passwordStrength > 75
                  ? 'success'
                  : passwordStrength > 50
                    ? 'warning'
                    : 'error'
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            >
              Activate Account
            </Button>
          </Box>
        </CardContent>
      </Card>
      <StyledModal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="activation-success-modal"
      >
        <ModalContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <SuccessIcon />
            <Typography
              variant="h5"
              component="h2"
              sx={{ mt: 2, fontWeight: 'bold' }}
            >
              Account Activated
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 2, mb: 3, textAlign: 'center' }}
            >
              Your account has been successfully activated. You now have access
              to the RBC MIDaP platform.
            </Typography>
            <Button
              onClick={handleModalClose}
              variant="contained"
              color="primary"
              fullWidth
            >
              Proceed to Dashboard
            </Button>
          </Box>
        </ModalContent>
      </StyledModal>
    </Container>
  );
};

export default ActivateAccount;
