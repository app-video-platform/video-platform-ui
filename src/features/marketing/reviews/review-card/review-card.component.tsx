import React from 'react';
import { format } from 'date-fns';
import clsx from 'clsx';

import { Review } from '@api/models';
import { VPIcon, StarRating, UserAvatar } from '@shared/ui';
import { PRODUCT_META } from '@api/constants';
import { MenuDropdown } from '@features/dropdowns';

import './review-card.styles.scss';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => (
  <div className="review-card">
    <div className="review-wrapper">
      <div className="user-container">
        <UserAvatar
          imageUrl={review.customer.avatarUrl ?? ''}
          alt={review.customer.name}
        />
        <div className="customer-details">
          <span className="customer-name">{review.customer.name}</span>
          <span className="customer-email">{review.customer.email}</span>
        </div>
      </div>
      <div className="product-details">
        <VPIcon
          icon={PRODUCT_META[review.product.type].icon}
          color={PRODUCT_META[review.product.type].color}
          size={24}
        />
        <h3 className="product-name">{review.product.name}</h3>
      </div>
    </div>
    <div className="rating-container">
      <div className="rating-row">
        <StarRating value={review.rating} small />
        <div
          className={clsx('visibility-container', {
            'visibility-container__hidden': review.hidden,
          })}
        >
          {review.hidden ? 'Hidden' : 'Visible'}
        </div>
      </div>
      <p>{review.comment ?? 'No comment added'}</p>
      <div className="date-row">
        <span>Created: {format(review.createdAt, 'dd MMM')}</span>
        <span>●</span>
        <span>Updated: {format(review.updatedAt, 'dd MMM')}</span>
      </div>
    </div>
    <div className="box-right">
      <MenuDropdown />
      <div className="reply-row">
        {review.reply ? (
          <>
            <span>Replied on {format(review.reply.updatedAt, 'dd MMM')}</span>
            <span>●</span>
            <button type="button" className="reply-action">
              Edit Reply
            </button>
          </>
        ) : (
          <>
            <span>No reply yet</span>
            <span>●</span>
            <button type="button" className="reply-action">
              Reply Now
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);

export default ReviewCard;
