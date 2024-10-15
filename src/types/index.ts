type UserRole = 'Administrator' | 'Radiologist' | 'Physician' | 'Non-Specialist';

export interface User {
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}