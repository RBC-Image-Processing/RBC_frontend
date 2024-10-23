import React from 'react';
import {
  Box,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu, X } from 'lucide-react';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  drawerWidth?: number;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  children,
  sidebarContent,
  drawerWidth = 350,
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate available height (viewport height minus navbar and footer)
  const NAVBAR_HEIGHT = 64; // Your navbar height
  const FOOTER_HEIGHT = 70; // Your footer height
  const availableHeight = `calc(100vh - ${NAVBAR_HEIGHT}px - ${FOOTER_HEIGHT}px)`;

  return (
    <Box
      sx={{
        display: 'flex',
        height: availableHeight,
        overflow: 'hidden', // Prevent scrolling
      }}
    >
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{
            position: 'fixed',
            left: 8,
            top: NAVBAR_HEIGHT + 8,
            zIndex: theme.zIndex.drawer + 1,
            bgcolor: 'background.paper',
            boxShadow: 1,
          }}
        >
          {mobileOpen ? <X /> : <Menu />}
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            height: availableHeight,
            top: `${NAVBAR_HEIGHT}px`,
            boxSizing: 'border-box',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          height: '100%',
          overflow: 'hidden',
          p: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
