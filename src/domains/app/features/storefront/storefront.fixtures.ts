import { ProductMinimised, User, UserRole } from 'core/api/models';
import { SocialPlatforms } from 'core/api/models/socials/social-media-link';

export const storefrontInspectionUser: User = {
  id: 'creator-maya-rivera',
  firstName: 'Maya',
  lastName: 'Rivera',
  email: 'maya@example.com',
  roles: [UserRole.CREATOR],
  title: 'Independent filmmaker and creator educator',
  taglineMission: 'Practical cinematic systems for creators building paid audiences.',
  bio:
    'Maya helps video creators package their knowledge into focused courses, downloads, consultations, and membership communities.',
  website: 'https://maya.example.com',
  socialLinks: [
    { platform: SocialPlatforms.YT, url: 'https://youtube.com/@mayarivera' },
    { platform: SocialPlatforms.IG, url: 'https://instagram.com/mayarivera' },
  ],
};

export const storefrontInspectionProducts: ProductMinimised[] = [
  {
    id: 'sf-course-1',
    title: 'Creator Launch Studio',
    description: 'A structured course for planning, filming, and launching a paid video product.',
    type: 'COURSE',
    status: 'PUBLISHED',
    price: 149,
    createdById: storefrontInspectionUser.id,
    createdByName: 'Maya Rivera',
    createdByTitle: storefrontInspectionUser.title,
  },
  {
    id: 'sf-download-1',
    title: 'Content Calendar Kit',
    description: 'Templates for mapping weekly videos, launches, and customer touchpoints.',
    type: 'DOWNLOAD',
    status: 'PUBLISHED',
    price: 29,
    createdById: storefrontInspectionUser.id,
    createdByName: 'Maya Rivera',
    createdByTitle: storefrontInspectionUser.title,
  },
  {
    id: 'sf-consultation-1',
    title: 'Launch Strategy Session',
    description: 'A focused consultation to review your product offer and launch plan.',
    type: 'CONSULTATION',
    status: 'PUBLISHED',
    price: 220,
    createdById: storefrontInspectionUser.id,
    createdByName: 'Maya Rivera',
    createdByTitle: storefrontInspectionUser.title,
  },
  {
    id: 'sf-membership-1',
    title: 'Creator Lab Membership',
    description: 'Monthly workshops, critiques, and member-only operating systems.',
    type: 'MEMBERSHIP',
    status: 'PUBLISHED',
    price: 39,
    createdById: storefrontInspectionUser.id,
    createdByName: 'Maya Rivera',
    createdByTitle: storefrontInspectionUser.title,
  },
  {
    id: 'sf-draft-1',
    title: 'Unannounced Workshop',
    description: 'Draft product intentionally hidden from public Storefront.',
    type: 'COURSE',
    status: 'DRAFT',
    price: 99,
    createdById: storefrontInspectionUser.id,
    createdByName: 'Maya Rivera',
    createdByTitle: storefrontInspectionUser.title,
  },
  {
    id: 'sf-hidden-1',
    title: 'Retired Preset Pack',
    description: 'Hidden product intentionally excluded from public Storefront.',
    type: 'DOWNLOAD',
    status: 'HIDDEN',
    price: 19,
    createdById: storefrontInspectionUser.id,
    createdByName: 'Maya Rivera',
    createdByTitle: storefrontInspectionUser.title,
  },
];

export const storefrontInspectionFeaturedProductId = 'sf-course-1';
