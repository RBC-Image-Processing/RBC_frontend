import React, { createContext, useContext, useEffect } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

const CornerstoneContext = createContext<boolean>(false);

export const useCornerstoneContext = () => {
  const context = useContext(CornerstoneContext);
  if (context === undefined) {
    throw new Error('useCornerstoneContext must be used within a CornerstoneProvider');
  }
  return context;
};

export const CornerstoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize cornerstone only once
    try {
      // Set external dependencies
      cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
      cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

      // Initialize web worker
      cornerstoneWADOImageLoader.webWorkerManager.initialize({
        maxWebWorkers: Math.max(navigator.hardwareConcurrency - 1 || 1, 1),
        startWebWorkersOnDemand: true,
        taskConfiguration: {
          decodeTask: {
            initializeCodecsOnStartup: true,
            usePDFJS: false,
          },
        },
      });

      // Register image loaders
      cornerstone.registerImageLoader(
        'wadouri',
        cornerstoneWADOImageLoader.wadouri.loadImage
      );
      cornerstone.registerImageLoader(
        'wadors',
        cornerstoneWADOImageLoader.wadors.loadImage
      );

      console.log('Cornerstone initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Cornerstone:', error);
    }

    return () => {
      // Cleanup if needed
      if (cornerstoneWADOImageLoader.webWorkerManager) {
        cornerstoneWADOImageLoader.webWorkerManager.terminate();
      }
    };
  }, []);

  return (
    <CornerstoneContext.Provider value={true}>
      {children}
    </CornerstoneContext.Provider>
  );
};