declare module 'dicom.ts' {
  export interface Image {
    patientID: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTagValue(tag: [number, number]): any;
  }

  export class Renderer {
    constructor(canvas: HTMLCanvasElement);
    render(image: Image, frame: number): Promise<void>;
  }

  export function parseImage(buffer: ArrayBuffer): Image;

  const dicomjs: {
    Renderer: typeof Renderer;
    parseImage: typeof parseImage;
  };

  export default dicomjs;
}
