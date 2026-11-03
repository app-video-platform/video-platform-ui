import DOMPurify from 'dompurify';
import {
  generateHTML,
  JSONContent,
} from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';

const ARTICLE_EXTENSIONS = [
  StarterKit,
  Link.configure({ openOnClick: false }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Image,
  Underline,
];

const supportedNodes = new Set([
  'doc', 'paragraph', 'text', 'heading', 'bulletList', 'orderedList', 'listItem',
  'blockquote', 'codeBlock', 'hardBreak', 'horizontalRule', 'image', 'taskList', 'taskItem',
]);
const supportedMarks = new Set(['bold', 'italic', 'strike', 'code', 'link', 'underline']);

const isSupportedNode = (value: unknown): value is JSONContent => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {return false;}
  const node = value as JSONContent;
  return Boolean(node.type && supportedNodes.has(node.type) &&
    (!node.content || (Array.isArray(node.content) && node.content.every(isSupportedNode))) &&
    (!node.marks || (Array.isArray(node.marks) && node.marks.every((mark) =>
      Boolean(mark?.type && supportedMarks.has(mark.type)),
    ))));
};

export type RenderedArticleContent =
  | { kind: 'html'; value: string }
  | { kind: 'text'; value: string }
  | null;

const sanitizedHtml = (html: string): RenderedArticleContent => {
  const value = DOMPurify.sanitize(html);
  return value.trim() ? { kind: 'html', value } : null;
};

/** Convert persisted Tiptap JSON or supported legacy content into safe reader output. */
export const renderArticleContent = (content?: string | null): RenderedArticleContent => {
  if (!content?.trim()) {return null;}
  const trimmed = content.trim();

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (!isSupportedNode(parsed) || parsed.type !== 'doc') {return null;}
      return sanitizedHtml(generateHTML(parsed, ARTICLE_EXTENSIONS));
    } catch {
      // Do not show malformed or unsupported JSON serialization to readers.
      return null;
    }
  }

  if (/<\/?[a-z][^>]*>/i.test(trimmed)) {
    return sanitizedHtml(trimmed);
  }

  // Plain legacy text is rendered by React as text, never interpreted as markup.
  return { kind: 'text', value: content };
};
