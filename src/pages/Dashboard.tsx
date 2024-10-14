import React from 'react';
import { Typography, Container, Box, Grid, Paper, Avatar } from '@mui/material';
import { Activity, FileText, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const dashboardItems = [
    {
      title: 'Activity Overview',
      icon: Activity,
      color: 'primary.main',
      description: 'Recent activities and statistics will be displayed here.',
    },
    {
      title: 'Recent Reports',
      icon: FileText,
      color: 'secondary.main',
      description: 'Your latest reports and analyses will be listed here.',
    },
    {
      title: 'Image Analysis',
      icon: ImageIcon,
      color: 'success.main',
      description: 'Access and manage your medical image analyses here.',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Welcome, {user?.email}
        </Typography>
        <Grid container spacing={3}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{ bgcolor: item.color, mr: 2, width: 56, height: 56 }}
                  >
                    <item.icon size={32} />
                  </Avatar>
                  <Typography variant="h6">{item.title}</Typography>
                </Box>
                <Typography variant="body1">{item.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
