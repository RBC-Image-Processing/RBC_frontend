import { useEffect } from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

export const useCornerstone = () => {
  useEffect(() => {
    // Initialize cornerstone
    if (typeof window !== 'undefined') {
      // Register image loader
      cornerstone.registerImageLoader(
        'wadouri',
        cornerstoneWADOImageLoader.wadouri.loadImage
      );

      // Configure webworkers
      cornerstoneWADOImageLoader.webWorkerManager.initialize({
        maxWebWorkers: navigator.hardwareConcurrency || 1,
        startWebWorkersOnDemand: true,
        taskConfiguration: {
          decodeTask: {
            initializeCodecsOnStartup: true,
            usePDFJS: false,
          },
        },
      });
    }
  }, []);
};
