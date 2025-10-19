import { SocialMediaLink } from '../socials/social-media-link';

export interface UpdateUserRequest {
  userId?: string;
  title?: string;
  bio?: string;
  taglineMission?: string;
  website?: string;
  city?: string;
  country?: string;
  socialLinks?: SocialMediaLink[];
}
