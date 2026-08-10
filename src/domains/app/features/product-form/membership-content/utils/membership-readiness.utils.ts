import { ProductMinimised } from 'core/api/models';
import { ProductDraft, RecurringPricing } from '../../models';
import {
  MembershipContentItem,
  MembershipProductFeedEntry,
} from '../models';

export type MembershipReadinessSeverity = 'ERROR' | 'WARNING';

export interface MembershipReadinessIssue {
  code: string;
  severity: MembershipReadinessSeverity;
  message: string;
}

export interface MembershipReadinessResult {
  canPublish: boolean;
  errors: MembershipReadinessIssue[];
  warnings: MembershipReadinessIssue[];
}

export interface MembershipReadinessInput {
  formData: Pick<ProductDraft, 'name' | 'imageUrl'>;
  recurringPricing: RecurringPricing;
  nativeContentItems: readonly MembershipContentItem[];
  includedProducts: readonly ProductMinimised[];
  hasThumbnail?: boolean;
}

const VALID_BILLING_INTERVALS: RecurringPricing['interval'][] = [
  'MONTH',
  'YEAR',
];

const createIssue = (
  code: string,
  severity: MembershipReadinessSeverity,
  message: string,
): MembershipReadinessIssue => ({
  code,
  severity,
  message,
});

export const resolveMembershipIncludedProducts = (
  includedProductEntries: readonly MembershipProductFeedEntry[],
  productSummaries: readonly ProductMinimised[] | null | undefined,
): ProductMinimised[] => {
  const productById = new Map<string, ProductMinimised>();

  (productSummaries ?? []).forEach((product) => {
    if (product.id) {
      productById.set(product.id, product);
    }
  });

  return includedProductEntries
    .map((entry) => productById.get(entry.productId))
    .filter((product): product is ProductMinimised => Boolean(product));
};

export const evaluateMembershipReadiness = ({
  formData,
  recurringPricing,
  nativeContentItems,
  includedProducts,
  hasThumbnail,
}: MembershipReadinessInput): MembershipReadinessResult => {
  const errors: MembershipReadinessIssue[] = [];
  const warnings: MembershipReadinessIssue[] = [];
  const hasPublishedNativeContent = nativeContentItems.some(
    (item) => item.status === 'PUBLISHED',
  );
  const hasPublishedIncludedProduct = includedProducts.some(
    (product) => product.status === 'PUBLISHED',
  );
  const hasValidBillingInterval = VALID_BILLING_INTERVALS.includes(
    recurringPricing.interval,
  );
  const hasResolvedThumbnail = hasThumbnail ?? Boolean(formData.imageUrl);

  if (!formData.name?.trim()) {
    errors.push(createIssue('MISSING_NAME', 'ERROR', 'Add a Membership name.'));
  }

  if (recurringPricing.amount <= 0 || !hasValidBillingInterval) {
    errors.push(
      createIssue('INVALID_RECURRING_PRICE', 'ERROR', 'Set a valid recurring price.'),
    );
  }

  if (!hasPublishedNativeContent && !hasPublishedIncludedProduct) {
    errors.push(
      createIssue(
        'NO_PUBLISHED_ENTRY',
        'ERROR',
        'Add at least one published content item or included Product.',
      ),
    );
  }

  if (!hasResolvedThumbnail) {
    warnings.push(
      createIssue(
        'NO_THUMBNAIL',
        'WARNING',
        'Add a thumbnail to make the Membership easier to identify.',
      ),
    );
  }

  if (nativeContentItems.some((item) => item.status === 'DRAFT')) {
    warnings.push(
      createIssue(
        'HAS_DRAFT_CONTENT',
        'WARNING',
        'Some Membership content is still in Draft.',
      ),
    );
  }

  if (nativeContentItems.some((item) => item.status === 'HIDDEN')) {
    warnings.push(
      createIssue(
        'HAS_HIDDEN_CONTENT',
        'WARNING',
        'Some Membership content is Hidden.',
      ),
    );
  }

  if (nativeContentItems.length === 0) {
    warnings.push(
      createIssue(
        'NO_NATIVE_CONTENT',
        'WARNING',
        'This Membership has no native content yet.',
      ),
    );
  }

  if (includedProducts.length === 0) {
    warnings.push(
      createIssue(
        'NO_INCLUDED_PRODUCTS',
        'WARNING',
        'This Membership has no included Products.',
      ),
    );
  }

  return {
    canPublish: errors.length === 0,
    errors,
    warnings,
  };
};
