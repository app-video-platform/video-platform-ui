import type { DocNonIndexRouteObject, DocRoute } from './routes.map';
import { UserRole } from '@api/models';

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

function isNonIndex(r: DocRoute): r is DocNonIndexRouteObject {
  // Index routes are the only ones with r.index === true
  return !('index' in r) || (r as any).index !== true;
}

export function flattenRoutes(routes: DocRoute[], base = ''): FlatRow[] {
  const out: FlatRow[] = [];
  for (const r of routes) {
    // For index routes, use the parent path as the full path
    const full = r.index ? base || '/' : join(base, r.path);
    out.push({
      path: full,
      access: r.meta?.access ?? 'public',
      roles: r.meta?.roles,
      index: Boolean(r.index),
      notes: r.meta?.notes,
      id: (r as any).id,
    });
    if (isNonIndex(r) && r.children?.length) {
      out.push(...flattenRoutes(r.children, full));
    }
  }
  // optional de-dupe
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

export function toMermaid(rows: FlatRow[]): string {
  const lines: string[] = ['graph TD', '  APP[/app (AppLayout)/]'];
  const top = new Set<string>();

  for (const r of rows) {
    const path = r.path;
    if (path === '/' || path === '/*') {
      continue;
    }

    // group under /app vs top-level
    const isApp = path.startsWith('/app');
    const nodeId = path.replace(/[^\w]/g, '_') || 'root';
    const label = path.endsWith('/*') ? `${path} (fallback)` : path;

    if (isApp) {
      lines.push(`  APP --> ${nodeId}["${label}"]`);
    } else {
      top.add(nodeId);
      lines.push(`  ${nodeId}["${label}"]`);
    }
  }
  return lines.join('\n');
}

export function toPermissionsTable(rows: FlatRow[]): string {
  const header =
    '| Route | Visitor | User | Creator | Admin |\n|---|---|---|---|---|';
  const body = rows
    .filter((r) => !r.path.endsWith('/*'))
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((r) => {
      const roles = new Set(r.roles?.map(String));
      const isPublic = r.access === 'public';
      const v = isPublic ? '✅' : '❌';
      const u =
        isPublic ||
        roles.has(String(UserRole.USER)) ||
        roles.has(String(UserRole.ADMIN))
          ? '✅'
          : '❌';
      const c =
        isPublic ||
        roles.has(String(UserRole.CREATOR)) ||
        roles.has(String(UserRole.ADMIN))
          ? '✅'
          : '❌';
      const a = isPublic || roles.has(String(UserRole.ADMIN)) ? '✅' : '❌';
      return `| \`${r.path}\` | ${v} | ${u} | ${c} | ${a} |`;
    })
    .join('\n');
  return `${header}\n${body}\n`;
}
