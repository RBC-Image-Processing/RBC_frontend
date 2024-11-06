import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Eye } from 'lucide-react';
import { Study } from '../types/index';

interface DICOMTableProps {
  studies: Study[];
  onStudySelect: (study: Study) => void;
}

export const DICOMTable: React.FC<DICOMTableProps> = ({
  studies,
  onStudySelect,
}) => {

  console.log(studies,"the studies are selected");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <TableContainer component={Paper}>
      <Table size={isMobile ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell>Patient ID</TableCell>
            {!isMobile && <TableCell>Study Date</TableCell>}
            <TableCell>Description</TableCell>
            {!isMobile && <TableCell>Modality</TableCell>}
            <TableCell>Instances</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studies.map((study) => (
            <TableRow key={study.studyId}>
              <TableCell>{study.patientId}</TableCell>
              {!isMobile && <TableCell>{study.studyDate}</TableCell>}
              <TableCell>{study.description}</TableCell>
              {!isMobile && <TableCell>{study.modality}</TableCell>}
              <TableCell>
                <Chip
                  label={study.instances.length}
                  color="primary"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onStudySelect(study)} size="small">
                  <Eye size={18} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
