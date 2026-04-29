"use client";

import { useState } from "react";
import { motion } from "motion/react";

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
  const areaPath =
    data.length > 0
      ? `M ${toX(0)},${padT + chartH} ` +
        data.map((d, i) => `L ${toX(i)},${toY(d.value)}`).join(" ") +
        ` L ${toX(data.length - 1)},${padT + chartH} Z`
      : "";
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
        <defs>
          <linearGradient id="lineAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.18} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>
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
        {areaPath && (
          <motion.path
            d={areaPath}
            fill="url(#lineAreaFill)"
            className="text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
          />
        )}
        <motion.polyline
          points={points}
          fill="none"
          className="stroke-primary"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 1.1, ease: [0.2, 0.7, 0.2, 1] },
            opacity: { duration: 0.2 },
          }}
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
          <motion.circle
            cx={toX(hovered)}
            cy={toY(data[hovered].value)}
            r={5}
            className="fill-primary stroke-card"
            strokeWidth={2}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ pointerEvents: "none", transformOrigin: "center" }}
          />
        )}
      </svg>
      {tooltip && hovered != null && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
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
        </motion.div>
      )}
    </div>
  );
}
