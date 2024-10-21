type UserRole =
  | 'Administrator'
  | 'Radiologist'
  | 'Physician'
  | 'Non-Specialist';

export interface User {
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export interface Instance {
  id: string;
  imagePath: string;
}

export interface Study {
  id: string;
  patientId: string;
  studyDate: string;
  description: string;
  modality: 'XR' | 'MR';
  instances: Instance[];
}
