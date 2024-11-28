import React, { useState } from 'react';
import {
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword: React.FC = () => {

const {sendResetPasswordRequest, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call an API to send the reset link
    try {
      await sendResetPasswordRequest(email);
      // For now, we'll just simulate a successful submission
    } catch (error) {
      console.error('Error sending reset link:', error);
      
    }
    setIsSubmitted(true);
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
            Forgot Password
          </Typography>
          {!isSubmitted ? (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="body2" mb={2}>
                Enter your email address and a link will be sent to your email for password reset.
            
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
           
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            </Box>
          ) : (
            <Alert severity="success">
              If an account exists for {email}, you will receive a password
              reset link shortly.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
