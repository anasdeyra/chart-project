import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { formatBigInt, formatDate, getChartColor } from "../util";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          boxShadow:
            "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
          border: "1px solid #F2F4F7",
          padding: "0 0.5rem",
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <p className="text-[#475467] text-xs">
          {formatDate(payload[0].payload.date)}
        </p>
        <p className="text-[#111827] font-semibold mt-[2px]">
          {formatBigInt(payload[0].value)}
        </p>
      </div>
    );
  }

  return null;
};

const DATA1 = [
  {
    date: "2022-10-1",
    viewCount: 3000,
  },
  {
    date: "2022-11-1",
    viewCount: 2000,
  },
  {
    date: "2022-12-1",
    viewCount: 1000,
  },
];

export default function ViewsChart({
  data = DATA1,
  width = "100%",
  height,
  aspect = 2,
  color = "green",
  id = 0,
}) {
  const formatedData = data.map((d) => ({
    ...d,
    viewCount: parseInt(d.viewCount),
  }));

  const min = Math.min(...formatedData.map((d) => d.viewCount));
  const max = Math.max(...formatedData.map((d) => d.viewCount));

  return (
    <ResponsiveContainer width={width} aspect={aspect} height={height}>
      <AreaChart
        data={formatedData}
        margin={{
          bottom: 0,
          left: 0,
          right: 0,
          top: 8,
        }}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.18} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey={"viewCount"}
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#${id})`}
          activeDot={{
            r: 5,
            fill: "#fff",
            stroke: color,
            strokeWidth: 2,
          }}
        />

        <YAxis hide domain={[min * 0.985, max]} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
