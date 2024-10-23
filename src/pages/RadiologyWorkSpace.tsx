// File: src/components/RadiologyWorkspace/RadiologyWorkspace.tsx
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { WorkspaceLayout } from '../components/RadiologyWorkSpace/WorkSpaceLayout';
import { ImageList } from '../components/RadiologyWorkSpace/ImageList';
import { ImageViewer } from '../components/RadiologyWorkSpace/ImageViewer';
import { InterpretationForm } from '../components/RadiologyWorkSpace/InterpretationForm';
import { Study } from '../types/index';
import { Interpretation } from '../types/radiologist';
import { useCornerstoneContext } from '../contexts/CornerstoneContext';

export const RadiologyWorkspace: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [showInterpretation, setShowInterpretation] = useState(!isMobile);
  const isInitialized = useCornerstoneContext();
  const [studies, setStudies] = useState<Study[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [currentInstance, setCurrentInstance] = useState(0);
  const [interpretation, setInterpretation] = useState<Partial<Interpretation>>(
    {
      text: 'No obvious fractures or lytic lesions. Mild\
       degenerative changes are seen in the thoracic spine.Right lower lobe consolidation, \
       likely infectious in nature (pneumonia).',
      radiologistId: 'RD00023',
      createdAt: '20/10/2024',
    }
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        // This would be replaced with an actual API call

        setStudies([
          {
            id: 'STU001',
            patientId: 'PAT12345',
            studyDate: '2024-03-22',
            description: 'Chest X-Ray - PA and Lateral',
            modality: 'XR',
            instances: [
              {
                id: 'IMG001-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG001-2',
                imagePath: '/images/sample_dicom2.dcm',
              },
            ],
          },
          {
            id: 'STU002',
            patientId: 'PAT67890',
            studyDate: '2024-03-22',
            description: 'Brain MRI with Contrast',
            modality: 'MR',
            instances: [
              {
                id: 'IMG002-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG002-2',
                imagePath: '/images/sample_dicom1.dcm',
              },
              {
                id: 'IMG002-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
            ],
          },
          {
            id: 'STU003',
            patientId: 'PAT24680',
            studyDate: '2024-03-21',
            description: 'Cervical Spine X-Ray',
            modality: 'XR',
            instances: [
              {
                id: 'IMG003-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG003-2',
                imagePath: '/images/sample_dicom1.dcm',
              },
              {
                id: 'IMG003-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
            ],
          },
          {
            id: 'STU004',
            patientId: 'PAT13579',
            studyDate: '2024-03-21',
            description: 'Lumbar Spine MRI',
            modality: 'MR',
            instances: [
              {
                id: 'IMG004-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG004-2',
                imagePath: '/images/sample_dicom1.dcm',
              },
              {
                id: 'IMG004-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
            ],
          },
          {
            id: 'STU005',
            patientId: 'PAT11111',
            studyDate: '2024-03-20',
            description: 'Abdominal X-Ray',
            modality: 'XR',
            instances: [
              {
                id: 'IMG005-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG005-2',
                imagePath: '/images/sample_dicom2.dcm',
              },
            ],
          },
          {
            id: 'STU006',
            patientId: 'PAT22222',
            studyDate: '2024-03-20',
            description: 'Knee MRI Right',
            modality: 'MR',
            instances: [
              {
                id: 'IMG006-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG006-2',
                imagePath: '/images/sample_dicom2.dcm',
              },
              {
                id: 'IMG006-3',
                imagePath: '/images/sample_dicom1.dcm',
              },
              {
                id: 'IMG006-4',
                imagePath: '/images/sample_dicom2.dcm',
              },
            ],
          },
          {
            id: 'STU007',
            patientId: 'PAT33333',
            studyDate: '2024-03-19',
            description: 'Chest X-Ray - Portable',
            modality: 'XR',
            instances: [
              {
                id: 'IMG007-1',
                imagePath: '/images/sample_dicom.dcm',
              },
            ],
          },
          {
            id: 'STU008',
            patientId: 'PAT44444',
            studyDate: '2024-03-19',
            description: 'Shoulder MRI Left',
            modality: 'MR',
            instances: [
              {
                id: 'IMG008-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-2',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
              {
                id: 'IMG008-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-2',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
              {
                id: 'IMG008-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-2',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
              {
                id: 'IMG008-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-2',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
              {
                id: 'IMG008-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-2',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
              {
                id: 'IMG008-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-2',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
              {
                id: 'IMG008-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-2',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
              {
                id: 'IMG008-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-2',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
              {
                id: 'IMG008-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-2',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
              {
                id: 'IMG008-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-2',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG008-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
            ],
          },
          {
            id: 'STU009',
            patientId: 'PAT55555',
            studyDate: '2024-03-18',
            description: 'Wrist X-Ray Right',
            modality: 'XR',
            instances: [
              {
                id: 'IMG009-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG009-2',
                imagePath: '/images/sample_dicom2.dcm',
              },
              {
                id: 'IMG009-3',
                imagePath: '/images/sample_dicom1.dcm',
              },
            ],
          },
          {
            id: 'STU010',
            patientId: 'PAT66666',
            studyDate: '2024-03-18',
            description: 'Cervical Spine MRI',
            modality: 'MR',
            instances: [
              {
                id: 'IMG010-1',
                imagePath: '/images/sample_dicom.dcm',
              },
              {
                id: 'IMG010-2',
                imagePath: '/images/sample_dicom1.dcm',
              },
              {
                id: 'IMG010-3',
                imagePath: '/images/sample_dicom2.dcm',
              },
            ],
          },
        ]);
      } catch (error) {
        console.error('Error fetching studies:', error);
        showSnackbar('Error loading studies', 'error');
      }
    };

    fetchStudies();
  }, []);

  // Drawer width calculation based on screen size
  const getDrawerWidth = () => {
    if (isSmallScreen) return '100%';
    if (isMobile) return '80%';
    return '400px';
  };

  const handleStudySelect = async (study: Study) => {
    setSelectedStudy(study);
    setCurrentInstance(0);

    // try {
    //   // This would be replaced with an actual API call
    //   const response = await fetch(`/api/interpretations/${study.id}`);
    //   const existingInterpretation = await response.json();

    //   if (existingInterpretation) {
    //     setInterpretation(existingInterpretation);
    //   } else {
    //     // setInterpretation();
    //   }
    // } catch (error) {
    //   console.error('Error loading interpretation:', error);
    //   showSnackbar('Error loading interpretation', 'error');
    // }
  };

  const handleInterpretationChange = (
    field: keyof Interpretation,
    value: string
  ) => {
    setInterpretation((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // This would be replaced with an actual API call
      await fetch(`/api/interpretations/${selectedStudy?.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...interpretation,
          studyId: selectedStudy?.id,
          status: 'draft',
        }),
      });

      showSnackbar('Interpretation saved successfully', 'success');
    } catch (error) {
      console.error('Error saving interpretation:', error);
      showSnackbar('Error saving interpretation', 'error');
    }
  };

  const handleSubmit = async () => {
    try {
      // This would be replaced with an actual API call
      await fetch(`/api/interpretations/${selectedStudy?.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...interpretation,
          studyId: selectedStudy?.id,
          status: 'submitted',
        }),
      });

      showSnackbar('Interpretation submitted successfully', 'success');
      // Optionally, refresh the studies list or mark this study as completed
    } catch (error) {
      console.error('Error submitting interpretation:', error);
      showSnackbar('Error submitting interpretation', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  return (
    <WorkspaceLayout
      sidebarContent={
        <ImageList
          studies={studies}
          onStudySelect={handleStudySelect}
          selectedStudy={selectedStudy!}
        />
      }
    >
      {selectedStudy ? (
        <Box
          sx={{
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              minHeight: isMobile ? 'auto' : '100%',
              flexDirection: isMobile ? 'column' : 'row',
            }}
          >
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                height: isMobile ? '60vh' : '100%',
                minHeight: isMobile ? '400px' : 'auto',
              }}
            >
              <ImageViewer
                study={selectedStudy}
                currentInstance={currentInstance}
                onInstanceChange={setCurrentInstance}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                height: isMobile ? 'auto' : '100%',
                minHeight: isMobile ? '300px' : 'auto',
              }}
            >
              <InterpretationForm
                interpretation={interpretation!}
                currentRadiologistId="RD00023"
                onSubmit={handleSubmit}
              />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Alert severity="info">
            Please select a study from the list to begin interpretation
          </Alert>
        </Box>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </WorkspaceLayout>
  );
};

export default RadiologyWorkspace;
