import React from 'react';
import { docRoutes } from '../devtools/routes.map';
import {
  flattenRoutes,
  toMarkdownTable,
  toMermaid,
  toPermissionsTable,
} from '../devtools/route-reporter';

export default function RoutesDev() {
  const rows = flattenRoutes(docRoutes);
  const md = toMarkdownTable(rows);
  const mermaid = toMermaid(rows);
  const perms = toPermissionsTable(rows);

  return (
    <div style={{ padding: 16 }}>
      <h2>Route JSON</h2>
      <pre>{JSON.stringify(rows, null, 2)}</pre>

      <h2>Markdown table</h2>
      <textarea readOnly value={md} style={{ width: '100%', height: 240 }} />

      <h2>Mermaid diagram</h2>
      <textarea
        readOnly
        value={`\`\`\`mermaid\n${mermaid}\n\`\`\``}
        style={{ width: '100%', height: 200 }}
      />

      <h2>Permissions matrix</h2>
      <textarea readOnly value={perms} style={{ width: '100%', height: 240 }} />
    </div>
  );
}
