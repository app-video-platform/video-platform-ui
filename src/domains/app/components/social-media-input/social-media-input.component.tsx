/* eslint-disable indent */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Plus, Minus, BadgeX, CircleX } from 'lucide-react';
import { IconType } from 'react-icons';
import { FaFacebookF } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaTiktok } from 'react-icons/fa6';
import { FaYoutube } from 'react-icons/fa';

import { Icon } from '@shared/ui';

import './social-media-input.styles.scss';
import { SocialMediaLink, SocialPlatforms } from 'core/api/models';

interface Option {
  id: SocialPlatforms;
  icon: IconType;
  color: string;
  title: string;
}

const options: Option[] = [
  {
    id: SocialPlatforms.FB,
    icon: FaFacebookF,
    color: '#1877F2',
    title: 'Facebook',
  },
  {
    id: SocialPlatforms.IG,
    icon: FaInstagram,
    color: '#962fbf',
    title: 'Instagram',
  },
  { id: SocialPlatforms.X, icon: FaXTwitter, color: '#000000', title: 'X' },
  {
    id: SocialPlatforms.YT,
    icon: FaYoutube,
    color: '#FF0000',
    title: 'Youtube',
  },
  { id: SocialPlatforms.TT, icon: FaTiktok, color: '#000000', title: 'Tiktok' },
];

const currentLinkValue = (
  links: SocialMediaLink[],
  platform: SocialPlatforms,
) => links.find((link) => link.platform === platform)?.url.trim() ?? '';

interface SocialMediaInputProps {
  initialSocialLinks?: SocialMediaLink[];
  // eslint-disable-next-line no-unused-vars
  onChange: (links: SocialMediaLink[]) => void;
}

const SocialMediaInput: React.FC<SocialMediaInputProps> = ({
  initialSocialLinks,
  onChange,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [removed, setRemoved] = useState<Record<string, boolean>>({});
  const [inputValue, setInputValue] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>(
    initialSocialLinks || [],
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // If the click is *not* anywhere in our container, close
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSelectedId(null);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleCircleClick = (id: string) => {
    setInputValue('');
    if (socialLinks) {
      const foundLink = socialLinks.find((link) => link.platform === id);
      if (foundLink) {
        setInputValue(foundLink.url);
      }
    }

    setSelectedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    setSocialLinks(initialSocialLinks || []);

    if (initialSocialLinks && initialSocialLinks.length > 0) {
      initialSocialLinks.forEach((link) => {
        setCompleted((prev) => ({ ...prev, [link.platform]: true }));
      });
    }
  }, [initialSocialLinks]);

  useEffect(() => {
    onChange(socialLinks);
  }, [socialLinks, onChange]);

  const handleAdd = (id: SocialPlatforms) => {
    const normalizedValue = inputValue.trim();
    const currentValue =
      socialLinks.find((link) => link.platform === id)?.url.trim() ?? '';

    if (currentValue !== normalizedValue) {
      if (!normalizedValue) {
        setSocialLinks((prev) => prev.filter((link) => link.platform !== id));
        setCompleted((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        setRemoved((prev) => ({ ...prev, [id]: true }));
      } else {
        const link: SocialMediaLink = {
          id: null,
          platform: id,
          url: normalizedValue,
        };
        setSocialLinks((prev) => {
          const index = prev.findIndex((entry) => entry.platform === id);
          if (index < 0) {
            return [...prev, link];
          }
          return prev.map((entry) =>
            entry.platform === id ? { ...entry, url: normalizedValue } : entry,
          );
        });
        setCompleted((prev) => ({ ...prev, [id]: true }));
        setRemoved((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    }

    setInputValue('');
    setSelectedId(null);
  };

  return (
    <div className="animated-circle-input" ref={containerRef}>
      <div className="circles">
        {options.map((opt, idx) => (
          <div key={idx} className="circle-wrapper">
            <motion.div
              className="circle"
              style={{
                backgroundColor: opt.color,
                marginRight: opt.id === selectedId ? '275px' : '0',
              }}
              title={opt.title}
              onClick={() => {
                handleCircleClick(opt.id);
              }}
              whileHover={{
                scale: completed[opt.id] || removed[opt.id] ? 1 : 1.1,
              }}
            >
              <Icon color="white" icon={opt.icon} size={24} />
              <AnimatePresence>
                {(completed[opt.id] || removed[opt.id]) && (
                  <motion.div
                    className="check-overlay"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{
                      type: 'tween',
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                  >
                    {completed[opt.id] && (
                      <CheckCircle size={24} strokeWidth={4} color="#28a745" />
                    )}
                    {removed[opt.id] && (
                      <CircleX size={24} strokeWidth={4} color="#a72828ff" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Input panel toggles next to the clicked circle */}
            <AnimatePresence>
              {selectedId === opt.id && (
                <motion.div
                  className="input-panel"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{
                    type: 'tween',
                    duration: 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  <input
                    type="text"
                    autoFocus
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value..."
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        handleAdd(opt.id);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAdd(opt.id)}
                    style={{
                      backgroundColor: inputValue.trim()
                        ? currentLinkValue(socialLinks, opt.id) === inputValue.trim()
                          ? '#2865a7'
                          : '#28a745'
                        : currentLinkValue(socialLinks, opt.id)
                          ? '#a72828ff'
                          : '#2865a7',
                    }}
                  >
                    {inputValue.trim() &&
                      currentLinkValue(socialLinks, opt.id) !== inputValue.trim() && (
                        <Plus size={16} />
                      )}
                    {!inputValue.trim() && currentLinkValue(socialLinks, opt.id) && (
                      <Minus size={16} />
                    )}
                    {!inputValue.trim() && !currentLinkValue(socialLinks, opt.id) && (
                      <BadgeX size={16} />
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaInput;
