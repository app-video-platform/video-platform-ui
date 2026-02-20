import { ReviewPayload } from './reviews';

export type CreateReviewPayload = Omit<ReviewPayload, 'id'>;
