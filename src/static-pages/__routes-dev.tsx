import React from 'react';
import { docRoutes } from '../devtools/routes.map';
import { flattenRoutes, toMarkdownTable } from '../devtools/route-reporter';

export default function RoutesDev() {
  const rows = flattenRoutes(docRoutes);
  const md = toMarkdownTable(rows);

  return (
    <div style={{ padding: 16 }}>
      <h2>Route JSON</h2>
      <pre>{JSON.stringify(rows, null, 2)}</pre>

      <h2>Markdown table (copy into Docusaurus)</h2>
      <textarea
        readOnly
        value={md}
        style={{ width: '100%', height: 300, fontFamily: 'monospace' }}
        onFocus={(e) => e.currentTarget.select()}
      />
      <p style={{ opacity: 0.7 }}>
        Tip: Click inside the textarea and press <kbd>Ctrl/Cmd+A</kbd>, then
        copy.
      </p>
    </div>
  );
}
