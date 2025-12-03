import React from 'react';
import type { Editor } from '@tiptap/react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaCode,
  FaLink,
  FaTasks,
  FaImage,
  FaPhotoVideo,
  FaUndo,
} from 'react-icons/fa';
import {
  RiDoubleQuotesL,
  RiH1,
  RiH2,
  RiH3,
  RiListOrdered,
} from 'react-icons/ri';
import { MdHorizontalRule } from 'react-icons/md';
import { BiCodeCurly } from 'react-icons/bi';
import {
  PiArrowElbowDownRightBold,
  PiListBullets,
  PiArrowElbowDownLeftBold,
} from 'react-icons/pi';
import { IconType } from 'react-icons';
import clsx from 'clsx';

import { GalIcon } from '@shared/ui/gal-icon';
import { getCssVar } from '@shared/utils';

import './gal-rte-menu-bar.styles.scss';

interface ToolbarAction {
  active: boolean;
  action: () => boolean | void;
  disabled?: boolean;
  aria: string;
  icon: IconType;
}

interface GalMenuBarProps {
  editor: Editor | null;
}

export default function GalRTEMenuBar({ editor }: GalMenuBarProps) {
  if (!editor) {
    return null;
  }

  const chain = () => editor.chain().focus();

  const toolbarActions: Record<string, ToolbarAction[]> = {
    text: [
      {
        action: () => chain().toggleBold().run(),
        active: editor.isActive('bold'),
        aria: 'Bold',
        icon: FaBold,
        disabled: !editor.can().chain().focus().toggleBold().run(),
      },
      {
        action: () => chain().toggleItalic().run(),
        active: editor.isActive('italic'),
        aria: 'Italic',
        icon: FaItalic,
        disabled: !editor.can().chain().focus().toggleItalic().run(),
      },

      {
        action: () => chain().toggleUnderline().run(),
        active: editor.isActive('underline'),
        aria: 'Underline',
        icon: FaUnderline,
        disabled: !editor.can().chain().focus().toggleUnderline().run(),
      },

      {
        action: () => chain().toggleStrike().run(),
        active: editor.isActive('strike'),
        aria: 'Strikethrough',
        icon: FaStrikethrough,
        disabled: !editor.can().chain().focus().toggleStrike().run(),
      },

      {
        action: () => chain().toggleCode().run(),
        active: editor.isActive('code'),
        aria: 'Inline code',
        icon: FaCode,
        disabled: !editor.can().chain().focus().toggleCode().run(),
      },

      {
        action: () => {
          const previousUrl = editor.getAttributes('link').href as
            | string
            | undefined;
          const url = window.prompt('Enter URL', previousUrl || '');

          // cancel
          if (url === null) {
            return;
          }

          // empty: unset link
          if (url === '') {
            chain().unsetLink().run();
            return;
          }

          chain().extendMarkRange('link').setLink({ href: url }).run();
        },
        active: editor.isActive('link'),
        aria: 'Link',
        icon: FaLink,
      },
    ],
    structure: [
      {
        action: () => chain().toggleHeading({ level: 1 }).run(),
        active: editor.isActive('heading', { level: 1 }),
        aria: 'Heading One',
        icon: RiH1,
      },

      {
        action: () => chain().toggleHeading({ level: 2 }).run(),
        active: editor.isActive('heading', { level: 2 }),
        aria: 'Heading Two',
        icon: RiH2,
      },
      {
        action: () => chain().toggleHeading({ level: 3 }).run(),
        active: editor.isActive('heading', { level: 3 }),
        aria: 'Heading Three',
        icon: RiH3,
      },

      {
        action: () => chain().toggleBlockquote().run(),
        active: editor.isActive('blockquote'),
        aria: 'Blockquote',
        icon: RiDoubleQuotesL,
      },

      {
        action: () => chain().setHorizontalRule().run(),
        active: false,
        aria: 'Horizontal Rule',
        icon: MdHorizontalRule,
      },

      {
        action: () => chain().toggleCodeBlock().run(),
        active: editor.isActive('codeBlock'),
        aria: 'Code Block',
        icon: BiCodeCurly,
      },
    ],
    lists: [
      {
        action: () => chain().toggleBulletList().run(),
        active: editor.isActive('bulletList'),
        aria: 'Bullet List',
        icon: PiListBullets,
      },

      {
        action: () => chain().toggleOrderedList().run(),
        active: editor.isActive('orderedList'),
        aria: 'Ordered List',
        icon: RiListOrdered,
      },

      {
        action: () => chain().toggleTaskList().run(),
        active: editor.isActive('taskList'),
        aria: 'Task List',
        icon: FaTasks,
      },

      {
        action: () => chain().sinkListItem('listItem').run(),
        active: false,
        aria: 'Sink List Item',
        icon: PiArrowElbowDownRightBold,
      },
      {
        action: () => chain().liftListItem('listItem').run(),
        active: false,
        aria: 'List List Item',
        icon: PiArrowElbowDownLeftBold,
      },
    ],
    media: [
      {
        action: () => {
          const url = window.prompt('Enter image URL');
          if (!url) {
            return;
          }
          chain().setImage({ src: url }).run();
        },
        active: false,
        aria: 'Image',
        icon: FaImage,
      },
      {
        action: () => {
          const url = window.prompt('Enter embed URL (YouTube, Loom, etc.)');
          if (!url) {
            return;
          }
          // TODO: requires custom embed / iframe extension
          console.info('Embed URL chosen:', url);
        },
        active: false,
        aria: 'Video',
        icon: FaPhotoVideo,
      },
    ],
    utilities: [
      {
        action: () => chain().unsetAllMarks().clearNodes().run(),
        active: false,
        aria: 'Clear',
        icon: FaUndo,
      },
    ],
  };

  return (
    <div className="gal-rte-menubar">
      {/* GROUP 1 – TEXT STYLE */}
      <div className="gal-rte-group">
        {toolbarActions.text.map((action, index) => (
          <button
            key={index}
            type="button"
            className={clsx('gal-rte-btn', { 'is-active': action.active })}
            onClick={action.action}
            disabled={action.disabled}
            aria-label={action.aria}
            title={action.aria}
          >
            <GalIcon
              icon={action.icon}
              size={14}
              color={getCssVar('--text-primary')}
            />
          </button>
        ))}
      </div>

      {/* GROUP 2 – STRUCTURE */}
      <div className="gal-rte-separator" />

      <div className="gal-rte-group">
        {toolbarActions.structure.map((action, index) => (
          <button
            key={index}
            type="button"
            className={clsx('gal-rte-btn', { 'is-active': action.active })}
            onClick={action.action}
            disabled={action.disabled}
            aria-label={action.aria}
            title={action.aria}
          >
            <GalIcon
              icon={action.icon}
              size={14}
              color={getCssVar('--text-primary')}
            />
          </button>
        ))}
      </div>

      {/* GROUP 3 – LISTS */}
      <div className="gal-rte-separator" />

      <div className="gal-rte-group">
        {toolbarActions.lists.map((action, index) => (
          <button
            key={index}
            type="button"
            className={clsx('gal-rte-btn', { 'is-active': action.active })}
            onClick={action.action}
            disabled={action.disabled}
            aria-label={action.aria}
            title={action.aria}
          >
            <GalIcon
              icon={action.icon}
              size={14}
              color={getCssVar('--text-primary')}
            />
          </button>
        ))}
      </div>

      {/* GROUP 4 – MEDIA */}
      <div className="gal-rte-separator" />

      <div className="gal-rte-group">
        {toolbarActions.media.map((action, index) => (
          <button
            key={index}
            type="button"
            className={clsx('gal-rte-btn', { 'is-active': action.active })}
            onClick={action.action}
            disabled={action.disabled}
            aria-label={action.aria}
            title={action.aria}
          >
            <GalIcon
              icon={action.icon}
              size={14}
              color={getCssVar('--text-primary')}
            />
          </button>
        ))}
      </div>

      {/* GROUP 5 – UTILITIES */}
      <div className="gal-rte-separator" />

      <div className="gal-rte-group">
        {toolbarActions.utilities.map((action, index) => (
          <button
            key={index}
            type="button"
            className={clsx('gal-rte-btn', { 'is-active': action.active })}
            onClick={action.action}
            disabled={action.disabled}
            aria-label={action.aria}
            title={action.aria}
          >
            <GalIcon
              icon={action.icon}
              size={14}
              color={getCssVar('--text-primary')}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
