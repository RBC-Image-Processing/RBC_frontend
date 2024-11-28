import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#005A9C' },
    secondary: { main: '#FDB913' },
    success: { main: '#00A651' },
    background: { default: '#F0F2F5' },
  },
  typography: { fontFamily: 'Poppins, Arial, sans-serif' },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          textTransform: 'none',
          fontWeight: 'bold',
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        },
      },
    },
  },
});

export default theme;
