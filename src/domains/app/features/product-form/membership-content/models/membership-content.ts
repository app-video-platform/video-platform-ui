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

export interface MembershipPostItem extends MembershipContentItemBase {
  type: 'POST';
  body: string;
}

export type MembershipContentItem =
  | MembershipPostItem
  | (MembershipContentItemBase & { type: 'VIDEO' | 'RESOURCE' });

export interface MembershipPostDraft {
  title: string;
  body: string;
  status: MembershipContentStatus;
}

export const createBlankMembershipPostDraft = (): MembershipPostDraft => ({
  title: '',
  body: '',
  status: 'DRAFT',
});

export const createMembershipPostItem = (
  draft: MembershipPostDraft,
  id: string,
  now: string,
): MembershipPostItem => ({
  id,
  type: 'POST',
  title: draft.title.trim(),
  body: draft.body.trim(),
  status: draft.status,
  createdAt: now,
  updatedAt: now,
});

export const updateMembershipPostItem = (
  item: MembershipPostItem,
  draft: MembershipPostDraft,
  now: string,
): MembershipPostItem => ({
  ...item,
  title: draft.title.trim(),
  body: draft.body.trim(),
  status: draft.status,
  updatedAt: now,
});

export type MembershipContentListItem =
  | {
      kind: 'CONTENT';
      content: MembershipContentItem;
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
  nativeContentItems: readonly MembershipContentItem[],
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
