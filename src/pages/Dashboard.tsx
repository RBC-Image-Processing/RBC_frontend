import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Users,
  Film,
  Stethoscope,
  Brain,
  BarChart2,
  Upload,
  Search,
  FileText,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardItemProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

const DashboardItem: React.FC<DashboardItemProps> = ({
  title,
  description,
  icon: Icon,
  color,
  onClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Icon size={32} color={color} />
        <Typography variant="h6" ml={2}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" flexGrow={1} mb={2}>
        {description}
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={onClick}
        fullWidth={isMobile}
      >
        Access
      </Button>
    </Paper>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: 'User Management',
      description: 'Manage user accounts and roles across the platform.',
      icon: Users,
      color: '#4CAF50',
      onClick: () => navigate('/users'),
      roles: ['Administrator'],
    },
    {
      title: 'DICOM Vault',
      description: 'Upload, view, and manage medical images in DICOM format.',
      icon: Film,
      color: '#2196F3',
      onClick: () => navigate('/dicom-viewer'),
      roles: ['Administrator', 'Radiologist', 'Physician', 'Non-Specialist'],
    },
    {
      title: 'Radiologist Workspace',
      description:
        'Review and provide expert interpretations for medical images.',
      icon: Stethoscope,
      color: '#9C27B0',
      onClick: () => navigate('/radiologist-corner'),
      roles: ['Radiologist'],
    },
    {
      title: 'AI Assist',
      description:
        'Leverage AI for automated image interpretation and analysis.',
      icon: Brain,
      color: '#FF9800',
      onClick: () => navigate('/ai-interpretation'),
      roles: ['Administrator', 'Physician', 'Non-Specialist'],
    },
  ];

  const filteredItems = dashboardItems.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  return (
    <Box sx={{ bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Welcome, {user?.email}
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          {user?.role} Dashboard
        </Typography>
        <Grid container spacing={3} mt={2}>
          {filteredItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <DashboardItem
                title={item.title}
                description={item.description}
                icon={item.icon}
                color={item.color}
                onClick={item.onClick}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;