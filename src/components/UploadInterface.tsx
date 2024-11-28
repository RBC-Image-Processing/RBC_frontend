import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  SelectChangeEvent,
  LinearProgress,
  Fade,
} from '@mui/material';
import { Upload } from 'lucide-react';
import axios from 'axios';

interface UploadMetadata {
  patientId: string;
  studyDate: string;
  description: string;
  modality: string;
}

interface UploadProgress {
  active: boolean;
  value: number;
}

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

export const UploadInterface: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<UploadMetadata>({
    patientId: '',
    studyDate: '',
    description: '',
    modality: '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    active: false,
    value: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleMetadataChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setMetadata({ ...metadata, [name as string]: value as string });
  };

  const resetUpload = () => {
    setFiles([]);
    setMetadata({
      patientId: '',
      studyDate: '',
      description: '',
      modality: '',
    });
    setUploadProgress({ active: false, value: 0 });
    setIsUploading(false);
  };

  const handleUpload = async () => {
    // Validate form
    if (
      !files.length ||
      !metadata.patientId ||
      !metadata.studyDate ||
      !metadata.description ||
      !metadata.modality
    ) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields and select files',
        severity: 'error', // Red for validation errors
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress({ active: true, value: 0 });

    try {
      const formData = new FormData();

      // Append files
      files.forEach((file) => {
        formData.append('dicom', file);
      });

      // Append metadata
      Object.entries(metadata).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axios.post(
        `${BASE_URL}/api/study/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            setUploadProgress({
              active: true,
              value: percentCompleted,
            });
          },
        }
      );

      // Check response status and show appropriate message
      if (response.data.status === 'success') {
        setSnackbar({
          open: true,
          message: `Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''}!`,
          severity: 'success', // Green for success
        });
        resetUpload();
      } else {
        // Handle other statuses that aren't errors but also aren't successes
        setSnackbar({
          open: true,
          message: response.data.message || 'Upload completed with warnings',
          severity: 'success', // You can also use 'warning' for amber color
        });
        resetUpload();
      }
    } catch (error) {
      console.error('Upload error:', error);

      // Handle different types of errors
      let errorMessage = 'Upload failed';

      if (axios.isAxiosError(error)) {
        // Handle Axios errors (network, server errors, etc.)
        errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Network error occurred';
      } else if (error instanceof Error) {
        // Handle standard JavaScript errors
        errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error', // Red for errors
      });
      setUploadProgress({ active: false, value: 0 });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Upload DICOM Images
      </Typography>
      <Paper sx={{ p: isMobile ? 2 : 3, mb: 3 }}>
        <Grid container spacing={isMobile ? 2 : 3}>
          <Grid item xs={12}>
            <input
              accept=".dcm,.jpg,.jpeg"
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Upload size={18} />}
                fullWidth={isMobile}
                disabled={isUploading}
              >
                Select DICOM Files
              </Button>
            </label>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {files.length > 0
                ? `${files.length} file(s) selected`
                : 'No files selected'}
            </Typography>
          </Grid>

          {/* Progress indicator */}
          <Grid item xs={12}>
            <Fade in={uploadProgress.active} timeout={1000}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress.value}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {uploadProgress.value}%
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {uploadProgress.value === 100
                    ? 'Processing...'
                    : 'Uploading files...'}
                </Typography>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Patient ID"
              name="patientId"
              value={metadata.patientId}
              onChange={handleMetadataChange}
              disabled={isUploading}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Study Date"
              name="studyDate"
              type="date"
              value={metadata.studyDate}
              onChange={handleMetadataChange}
              InputLabelProps={{ shrink: true }}
              disabled={isUploading}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={metadata.description}
              onChange={handleMetadataChange}
              disabled={isUploading}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Modality</InputLabel>
              <Select
                name="modality"
                value={metadata.modality}
                onChange={handleMetadataChange}
                label="Modality"
                disabled={isUploading}
              >
                <MenuItem value="XR">X-Ray</MenuItem>
                <MenuItem value="MR">MRI</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading}
              startIcon={<Upload size={18} />}
              fullWidth={isMobile}
              sx={{
                position: 'relative',
                height: 48, // Fixed height to prevent button size change
              }}
            >
              {isUploading ? 'Uploading...' : 'Upload DICOM Images'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Optional: position the snackbar
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled" // Makes the alert more prominent
          sx={{
            width: '100%',
            '&.MuiAlert-standardSuccess': {
              backgroundColor: 'success.main',
              color: 'success.contrastText',
            },
            '&.MuiAlert-standardError': {
              backgroundColor: 'error.main',
              color: 'error.contrastText',
            },
            '&.MuiAlert-standardWarning': {
              backgroundColor: 'warning.main',
              color: 'warning.contrastText',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
