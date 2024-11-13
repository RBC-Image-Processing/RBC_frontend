import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Button,
  Rating,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  Tab,
  Tabs,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Brain,
  MessageSquare,
  Menu,
  FileQuestion,
  Stethoscope,
  Clock,
} from 'lucide-react';
import { ImageList } from '../components/RadiologyWorkSpace/ImageList';
import { ImageViewer } from '../components/RadiologyWorkSpace/ImageViewer';
import { Study } from '../types/index';
import { useAuth } from '../contexts/AuthContext';
import { useCornerstoneContext } from '../contexts/CornerstoneContext';
import ConfidenceProgressBar from '../components/ProgressBar';
import { getToken } from '../api/token';
import { decodeToken } from '../util/decodeToken';
import { useUser } from '../contexts/UserContext';

interface AIInterpretation {
  id: string;
  studyId: string;
  interpretation: string;
  confidence: number;
  timestamp: string;
  rating?: number;
  comments?: {
    userId: string;
    userRole: string;
    text: string;
    timestamp: string;
  }[];
}

interface RadiologistInterpretation {
  id: string;
  studyId: string;
  text: string;
  radiologistId: string;
  radiologistName: string;
  timestamp: string;
  status: 'pending' | 'completed';
  priority?: 'routine' | 'urgent' | 'stat';
}

interface DicomImage {
  blob: Blob;
  objectUrl: string;
  arrayBuffer: ArrayBuffer;
  cornerstoneImage?: any;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    sx={{
      height: '100%',
      overflow: 'auto',
    }}
  >
    {value === index && children}
  </Box>
);

export const AIAssist: React.FC = () => {
   const { dicomImage } = useCornerstoneContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   const {loading, loggedInUser, getUser} = useUser();

//get user information with the userId
useEffect(() => {
  const fetchUser = async () => {
    //The fetching will be done when the loggedInUser is null
    if (!loggedInUser) {
      const token = getToken('token');
      const { userId } = decodeToken(token);
      await getUser(userId);
    }
  };

  fetchUser();
}, []);

  const [studies, setStudies] = useState<Study[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [currentInstance, setCurrentInstance] = useState(0);
  const [studyListOpen, setStudyListOpen] = useState(!isMobile);
  const [activeTab, setActiveTab] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiInterpretation, setAiInterpretation] =
    useState<AIInterpretation | null>(null);
  const [radiologistInterpretation, setRadiologistInterpretation] =
    useState<RadiologistInterpretation | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isLoadingRadiologist, setIsLoadingRadiologist] = useState(false);

  const canRate = loggedInUser?.roleId === 2;


  // Reset states when study changes
  useEffect(() => {
    setCurrentInstance(0);
    setAiInterpretation(null);
    setRadiologistInterpretation(null);
    setRating(null);
    setComment('');

    if (selectedStudy) {
      fetchRadiologistInterpretation(selectedStudy.studyId);
    }
  }, [selectedStudy?.studyId]);

 






  useEffect(() => {
    const fetchStudies = async () => {
      // setIsLoading(true);
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


  const fetchRadiologistInterpretation = async (studyId: string) => {
    setIsLoadingRadiologist(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockResponse: RadiologistInterpretation = {
        id: `rad-${studyId}`,
        studyId,
        text: 'The chest radiograph demonstrates patchy airspace opacification in the right lower lobe, consistent with pneumonia. Heart size is normal. No pleural effusion or pneumothorax is seen. The visualized bony structures are intact.',
        radiologistId: 'RAD001',
        radiologistName: 'Dr. Sarah Johnson',
        timestamp: new Date().toISOString(),
        status: 'completed',
        priority: 'routine',
      };
      setRadiologistInterpretation(mockResponse);
    } catch (error) {
      console.error('Error fetching radiologist interpretation:', error);
      setRadiologistInterpretation(null);
    } finally {
      setIsLoadingRadiologist(false);
    }
  };

  const handleStudySelect = async (study: Study) => {
    setSelectedStudy(study);
    if (isMobile) {
      setStudyListOpen(false);
    }
  };



const handleRequestAI = async () => {
  if (!selectedStudy || !dicomImage) return; // Ensure both study and file are selected
  setIsProcessing(true);

  try {
    // Create FormData to include the file
    const formData = new FormData();
     formData.append("file", dicomImage.blob, "image.dcm");// `fileToUpload` should be the File object you want to send

    // Make the API call
    const response = await axios.post(
      "http://172.29.98.121:8000/predict_with_interpretation",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type
        },
      }
    );

    
    // Extract AI interpretation from the response
    const { id, studyId, interpretation, confidence, timestamp } = response.data;
    
    console.log(interpretation, "the ai response")
    // Construct the AIInterpretation object
    const aiResult: AIInterpretation = {
      id: id || Date.now().toString(),
      studyId: studyId || selectedStudy.studyId,
      interpretation: interpretation || "No interpretation available.",
      confidence: confidence || 0,
      timestamp: timestamp || new Date().toISOString(),
      comments: [],
    };

    // Set the AI interpretation
    setAiInterpretation(aiResult);
  } catch (error) {
    console.error("Error requesting AI interpretation:", error);
  } finally {
    setIsProcessing(false);
  }
};


  // const handleRequestAI = async () => {
  //   if (!selectedStudy) return;
  //   setIsProcessing(true);
  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     const mockAIResult: AIInterpretation = {
  //       id: Date.now().toString(),
  //       studyId: selectedStudy.id,
  //       text: 'Analysis indicates presence of consolidation in the right lower lobe with approximately 89% confidence. Potential indicators of bacterial pneumonia. No significant cardiomegaly observed. Recommendation: Clinical correlation advised.',
  //       confidence: 0.89,
  //       timestamp: new Date().toISOString(),
  //       comments: [],
  //     };
  //     setAiInterpretation(mockAIResult);
  //   } catch (error) {
  //     console.error('Error requesting AI interpretation:', error);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const handleSubmitFeedback = async () => {
    if (!rating || !comment || !aiInterpretation || !user) return;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newComment = {
        userId: user.email,
        userRole: user.role,
        text: comment,
        timestamp: new Date().toISOString(),
      };

      setAiInterpretation((prev) =>
        prev
          ? {
              ...prev,
              rating,
              comments: [...(prev.comments || []), newComment],
            }
          : null
      );

      setRating(null);
      setComment('');
      setActiveTab(0); // Switch back to AI Analysis tab
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
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
          <Typography variant="subtitle1" noWrap>
            AI Assistant
          </Typography>
        </Stack>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ...(!isMobile && {
            justifyContent: 'center',
            py: 4,
          }),
        }}
      >
        <Grid
          container
          sx={{
            height: isMobile ? '100%' : '85vh',
            maxHeight: isMobile ? '100%' : '1000px',
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
            md={5}
            sx={{
              height: isMobile ? '50vh' : '100%',
              minHeight: isMobile ? 300 : 'auto',
              ...(isMobile && { mb: 2 }),
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
                    ? 'Tap the menu to select a study'
                    : 'Select a study for AI analysis'}
                </Alert>
              </Box>
            )}
          </Grid>

          {/* Analysis Panel */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              height: isMobile ? '50vh' : '100%',
              minHeight: isMobile ? 300 : 'auto',
              borderLeft: isMobile ? 'none' : 1,
              borderTop: isMobile ? 1 : 'none',
              borderColor: 'divider',
              ...(isMobile && { pb: 4 }),
            }}
          >
            <Paper
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 2,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  mb: 2,
                  '& .MuiTabs-scroller': {
                    overflowX: 'auto',
                  },
                }}
              >
                <Tab
                  icon={<Brain size={16} />}
                  label="AI Analysis"
                  iconPosition="start"
                />
                <Tab
                  icon={<Stethoscope size={16} />}
                  label="Radiologist"
                  iconPosition="start"
                />
                {canRate && (
                  <Tab
                    icon={<MessageSquare size={16} />}
                    label="Feedback"
                    iconPosition="start"
                  />
                )}
              </Tabs>

              {/* AI Analysis Tab */}
              <TabPanel value={activeTab} index={0}>
                {!selectedStudy ? (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography color="text.secondary">
                      Select a study to begin
                    </Typography>
                  </Box>
                ) : isProcessing ? (
                  <Stack
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: '100%' }}
                  >
                    <CircularProgress />
                    <Typography>Processing image...</Typography>
                  </Stack>
                ) : aiInterpretation ? (
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                       <ConfidenceProgressBar confidenceScore={aiInterpretation.confidence} />
                      {/* <Chip
                        label={`${(aiInterpretation.confidence * 100).toFixed(0)}% Confidence`}
                        color="primary"
                        size="small"
                      />
                      {aiInterpretation.rating && (
                        <Chip
                          label={`Rated ${aiInterpretation.rating}/5`}
                          color="secondary"
                          size="small"
                        />
                      )} */}
                    </Stack>
                   
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: 'background.default' }}
                    >
                      <Typography>{aiInterpretation.interpretation}</Typography>
                    </Paper>
                    {aiInterpretation.comments &&
                      aiInterpretation.comments.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Feedback Comments
                          </Typography>
                          <Stack spacing={1}>
                            {aiInterpretation.comments.map((comment, index) => (
                              <Paper
                                key={index}
                                variant="outlined"
                                sx={{ p: 1.5 }}
                              >
                                <Stack spacing={1}>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    <Avatar
                                      sx={{
                                        width: 24,
                                        height: 24,
                                        fontSize: '0.875rem',
                                      }}
                                    >
                                      {comment.userRole[0]}
                                    </Avatar>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {comment.userRole} •{' '}
                                      {new Date(
                                        comment.timestamp
                                      ).toLocaleString()}
                                    </Typography>
                                  </Stack>
                                  <Typography variant="body2">
                                    {comment.text}
                                  </Typography>
                                </Stack>
                              </Paper>
                            ))}
                          </Stack>
                        </Box>
                      )}
                  </Stack>
                ) : (
       <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Button
                      variant="contained"
                      startIcon={<Brain />}
                      onClick={handleRequestAI}
                    >
                      Request AI Analysis
                    </Button>
                  </Box>
                )}
              </TabPanel>

              {/* Radiologist Interpretation Tab */}
              <TabPanel value={activeTab} index={1}>
                {!selectedStudy ? (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography color="text.secondary">
                      Select a study to view radiologist interpretation
                    </Typography>
                  </Box>
                ) : isLoadingRadiologist ? (
                  <Stack
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: '100%' }}
                  >
                    <CircularProgress />
                    <Typography>Loading interpretation...</Typography>
                  </Stack>
                ) : radiologistInterpretation ? (
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Stethoscope size={20} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {radiologistInterpretation.radiologistName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(
                            radiologistInterpretation.timestamp
                          ).toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 2,
                      }}
                    >
                      <Typography>{radiologistInterpretation.text}</Typography>
                    </Paper>
                    {radiologistInterpretation.priority && (
                      <Chip
                        label={`Priority: ${radiologistInterpretation.priority.toUpperCase()}`}
                        color={
                          radiologistInterpretation.priority === 'stat'
                            ? 'error'
                            : radiologistInterpretation.priority === 'urgent'
                              ? 'warning'
                              : 'default'
                        }
                        size="small"
                      />
                    )}
                  </Stack>
                ) : (
                  <Stack
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: '100%' }}
                  >
                    <FileQuestion
                      size={40}
                      color={theme.palette.text.secondary}
                    />
                    <Typography align="center" color="text.secondary">
                      This image has not been reviewed by a radiologist yet.
                      <br />
                      Please check back later.
                    </Typography>
                    {selectedStudy?.studyDate && (
                      <Chip
                        icon={<Clock size={16} />}
                        label={`Study Date: ${selectedStudy.studyDate}`}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Stack>
                )}
              </TabPanel>

              {/* Feedback Tab - Only for Physicians */}
              {canRate && (
                <TabPanel value={activeTab} index={2}>
                  {!aiInterpretation ? (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Alert severity="info">
                        Please request an AI analysis first to provide feedback
                      </Alert>
                    </Box>
                  ) : (
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Rate AI Performance
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          How accurate was the AI interpretation compared to
                          your clinical assessment?
                        </Typography>
                        <Rating
                          value={rating}
                          onChange={(_, value) => setRating(value)}
                          size="large"
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: theme.palette.secondary.main,
                            },
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Provide Detailed Feedback
                        </Typography>
                        <TextField
                          multiline
                          rows={4}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your insights about the AI interpretation, including accuracy, clarity, and any suggestions for improvement..."
                          fullWidth
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                      <Button
                        variant="contained"
                        onClick={handleSubmitFeedback}
                        disabled={!rating || !comment}
                        sx={{ mt: 2 }}
                      >
                        Submit Feedback
                      </Button>
                    </Stack>
                  )}
                </TabPanel>
              )}
            </Paper>
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
          <Box sx={{ pt: 2, px: 2 }}>
            <Typography variant="h6" gutterBottom>
              Select Study
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <ImageList
            studies={studies}
            onStudySelect={handleStudySelect}
            selectedStudy={selectedStudy!}
          />
        </Drawer>
      )}
    </Box>
  );
};

export default AIAssist;
