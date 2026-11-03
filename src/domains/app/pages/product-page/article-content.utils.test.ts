import '@testing-library/jest-dom';
import { renderArticleContent } from './article-content.utils';

describe('renderArticleContent', () => {
  it('renders persisted Tiptap paragraphs and text marks as formatted HTML', () => {
    const result = renderArticleContent(JSON.stringify({
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Hello ' },
          { type: 'text', text: 'world', marks: [{ type: 'bold' }] },
        ],
      }],
    }));

    expect(result?.kind).toBe('html');
    if (result?.kind !== 'html') {return;}
    const container = document.createElement('div');
    container.innerHTML = result.value;
    expect(container.querySelector('p')).toHaveTextContent('Hello world');
    expect(container.querySelector('strong')).toHaveTextContent('world');
  });

  it('preserves ordered and unordered lists and permitted HTTPS links', () => {
    const result = renderArticleContent(JSON.stringify({
      type: 'doc',
      content: [
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'One' }] }] }] },
        { type: 'orderedList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Two' }] }] }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Safe link', marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] }] },
      ],
    }));

    expect(result?.kind).toBe('html');
    if (result?.kind !== 'html') {return;}
    const container = document.createElement('div');
    container.innerHTML = result.value;
    expect(result.value).toContain('<ul');
    expect(container.querySelector('ul')).not.toBeNull();
    expect(container.querySelector('ol')).not.toBeNull();
    expect(container.querySelector('a')).toHaveAttribute('href', 'https://example.com');
  });

  it('sanitizes supported legacy HTML, unsafe attributes, scripts, and URL schemes', () => {
    const result = renderArticleContent(
      '<p onclick="evil()">Safe<script>alert(1)</script><a href="javascript:evil()">bad</a></p>',
    );

    expect(result?.kind).toBe('html');
    if (result?.kind !== 'html') {return;}
    const container = document.createElement('div');
    container.innerHTML = result.value;
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('[onclick]')).toBeNull();
    expect(container.querySelector('a')).not.toHaveAttribute('href');
    expect(container.querySelector('p')).toHaveTextContent('Safebad');
  });

  it.each([
    '',
    '   ',
    '{"type":"doc",',
    JSON.stringify({ type: 'doc', content: [{ type: 'unknownNode' }] }),
    JSON.stringify({ type: 'unknownDocument', content: [] }),
  ])('returns no content for empty, malformed, or unsupported content: %s', (content) => {
    expect(renderArticleContent(content)).toBeNull();
  });

  it('renders plain legacy content as text instead of interpreting it as markup', () => {
    expect(renderArticleContent('Plain Article copy')).toEqual({
      kind: 'text',
      value: 'Plain Article copy',
    });
  });
});
