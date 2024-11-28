import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface ConfidenceProgressBarProps {
  confidenceScore: string;
}

function ConfidenceProgressBar({
  confidenceScore,
}: ConfidenceProgressBarProps) {
  return (
    <Box
      sx={{
        backgroundColor: '#f0f0f0', // Gray background
        padding: 2, // Padding inside the box
        borderRadius: 2, // Rounded corners for the box
        flex: 1, // Makes the box flexible and stretchable
        width: '100%', // Ensure the box takes the full width
      }}
    >
      {/* Heading for Pneumonia */}
      <Typography variant="h6" gutterBottom>
        Pneumonia
      </Typography>

      {/* Subheading for Confidence Interval */}
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Confidence Interval
      </Typography>

      {/* Heading showing the Confidence Score */}
      <Typography variant="body1" gutterBottom>
        {`${(parseInt(confidenceScore) * 100).toFixed(0)}% Confident`}
      </Typography>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={parseInt(confidenceScore) * 100}
        sx={{ height: 10, borderRadius: 5 }}
      />
    </Box>
  );
}

export default ConfidenceProgressBar;
