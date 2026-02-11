import React from 'react';
import clsx from 'clsx';
import { FaRegUser } from 'react-icons/fa';

import { getCssVar } from '@shared/utils';
import { VPIcon } from '../vp-icon';

import './user-avatar.styles.scss';

export interface UserAvatarProps
  extends React.BaseHTMLAttributes<HTMLImageElement> {
  imageUrl: string;
  alt?: string;
  large?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  imageUrl,
  alt,
  large = false,
}) => {
  const hasAvatar = imageUrl && imageUrl !== '';

  return (
    <div className={clsx('user-avatar', { 'user-avatar__large': large })}>
      {hasAvatar ? (
        <img src={imageUrl} alt={alt} />
      ) : (
        <VPIcon
          icon={FaRegUser}
          size={large ? 24 : 18}
          color={getCssVar('--text-primary')}
        />
      )}
    </div>
  );
};

export default UserAvatar;
