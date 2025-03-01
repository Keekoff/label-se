
import * as React from "react"
import { Line, Bar, Pie, LineChart as RechartsLineChart, BarChart as RechartsBarChart, PieChart as RechartsPieChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend } from "recharts"
import { ChartContainer, ChartTooltip } from "./chart-primitives"

interface ChartData {
  name: string;
  value: number;
}

interface TierReferenceData {
  tier1?: number;
  tier2?: number;
  tier3?: number;
}

// Line Chart Component
export const LineChart = ({ data }: { data: ChartData[] }) => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#35DA56" strokeWidth={2} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// Bar Chart Component
export const BarChart = ({ data }: { data: ChartData[] }) => {
  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#35DA56" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// Pie Chart Component
export const PieChart = ({ data }: { data: ChartData[] }) => {
  const COLORS = ['#35DA56', '#27017F', '#8985FF', '#4CAF50']

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8985FF"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// Bar Chart with Reference Lines Component
export const TieredBarChart = ({ 
  data, 
  tiers, 
  title 
}: { 
  data: ChartData[]; 
  tiers: TierReferenceData; 
  title: string;
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2 text-sm justify-center mb-2">
        {tiers.tier1 !== undefined && (
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-green-500 mx-1 border-dashed border-t-2 border-green-500"></div>
            <span>Tier 1</span>
          </div>
        )}
        {tiers.tier2 !== undefined && (
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-500 mx-1 border-dashed border-t-2 border-blue-500"></div>
            <span>Tier 2</span>
          </div>
        )}
        {tiers.tier3 !== undefined && (
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-black mx-1 border-dashed border-t-2 border-black"></div>
            <span>Tier 3</span>
          </div>
        )}
        <div className="flex items-center">
          <div className="w-4 h-3 bg-blue-300 opacity-70 mx-1"></div>
          <span>Résultats</span>
        </div>
      </div>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            {tiers.tier1 !== undefined && (
              <ReferenceLine y={tiers.tier1} stroke="#35DA56" strokeDasharray="3 3" label={{ value: `Tier 1: ${tiers.tier1}`, position: 'right' }} />
            )}
            {tiers.tier2 !== undefined && (
              <ReferenceLine y={tiers.tier2} stroke="#27017F" strokeDasharray="3 3" label={{ value: `Tier 2: ${tiers.tier2}`, position: 'right' }} />
            )}
            {tiers.tier3 !== undefined && (
              <ReferenceLine y={tiers.tier3} stroke="#000000" strokeDasharray="3 3" label={{ value: `Tier 3: ${tiers.tier3}`, position: 'right' }} />
            )}
            <Bar dataKey="value" fill="#93c5fd" fillOpacity={0.7} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

// Re-export chart primitives
export * from "./chart-primitives"
