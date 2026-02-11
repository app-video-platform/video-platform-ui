/* eslint-disable no-unused-vars */
import { SocialMediaLink } from '../socials/social-media-link';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  onboardingCompleted?: boolean;
  title?: string;
  imageUrl?: string;
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

export enum UserRole {
  USER = 'User',
  CREATOR = 'Creator',
  ADMIN = 'Admin',
}
