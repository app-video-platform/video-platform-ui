import { MeetingMethods } from 'core/enums';
import {
  ConsultationDayAvailability,
  ProductMinimised,
} from 'core/api/models';
import { BuilderTab } from '../builder-sidebar';
import { ProductDraft, RecurringPricing } from '../models';
import { MembershipContentItem } from '../membership-content/models';

export type ProductReadinessSeverity = 'BLOCKER' | 'WARNING';

export interface ProductReadinessIssue {
  id: string;
  severity: ProductReadinessSeverity;
  title: string;
  description: string;
  destination?: BuilderTab;
}

export interface ProductReadinessResult {
  blockers: ProductReadinessIssue[];
  warnings: ProductReadinessIssue[];
  isReadyToPublish: boolean;
  isEvaluating: boolean;
}

export interface ProductReadinessInput {
  formData: ProductDraft;
  recurringPricing?: RecurringPricing;
  membershipNativeContentItems?: readonly MembershipContentItem[];
  membershipIncludedProducts?: readonly ProductMinimised[];
  isMembershipLoading?: boolean;
}

const VALID_BILLING_INTERVALS: RecurringPricing['interval'][] = [
  'MONTH',
  'YEAR',
];

const createIssue = (
  id: string,
  severity: ProductReadinessSeverity,
  title: string,
  description: string,
  destination?: BuilderTab,
): ProductReadinessIssue => ({
  id,
  severity,
  title,
  description,
  destination,
});

const hasPositivePrice = (price: ProductDraft['price']) =>
  typeof price === 'number' && Number.isFinite(price) && price > 0;

const isOneTimePriceReady = (formData: ProductDraft) =>
  formData.price === 'free' || hasPositivePrice(formData.price);

const toMinutes = (value?: string) => {
  if (!value) {
    return NaN;
  }

  const [hours, minutes] = value.split(':').map(Number);

  return hours * 60 + minutes;
};

export const getConsultationDayValidation = (
  day: ConsultationDayAvailability,
): string | null => {
  if (!day.enabled) {
    return null;
  }

  if (day.windows.length === 0) {
    return 'Enabled days need at least one time range.';
  }

  const sorted = [...day.windows].sort(
    (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime),
  );

  for (const window of sorted) {
    const start = toMinutes(window.startTime);
    const end = toMinutes(window.endTime);

    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return 'Start and end times are required.';
    }

    if (start >= end) {
      return 'Start time must be before end time.';
    }
  }

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];

    if (toMinutes(current.startTime) < toMinutes(previous.endTime)) {
      return 'Time ranges cannot overlap.';
    }
  }

  return null;
};

const hasConfirmedDownloadFile = (formData: ProductDraft) =>
  (formData.sections ?? []).some((section) =>
    (section.files ?? []).some((file) => Boolean(file.id || file.url || file.fileName)),
  );

const hasCourseLesson = (formData: ProductDraft) =>
  (formData.sections ?? []).some((section) => (section.lessons ?? []).length > 0);

const hasAvailableConsultationWindow = (
  weeklyAvailability: ConsultationDayAvailability[] = [],
) =>
  weeklyAvailability.some(
    (day) =>
      day.enabled &&
      day.windows.some((window) => !getConsultationDayValidation({
        ...day,
        windows: [window],
      })),
  );

const hasInvalidConsultationAvailability = (
  weeklyAvailability: ConsultationDayAvailability[] = [],
) => weeklyAvailability.some((day) => Boolean(getConsultationDayValidation(day)));

const hasPublishedMembershipEntry = (
  nativeContentItems: readonly MembershipContentItem[] = [],
  includedProducts: readonly ProductMinimised[] = [],
) =>
  nativeContentItems.some((item) => item.status === 'PUBLISHED') ||
  includedProducts.some((product) => product.status === 'PUBLISHED');

const hasDraftMembershipContent = (
  nativeContentItems: readonly MembershipContentItem[] = [],
) => nativeContentItems.some((item) => item.status === 'DRAFT');

const hasBackendPendingPublishedBinaryContent = (
  nativeContentItems: readonly MembershipContentItem[] = [],
) =>
  nativeContentItems.some(
    (item) =>
      item.status === 'PUBLISHED' &&
      (item.type === 'VIDEO' || item.type === 'RESOURCE'),
  );

export const evaluateProductReadiness = ({
  formData,
  recurringPricing,
  membershipNativeContentItems = [],
  membershipIncludedProducts = [],
  isMembershipLoading = false,
}: ProductReadinessInput): ProductReadinessResult => {
  const blockers: ProductReadinessIssue[] = [];
  const warnings: ProductReadinessIssue[] = [];

  if (!formData.name?.trim()) {
    blockers.push(
      createIssue(
        'missing-name',
        'BLOCKER',
        'Add a Product name',
        'Customers need a clear Product name before this can be published.',
        'basics',
      ),
    );
  }

  if (formData.type === 'COURSE' || formData.type === 'DOWNLOAD') {
    if (!isOneTimePriceReady(formData)) {
      blockers.push(
        createIssue(
          'invalid-one-time-price',
          'BLOCKER',
          'Set valid pricing',
          'Choose Free or enter a positive one-time price.',
          'pricing',
        ),
      );
    }
  }

  if (formData.type === 'CONSULTATION' && !hasPositivePrice(formData.price)) {
    blockers.push(
      createIssue(
        'invalid-consultation-price',
        'BLOCKER',
        'Set a Consultation price',
        'Consultations require a positive one-time price in the MVP.',
        'pricing',
      ),
    );
  }

  if (formData.type === 'MEMBERSHIP') {
    const amount = recurringPricing?.amount ??
      (typeof formData.price === 'number' ? formData.price : 0);
    const interval = recurringPricing?.interval ?? formData.billingInterval;

    if (amount <= 0 || !VALID_BILLING_INTERVALS.includes(interval as RecurringPricing['interval'])) {
      blockers.push(
        createIssue(
          'invalid-recurring-price',
          'BLOCKER',
          'Set valid recurring pricing',
          'Memberships require a positive recurring price and monthly or yearly billing.',
          'pricing',
        ),
      );
    }
  }

  if (!formData.imageUrl) {
    warnings.push(
      createIssue(
        'missing-thumbnail',
        'WARNING',
        'Add a thumbnail',
        'Products with a thumbnail are easier to recognize across your storefront and Product pages.',
        'media',
      ),
    );
  }

  if (formData.type === 'COURSE') {
    if ((formData.sections ?? []).length === 0 || !hasCourseLesson(formData)) {
      blockers.push(
        createIssue(
          'course-needs-curriculum',
          'BLOCKER',
          'Add Course curriculum',
          'Courses need at least one section and one lesson before customers have something to learn.',
          'sections',
        ),
      );
    }
  }

  if (formData.type === 'DOWNLOAD' && !hasConfirmedDownloadFile(formData)) {
    blockers.push(
      createIssue(
        'download-needs-file',
        'BLOCKER',
        'Add at least one file',
        'Customers need something to receive from this Download.',
        'sections',
      ),
    );
  }

  if (formData.type === 'CONSULTATION') {
    const details = formData.consultationDetails;
    const weeklyAvailability = details?.weeklyAvailability ?? [];

    if (!details?.durationMinutes || details.durationMinutes <= 0) {
      blockers.push(
        createIssue(
          'consultation-duration',
          'BLOCKER',
          'Set a valid session duration',
          'Consultations need a positive session duration.',
          'consultation-details',
        ),
      );
    }

    if (!details?.meetingMethod) {
      blockers.push(
        createIssue(
          'consultation-meeting-method',
          'BLOCKER',
          'Choose a meeting method',
          'Customers need to know how the Consultation will happen.',
          'consultation-details',
        ),
      );
    }

    if (
      details?.meetingMethod === MeetingMethods.OTHER &&
      !details.customLocation?.trim()
    ) {
      blockers.push(
        createIssue(
          'consultation-custom-location',
          'BLOCKER',
          'Describe the custom meeting location',
          'Other meeting methods need customer-facing location or joining instructions.',
          'consultation-details',
        ),
      );
    }

    if (!hasAvailableConsultationWindow(weeklyAvailability)) {
      blockers.push(
        createIssue(
          'consultation-availability',
          'BLOCKER',
          'Add weekly availability',
          'Consultations need at least one valid weekly time range before customers can book.',
          'consultation-details',
        ),
      );
    }

    if (hasInvalidConsultationAvailability(weeklyAvailability)) {
      blockers.push(
        createIssue(
          'consultation-invalid-availability',
          'BLOCKER',
          'Fix availability ranges',
          'Availability ranges must have start and end times, start before end, and no overlaps.',
          'consultation-details',
        ),
      );
    }

    if ((details?.connectedCalendars ?? []).length === 0) {
      warnings.push(
        createIssue(
          'consultation-no-calendar',
          'WARNING',
          'Connect a calendar',
          'Calendar connection helps prevent future booking conflicts, but it is not required to publish.',
          'consultation-details',
        ),
      );
    }
  }

  if (formData.type === 'MEMBERSHIP' && !isMembershipLoading) {
    if (!hasPublishedMembershipEntry(
      membershipNativeContentItems,
      membershipIncludedProducts,
    )) {
      blockers.push(
        createIssue(
          'membership-needs-published-entry',
          'BLOCKER',
          'Add published Membership content',
          'Memberships need at least one published native item or published included Product.',
          'membership-content',
        ),
      );
    }

    if (hasDraftMembershipContent(membershipNativeContentItems)) {
      warnings.push(
        createIssue(
          'membership-has-draft-content',
          'WARNING',
          'Review Draft content',
          'Some Membership content is still Draft and will not be customer-ready.',
          'membership-content',
        ),
      );
    }

    if (hasBackendPendingPublishedBinaryContent(membershipNativeContentItems)) {
      warnings.push(
        createIssue(
          'membership-binary-media-backend-pending',
          'WARNING',
          'Confirm Membership media persistence',
          'Published Membership Video or Resource items currently rely on backend-pending durable media storage.',
          'membership-content',
        ),
      );
    }
  }

  return {
    blockers,
    warnings,
    isReadyToPublish: blockers.length === 0 && !isMembershipLoading,
    isEvaluating: formData.type === 'MEMBERSHIP' && isMembershipLoading,
  };
};
