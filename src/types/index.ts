import { JwtPayload } from 'jwt-decode';

type UserRole =
  | 'ADMINISTRATOR'
  | 'RADIOLOGIST'
  | 'PHYSICIAN'
  | 'NON-SPECIALIST';

export interface User {
  token: string;
  email: string;
  role: UserRole;
}

export interface LoggedUser {
  userId: string;
  email: string;
  fullName: string;
  roleId: number;
}

export interface EditingUser {
  userId: string;
  isEmail: boolean;
}

export interface Role {
  roleName: string;
  roleId: string;
}

export interface UserList {
  userId: string;
  email: string;
  fullName: string;
  Role: Role;
  role: UserRole;
  verified: boolean;
  isActive: boolean;
}

export interface UserDetails {
  userId: number;
  roleId: number;
  fullName: string;
  email: string;
  isActive: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  Role: UserRole;
}

export interface UserResponse {
  status: number;
  message: string;
  data: UserDetails;
  links: {
    self: string;
  };
}

export interface Feedback {
  doctor_comment_id: string;
  ai_interpretation_id: number;
  userId: string;
  fullName: string;
  email: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export interface Err {
  email: string;
  password: string;
}

export interface UserErr {
  fullName: string;
  roleId: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean | null;
  sendResetPasswordRequest: (email: string) => Promise<boolean>;
  resetPassword: (
    newPassword: string,
    token: string | null
  ) => Promise<boolean>;
  message: string;
  errors: Err;
}

export interface UserContextType {
  users: UserList[] | null;
  registerUser: (
    fullName: string,
    roleId: string,
    email: string
  ) => Promise<boolean>;
  errors: UserErr;
  loading: boolean | null;
  message: string;
  getUsers: () => Promise<boolean>;
  getUser: (userId: string) => Promise<boolean>;
  updateUser: (userId: string, data: object) => Promise<boolean>;
  sendActivateAccountRequest: (email: string) => Promise<boolean>;
  activateAccount: (
    newPassword: string,
    token: string | null
  ) => Promise<boolean>;
  loggedInUser: LoggedUser | null;
  getUserDetails: (userId: string) => Promise<UserDetails | null>;
}

export interface FeedBackContextType {
  feedback: Feedback[] | null;
  getFeedback: (doctor_comment_id: string) => Promise<boolean>;
  postFeedback: (data: object) => Promise<boolean>;
  putFeedback: (doctor_comment_id: string, data: object) => Promise<boolean>;
  deleteFeedback: (doctor_comment_id: string) => Promise<boolean>;
  isLoading: boolean | null;
  message: string;
  errors: Err | null;
}

export interface Instance {
  id: string;
  imagePath: string;
}

export interface Study {
  id: string;
  patientId: string;
  patientName: string;
  studyId: string;
  studyDate: string;
  description: string;
  modality: 'XR' | 'MR' | 'CR';
  instances: Instance[];
}

export interface StudyApiResponse {
  status: number;
  message: string;
  data: Study[];
  links: {
    self: string;
  };
}

export interface CustomJwtPayload extends JwtPayload {
  userId: number;
  role: number;
  iat: number;
}
