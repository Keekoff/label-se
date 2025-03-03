
import * as React from "react"
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "../chart-primitives"

interface ChartData {
  name: string;
  value: number;
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
