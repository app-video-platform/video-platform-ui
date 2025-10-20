import type { DocRoute } from './routes.map';
import { UserRole } from '../api/models/user/user';

function join(base: string, seg?: string) {
  if (!seg) {
    return base || '/';
  }
  const a = base.endsWith('/') ? base.slice(0, -1) : base;
  const b = seg.startsWith('/') ? seg : `/${seg}`;
  return (a + b).replace(/\/+/g, '/');
}

export type FlatRow = {
  path: string;
  access: 'public' | 'protected';
  roles?: UserRole[];
  index?: boolean;
  notes?: string;
  id?: string;
};

export function flattenRoutes(routes: DocRoute[], base = ''): FlatRow[] {
  const out: FlatRow[] = [];
  for (const r of routes) {
    const full = r.index ? r.path || base || '/' : join(base, r.path ?? '');
    if (r.path || r.index || r.meta) {
      out.push({
        path: r.index ? full : full || '/',
        access: r.meta?.access ?? 'public',
        roles: r.meta?.roles,
        index: Boolean(r.index),
        notes: r.meta?.notes,
        id: (r as any).id,
      });
    }
    if (r.children?.length) {
      out.push(...flattenRoutes(r.children as DocRoute[], full));
    }
  }
  // de-dupe (in case of helper paths used for index)
  const seen = new Set<string>();
  return out.filter((row) => {
    const key = `${row.path}|${row.access}|${row.roles?.join(',') ?? ''}|${row.index}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function toMarkdownTable(rows: FlatRow[]): string {
  const header = '| Route | Access | Roles | Notes |\n|---|---|---|---|';
  const body = rows
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((r) => {
      const roles = r.access === 'protected' ? r.roles?.join(', ') || '—' : '—';
      const notes = [r.index ? 'Index' : '', r.notes || '']
        .filter(Boolean)
        .join(' · ');
      return `| \`${r.path}\` | ${r.access} | ${roles} | ${notes} |`;
    })
    .join('\n');
  return `${header}\n${body}\n`;
}
