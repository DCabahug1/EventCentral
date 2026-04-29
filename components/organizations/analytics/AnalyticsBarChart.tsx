"use client";

import { useState } from "react";

type Bar = { label: string; value: number };

type Props = {
  data: Bar[];
  height?: number;
  unit?: string;
};

function shortLabel(label: string) {
  return label.length > 14 ? `${label.slice(0, 12)}…` : label;
}

export default function AnalyticsBarChart({
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
  const padB = 32;

  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxV = Math.max(...data.map((d) => d.value), 1);
  const slot = chartW / data.length;
  const barW = slot * 0.6;

  const toX = (i: number) => padL + i * slot + slot / 2;
  const toBarH = (v: number) => (v / maxV) * chartH;
  const yTicks = [...new Set([0, Math.round(maxV * 0.5), maxV])];
  const formatTick = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`;

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={height}
        className="block"
      >
        {yTicks.map((v) => {
          const y = padT + chartH - (v / maxV) * chartH;
          return (
            <line
              key={`grid-${v}`}
              x1={padL}
              y1={y}
              x2={W - padR}
              y2={y}
              className="stroke-muted"
              strokeWidth={1}
            />
          );
        })}
        {yTicks.map((v) => {
          const y = padT + chartH - (v / maxV) * chartH;
          return (
            <text
              key={`y-${v}`}
              x={padL - 6}
              y={y + 4}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={11}
            >
              {formatTick(v)}
            </text>
          );
        })}
        {data.map((d, i) => {
          const bh = toBarH(d.value);
          const x = toX(i) - barW / 2;
          const y = padT + chartH - bh;
          return (
            <g key={`bar-${i}`}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={bh}
                className="fill-primary"
                opacity={1 - i * 0.1}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              <text
                x={toX(i)}
                y={H - 10}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={10.5}
              >
                {shortLabel(d.label)}
              </text>
            </g>
          );
        })}
      </svg>
      {hovered != null && (() => {
        const bh = toBarH(data[hovered].value);
        const y = padT + chartH - bh;
        return (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] border bg-muted px-2.5 py-1.5 text-xs whitespace-nowrap"
            style={{
              left: `${(toX(hovered) / W) * 100}%`,
              top: `${(y / H) * 100}%`,
            }}
          >
            <div className="text-muted-foreground">{data[hovered].label}</div>
            <div className="font-semibold text-primary">
              {data[hovered].value.toLocaleString()}
              {unit ? ` ${unit}` : ""}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
