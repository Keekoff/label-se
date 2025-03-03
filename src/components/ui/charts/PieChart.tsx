
import * as React from "react"
import { Pie, PieChart as RechartsPieChart, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer } from "../chart-primitives"

interface ChartData {
  name: string;
  value: number;
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
