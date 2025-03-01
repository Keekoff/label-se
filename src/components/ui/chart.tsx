import * as React from "react"
import { Line, Bar, Pie, LineChart as RechartsLineChart, BarChart as RechartsBarChart, PieChart as RechartsPieChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
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

interface TierLabels {
  tier1?: string;
  tier2?: string;
  tier3?: string;
}

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

export interface RadarDataPoint {
  subject: string;
  myScore: number;
  maxScore: number;
}

export const SustainabilityRadarChart = ({ 
  data, 
  title,
  myScoreColor = "#0EA5E9",
  maxScoreColor = "#35DA56" 
}: { 
  data: RadarDataPoint[];
  title: string;
  myScoreColor?: string;
  maxScoreColor?: string;
}) => {
  return (
    <div className="flex flex-col h-full w-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-4 text-sm justify-center mb-4">
        <div className="flex items-center">
          <div className="w-4 h-2 rounded mr-2" style={{ backgroundColor: myScoreColor }}></div>
          <span>Mes résultats</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-2 rounded mr-2" style={{ backgroundColor: maxScoreColor }}></div>
          <span>Scores max</span>
        </div>
      </div>
      <div className="flex-grow w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart outerRadius="80%" data={data}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ 
                fontSize: 10, 
                fill: "#4B5563",
                dy: 3
              }} 
              cx="50%" 
              cy="50%" 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tickCount={6}
            />
            <Radar 
              name="Mes résultats" 
              dataKey="myScore" 
              stroke={myScoreColor} 
              fill={myScoreColor} 
              fillOpacity={0.2} 
            />
            <Radar 
              name="Scores max" 
              dataKey="maxScore" 
              stroke={maxScoreColor} 
              fill={maxScoreColor} 
              fillOpacity={0.2} 
            />
            <Tooltip />
            <Legend />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const TieredBarChart = ({ 
  data, 
  tiers, 
  title,
  barColor = "#93c5fd",
  tierLabels = {
    tier1: "Tier 1",
    tier2: "Tier 2",
    tier3: "Tier 3"
  }
}: { 
  data: ChartData[]; 
  tiers: TierReferenceData; 
  title: string;
  barColor?: string;
  tierLabels?: TierLabels;
}) => {
  return (
    <div className="flex flex-col h-full w-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2 text-sm justify-center mb-4">
        {tiers.tier1 !== undefined && (
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-green-500 mx-1 border-dashed border-t-2 border-green-500"></div>
            <span>{tierLabels.tier1}</span>
          </div>
        )}
        {tiers.tier2 !== undefined && (
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-500 mx-1 border-dashed border-t-2 border-blue-500"></div>
            <span>{tierLabels.tier2}</span>
          </div>
        )}
        {tiers.tier3 !== undefined && (
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-black mx-1 border-dashed border-t-2 border-black"></div>
            <span>{tierLabels.tier3}</span>
          </div>
        )}
        <div className="flex items-center">
          <div className="w-4 h-3" style={{ backgroundColor: barColor, opacity: 0.7 }}></div>
          <span>Résultats</span>
        </div>
      </div>
      <div className="flex-grow w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            {tiers.tier1 !== undefined && (
              <ReferenceLine y={tiers.tier1} stroke="#35DA56" strokeDasharray="3 3" label={{ value: `${tierLabels.tier1}: ${tiers.tier1}`, position: 'right', style: { fontSize: '11px' } }} />
            )}
            {tiers.tier2 !== undefined && (
              <ReferenceLine y={tiers.tier2} stroke="#27017F" strokeDasharray="3 3" label={{ value: `${tierLabels.tier2}: ${tiers.tier2}`, position: 'right', style: { fontSize: '11px' } }} />
            )}
            {tiers.tier3 !== undefined && (
              <ReferenceLine y={tiers.tier3} stroke="#000000" strokeDasharray="3 3" label={{ value: `${tierLabels.tier3}: ${tiers.tier3}`, position: 'right', style: { fontSize: '11px' } }} />
            )}
            <Bar dataKey="value" fill={barColor} fillOpacity={0.7} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export * from "./chart-primitives"
