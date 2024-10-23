// File: src/types/cornerstone.d.ts
declare module 'cornerstone-core' {
  export interface Image {
    imageId: string;
    minPixelValue: number;
    maxPixelValue: number;
    slope: number;
    intercept: number;
    windowCenter: number;
    windowWidth: number;
    getPixelData: () => Uint8Array | Float32Array;
    rows: number;
    columns: number;
    height: number;
    width: number;
    color: boolean;
    columnPixelSpacing: number;
    rowPixelSpacing: number;
    sizeInBytes: number;
  }

  export interface Viewport {
    scale: number;
    translation: {
      x: number;
      y: number;
    };
    voi: {
      windowWidth: number;
      windowCenter: number;
    };
    invert: boolean;
    pixelReplication: boolean;
    rotation: number;
    hflip: boolean;
    vflip: boolean;
    modalityLUT: any;
    voiLUT: any;
  }

  export function enable(element: HTMLElement): void;
  export function disable(element: HTMLElement): void;
  export function displayImage(element: HTMLElement, image: Image): void;
  export function loadImage(imageId: string): Promise<Image>;
  export function getViewport(element: HTMLElement): Viewport;
  export function setViewport(element: HTMLElement, viewport: Viewport): void;
  export function reset(element: HTMLElement): void;
  export function getDefaultViewportForImage(
    element: HTMLElement,
    image: Image
  ): Viewport;
  export function registerImageLoader(scheme: string, loader: any): void;
}

declare module 'cornerstone-wado-image-loader' {
  interface WebWorkerConfig {
    maxWebWorkers?: number;
    startWebWorkersOnDemand?: boolean;
    taskConfiguration?: {
      decodeTask?: {
        initializeCodecsOnStartup?: boolean;
        usePDFJS?: boolean;
      };
    };
  }

  interface ConfigurationOptions {
    beforeSend?: (xhr: XMLHttpRequest) => void;
  }

  export const webWorkerManager: {
    initialize: (config: WebWorkerConfig) => void;
  };

  export const wadouri: {
    loadImage: (imageId: string) => Promise<any>;
  };

  export const wadors: {
    loadImage: (imageId: string) => Promise<any>;
  };

  export const external: {
    cornerstone: any;
    dicomParser: any;
  };

  export function configure(options: ConfigurationOptions): void;
}

declare module 'dicom-parser' {
  export function parseDicom(byteArray: Uint8Array): any;
}
