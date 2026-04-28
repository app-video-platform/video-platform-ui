/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useMemo, useRef } from 'react';

type NodeDef = {
  id: string;
  x: number;
  y: number;
  r: number;
  kind?: 'base' | 'center' | 'accent';
};
type EdgeDef = { a: string; b: string; kind?: 'base' | 'accent' };

interface MissionConstellationProps {
  className?: string;
  /** repel radius in SVG units (this SVG viewBox is 0..640 x 0..420) */
  repelRadius?: number; // default 80
  /** max push in SVG units */
  maxPush?: number; // default 8
}

const VIEWBOX = { w: 640, h: 420 };

// Curated constellation (hand-authored)
const NODES: NodeDef[] = [
  { id: 'n1', x: 110, y: 110, r: 4.2, kind: 'base' },
  { id: 'n2', x: 170, y: 155, r: 4.2, kind: 'base' },
  { id: 'n3', x: 240, y: 125, r: 4.2, kind: 'base' },
  { id: 'n4', x: 310, y: 155, r: 4.2, kind: 'base' },
  { id: 'n5', x: 380, y: 120, r: 4.2, kind: 'base' },
  { id: 'n6', x: 450, y: 155, r: 4.2, kind: 'base' },

  { id: 'n7', x: 210, y: 220, r: 4.2, kind: 'base' },
  { id: 'n8', x: 285, y: 240, r: 4.2, kind: 'base' },
  { id: 'n9', x: 360, y: 215, r: 4.2, kind: 'base' },
  { id: 'n10', x: 435, y: 235, r: 4.2, kind: 'base' },

  { id: 'n11', x: 255, y: 305, r: 4.2, kind: 'base' },
  { id: 'n12', x: 330, y: 325, r: 4.2, kind: 'base' },
  { id: 'n13', x: 410, y: 300, r: 4.2, kind: 'base' },

  { id: 'n14', x: 500, y: 260, r: 4.2, kind: 'base' },
  { id: 'n15', x: 520, y: 170, r: 4.2, kind: 'base' },
  { id: 'n16', x: 140, y: 250, r: 4.2, kind: 'base' },

  // Key nodes
  { id: 'c', x: 340, y: 210, r: 6.0, kind: 'center' },
  { id: 'a', x: 455, y: 210, r: 5.6, kind: 'accent' },
];

const EDGES: EdgeDef[] = [
  // Top chain
  { a: 'n1', b: 'n2' },
  { a: 'n2', b: 'n3' },
  { a: 'n3', b: 'n4' },
  { a: 'n4', b: 'n5' },
  { a: 'n5', b: 'n6' },
  { a: 'n6', b: 'n15' },

  // Middle structure
  { a: 'n2', b: 'n7' },
  { a: 'n3', b: 'c' },
  { a: 'n4', b: 'c' },
  { a: 'n5', b: 'a', kind: 'accent' },
  { a: 'c', b: 'n9' },
  { a: 'n9', b: 'a', kind: 'accent' },
  { a: 'n9', b: 'n10' },
  { a: 'n10', b: 'n14' },

  // Lower cluster
  { a: 'n7', b: 'n8' },
  { a: 'n8', b: 'c' },
  { a: 'n8', b: 'n11' },
  { a: 'n11', b: 'n12' },
  { a: 'n12', b: 'n13' },
  { a: 'n13', b: 'n14' },

  // Side anchors
  { a: 'n16', b: 'n7' },
  { a: 'n16', b: 'n11' },
  { a: 'n15', b: 'n10' },
];

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

const MissionConstellation: React.FC<MissionConstellationProps> = ({
  className,
  repelRadius = 80,
  maxPush = 8,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Cache node defs in a map for quick lookups
  const nodeMap = useMemo(() => {
    const m = new Map<string, NodeDef>();
    NODES.forEach((n) => m.set(n.id, n));
    return m;
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    const prefersReduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    )?.matches;
    if (prefersReduced) {
      return;
    }

    const finePointer =
      window.matchMedia?.('(pointer: fine)')?.matches ?? false;
    const hoverCapable =
      window.matchMedia?.('(hover: hover)')?.matches ?? false;
    if (!finePointer || !hoverCapable) {
      return;
    }

    // Elements
    const nodeEls = Array.from(
      svg.querySelectorAll<SVGCircleElement>('[data-node-id]'),
    );
    const edgeEls = Array.from(
      svg.querySelectorAll<SVGLineElement>('[data-edge]'),
    );

    // Original positions (SVG units)
    const basePos = new Map<string, { x: number; y: number }>();
    nodeEls.forEach((el) => {
      const id = el.dataset.nodeId!;
      const def = nodeMap.get(id)!;
      basePos.set(id, { x: def.x, y: def.y });
    });

    // Current offsets (smooth interpolation target)
    const cur = new Map<string, { x: number; y: number }>();
    const tgt = new Map<string, { x: number; y: number }>();
    basePos.forEach((p, id) => {
      cur.set(id, { x: p.x, y: p.y });
      tgt.set(id, { x: p.x, y: p.y });
    });

    // Helpers to set attributes (no layout reads)
    const setCircle = (el: SVGCircleElement, x: number, y: number) => {
      el.setAttribute('cx', x.toFixed(2));
      el.setAttribute('cy', y.toFixed(2));
    };

    const edgeIndex = EDGES.map((e) => ({
      key: `${e.a}-${e.b}`,
      a: e.a,
      b: e.b,
    }));

    const updateEdges = () => {
      edgeEls.forEach((line) => {
        const idx = Number(line.dataset.edgeIndex);
        const e = edgeIndex[idx];
        const pa = cur.get(e.a)!;
        const pb = cur.get(e.b)!;
        line.setAttribute('x1', pa.x.toFixed(2));
        line.setAttribute('y1', pa.y.toFixed(2));
        line.setAttribute('x2', pb.x.toFixed(2));
        line.setAttribute('y2', pb.y.toFixed(2));
      });
    };

    // Pointer position in SVG coords
    let pointer = { x: VIEWBOX.w / 2, y: VIEWBOX.h / 2 };
    let hovering = false;
    let raf = 0;

    const svgPointFromClient = (clientX: number, clientY: number) => {
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) {
        return { x: pointer.x, y: pointer.y };
      }
      const inv = ctm.inverse();
      const sp = pt.matrixTransform(inv);
      return { x: sp.x, y: sp.y };
    };

    const computeTargets = () => {
      // When not hovering: return all targets to base
      if (!hovering) {
        basePos.forEach((p, id) => {
          const t = tgt.get(id)!;
          t.x = p.x;
          t.y = p.y;
        });
        return;
      }

      // Repel nodes within radius
      const R = repelRadius;
      const R2 = R * R;

      basePos.forEach((p, id) => {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;

        const t = tgt.get(id)!;

        if (d2 >= R2 || d2 < 0.0001) {
          t.x = p.x;
          t.y = p.y;
          return;
        }

        const d = Math.sqrt(d2);
        const falloff = 1 - d / R; // 1 near cursor, 0 at radius
        const push = maxPush * (falloff * falloff); // smoother falloff

        const nx = dx / d;
        const ny = dy / d;

        t.x = p.x + nx * push;
        t.y = p.y + ny * push;
      });
    };

    const tick = () => {
      computeTargets();

      // Smoothly ease current toward target (inertia)
      const ease = hovering ? 0.18 : 0.14;

      nodeEls.forEach((el) => {
        const id = el.dataset.nodeId!;
        const c = cur.get(id)!;
        const t = tgt.get(id)!;

        c.x += (t.x - c.x) * ease;
        c.y += (t.y - c.y) * ease;

        setCircle(el, c.x, c.y);
      });

      updateEdges();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      hovering = true;
      pointer = svgPointFromClient(e.clientX, e.clientY);
      pointer.x = clamp(pointer.x, 0, VIEWBOX.w);
      pointer.y = clamp(pointer.y, 0, VIEWBOX.h);
    };

    const onEnter = (e: PointerEvent) => {
      hovering = true;
      pointer = svgPointFromClient(e.clientX, e.clientY);
    };

    const onLeave = () => {
      hovering = false;
    };

    svg.addEventListener('pointermove', onMove, { passive: true });
    svg.addEventListener('pointerenter', onEnter, { passive: true });
    svg.addEventListener('pointerleave', onLeave, { passive: true });

    // Start loop (lightweight)
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      svg.removeEventListener('pointermove', onMove);
      svg.removeEventListener('pointerenter', onEnter);
      svg.removeEventListener('pointerleave', onLeave);
    };
  }, [repelRadius, maxPush, nodeMap]);

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        {/* Soft glow (used sparingly) */}
        <filter id="mcGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtle line gradient (helps “space” feel without a card) */}
        <linearGradient id="mcLineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(248, 249, 250, 0.0)" />
          <stop offset="40%" stopColor="rgba(195, 192, 197, 0.28)" />
          <stop offset="60%" stopColor="rgba(195, 192, 197, 0.30)" />
          <stop offset="100%" stopColor="rgba(248, 249, 250, 0.0)" />
        </linearGradient>
      </defs>

      {/* Optional: faint local haze (not a box) */}
      <g className="mc-haze" aria-hidden="true">
        <circle cx="360" cy="220" r="180" fill="rgba(58, 46, 111, 0.10)" />
        <circle cx="420" cy="180" r="130" fill="rgba(59, 201, 219, 0.06)" />
      </g>

      {/* Lines (as <line> so we can update endpoints easily) */}
      <g
        className="mc-lines"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {EDGES.map((e, i) => {
          const a = nodeMap.get(e.a)!;
          const b = nodeMap.get(e.b)!;
          const isAccent = e.kind === 'accent';
          return (
            <line
              key={`${e.a}-${e.b}`}
              data-edge
              data-edge-index={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className={['mc-line', isAccent ? 'mc-line--accent' : '']
                .filter(Boolean)
                .join(' ')}
              stroke={
                isAccent ? 'rgba(59, 201, 219, 0.42)' : 'url(#mcLineGrad)'
              }
              strokeWidth={isAccent ? 1.9 : 1.6}
              opacity={isAccent ? 1 : 0.95}
            />
          );
        })}
      </g>

      {/* Nodes */}
      <g className="mc-nodes">
        {NODES.map((n) => {
          const isCenter = n.kind === 'center';
          const isAccent = n.kind === 'accent';
          const fill = isAccent
            ? 'rgba(59, 201, 219, 0.85)'
            : isCenter
              ? 'rgba(248, 249, 250, 0.78)'
              : 'rgba(248, 249, 250, 0.58)';

          const filter = isCenter || isAccent ? 'url(#mcGlow)' : undefined;

          return (
            <circle
              key={n.id}
              data-node-id={n.id}
              className={[
                'mc-node',
                isCenter ? 'mc-node--center' : '',
                isAccent ? 'mc-node--accent' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={fill}
              filter={filter}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default MissionConstellation;
