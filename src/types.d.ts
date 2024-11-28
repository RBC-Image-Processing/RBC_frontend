declare module 'cornerstone-core';
declare module 'cornerstone-web-image-loader';
declare module 'cornerstone-tools';
declare module 'cornerstone-math';
declare module 'cornerstone-wado-image-loader';
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hammer: any;
  }
}
