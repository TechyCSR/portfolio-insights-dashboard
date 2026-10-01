"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { SectorSummary } from "../types/portfolio";
import { formatCurrency } from "../utils/formatters";

interface PortfolioChartsProps {
  sectors: SectorSummary[];
}

const SECTOR_COLORS = [
  "#2563eb",
  "#475569",
  "#059669",
  "#0284c7",
  "#7c3aed",
  "#64748b"
];

export function PortfolioCharts({ sectors }: PortfolioChartsProps) {
  const [activeTab, setActiveTab] = useState<"allocation" | "comparison">("allocation");

  const pieData = sectors.map((s, idx) => ({
    name: s.sector,
    value: s.totalInvestment,
    color: SECTOR_COLORS[idx % SECTOR_COLORS.length]
  }));

  const barData = sectors.map((s) => ({
    sector: s.sector,
    Investment: s.totalInvestment,
    "Present Value": s.totalPresentValue
  }));

  return (
    <div className="bg-white border border-black rounded-lg p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900 tracking-tight">
            Portfolio Visualizations
          </h2>
          <p className="text-xs text-neutral-500">
            Sector weights and cost vs value comparison
          </p>
        </div>

        <div className="flex items-center bg-neutral-100 p-0.5 rounded border border-gray-200">
          <button
            onClick={() => setActiveTab("allocation")}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition cursor-pointer ${
              activeTab === "allocation"
                ? "bg-black text-white"
                : "text-neutral-700 hover:text-black"
            }`}
          >
            Allocation
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition cursor-pointer ${
              activeTab === "comparison"
                ? "bg-black text-white"
                : "text-neutral-700 hover:text-black"
            }`}
          >
            Cost vs Value
          </button>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        {activeTab === "allocation" ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  formatCurrency(typeof value === "number" ? value : 0),
                  "Investment"
                ]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#000000",
                  borderWidth: "1px",
                  borderRadius: "0.25rem",
                  color: "#0f172a",
                  fontSize: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
                }}
              />
              <Legend
                formatter={(val) => <span className="text-xs text-neutral-800 font-medium">{val}</span>}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <XAxis
                dataKey="sector"
                stroke="#525252"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#000000" }}
              />
              <YAxis
                stroke="#525252"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#000000" }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => [
                  formatCurrency(typeof value === "number" ? value : 0),
                  ""
                ]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#000000",
                  borderWidth: "1px",
                  borderRadius: "0.25rem",
                  color: "#0f172a",
                  fontSize: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
                }}
              />
              <Legend
                formatter={(val) => <span className="text-xs text-neutral-800 font-medium">{val}</span>}
              />
              <Bar dataKey="Investment" fill="#525252" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Present Value" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
