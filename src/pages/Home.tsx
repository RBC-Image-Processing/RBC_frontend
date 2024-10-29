import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LogIn as LoginIcon,
  Database,
  Brain,
  Share2,
  FileText,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {getToken} from "../api/token"

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'url(/images/hero-background.jpg) center/cover no-repeat',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textAlign: 'center',
  position: 'relative',
  padding: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}));

const Home: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();

  const token = getToken("token");

  const handleGetStarted = () => {
    if (token) return navigate('/dashboard');

    navigate('/login');
  };

  const features = [
    {
      title: 'Systematic Image Storage',
      icon: Database,
      color: 'primary.main',
      description:
        'Efficiently store and manage medical images from various hospitals and healthcare facilities.',
    },
    {
      title: 'AI-Powered Interpretation',
      icon: Brain,
      color: 'secondary.main',
      description:
        'Utilize machine learning algorithms for automated interpretation of medical images.',
    },
    {
      title: 'Collaborative Platform',
      icon: Share2,
      color: 'success.main',
      description:
        'Enable seamless collaboration between specialized and non-specialized healthcare providers.',
    },
    {
      title: 'Comprehensive Reporting',
      icon: FileText,
      color: 'info.main',
      description:
        'Generate detailed reports and analyses from processed medical images.',
    },
  ];

  return (
    <Box>
      <HeroSection>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Welcome to RBC MIDaP
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Advancing healthcare through innovative medical image processing
          </Typography>
          <Box mt={4}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleGetStarted}
              startIcon={<LoginIcon />}
              sx={{ py: 1.5, px: 4 }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </HeroSection>
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Grid container spacing={4}>
          {features.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                }}
              >
                <Avatar
                  sx={{ width: 60, height: 60, mb: 2, bgcolor: item.color }}
                >
                  <item.icon size={30} />
                </Avatar>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {item.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
