import React, { useEffect, useRef, useState } from 'react';
import {
  Paper,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Maximize2,
  Image as ImageIcon,
} from 'lucide-react';
import cornerstone from 'cornerstone-core';
import { Study } from '../../types/index';

interface ImageViewerProps {
  study: Study;
  currentInstance: number;
  onInstanceChange: (index: number) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  study,
  currentInstance,
  onInstanceChange,
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showThumbnails, setShowThumbnails] = useState(true);

  // Initialize cornerstone element
  useEffect(() => {
    if (!viewerRef.current) return;

    try {
      cornerstone.enable(viewerRef.current);
    } catch (error) {
      console.error('Failed to enable cornerstone:', error);
    }

    return () => {
      if (viewerRef.current) {
        try {
          cornerstone.disable(viewerRef.current);
        } catch (error) {
          console.error('Failed to disable cornerstone:', error);
        }
      }
    };
  }, []);

  // Load and display image when instance changes
  useEffect(() => {
    const loadAndDisplayImage = async () => {
      if (!viewerRef.current) return;

      setIsLoading(true);
      setError(null);

      try {
        const imageId = `wadouri:${study.instances[currentInstance].imagePath}`;
        const image = await cornerstone.loadImage(imageId);
        await cornerstone.displayImage(viewerRef.current, image);
      } catch (error) {
        console.error('Error loading image:', error);
        setError('Failed to load image');
      } finally {
        setIsLoading(false);
      }
    };

    loadAndDisplayImage();
  }, [study, currentInstance]);

  const handleZoom = (delta: number) => {
    if (!viewerRef.current) return;
    const viewport = cornerstone.getViewport(viewerRef.current);
    viewport.scale += delta;
    cornerstone.setViewport(viewerRef.current, viewport);
  };

  const handleRotate = () => {
    if (!viewerRef.current) return;
    const viewport = cornerstone.getViewport(viewerRef.current);
    viewport.rotation += 90;
    cornerstone.setViewport(viewerRef.current, viewport);
  };

  const handleReset = () => {
    if (!viewerRef.current) return;
    cornerstone.reset(viewerRef.current);
  };

  const thumbnailHeight = 120; // Height of thumbnail strip

  return (
    <Paper
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#000',
        color: 'white',
        position: 'relative',
      }}
    >
      {/* Toolbar */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          p: 1,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          bgcolor: 'rgba(0,0,0,0.8)',
        }}
      >
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {study.description} - Image {currentInstance + 1}/
          {study.instances.length}
        </Typography>
        <Tooltip title="Zoom In">
          <IconButton
            onClick={() => handleZoom(0.1)}
            size="small"
            color="inherit"
          >
            <ZoomIn />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom Out">
          <IconButton
            onClick={() => handleZoom(-0.1)}
            size="small"
            color="inherit"
          >
            <ZoomOut />
          </IconButton>
        </Tooltip>
        <Tooltip title="Rotate">
          <IconButton onClick={handleRotate} size="small" color="inherit">
            <RotateCw />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset">
          <IconButton onClick={handleReset} size="small" color="inherit">
            <RefreshCw />
          </IconButton>
        </Tooltip>
        <Tooltip title={showThumbnails ? 'Hide Thumbnails' : 'Show Thumbnails'}>
          <IconButton
            onClick={() => setShowThumbnails(!showThumbnails)}
            size="small"
            color="inherit"
          >
            <ImageIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Main viewer area */}
      <Box
        sx={{
          flexGrow: 1,
          position: 'relative',
          height: showThumbnails ? `calc(100% - ${thumbnailHeight}px)` : '100%',
        }}
      >
        <div
          ref={viewerRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        />
        {isLoading && (
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          />
        )}
        {error && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'error.main',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">{error}</Typography>
          </Box>
        )}
      </Box>

      {/* Thumbnail strip */}
      {showThumbnails && (
        <Box
          sx={{
            height: thumbnailHeight,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            overflowX: 'auto',
            bgcolor: 'rgba(0,0,0,0.8)',
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'rgba(255,255,255,0.3)',
              borderRadius: 4,
            },
          }}
        >
          {study.instances.map((instance, index) => (
            <Box
              key={instance.id}
              onClick={() => onInstanceChange(index)}
              sx={{
                flex: '0 0 auto',
                width: 100,
                height: '100%',
                p: 1,
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
                ...(currentInstance === index && {
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }),
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    py: 0.5,
                  }}
                >
                  {index + 1}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};
