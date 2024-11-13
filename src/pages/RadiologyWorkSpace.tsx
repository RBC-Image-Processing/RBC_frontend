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
import axios from "axios"
import { useUser } from '../contexts/UserContext';

export const RadiologyWorkspace: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useCornerstoneContext();

  const [studies, setStudies] = useState<Study[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [currentInstance, setCurrentInstance] = useState(0);
  const [studyListOpen, setStudyListOpen] = useState(false);
   const { loggedInUser} = useUser();
  const [interpretation, setInterpretation] = useState<Interpretation>({
    text: 'Enter the interpretation here ..... ',
    radiologistId: `RD ${loggedInUser&&loggedInUser.userId}`,
    createdAt: new Date().toISOString(),
  });
  useEffect(() => {
    const fetchStudies = async () => {
      // setIsLoading(true);ft_api_auth_intergration
      try {
        // Make the API call to fetch studies
        const response = await axios.get<any>('http://localhost:8000/api/study');

        console.log(response, "the response")
        
        // Update the state with the fetched studies

        const filteredValue = response.data.data.filter((item)=> {return item !== null});

        console.log(filteredValue, "the filtered value");
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
              interpretation={interpretation}
              currentRadiologistId={`RD${loggedInUser&&loggedInUser.userId}`}
              onSubmit={() => {
              //TODO , here call the api to submit the form
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
