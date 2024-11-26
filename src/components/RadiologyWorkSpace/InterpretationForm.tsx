import React, { useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Chip,
  useTheme,
  alpha,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Send,
  User,
  Clock,
  AlertCircle,
  Edit3,
  Lock,
  FileText,
} from 'lucide-react';

import { Interpretation } from '../../types/radiologist';
import { useInterpretation } from '../../contexts/InterpretationContext';

interface InterpretationFormProps {
  interpretation: Interpretation | null; // Interpretation data passed as prop
  currentRadiologistId: string; // Current radiologist ID for checking edit permissions
  loggedUserRole:string;
  loading:boolean;
  onSubmit: (text: string, isNew: boolean) => void; // Function to handle form submission
}

export const InterpretationForm: React.FC<InterpretationFormProps> = ({
  interpretation,
  loggedUserRole,
  loading,
  onSubmit,
}) => {
  const [text, setText] = React.useState(interpretation?.diagnosis || '');
  const { retInterpretations} = useInterpretation();


  const canEdit =
  loggedUserRole === '3';
  const theme = useTheme();

  // Effect hook to reset text when interpretation prop changes
  useEffect(() => {
    if (interpretation) {
      setText(interpretation?.diagnosis);
    }
  }, [interpretation]);

  const handleSubmit = () => {
    const isNew = !interpretation; // Check if it's a new interpretation or existing one
    onSubmit(text, isNew); // Call the onSubmit function with text and whether it's a new interpretation
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        bgcolor: theme.palette.background.paper,
        overflow: 'hidden',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <FileText size={20} color={theme.palette.primary.main} />
        <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
          Interpretation
        </Typography>
        {!canEdit && (
          <Tooltip title="Read-only mode">
            <Lock size={18} color={theme.palette.text.secondary} />
          </Tooltip>
        )}
      </Box>

      {/* Status Section */}
      <Box sx={{ p: 2 }}>
        {interpretation && retInterpretations? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 2,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={<User size={16} />}
                label={interpretation?.radiologistId}
                variant="outlined"
                color="primary"
                size="small"
              />
              <Tooltip title="Interpretation Date">
                <Chip
                  icon={<Clock size={16} />}
                  label={interpretation?.createdAt}
                  variant="outlined"
                  size="small"
                  color="default"
                />
              </Tooltip>
            </Box>
          </Box>
        ) : (
          <Alert
            icon={<AlertCircle size={20} />}
            severity="info"
            variant="outlined"
            sx={{
              borderRadius: 1,
              '& .MuiAlert-message': {
                color: theme.palette.text.primary,
              },
            }}
          >
            No previous interpretation found
          </Alert>
        )}
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative', flexGrow: 1 }}>
          {canEdit && (
            <Tooltip title="You can edit this interpretation">
              <Edit3
                size={16}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  color: theme.palette.primary.main,
                }}
              />
            </Tooltip>
          )}
          <TextField
            multiline
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!canEdit }
            placeholder={canEdit ? 'Enter your interpretation here...' : ''}
            variant="outlined"
            sx={{
              height: '100%',
              '& .MuiInputBase-root': {
                height: '100%',
                alignItems: 'flex-start',
                bgcolor: canEdit
                  ? 'background.paper'
                  : alpha(theme.palette.action.disabled, 0.05),
                fontSize: '0.95rem',
                lineHeight: 1.6,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.divider, 0.1),
              },
              '& .MuiInputBase-input': {
                height: '100% !important',
                color: theme.palette.text.primary,
              },
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: theme.palette.text.primary,
                color: theme.palette.text.primary,
              },
            }}
          />
        </Box>
      </Box>

      {/* Footer Section */}
      {canEdit && (
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.background.default, 0.5),
          }}
        >
          <Button
            variant="contained"
            startIcon={<Send size={18} />}

onClick={handleSubmit}
            disabled={text?.trim().length === 0}
            fullWidth
            sx={{
              py: 1.5,
              bgcolor: theme.palette.primary.main,
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
        {loading ? <CircularProgress color="inherit" /> : `${retInterpretations?.length > 0 ? 'Update' : 'Submit'} Interpretation`}
          </Button>
        </Box>
      )}
    </Paper>
  );
};
