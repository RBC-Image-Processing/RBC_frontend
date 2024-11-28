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
import { Study, StudyApiResponse } from '../types/index';
import { ApiInterpretationResponse as Interpretation } from '../types/radiologist';
import { useCornerstoneContext } from '../contexts/CornerstoneContext';
import { Menu } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { getToken } from '../api/token';
import { decodeToken } from '../utils/decodeToken';
import { useInterpretation } from '../contexts/InterpretationContext';
import { AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

export const RadiologyWorkspace: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useCornerstoneContext();

  const [studies, setStudies] = useState<Study[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [currentInstance, setCurrentInstance] = useState(0);

  const [studyListOpen, setStudyListOpen] = useState(false);
  const { loggedInUser, getUser } = useUser();
  console.log('Testing........', selectedStudy);

  // =======
  //   const [studyListOpen, setStudyListOpen] = useState(false);
  //   const [interpretation, setInterpretation] = useState<Interpretation>({
  //     id: '8fb3d973-4449cad4-c21bb79d-81c41b56-b9412373',
  //     text: 'There is an abnormal opacity in the right lower lung zone, suggestive of consolidation. This could be due to pneumonia, given the lobar distribution and clinical symptoms. No cavitations or nodules are seen',
  //     radiologistId: 'RD00023',
  //     createdAt: new Date().toISOString(),
  //   });

  const {
    isLoading,
    retInterpretations,
    updateInterpretation,
    createInterpretation,
    getInterpretationByStudyId,
  } = useInterpretation();

  //get user information with the userId
  useEffect(() => {
    const fetchUser = async () => {
      //The fetching will be done when the loggedInUser is null
      if (!loggedInUser) {
        const token = getToken('token');
        const { userId } = decodeToken(token);
        await getUser('' + userId);
      }
    };

    fetchUser();
  }, []);

  //dependency is if a study is selected
  // make an api call to get an interpretation associated with the study
  useEffect(() => {
    console.log('called changed study', selectedStudy?.studyId);

    const fetchInterpretation = async () => {
      if (selectedStudy) {
        const interpretations: Interpretation[] =
          await getInterpretationByStudyId(selectedStudy.studyId);

        if (loggedInUser != null && interpretations?.length > 0) {
          setInterpretation({
            interpretationId: interpretations[0]?.interpretationId,
            diagnosis: interpretations[0]?.diagnosis,
            radiologistId: `RD ${loggedInUser.userId}`,
            roleId: loggedInUser.roleId.toString(),
            createdAt: new Date().toISOString(),
          });
        } else {
          setInterpretation({
            interpretationId: '',
            diagnosis: ' ',
            radiologistId: '',
            roleId: '',
            createdAt: '',
          });
        }
      }
    };

    fetchInterpretation();
  }, [selectedStudy, loggedInUser, isLoading]);

  const [interpretation, setInterpretation] = useState<Interpretation>();
  useEffect(() => {
    const fetchStudies = async () => {
      // setIsLoading(true);ft_api_auth_intergration
      try {
        // Make the API call to fetch studies
        const response: AxiosResponse<StudyApiResponse> = await axios.get(
          `${BASE_URL}api/study`
        );

        console.log(response, 'the response');

        // Update the state with the fetched studies

        const filteredValue = response.data.data.filter((item) => {
          return item !== null;
        });

        setStudies(filteredValue);
      } catch (error) {
        console.error('Error fetching studies:', error);
      } finally {
        // setIsLoading(false);
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
              interpretation={interpretation || null}
              currentRadiologistId={
                loggedInUser ? `RD${loggedInUser.userId}` : 'RD_DEFAULT'
              }
              loggedUserRole={loggedInUser?.roleId?.toString() || '3'}
              loading={isLoading ?? false}
              onSubmit={(text) => {
                console.log(
                  selectedStudy?.studyId,
                  loggedInUser?.userId,
                  'info to be used'
                );
                if (
                  retInterpretations &&
                  interpretation &&
                  retInterpretations[0].userId === loggedInUser?.userId
                ) {
                  if (retInterpretations[0]?.interpretationId) {
                    updateInterpretation(
                      retInterpretations[0]?.interpretationId,
                      text
                    );
                  }
                } else {
                  createInterpretation(
                    selectedStudy?.studyId,
                    loggedInUser?.userId,
                    text
                  );
                }
              }}
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
