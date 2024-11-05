import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  Stack,
} from '@mui/material';
import { ImageList } from '../components/RadiologyWorkSpace/ImageList';
import { ImageViewer } from '../components/RadiologyWorkSpace/ImageViewer';
import { InterpretationForm } from '../components/RadiologyWorkSpace/InterpretationForm';
import { Study } from '../types/index';
import { Interpretation } from '../types/radiologist';
import { useCornerstoneContext } from '../contexts/CornerstoneContext';
import { Menu } from 'lucide-react';

export const RadiologyWorkspace: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useCornerstoneContext();

  const [studies, setStudies] = useState<Study[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [currentInstance, setCurrentInstance] = useState(0);
  const [studyListOpen, setStudyListOpen] = useState(false);
  const [interpretation, setInterpretation] = useState<Interpretation>({
    text: 'There is an abnormal opacity in the right lower lung zone, suggestive of consolidation. This could be due to pneumonia, given the lobar distribution and clinical symptoms. No cavitations or nodules are seen',
    radiologistId: 'RD00023',
    createdAt: new Date().toISOString(),
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
      }
    };

    fetchStudies();
  }, []);

  const handleStudySelect = async (study: Study) => {
    setSelectedStudy(study);
    if (isMobile) {
      setStudyListOpen(false);
    }
    setCurrentInstance(0);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Mobile Controls */}
      {isMobile && (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            p: 1,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <IconButton onClick={() => setStudyListOpen(true)}>
            <Menu />
          </IconButton>
        </Stack>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          // Center content vertically on larger screens
          ...(!isMobile && {
            justifyContent: 'center',
            py: 4, // Add vertical padding on desktop
          }),
        }}
      >
        <Grid
          container
          sx={{
            height: isMobile ? '100%' : '85vh', // Set to 85% of viewport height on desktop
            maxHeight: isMobile ? '100%' : '1000px', // Prevent excessive height on very large screens
          }}
        >
          {/* Study List */}
          {!isMobile && (
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                height: '100%',
                borderRight: 1,
                borderColor: 'divider',
                overflow: 'auto',
              }}
            >
              <ImageList
                studies={studies}
                onStudySelect={handleStudySelect}
                selectedStudy={selectedStudy!}
              />
            </Grid>
          )}

          {/* Image Viewer */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              height: isMobile ? '50vh' : '100%',
              minHeight: isMobile ? 300 : 'auto',
              // Add bottom margin on mobile when stacked
              ...(isMobile && {
                mb: 2,
              }),
            }}
          >
            {selectedStudy ? (
              <ImageViewer
                study={selectedStudy}
                currentInstance={currentInstance}
                onInstanceChange={setCurrentInstance}
              />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                }}
              >
                <Alert severity="info">
                  {isMobile
                    ? 'Tap the menu icon to select a study'
                    : 'Select a study from the list to begin'}
                </Alert>
              </Box>
            )}
          </Grid>

          {/* Interpretation Form */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              height: isMobile ? '50vh' : '100%',
              minHeight: isMobile ? 300 : 'auto',
              borderLeft: isMobile ? 'none' : 1,
              borderTop: isMobile ? 1 : 'none',
              borderColor: 'divider',
              // Add bottom padding on mobile to prevent footer collision
              ...(isMobile && {
                pb: 4, // Increase this value if needed
              }),
            }}
          >
            <InterpretationForm
              interpretation={interpretation}
              currentRadiologistId="RD00023"
              onSubmit={() => {}}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Mobile Study List Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={studyListOpen}
          onClose={() => setStudyListOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%',
              maxWidth: 360,
              height: '100%',
            },
          }}
        >
          <ImageList
            studies={studies}
            onStudySelect={handleStudySelect}
            selectedStudy={selectedStudy!}
          />
        </Drawer>
      )}

      {/* Snackbar */}
      <Snackbar open={false} autoHideDuration={6000} onClose={() => {}}>
        <Alert severity="success">Success</Alert>
      </Snackbar>
    </Box>
  );
};

export default RadiologyWorkspace;
