"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import type { VolumeByMethodPoint } from "@/lib/types";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-md border border-border/60 bg-background p-3 text-sm shadow-sm min-w-[160px]">
      <p className="font-medium mb-1 text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">
        Volume:{" "}
        <span className="font-mono font-medium text-foreground">
          ${Number(d?.value).toLocaleString()}
        </span>
      </p>
      {payload[0]?.payload && (
        <p className="text-xs text-muted-foreground mt-0.5">
          Share:{" "}
          <span className="font-mono font-medium text-foreground">
            {(payload[0].payload as VolumeByMethodPoint).share}%
          </span>
        </p>
      )}
    </div>
  );
};

export function MethodChart({ data }: { data: VolumeByMethodPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
        barSize={28}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="method"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          width={44}
        />
        <Tooltip content={(props) => <CustomTooltip {...(props as TooltipContentProps<ValueType, NameType>)} />} />
        <Bar dataKey="volume" radius={[3, 3, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
