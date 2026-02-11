import { ProductType } from '../product';

export interface Review {
  id: string;
  product: {
    id: string;
    name: string;
    type: ProductType;
  };
  customer: {
    id: string; // who wrote it (customer)
    name: string;
    email?: string;
    avatarUrl?: string;
  };
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  hidden: boolean; // moderation flag
  createdAt: string;
  updatedAt: string;
  reply?: ReviewReply | null;
}

export interface ReviewReply {
  authorId: string; // usually the creator or team member
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsListResponse {
  items: Review[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReviewSummary {
  averageRating: number; // 4.6
  totalCount: number; // 128
  byRating: { [1]: number; [2]: number; [3]: number; [4]: number; [5]: number };
}

export interface ReviewPayload {
  id: string;
  productId: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  hidden: boolean;
}
