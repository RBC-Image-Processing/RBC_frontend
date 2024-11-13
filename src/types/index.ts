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

export interface LoggedUser {
  userId:string,
		email: string
		fullName: string
		roleId: number

}


export interface EditingUser {
  userId:string
  isEmail:boolean
}


export interface Role {
  roleName: string;
  roleId: string;
}


export interface UserList {
  userId: string;
  email: string;
  fullName:string;
  Role: Role;
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
  sendResetPasswordRequest:(email: string) => Promise<boolean>;
  resetPassword: (newPassword: string, token:string|null) => Promise<boolean>;
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
  getUser:(userId:string)=> Promise<boolean>;
  updateUser : (userId: string, data:object) => Promise<boolean>;
  sendActivateAccountRequest: (email: string) => Promise<boolean>;
  activateAccount: (newPassword: string, token:string|null) => Promise<boolean>;
  loggedInUser: LoggedUser | null;
}


export interface Instance {
  id: string;
  // imagePath: string;
}

export interface Study {
  // id: string;
  patientId: string;
  patientName:string;
  studyId: string;
  studyDate:string;
  description: string;
  modality: 'XR' | 'MR' | "CR";
  instances: Instance[];
}
