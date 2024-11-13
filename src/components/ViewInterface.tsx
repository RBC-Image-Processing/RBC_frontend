import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Study } from '../types/index';
import { DICOMTable } from './DICOMTable';
import { DICOMViewer } from './DICOMViewer';
import axios from 'axios';

export const ViewInterface: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState<Record<string, string>>({
    patientId: '',
    dateRange: '',
  });
  const [allStudies, setAllStudies] = useState<any[]>([]);
  const [filteredStudies, setFilteredStudies] = useState<any[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // useEffect(() => {
  //   const fetchStudies = async () => {
  //     setIsLoading(true);
  //     try {
  //       // This would typically be an API call
  //       const studies: Study[] = [
  //         {
  //           id: '1',
  //           patientId: '12345',
  //           studyDate: '2023-05-15',
  //           description: 'Chest X-Ray',
  //           modality: 'XR',
  //           instances: [
  //             { id: '1-1', imagePath: '/images/sample_dicom.dcm' },
  //             { id: '1-2', imagePath: '/images/sample_dicom1.dcm' },
  //           ],
  //         },
  //         {
  //           id: '2',
  //           patientId: '67890',
  //           studyDate: '2023-05-14',
  //           description: 'Brain MRI',
  //           modality: 'MR',
  //           instances: [
  //             { id: '2-1', imagePath: '/images/sample_dicom.dcm' },
  //             { id: '2-2', imagePath: '/images/sample_dicom1.dcm' },
  //             { id: '2-3', imagePath: '/images/sample_dicom2.dcm' },
  //           ],
  //         },
  //       ];
  //       setAllStudies(studies);
  //       setFilteredStudies(studies);
  //     } catch (error) {
  //       console.error('Error fetching studies:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchStudies();
  // }, []);


  useEffect(() => {
    const fetchStudies = async () => {
      setIsLoading(true);
      try {
        // Make the API call to fetch studies
        const response = await axios.get<any>('http://localhost:8000/api/study');

        console.log(response, "the response")
        
        // Update the state with the fetched studies

        const filteredValue = response.data.data.filter((item)=> {return item !== null});

        console.log(filteredValue, "the filtered value");
        setAllStudies(filteredValue);
        setFilteredStudies(filteredValue);
      } catch (error) {
        console.error('Error fetching studies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudies();
  }, []);

  useEffect(() => {
    const filtered = allStudies.filter((study) => {
      const patientIdMatch = study.patientId
        .toLowerCase()
        .includes(searchCriteria.patientId.toLowerCase());
      const dateMatch =
        !searchCriteria.dateRange ||
        study.studyDate === searchCriteria.dateRange;
      return patientIdMatch && dateMatch;
    });
    setFilteredStudies(filtered);
  }, [searchCriteria, allStudies]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        View DICOM Images
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          mb: 4,
        }}
      >
        <TextField
          label="Patient ID"
          name="patientId"
          value={searchCriteria.patientId}
          onChange={(e) =>
            setSearchCriteria({ ...searchCriteria, patientId: e.target.value })
          }
          fullWidth
        />
        <TextField
          label="Date Range"
          name="dateRange"
          type="date"
          value={searchCriteria.dateRange}
          onChange={(e) =>
            setSearchCriteria({ ...searchCriteria, dateRange: e.target.value })
          }
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <DICOMTable
          studies={filteredStudies}
          onStudySelect={setSelectedStudy}
        />
      )}
      {selectedStudy && (
        <DICOMViewer
          key={selectedStudy.id}
          study={selectedStudy}
          onClose={() => setSelectedStudy(null)}
        />
      )}
    </Box>
  );
};
