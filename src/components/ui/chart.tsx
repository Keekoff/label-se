
import * as React from "react"
import { Line, Bar, Pie, LineChart as RechartsLineChart, BarChart as RechartsBarChart, PieChart as RechartsPieChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip } from "./chart-primitives"

interface ChartData {
  name: string;
  value: number;
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

// Re-export chart primitives
export * from "./chart-primitives"
