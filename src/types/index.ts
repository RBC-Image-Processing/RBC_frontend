import { User } from 'lucide-react';
type UserRole =
  | 'ADMINISTRATOR'
  | 'RADIOLOGIST'
  | 'PHYSICIAN'
  | 'NON-SPECIALIST';

export interface User {
  token:string,
  email: string;
  role: UserRole;
}

export interface UserList {
  userId: string;
  email: string;
  role: UserRole;
  verified: boolean;
  isActive: boolean;
}



export interface Err {
  email: string;
  password: string;
}

export interface UserErr {
  fullName: string;
  roleId:string;
  email: string;
}


export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) =>  Promise<boolean>;
  logout: () => void;
  loading: boolean | null
  message:string,
  errors:Err
}


export interface UserContextType {
  users: UserList[] | null;
  registerUser : (fullName: string, roleId: string, email: string) => Promise<boolean>;
  errors:UserErr;
  loading: boolean | null;
  message:string;
  getUsers : () => Promise<boolean>;
  updateUser : (userId: string, data:object) => Promise<boolean>;
  sendActivateAccountRequest: (email: string) => Promise<boolean>;
  activateAccount: (newPassword: string) => Promise<boolean>;
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
