import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { Study } from '../../types/index';

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
      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {filteredStudies.map((study) => (
          <ListItem key={study.id} disablePadding>
            <ListItemButton
              selected={selectedStudy?.id === study.id}
              onClick={() => onStudySelect(study)}
            >
              <ListItemText
                primary={study.description}
                secondary={
                  <>
                    <Typography variant="body2" component="span">
                      Patient ID: {study.patientId}
                    </Typography>
                    <br />
                    <Typography variant="body2" component="span">
                      Date: {study.studyDate}
                    </Typography>
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
