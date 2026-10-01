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
  "#6366f1",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6"
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Portfolio Visualizations
          </h2>
          <p className="text-xs text-slate-400">
            Sector-level weight distribution and valuation performance
          </p>
        </div>

        <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("allocation")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
              activeTab === "allocation"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sector Allocation
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
              activeTab === "comparison"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Investment vs Value
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        {activeTab === "allocation" ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  formatCurrency(typeof value === "number" ? value : 0),
                  "Investment"
                ]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.5rem",
                  color: "#f8fafc",
                  fontSize: "12px"
                }}
              />
              <Legend
                formatter={(val) => <span className="text-xs text-slate-300 font-medium">{val}</span>}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis
                dataKey="sector"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => [
                  formatCurrency(typeof value === "number" ? value : 0),
                  ""
                ]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.5rem",
                  color: "#f8fafc",
                  fontSize: "12px"
                }}
              />
              <Legend
                formatter={(val) => <span className="text-xs text-slate-300 font-medium">{val}</span>}
              />
              <Bar dataKey="Investment" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Present Value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
