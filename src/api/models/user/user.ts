import { SocialMediaLink } from '../socials/social-media-link';

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
  socialLinks?: SocialMediaLink[];
  createdAt?: Date;
}

// export interface UserDto {
//   /** User identifier */
//   id?: string;
//   /** First name */
//   firstName?: string;
//   /** Last name */
//   lastName?: string;
//   /** Login email */
//   email?: string;
//   /** Public title shown on storefront */
//   title?: string;
//   /** Short biography */
//   bio?: string;
//   /** Mission tagline */
//   taglineMission?: string;
//   /** Personal website */
//   website?: string;
//   /** City */
//   city?: string;
//   /** Country */
//   country?: string;
//   /** Whether onboarding tour is done */
//   onboardingCompleted?: boolean;
//   /** Granted roles */
//   roles?: string[];
//   /** Published social links */
//   socialLinks?: SocialMediaLinkResponse[];
//   /** Account creation timestamp */
//   createdAt?: ISODateTime;
// }

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

// export interface UserRegisterData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// export interface UserLoginResponse {
//   // id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   // token: string;
//   role: UserRole[];
// }

export enum UserRole {
  USER = 'User',
  CREATOR = 'Creator',
  ADMIN = 'Admin',
}

// export interface UserDetails {
//   userId: string;
//   title?: string;
//   bio?: string;
//   taglineMission?: string;
//   website?: string;
//   city?: string;
//   country?: string;
//   socialLinks?: SocialMediaLink[];
// }

// export interface SocialLink {
//   id?: string | null;
//   platform: SocialPlatforms;
//   url: string;
// }

// export enum SocialPlatforms {
//   IG = 'INSTAGRAM',
//   FB = 'FACEBOOK',
//   X = 'X',
//   TT = 'TIKTOK',
//   YT = 'YOUTUBE',
// }
