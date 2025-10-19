export interface SocialMediaLink {
  id?: string | null;
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