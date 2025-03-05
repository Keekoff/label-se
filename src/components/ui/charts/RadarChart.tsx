
import * as React from "react"
import { 
  RadarChart as RechartsRadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

export interface RadarDataPoint {
  subject: string;
  myScore: number;
  maxScore: number;
}

export const SustainabilityRadarChart = ({ 
  data, 
  title,
  myScoreColor = "#35DA56",
  maxScoreColor = "#27017F" 
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
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 8]} 
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
            <Tooltip 
              formatter={(value, name) => [
                `${value}`, 
                name === "myScore" ? "Mes résultats" : "Score max"
              ]} 
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
