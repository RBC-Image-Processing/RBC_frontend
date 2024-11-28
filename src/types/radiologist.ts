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

export interface ApiInterpretationResponse {
  interpretationId: string | undefined;
  studyId?: string;
  userId?: string;
  diagnosis: string;
  timestamp?: string;
  roleId?: string;
  createdAt?: string;
  radiologistId?: string;
}

export interface Interpretation {
  interpretationId: string | undefined;
  diagnosis: string;
  radiologistId: string;
  roleId: string;
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
