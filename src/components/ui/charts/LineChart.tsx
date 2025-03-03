
import * as React from "react"
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "../chart-primitives"

interface ChartData {
  name: string;
  value: number;
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
