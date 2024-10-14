import React from 'react';
import { Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3, 0),
  marginTop: 'auto',
}));

const Footer: React.FC = () => (
  <FooterWrapper>
    <Container maxWidth="lg">
      <Typography variant="body2" align="center">
        © 2024 RBC MIDaP | CMU Africa Practicum 24
      </Typography>
    </Container>
  </FooterWrapper>
);

export default Footer;
