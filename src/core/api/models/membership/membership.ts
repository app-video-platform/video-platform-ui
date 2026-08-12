export type MembershipContentType = 'POST' | 'VIDEO' | 'RESOURCE';

export type MembershipContentStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export type MembershipOrderingMode = 'NEWEST_FIRST' | 'MANUAL';

export interface MembershipAssetRef {
  fileId?: string;
  fileName: string;
  fileType: string;
  size: number;
  url?: string;
}

export interface MembershipContentBase {
  id: string;
  type: MembershipContentType;
  title: string;
  description?: string;
  status: MembershipContentStatus;
  createdAt: string;
  updatedAt: string;
  position?: number;
}

export interface MembershipPostContent extends MembershipContentBase {
  type: 'POST';
  body: string;
}

export interface MembershipVideoContent extends MembershipContentBase {
  type: 'VIDEO';
  video: MembershipAssetRef;
}

export interface MembershipResourceContent extends MembershipContentBase {
  type: 'RESOURCE';
  file: MembershipAssetRef;
}

export type MembershipContent =
  | MembershipPostContent
  | MembershipVideoContent
  | MembershipResourceContent;

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

export interface MembershipConfig {
  productId: string;
  orderingMode: MembershipOrderingMode;
}

export interface MembershipAggregate {
  productId: string;
  config: MembershipConfig;
  content: MembershipContent[];
  feed: MembershipFeedEntry[];
  updatedAt?: string;
}

export type MembershipConfigUpdateRequest = Partial<
  Pick<MembershipConfig, 'orderingMode'>
>;

export type MembershipContentCreateRequest =
  | {
      type: 'POST';
      title: string;
      body: string;
      status: MembershipContentStatus;
      position?: number;
    }
  | {
      type: 'VIDEO';
      title: string;
      description?: string;
      status: MembershipContentStatus;
      video: MembershipAssetRef;
      position?: number;
    }
  | {
      type: 'RESOURCE';
      title: string;
      description?: string;
      status: MembershipContentStatus;
      file: MembershipAssetRef;
      position?: number;
    };

export type MembershipContentUpdateRequest =
  | (Partial<Omit<Extract<MembershipContentCreateRequest, { type: 'POST' }>, 'type'>> & {
      type: 'POST';
    })
  | (Partial<Omit<Extract<MembershipContentCreateRequest, { type: 'VIDEO' }>, 'type'>> & {
      type: 'VIDEO';
    })
  | (Partial<Omit<Extract<MembershipContentCreateRequest, { type: 'RESOURCE' }>, 'type'>> & {
      type: 'RESOURCE';
    });

export interface MembershipFeedUpdateRequest {
  orderingMode: MembershipOrderingMode;
  feed: MembershipFeedEntry[];
}
