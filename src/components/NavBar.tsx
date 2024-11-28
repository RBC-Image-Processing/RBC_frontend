import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LogIn as LoginIcon,
  LayoutDashboard as DashboardIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {getToken} from "../api/token"

const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& span': {
    width: 10,
    height: 30,
    marginRight: 5,
    borderRadius: 5,
    '&:nth-of-type(1)': { backgroundColor: theme.palette.primary.main },
    '&:nth-of-type(2)': { backgroundColor: theme.palette.secondary.main },
    '&:nth-of-type(3)': { backgroundColor: theme.palette.success.main },
  },
}));

const NavBar: React.FC = () => {
  const {  logout } = useAuth();
  const token = getToken("token"); 
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Logo>
          <span></span>
          <span></span>
          <span></span>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit', ml: 1 }}
          >
            RBC MIDaP
          </Typography>
        </Logo>
        <Box sx={{ flexGrow: 1 }} />
        {token ? (
          <>
            <Button
              color="primary"
              onClick={() => navigate('/dashboard')}
              startIcon={<DashboardIcon size={18} />}
            >
              Dashboard
            </Button>
            <Button
              color="primary"
              onClick={() => {
                logout();
                navigate('/');
              }}
              startIcon={<LoginIcon size={18} />}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            color="primary"
            onClick={() => navigate('/login')}
            startIcon={<LoginIcon size={18} />}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
