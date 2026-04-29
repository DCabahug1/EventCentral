"use client";

import { useState } from "react";

type Point = { label: string; value: number };

type Props = {
  data: Point[];
  height?: number;
  unit?: string;
};

export default function AnalyticsLineChart({
  data,
  height = 160,
  unit = "",
}: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  const W = 800;
  const H = height;
  const padL = 36;
  const padR = 10;
  const padT = 8;
  const padB = 28;

  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxV = Math.max(...data.map((d) => d.value), 1);

  const toX = (i: number) =>
    padL + (i / Math.max(1, data.length - 1)) * chartW;
  const toY = (v: number) => padT + chartH - (v / maxV) * chartH;

  const points = data.map((d, i) => `${toX(i)},${toY(d.value)}`).join(" ");
  const yTicks = [...new Set([0, Math.round(maxV * 0.5), maxV])];
  const xStep = Math.max(1, Math.ceil(data.length / 6));
  const xLabels = data.filter(
    (_, i) => i % xStep === 0 || i === data.length - 1,
  );

  const tooltip = hovered != null ? data[hovered] : null;

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={height}
        className="block"
      >
        {yTicks.map((v) => (
          <line
            key={`grid-${v}`}
            x1={padL}
            y1={toY(v)}
            x2={W - padR}
            y2={toY(v)}
            className="stroke-muted"
            strokeWidth={1}
          />
        ))}
        {yTicks.map((v) => (
          <text
            key={`y-${v}`}
            x={padL - 6}
            y={toY(v) + 4}
            textAnchor="end"
            className="fill-muted-foreground"
            fontSize={11}
          >
            {v}
          </text>
        ))}
        {xLabels.map((d) => {
          const i = data.indexOf(d);
          return (
            <text
              key={`x-${i}`}
              x={toX(i)}
              y={H - 6}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize={11}
            >
              {d.label}
            </text>
          );
        })}
        <polyline
          points={points}
          fill="none"
          className="stroke-primary"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {data.map((_, i) => (
          <rect
            key={`hit-${i}`}
            x={toX(i) - chartW / data.length / 2}
            y={padT}
            width={chartW / data.length}
            height={chartH + padB}
            fill="transparent"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        {hovered != null && (
          <circle
            cx={toX(hovered)}
            cy={toY(data[hovered].value)}
            r={5}
            className="fill-primary stroke-card"
            strokeWidth={2}
            style={{ pointerEvents: "none" }}
          />
        )}
      </svg>
      {tooltip && hovered != null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] border bg-muted px-2.5 py-1.5 text-xs whitespace-nowrap"
          style={{
            left: `${(toX(hovered) / W) * 100}%`,
            top: `${(toY(tooltip.value) / H) * 100}%`,
          }}
        >
          <div className="text-muted-foreground">{tooltip.label}</div>
          <div className="font-semibold text-primary">
            {tooltip.value.toLocaleString()}
            {unit ? ` ${unit}` : ""}
          </div>
        </div>
      )}
    </div>
  );
}
