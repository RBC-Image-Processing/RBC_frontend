import React, { useState } from 'react';
import { Box, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import { Eye, Upload } from 'lucide-react';
import { DICOMVaultLayout } from '../components/DICOMVaultLayout';
import { ViewInterface } from '../components/ViewInterface';
import { UploadInterface } from '../components/UploadInterface';

export const DICOMVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState('view');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <DICOMVaultLayout>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          variant={isMobile ? 'fullWidth' : 'standard'}
        >
          <Tab
            label={isMobile ? 'View' : 'View Images'}
            value="view"
            icon={<Eye size={18} />}
            iconPosition="start"
          />
          <Tab
            label={isMobile ? 'Upload' : 'Upload Images'}
            value="upload"
            icon={<Upload size={18} />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
      {activeTab === 'view' && <ViewInterface />}
      {activeTab === 'upload' && <UploadInterface />}
    </DICOMVaultLayout>
  );
};

export default DICOMVault;
