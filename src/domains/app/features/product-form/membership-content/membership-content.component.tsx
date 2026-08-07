import React from 'react';

import MembershipIncludedProducts from './membership-included-products.component';
import './membership-content.styles.scss';

interface MembershipContentSectionProps {
  ownerId?: string;
  currentProductId?: string;
}

const MembershipContentSection: React.FC<MembershipContentSectionProps> = ({
  ownerId,
  currentProductId,
}) => (
  <div className="membership-content">
    <MembershipIncludedProducts
      ownerId={ownerId}
      currentProductId={currentProductId}
    />
  </div>
);

export default MembershipContentSection;
