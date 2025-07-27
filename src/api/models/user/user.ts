export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  onboardingCompleted?: boolean;
  title?: string;
  bio?: string;
  taglineMission?: string;
  website?: string;
  city?: string;
  country?: string;
  lat?: string;
  long?: string;
  socialLinks?: SocialLink[];
  createdAt?: Date;
}

// export interface UserWithDetails {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   title?: string;
//   bio?: string;
//   taglineMission?: string;
//   website?: string;
//   city?: string;
//   country?: string;
//   onboardingCompleted?: boolean;
//   roles: string[];
//   socialLinks?: SocialLink[];
//   createdAt: Date;
// }

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

export interface UserDetails {
  userId: string;
  title?: string;
  bio?: string;
  taglineMission?: string;
  website?: string;
  city?: string;
  country?: string;
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  id?: string;
  platform: SocialPlatforms;
  url: string;
}

export enum SocialPlatforms {
  IG = 'INSTAGRAM',
  FB = 'FACEBOOK',
  X = 'X',
  TT = 'TIKTOK',
  YT = 'YOUTUBE',
}
