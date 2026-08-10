import { ProductMinimised } from 'core/api/models';

export type MembershipContentType = 'POST' | 'VIDEO' | 'RESOURCE';

export type MembershipContentStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export type MembershipOrderingMode = 'NEWEST_FIRST' | 'MANUAL';

export const MEMBERSHIP_DEFAULT_ORDERING_MODE: MembershipOrderingMode =
  'NEWEST_FIRST';

export const MEMBERSHIP_ORDERING_MODE_OPTIONS: Array<{
  value: MembershipOrderingMode;
  label: string;
}> = [
  { value: 'NEWEST_FIRST', label: 'Newest first' },
  { value: 'MANUAL', label: 'Manual' },
];

export const MEMBERSHIP_CONTENT_STATUS_OPTIONS: Array<{
  value: MembershipContentStatus;
  label: string;
}> = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'HIDDEN', label: 'Hidden' },
];

export const formatMembershipFileSize = (size: number) => {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${Math.round((size / (1024 * 1024)) * 10) / 10} MB`;
};

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

export interface MembershipVideoFileRef {
  fileName: string;
  fileType: string;
  size: number;
  localPreviewUrl?: string;
}

export interface MembershipVideoItem extends MembershipContentItemBase {
  type: 'VIDEO';
  video: MembershipVideoFileRef;
}

export interface MembershipResourceFileRef {
  fileName: string;
  fileType: string;
  size: number;
}

export interface MembershipResourceItem extends MembershipContentItemBase {
  type: 'RESOURCE';
  file: MembershipResourceFileRef;
}

export type MembershipContentItem =
  | MembershipPostItem
  | MembershipVideoItem
  | MembershipResourceItem;

export type MembershipFeedEntry =
  | {
      entryId: string;
      kind: 'CONTENT';
      contentId: string;
      addedAt: string;
      position?: number;
    }
  | {
      entryId: string;
      kind: 'PRODUCT';
      productId: string;
      addedAt: string;
      position?: number;
    };

export type MembershipProductFeedEntry = Extract<
  MembershipFeedEntry,
  { kind: 'PRODUCT' }
>;

export interface MembershipPostDraft {
  title: string;
  body: string;
  status: MembershipContentStatus;
}

export interface MembershipVideoDraft {
  title: string;
  description: string;
  status: MembershipContentStatus;
  video: MembershipVideoFileRef | null;
}

export interface MembershipResourceDraft {
  title: string;
  description: string;
  status: MembershipContentStatus;
  file: MembershipResourceFileRef | null;
}

export const createBlankMembershipPostDraft = (): MembershipPostDraft => ({
  title: '',
  body: '',
  status: 'DRAFT',
});

export const createBlankMembershipVideoDraft = (): MembershipVideoDraft => ({
  title: '',
  description: '',
  status: 'DRAFT',
  video: null,
});

export const createBlankMembershipResourceDraft =
  (): MembershipResourceDraft => ({
    title: '',
    description: '',
    status: 'DRAFT',
    file: null,
  });

export const createMembershipVideoFileRef = (
  file: File,
): MembershipVideoFileRef => ({
  fileName: file.name,
  fileType: file.type,
  size: file.size,
});

export const createMembershipResourceFileRef = (
  file: File,
): MembershipResourceFileRef => ({
  fileName: file.name,
  fileType: file.type,
  size: file.size,
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

export const createMembershipVideoItem = (
  draft: MembershipVideoDraft,
  id: string,
  now: string,
): MembershipVideoItem => {
  if (!draft.video) {
    throw new Error('Cannot create Membership Video without a selected video.');
  }

  return {
    id,
    type: 'VIDEO',
    title: draft.title.trim(),
    description: draft.description.trim() || undefined,
    status: draft.status,
    video: draft.video,
    createdAt: now,
    updatedAt: now,
  };
};

export const updateMembershipVideoItem = (
  item: MembershipVideoItem,
  draft: MembershipVideoDraft,
  now: string,
): MembershipVideoItem => {
  if (!draft.video) {
    throw new Error('Cannot update Membership Video without a selected video.');
  }

  return {
    ...item,
    title: draft.title.trim(),
    description: draft.description.trim() || undefined,
    status: draft.status,
    video: draft.video,
    updatedAt: now,
  };
};

export const createMembershipResourceItem = (
  draft: MembershipResourceDraft,
  id: string,
  now: string,
): MembershipResourceItem => {
  if (!draft.file) {
    throw new Error('Cannot create Membership Resource without a selected file.');
  }

  return {
    id,
    type: 'RESOURCE',
    title: draft.title.trim(),
    description: draft.description.trim() || undefined,
    status: draft.status,
    file: draft.file,
    createdAt: now,
    updatedAt: now,
  };
};

export const updateMembershipResourceItem = (
  item: MembershipResourceItem,
  draft: MembershipResourceDraft,
  now: string,
): MembershipResourceItem => {
  if (!draft.file) {
    throw new Error('Cannot update Membership Resource without a selected file.');
  }

  return {
    ...item,
    title: draft.title.trim(),
    description: draft.description.trim() || undefined,
    status: draft.status,
    file: draft.file,
    updatedAt: now,
  };
};

export type MembershipContentListItem =
  | {
      kind: 'CONTENT';
      entry: Extract<MembershipFeedEntry, { kind: 'CONTENT' }>;
      content: MembershipContentItem;
    }
  | {
      kind: 'PRODUCT';
      entry: MembershipProductFeedEntry;
      product: ProductMinimised;
    };

export const createMembershipContentFeedEntry = (
  contentId: string,
  addedAt: string,
): Extract<MembershipFeedEntry, { kind: 'CONTENT' }> => ({
  entryId: `content:${contentId}`,
  kind: 'CONTENT',
  contentId,
  addedAt,
});

export const createMembershipProductFeedEntry = (
  productId: string,
  addedAt: string,
): MembershipProductFeedEntry => ({
  entryId: `product:${productId}`,
  kind: 'PRODUCT',
  productId,
  addedAt,
});

export const orderMembershipFeedEntries = (
  feedEntries: readonly MembershipFeedEntry[],
  orderingMode: MembershipOrderingMode = MEMBERSHIP_DEFAULT_ORDERING_MODE,
): MembershipFeedEntry[] => {
  if (orderingMode === 'MANUAL') {
    return [...feedEntries];
  }

  return feedEntries
    .map((entry, index) => ({ entry, index }))
    .sort((first, second) => {
      const addedAtDifference =
        new Date(second.entry.addedAt).getTime() -
        new Date(first.entry.addedAt).getTime();

      if (addedAtDifference !== 0) {
        return addedAtDifference;
      }

      return first.index - second.index;
    })
    .map(({ entry }) => entry);
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
  feedEntries: readonly MembershipFeedEntry[],
  nativeContentItems: readonly MembershipContentItem[],
  includedProducts: readonly ProductMinimised[],
  orderingMode: MembershipOrderingMode = MEMBERSHIP_DEFAULT_ORDERING_MODE,
): MembershipContentListItem[] => {
  const nativeContentById = new Map(
    nativeContentItems.map((content) => [content.id, content]),
  );
  const includedProductById = new Map(
    includedProducts
      .filter((product): product is ProductMinimised & { id: string } =>
        Boolean(product.id),
      )
      .map((product) => [product.id, product]),
  );

  return orderMembershipFeedEntries(feedEntries, orderingMode).reduce<
    MembershipContentListItem[]
  >((items, entry) => {
    if (entry.kind === 'CONTENT') {
      const content = nativeContentById.get(entry.contentId);

      if (content) {
        items.push({ kind: 'CONTENT', entry, content });
      }

      return items;
    }

    const product = includedProductById.get(entry.productId);

    if (product) {
      items.push({ kind: 'PRODUCT', entry, product });
    }

    return items;
  }, []);
};
