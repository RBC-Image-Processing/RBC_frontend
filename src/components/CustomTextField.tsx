import React, { useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { IconButton, Box } from '@mui/material';
import { Check as CheckIcon, X as XIcon } from 'lucide-react';

interface CustomTextFieldProps {
  defaultValue?: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  label?: string;
}

const CustomTextField = React.memo(function CustomTextField({
  defaultValue = '',
  onSave,
  onCancel,
  label
}: CustomTextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const initialValueRef = useRef(defaultValue);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      // Set cursor at the end
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, []);

  const handleSave = () => {
    if (inputRef.current) {
      onSave(inputRef.current.value);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <TextField
        inputRef={inputRef}
        defaultValue={initialValueRef.current}
        size="small"
        label={label}
        fullWidth
        onKeyDown={handleKeyPress}
        autoComplete="off"
      />
      <IconButton onClick={handleSave} size="small">
        <CheckIcon size={18} />
      </IconButton>
      <IconButton onClick={onCancel} size="small">
        <XIcon size={18} />
      </IconButton>
    </Box>
  );
});

export default CustomTextField;