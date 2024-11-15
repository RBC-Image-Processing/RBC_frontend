import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Box,
  Typography,
  Divider,
  Avatar,
  CircularProgress
} from '@mui/material';
import { Study } from '../../types/index';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'; // Example icon

interface ImageListProps {
  studies: Study[];
  onStudySelect: (study: Study) => void;
  selectedStudy?: Study;
}

export const ImageList: React.FC<ImageListProps> = ({
  studies,
  onStudySelect,
  selectedStudy,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredStudies = studies.filter(
    (study) =>
      study.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search studies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
 {filteredStudies.length==0?   <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '200px' // Adjust this value based on your layout
      }}
    >
      <CircularProgress />
    </Box> : <List sx={{ flexGrow: 1, overflow: 'auto' }}>
      {filteredStudies &&
        filteredStudies.map((study) => (
          <React.Fragment key={study.studyId}>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedStudy?.studyId === study.studyId}
                onClick={() => onStudySelect(study)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Icon for modality */}
                  <Avatar sx={{ backgroundColor: '#1976d2', marginRight: 2 }}>
                    <MedicalServicesIcon />
                  </Avatar>

                  {/* Study information */}
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {study.patientName}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          Modality: {study.modality}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span">
                          Date: {study.studyDate}
                        </Typography>
                        <br />
                        <Typography variant="body2" color="textSecondary">
                          {study.description}
                        </Typography>
                      </>
                    }
                  />
                </Box>
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
    </List>}
    </Box>
  );
};
