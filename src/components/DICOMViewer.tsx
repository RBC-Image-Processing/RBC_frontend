import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import {
  Typography,
  Button,
  Box,
  Modal,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import dicomts from 'dicom.ts';
import { Study } from '../types/index';

interface DICOMViewerProps {
  study: Study;
  onClose: () => void;
}

export const DICOMViewer: React.FC<DICOMViewerProps> = ({ study, onClose }) => {
  const [currentInstanceIndex, setCurrentInstanceIndex] = useState<number>(-1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<any>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isShortScreen = useMediaQuery('(max-height: 460px)');

  // Reset current instance index when study changes
  useEffect(() => {
    setCurrentInstanceIndex(0);
  }, []);

  // useEffect(() => {
  //   const loadAndRenderImage = async () => {
  //     if (canvasRef.current) {
  //       const canvas = canvasRef.current;

  //       try {
  //         const instance = study.instances[currentInstanceIndex];
  //         const response = await fetch(instance.imagePath);
  //         const arrayBuffer = await response.arrayBuffer();

  //         const image = dicomts.parseImage(arrayBuffer);

  //         if (image) {
  //           // Log some DICOM tags
  //           console.log('PatientID:', image.patientID);
  //           const patientName = image.getTagValue([0x0010, 0x0010]);
  //           console.log(
  //             'PatientName:',
  //             patientName ? patientName.toString() : 'N/A'
  //           );

  //           // Create or reuse the renderer
  //           if (!rendererRef.current) {
  //             rendererRef.current = new dicomts.Renderer(canvas);
  //           }

  //           // Render the image
  //           await rendererRef.current.render(image, 0);
  //         } else {
  //           throw new Error('Failed to parse DICOM image');
  //         }
  //       } catch (error) {
  //         console.error('Error loading DICOM image:', error);
  //         const ctx = canvas.getContext('2d');
  //         if (ctx) {
  //           ctx.font = '20px Arial';
  //           ctx.fillStyle = 'red';
  //           ctx.fillText('Error loading image', 10, 50);
  //         }
  //       }
  //     }
  //   };

  //   loadAndRenderImage();
  // }, [study, currentInstanceIndex]);
useEffect(() => {
  const loadAndRenderImage = async () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

        // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

try {
  // Get the current instance object
  const instance = study.instances[currentInstanceIndex];

  console.log("Current instance:", instance); // Log instance

  if (!instance) {
    throw new Error("Instance is undefined or invalid");
  }

  const username = "bright";
  const password = "bright";
  const authString = btoa(`${username}:${password}`); // Base64 encode

  console.log("Auth String:", authString); // Log the auth string

  // Make an API call to fetch the DICOM image buffer
  const response = await axios.get(
    `http://localhost:8000/api/image/${instance}`,
    {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/dicom",
        Authorization: `Basic ${authString}`,
      },
    }
  );

  // const blob = new Blob([response.data], {type: "image/jpeg"});

  // const imageURL = URL.createObjectURL(blob);

  // console.log(image



  console.log(response, "the response before"); // Log response

  const arrayBuffer = response.data;

  // Parse the DICOM image using dicom.ts
        const image = dicomts.parseImage(arrayBuffer);

        if (image) {
          // Log some DICOM tags (optional)
          console.log("PatientID:", image.patientID);
          const patientName = image.getTagValue([0x0010, 0x0010]);
          console.log(
            "PatientName:",
            patientName ? patientName.toString() : "N/A"
          );

          // Create or reuse the renderer
          if (!rendererRef.current) {
            rendererRef.current = new dicomts.Renderer(canvas);
          }

          // Render the parsed DICOM image onto the canvas
          await rendererRef.current.render(image, 0);
        } else {
          throw new Error("Failed to parse DICOM image");
        }
} catch (error) {
  console.error("Error loading DICOM image:", error);
}

    }
  };

  loadAndRenderImage();
}, [currentInstanceIndex, study.instances]); // Dependencies to re-run the effect


  const handlePrevious = () => {
    setCurrentInstanceIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentInstanceIndex((prev) =>
      prev < study.instances.length - 1 ? prev + 1 : prev
    );
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '95%' : '80%',
          height: isShortScreen ? '95vh' : isMobile ? '95%' : '80%',
          maxHeight: '95vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: isShortScreen ? 1 : isMobile ? 2 : 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Typography variant="h6" component="h2" mb={isShortScreen ? 1 : 2}>
          Study Viewer
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#000',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 2,
              padding: 0.5,
            }}
          >
            <IconButton
              onClick={handlePrevious}
              disabled={currentInstanceIndex === 0}
              size="small"
            >
              <ChevronLeft size={isMobile ? 18 : 24} color="white" />
            </IconButton>
            <Typography color="white" mx={1} variant="body2">
              {currentInstanceIndex + 1} / {study.instances.length}
            </Typography>
            <IconButton
              onClick={handleNext}
              disabled={currentInstanceIndex === study.instances.length - 1}
              size="small"
            >
              <ChevronRight size={isMobile ? 18 : 24} color="white" />
            </IconButton>
          </Box>
        </Box>
        <Button
          onClick={onClose}
          startIcon={<X size={18} />}
          sx={{
            mt: isShortScreen ? 0.5 : 1,
            py: isShortScreen ? 0.5 : 1,
          }}
          fullWidth={isMobile}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};
