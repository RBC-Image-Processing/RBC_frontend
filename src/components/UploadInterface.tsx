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
} from '@mui/material';
import { Upload } from 'lucide-react';

export const UploadInterface: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<Record<string, string>>({
    patientId: '',
    studyDate: '',
    description: '',
    modality: '',
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

  const handleUpload = () => {
    // Simulated upload process
    console.log('Files:', files);
    console.log('Metadata:', metadata);
    setSnackbar({
      open: true,
      message: 'Upload successful!',
      severity: 'success',
    });
    // Reset form
    setFiles([]);
    setMetadata({
      patientId: '',
      studyDate: '',
      description: '',
      modality: '',
    });
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
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Upload size={18} />}
                fullWidth={isMobile}
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Patient ID"
              name="patientId"
              value={metadata.patientId}
              onChange={handleMetadataChange}
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={metadata.description}
              onChange={handleMetadataChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Modality</InputLabel>
              <Select
                name="modality"
                value={metadata.modality}
                onChange={handleMetadataChange}
                label="Modality"
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
              disabled={files.length === 0}
              startIcon={<Upload size={18} />}
              fullWidth={isMobile}
            >
              Upload DICOM Images
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
