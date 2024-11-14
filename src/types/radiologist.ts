// export interface Interpretation {
//   id: string;
//   text: string;
//   radiologistId: string;
//   roleId:number;
//   createdAt: string;
// }

// export interface Annotation {
//   id: string;
//   type: 'arrow' | 'circle' | 'text' | 'freehand';
//   coordinates: {
//     x: number;
//     y: number;
//     width?: number;
//     height?: number;
//     points?: { x: number; y: number }[];
//   };
//   color: string;
//   text?: string;
// }

//rad

export interface Interpretation {
  interpretationId: string | undefined;
  diagnosis: string;
  radiologistId: string;
  roleId:number;
  createdAt: string;
}

export interface Annotation {
  id: string;
  type: 'arrow' | 'circle' | 'text' | 'freehand';
  coordinates: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    points?: { x: number; y: number }[];
  };
  color: string;
  text?: string;
}