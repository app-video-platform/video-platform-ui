import { SocialMediaLink } from '../socials/social-media-link';

export interface UpdateUserRequest {
  userId?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  bio?: string;
  taglineMission?: string;
  website?: string;
  publicEmail?: string;
  city?: string;
  country?: string;
  socialLinks?: SocialMediaLink[];
}
