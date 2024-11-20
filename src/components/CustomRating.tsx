import React, { useState } from 'react';
import { Rating, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const RatingContainer = styled(Box)({
  position: 'relative',
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

const RatingLabel = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: -30,
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '4px 8px',
  borderRadius: '4px',
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  fontSize: '0.875rem',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  transition: 'opacity 0.2s ease-in-out',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    border: '4px solid transparent',
    borderTopColor: theme.palette.grey[100],
  },
}));

const RATING_LABELS = {
  1: 'Basic - Needs work',
  2: 'Fair - Improvable',
  3: 'Good - Adequate',
  4: 'Very Good - Minor flaws',
  5: 'Excellent - Top notch',
};

interface CustomRatingProps {
  value: number | null;
  onChange: (event: React.SyntheticEvent, value: number | null) => void;
  size?: 'small' | 'medium' | 'large';
  sx?: object;
}

const CustomRating = ({
  value,
  onChange,
  size = 'large',
  sx,
}: CustomRatingProps) => {
  const [hover, setHover] = useState(-1);

  return (
    <RatingContainer>
      {hover !== -1 && (
        <RatingLabel>
          {RATING_LABELS[hover as keyof typeof RATING_LABELS]}
        </RatingLabel>
      )}
      <Rating
        value={value}
        onChange={onChange}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        size={size}
        sx={{
          ...sx,
          '& .MuiRating-icon': {
            transition: 'transform 0.2s ease-in-out',
          },
          '& .MuiRating-iconHover': {
            transform: 'scale(1.2)',
          },
        }}
      />
    </RatingContainer>
  );
};

export default CustomRating;
