export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole[];
  onboardingCompleted?: boolean;
}

export interface UserRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserLoginResponse {
  // id: string;
  firstName: string;
  lastName: string;
  email: string;
  // token: string;
  role: UserRole[];
}

export enum UserRole {
  USER = 'User',
  CREATOR = 'Creator',
  ADMIN = 'Admin',
}
