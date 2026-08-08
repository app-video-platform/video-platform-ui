import { ProductMinimised } from 'core/api/models';

export type MembershipContentType = 'POST' | 'VIDEO' | 'RESOURCE';

export type MembershipContentStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export type MembershipContentCreationMode =
  | 'VIDEO'
  | 'POST'
  | 'RESOURCE'
  | null;

export type MembershipContentChooserSelection =
  | Exclude<MembershipContentCreationMode, null>
  | 'EXISTING_PRODUCT';

export interface MembershipContentItemBase {
  id: string;
  type: MembershipContentType;
  title: string;
  description?: string;
  status: MembershipContentStatus;
  createdAt: string;
  updatedAt: string;
}

export type MembershipContentListItem =
  | {
      kind: 'CONTENT';
      content: MembershipContentItemBase;
    }
  | {
      kind: 'PRODUCT';
      product: ProductMinimised;
    };

export const MEMBERSHIP_CONTENT_TYPE_LABELS: Record<
  MembershipContentType,
  string
> = {
  POST: 'Post',
  VIDEO: 'Video',
  RESOURCE: 'Resource',
};

export const MEMBERSHIP_CONTENT_TYPE_ICONS: Record<
  MembershipContentType,
  string
> = {
  POST: 'P',
  VIDEO: 'V',
  RESOURCE: 'R',
};

export const createMembershipContentListItems = (
  nativeContentItems: readonly MembershipContentItemBase[],
  includedProducts: readonly ProductMinimised[],
): MembershipContentListItem[] => [
  ...nativeContentItems.map((content) => ({
    kind: 'CONTENT' as const,
    content,
  })),
  ...includedProducts.map((product) => ({
    kind: 'PRODUCT' as const,
    product,
  })),
];
