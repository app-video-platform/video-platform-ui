import { useRef, useState } from 'react';

import {
  MembershipContentItem,
  MembershipContentType,
  MembershipFeedEntry,
  MembershipOrderingMode,
  MembershipProductFeedEntry,
  MEMBERSHIP_DEFAULT_ORDERING_MODE,
  createMembershipContentFeedEntry,
  createMembershipProductFeedEntry,
  orderMembershipFeedEntries,
} from './models';

const getContentIdPrefix = (type: MembershipContentType) =>
  `membership-${type.toLowerCase()}`;

export interface MembershipBuilderState {
  nativeContentItems: MembershipContentItem[];
  feedEntries: MembershipFeedEntry[];
  orderingMode: MembershipOrderingMode;
  includedProductEntries: MembershipProductFeedEntry[];
  // eslint-disable-next-line no-unused-vars
  getNextNativeContentId: (type: MembershipContentType) => string;
  // eslint-disable-next-line no-unused-vars
  setOrderingMode: (orderingMode: MembershipOrderingMode) => void;
  addNativeContentItem: (
    // eslint-disable-next-line no-unused-vars
    item: MembershipContentItem,
    // eslint-disable-next-line no-unused-vars
    addedAt: string,
  ) => void;
  updateNativeContentItem: (
    // eslint-disable-next-line no-unused-vars
    contentId: string,
    // eslint-disable-next-line no-unused-vars
    updater: (item: MembershipContentItem) => MembershipContentItem,
  ) => void;
  // eslint-disable-next-line no-unused-vars
  deleteNativeContentItem: (contentId: string) => void;
  // eslint-disable-next-line no-unused-vars
  addIncludedProducts: (productIds: string[], addedAt: string) => void;
  // eslint-disable-next-line no-unused-vars
  removeIncludedProduct: (productId?: string) => void;
  // eslint-disable-next-line no-unused-vars
  moveFeedEntry: (entryId: string, direction: 'UP' | 'DOWN') => void;
}

export const useMembershipBuilderState = (): MembershipBuilderState => {
  const nextLocalContentIds = useRef<Record<MembershipContentType, number>>({
    POST: 1,
    VIDEO: 1,
    RESOURCE: 1,
  });
  const hasInitializedManualOrder = useRef(false);
  const [nativeContentItems, setNativeContentItems] = useState<
    MembershipContentItem[]
  >([]);
  const [feedEntries, setFeedEntries] = useState<MembershipFeedEntry[]>([]);
  const [orderingMode, setOrderingModeState] = useState<MembershipOrderingMode>(
    MEMBERSHIP_DEFAULT_ORDERING_MODE,
  );

  const getNextNativeContentId = (type: MembershipContentType) => {
    const nextId = `${getContentIdPrefix(type)}-${nextLocalContentIds.current[type]}`;

    nextLocalContentIds.current[type] += 1;

    return nextId;
  };

  const setOrderingMode = (nextOrderingMode: MembershipOrderingMode) => {
    if (nextOrderingMode === orderingMode) {
      return;
    }

    if (
      nextOrderingMode === 'MANUAL' &&
      orderingMode === 'NEWEST_FIRST' &&
      !hasInitializedManualOrder.current
    ) {
      setFeedEntries((currentEntries) =>
        orderMembershipFeedEntries(currentEntries, 'NEWEST_FIRST'),
      );
      hasInitializedManualOrder.current = true;
    }

    setOrderingModeState(nextOrderingMode);
  };

  const addNativeContentItem = (
    item: MembershipContentItem,
    addedAt: string,
  ) => {
    const newEntry = createMembershipContentFeedEntry(item.id, addedAt);

    setNativeContentItems((currentItems) => [...currentItems, item]);
    setFeedEntries((currentEntries) =>
      orderingMode === 'MANUAL'
        ? [newEntry, ...currentEntries]
        : [...currentEntries, newEntry],
    );
  };

  const updateNativeContentItem = (
    contentId: string,
    // eslint-disable-next-line no-unused-vars
    updater: (item: MembershipContentItem) => MembershipContentItem,
  ) => {
    setNativeContentItems((currentItems) =>
      currentItems.map((item) =>
        item.id === contentId ? updater(item) : item,
      ),
    );
  };

  const deleteNativeContentItem = (contentId: string) => {
    setNativeContentItems((currentItems) =>
      currentItems.filter((item) => item.id !== contentId),
    );
    setFeedEntries((currentEntries) =>
      currentEntries.filter(
        (entry) => entry.kind !== 'CONTENT' || entry.contentId !== contentId,
      ),
    );
  };

  const addIncludedProducts = (productIds: string[], addedAt: string) => {
    setFeedEntries((currentEntries) => {
      const includedProductIds = new Set(
        currentEntries
          .filter((entry): entry is MembershipProductFeedEntry =>
            entry.kind === 'PRODUCT',
          )
          .map((entry) => entry.productId),
      );
      const nextEntries = productIds
        .filter((productId) => !includedProductIds.has(productId))
        .map((productId) => createMembershipProductFeedEntry(productId, addedAt));

      return orderingMode === 'MANUAL'
        ? [...nextEntries, ...currentEntries]
        : [...currentEntries, ...nextEntries];
    });
  };

  const removeIncludedProduct = (productId?: string) => {
    if (!productId) {
      return;
    }

    setFeedEntries((currentEntries) =>
      currentEntries.filter(
        (entry) => entry.kind !== 'PRODUCT' || entry.productId !== productId,
      ),
    );
  };

  const moveFeedEntry = (entryId: string, direction: 'UP' | 'DOWN') => {
    if (orderingMode !== 'MANUAL') {
      return;
    }

    setFeedEntries((currentEntries) => {
      const currentIndex = currentEntries.findIndex(
        (entry) => entry.entryId === entryId,
      );

      if (currentIndex === -1) {
        return currentEntries;
      }

      const nextIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;

      if (nextIndex < 0 || nextIndex >= currentEntries.length) {
        return currentEntries;
      }

      const nextEntries = [...currentEntries];
      const currentEntry = nextEntries[currentIndex];

      nextEntries[currentIndex] = nextEntries[nextIndex];
      nextEntries[nextIndex] = currentEntry;

      return nextEntries;
    });
  };

  const includedProductEntries = feedEntries.filter(
    (entry): entry is MembershipProductFeedEntry => entry.kind === 'PRODUCT',
  );

  return {
    nativeContentItems,
    feedEntries,
    orderingMode,
    includedProductEntries,
    getNextNativeContentId,
    setOrderingMode,
    addNativeContentItem,
    updateNativeContentItem,
    deleteNativeContentItem,
    addIncludedProducts,
    removeIncludedProduct,
    moveFeedEntry,
  };
};
