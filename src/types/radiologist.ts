export interface Interpretation {
  text: string;
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
