const COMMON_VALID_PROPS = new Set([
  'children',
  'className',
  'style',
  'id',
  'role',
  'title',
  'tabIndex',
  'hidden',
  'disabled',
  'checked',
  'value',
  'defaultValue',
  'name',
  'type',
  'placeholder',
  'src',
  'alt',
  'href',
  'target',
  'rel',
  'width',
  'height',
  'viewBox',
  'fill',
  'stroke',
  'd',
  'x',
  'y',
  'cx',
  'cy',
  'r',
  'x1',
  'x2',
  'y1',
  'y2',
  'points',
  'transform',
  'opacity',
  'preserveAspectRatio',
  'focusable',
  'xmlns',
]);

const isPropValid = (prop: string): boolean => {
  if (!prop) {
    return false;
  }

  if (COMMON_VALID_PROPS.has(prop)) {
    return true;
  }

  if (prop.startsWith('data-') || prop.startsWith('aria-')) {
    return true;
  }

  if (/^on[A-Z]/.test(prop)) {
    return true;
  }

  // Allow lowercase custom attributes (e.g. SVG / web components).
  return /^[a-z][\w:-]*$/.test(prop);
};

export default isPropValid;
